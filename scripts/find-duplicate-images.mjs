/**
 * Detects duplicate photos across the library, including re-encodes.
 *
 * Byte hashing only proves two files are identical. A re-encode, resize or
 * re-export of the same photograph still looks like a duplicate to the eye,
 * so this also compares pixel content: a 32x32 DCT pHash and a dHash for
 * gradient detail, plus a mean-absolute-difference score on a normalised
 * 32x32 greyscale grid. Two encodings of the same shot land within a couple of
 * bits and a fraction of a grey level; two different shots of the same room do
 * not.
 *
 * Run after adding or replacing images:
 *   node scripts/find-duplicate-images.mjs
 *
 * Exits non-zero when duplicates are found, so it can gate a commit.
 */
import { createHash } from "node:crypto";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

const ROOT = "public/images";

// A pair counts as the same photo when the mean absolute difference between
// their normalised greyscale grids is below this (out of 255). Measured
// re-encodes land near 0.1-0.5; genuinely different photos score far higher.
const MAD_THRESHOLD = 6;

async function grid(file) {
  const { data } = await sharp(file)
    .greyscale()
    .resize(32, 32, { fit: "fill" })
    .raw()
    .toBuffer({ resolveWithObject: true });
  return [...data];
}

const mad = (a, b) => a.reduce((s, v, i) => s + Math.abs(v - b[i]), 0) / a.length;

async function dHash(file) {
  const { data } = await sharp(file).greyscale().resize(9, 8, { fit: "fill" })
    .raw().toBuffer({ resolveWithObject: true });
  const bits = [];
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) bits.push(data[y * 9 + x] < data[y * 9 + x + 1] ? 1 : 0);
  }
  return bits;
}

/** DCT pHash: describes low-frequency structure, so it survives re-crops. */
async function pHash(file) {
  const size = 32;
  const { data } = await sharp(file).greyscale().resize(size, size, { fit: "fill" })
    .raw().toBuffer({ resolveWithObject: true });
  const cos = [];
  for (let u = 0; u < size; u++)
    for (let v = 0; v < size; v++)
      cos[u * size + v] = Math.cos(((2 * u + 1) * v * Math.PI) / (2 * size));
  const rows = [];
  for (let y = 0; y < size; y++) {
    const row = new Float64Array(size);
    for (let u = 0; u < size; u++) {
      let s = 0;
      for (let x = 0; x < size; x++) s += data[y * size + x] * cos[u * size + x];
      row[u] = s * (u === 0 ? Math.SQRT1_2 : 1);
    }
    rows.push(row);
  }
  const dct = [];
  for (let v = 0; v < size; v++) {
    for (let u = 0; u < size; u++) {
      let s = 0;
      for (let y = 0; y < size; y++) s += rows[y][u] * cos[v * size + y];
      dct.push(s * (v === 0 ? Math.SQRT1_2 : 1));
    }
  }
  const low = dct.slice(0, 64);
  const median = [...low].sort((x, y) => x - y)[32];
  return low.map((v) => (v > median ? 1 : 0));
}

const hamming = (a, b) => a.reduce((n, v, i) => n + (v !== b[i] ? 1 : 0), 0);

const images = [];
for (const folder of readdirSync(ROOT).sort()) {
  const dir = join(ROOT, folder);
  if (!statSync(dir).isDirectory()) continue;
  for (const file of readdirSync(dir).sort()) {
    if (!/\.(jpe?g|png|webp)$/i.test(file)) continue;
    const path = join(dir, file);
    images.push({
      folder,
      file,
      path,
      web: `/images/${folder}/${file}`,
      sha: createHash("sha1").update(readFileSync(path)).digest("hex").slice(0, 12),
    });
  }
}

for (const im of images) {
  im.g = await grid(im.path);
  im.p = await pHash(im.path);
  im.d = await dHash(im.path);
}

// Canonical map: walk in path order so the result is stable, and let the
// first photo seen for a given signature own it.
//
// pHash acts as a cheap pre-filter so the O(n^2) loop below only computes the
// expensive 32x32 mean difference for plausible pairs. Comparing every pair
// directly is fine at ~90 images but slows sharply as the library grows.
const NEAR = 12; // out of 64 bits
images.sort((a, b) => a.path.localeCompare(b.path));
const canonical = new Map();
for (let i = 0; i < images.length; i++) {
  let owner = null;
  for (let j = 0; j < i && !owner; j++) {
    const other = images[j];
    if (other.sha === images[i].sha) { owner = other; break; }
    if (hamming(images[i].p, other.p) > NEAR) continue;
    if (hamming(images[i].d, other.d) > NEAR) continue;
    if (mad(images[i].g, other.g) < MAD_THRESHOLD) owner = other;
  }
  canonical.set(images[i], owner ?? images[i]);
}

const dupes = images.filter((im) => canonical.get(im) !== im);
const unique = images.length - dupes.length;

console.log(`${images.length} images across ${new Set(images.map((i) => i.folder)).size} folders`);
console.log(`${unique} distinct, ${dupes.length} duplicates\n`);

if (dupes.length) {
  for (const d of dupes) {
    const c = canonical.get(d);
    const byte = c.sha === d.sha;
    const detail = byte
      ? "byte-identical"
      : `re-encoded (mad=${mad(d.g, c.g).toFixed(2)})`;
    console.log(`  ${d.web}`);
    console.log(`      duplicate of /images/${c.folder}/${c.file}  [${detail}]`);
  }
  process.exitCode = 1;
}
