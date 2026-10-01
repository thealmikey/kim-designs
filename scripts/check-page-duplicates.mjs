/**
 * Verifies the rendered gallery pages contain no repeated photograph.
 *
 * Reads the live pages, pulls every tile image out of the justified gallery,
 * and groups them by pixel content rather than by filename, so a re-encoded
 * copy is caught even though the paths differ.
 */
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

const BASE = process.env.BASE ?? "http://localhost:3000";
const PAGES = ["/", "/kitchens", "/wardrobes", "/bath-vanities", "/shop-fit-outs"];

async function grid(file) {
  const { data } = await sharp(file).greyscale().resize(32, 32, { fit: "fill" })
    .raw().toBuffer({ resolveWithObject: true });
  return [...data];
}
const mad = (a, b) => a.reduce((s, v, i) => s + Math.abs(v - b[i]), 0) / a.length;

let failures = 0;

for (const page of PAGES) {
  const html = await (await fetch(BASE + page)).text();

  // Gallery tiles only: next/image emits srcset entries, so match the img
  // whose src matches a /images/ path, and keep one entry per img tag.
  const imgs = [...html.matchAll(/<img[^>]*?\ssrc="(\/images\/[^"?]+)"[^>]*>/g)].map((m) => m[1]);
  const uniq = [...new Set(imgs)];

  // Group by content.
  const buckets = [];
  const grids = new Map();
  for (const web of uniq) {
    const path = "public" + web;
    let g;
    try {
      g = grids.get(web) ?? (await grid(path));
    } catch {
      console.log(`  !! ${web} referenced but unreadable`);
      failures++;
      continue;
    }
    grids.set(web, g);
    let hit = null;
    for (const b of buckets) if (mad(b.g, g) < 6) { hit = b; break; }
    if (hit) hit.members.push(web);
    else buckets.push({ g, members: [web] });
  }

  const repeated = buckets.filter((b) => b.members.length > 1);
  const tileCount = (html.match(/cursor-zoom-in/g) ?? []).length;

  console.log(`${page.padEnd(18)} tiles=${String(tileCount).padEnd(3)} images=${String(uniq.length).padEnd(3)} distinct=${buckets.length} repeated=${repeated.length}`);
  for (const b of repeated) {
    console.log(`    repeated group:`);
    for (const m of b.members) console.log(`      ${m}`);
    failures++;
  }
}

console.log(failures ? `\n${failures} repeated group(s)/errors` : "\nNo repeated photographs on any page.");
process.exitCode = failures ? 1 : 0;