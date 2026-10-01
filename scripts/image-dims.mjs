// Reads intrinsic dimensions from JPEG/PNG/WebP files without any native deps,
// then writes a path -> [width, height] manifest.
//
// The masonry gallery needs each image's true aspect ratio up front: the tile
// is sized before the bitmap decodes, which reserves the box and avoids
// layout shift, and it means photos are shown uncropped at their own ratio.
//
// Usage: node scripts/image-dims.mjs

import { readdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const ROOT = join(process.cwd(), "public");
const OUT = join(process.cwd(), "src", "lib", "image-dims.json");
const EXTS = new Set([".jpg", ".jpeg", ".png", ".webp"]);

/**
 * Walks the JPEG marker chain to the SOFn frame header, which carries the
 * real pixel dimensions. SOF0-SOF15 are the frame headers except DHT (c4),
 * JPG (c8) and DAC (cc), which share the 0xC0-0xCF range.
 */
function jpegSize(buf) {
  if (buf.length < 4 || buf.readUInt16BE(0) !== 0xffd8) return null;
  let i = 2;
  while (i < buf.length - 1) {
    if (buf[i] !== 0xff) {
      i += 1;
      continue;
    }
    const marker = buf[i + 1];
    // Padding and standalone markers carry no length.
    if (marker === 0xff || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd9)) {
      i += 2;
      continue;
    }
    const len = buf.readUInt16BE(i + 2);
    const isSof =
      marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc;
    if (isSof) {
      return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
    }
    i += 2 + len;
  }
  return null;
}

function pngSize(buf) {
  if (buf.length < 24) return null;
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  if (!buf.subarray(0, 8).equals(sig)) return null;
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

function webpSize(buf) {
  if (buf.length < 30) return null;
  if (buf.toString("latin1", 8, 12) !== "WEBP") return null;
  const fmt = buf.toString("latin1", 12, 16);
  if (fmt === "VP8 ") {
    return { width: buf.readUInt16LE(26) & 0x3fff, height: buf.readUInt16LE(28) & 0x3fff };
  }
  if (fmt === "VP8L") {
    const bits = buf.readUInt32LE(21);
    return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
  }
  if (fmt === "VP8X") {
    const w = buf[24] | (buf[25] << 8) | (buf[26] << 16);
    const h = buf[27] | (buf[28] << 8) | (buf[29] << 16);
    return { width: w + 1, height: h + 1 };
  }
  return null;
}

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else {
      const dot = entry.name.lastIndexOf(".");
      if (dot !== -1 && EXTS.has(entry.name.slice(dot).toLowerCase())) out.push(full);
    }
  }
  return out;
}

const manifest = {};
let unreadable = 0;

for (const file of walk(ROOT)) {
  const buf = readFileSync(file);
  const ext = file.slice(file.lastIndexOf(".")).toLowerCase();
  const size =
    ext === ".png" ? pngSize(buf) : ext === ".webp" ? webpSize(buf) : jpegSize(buf);
  if (!size || !size.width || !size.height) {
    unreadable += 1;
    console.error(`unreadable: ${relative(ROOT, file)}`);
    continue;
  }
  // Normalise to forward slashes so the key matches the /images/... URLs
  // used in the app regardless of platform separator.
  const key = "/" + relative(ROOT, file).split(sep).join("/");
  manifest[key] = [size.width, size.height];
}

const sorted = Object.fromEntries(
  Object.keys(manifest)
    .sort()
    .map((k) => [k, manifest[k]])
);

writeFileSync(OUT, JSON.stringify(sorted, null, 2) + "\n", "utf8");

const total = Object.keys(sorted).length;
console.log(`${total} images -> ${relative(process.cwd(), OUT)}`);
if (unreadable) console.log(`${unreadable} skipped (unreadable header)`);
console.log(`${(statSync(OUT).size / 1024).toFixed(1)} KB`);