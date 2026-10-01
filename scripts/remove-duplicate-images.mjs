/**
 * Removes duplicate photos and repoints every reference to the surviving copy.
 *
 * Two passes:
 *  1. decide, for each duplicate, which file survives (see SURVIVORS below)
 *  2. rewrite src/lib/projects.ts image lists and the homepage slider, then
 *     delete the redundant files and regenerate src/lib/image-dims.json
 *
 * Dry run by default; pass --write to apply.
 */
import { readFileSync, writeFileSync, existsSync, unlinkSync } from "node:fs";
import { join } from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

const WRITE = process.argv.includes("--write");

/** folder -> the files inside it that are redundant and must be deleted. */
const REMOVE = {
  // 01==02 and 05==06 are the same photograph re-encoded. 03 and 04 are real.
  "handless-melanin": ["02.jpg", "06.jpg"],
  // 15 of the 16 supplied "closets" photos already exist under
  // better-wardrobes/ and classic-wardrobe/. Only 02.jpg is new, and the
  // whole set is retired, so the folder goes entirely.
  closets: [
    "01.jpg", "03.jpg", "04.jpg", "05.jpg", "06.jpg", "07.jpg", "08.jpg",
    "09.jpg", "10.jpg", "11.jpg", "12.jpg", "13.jpg", "14.jpg", "15.jpg", "16.jpg",
  ],
  // Byte-identical to classic-wardrobe-with-mirror/01.jpg.
  "wardrobe-installation-process": ["02.jpg"],
  // Re-encodes of glossy-wardrobe-led-mirror/02-04.jpg.
  wardropes: ["04.jpg", "06.jpg", "07.jpg"],
};

/**
 * Folder that owns each removed photo's content, for repointing references.
 * Keys are "<folder>/<file>" and values are a bare path relative to /images/.
 */
const REPOINT = {
  "handless-melanin/02.jpg": "handless-melanin/01.jpg",
  "handless-melanin/06.jpg": "handless-melanin/05.jpg",
  "wardrobe-installation-process/02.jpg": "classic-wardrobe-with-mirror/01.jpg",
  "wardropes/04.jpg": "glossy-wardrobe-led-mirror/02.jpg",
  "wardropes/06.jpg": "glossy-wardrobe-led-mirror/03.jpg",
  "wardropes/07.jpg": "glossy-wardrobe-led-mirror/04.jpg",
  // Referenced by the homepage slider, so they need somewhere to point even
  // though the whole closets/ folder is going away.
  "closets/05.jpg": "better-wardrobes/08.jpg",
  "closets/10.jpg": "classic-wardrobe/10.jpg",
  // The remaining closets photos duplicate an existing project verbatim and
  // no reference outside the retired closets-2026 entry uses them.
  "closets/01.jpg": "better-wardrobes/03.jpg",
  "closets/03.jpg": "better-wardrobes/02.jpg",
  "closets/04.jpg": "better-wardrobes/06.jpg",
  "closets/06.jpg": "better-wardrobes/05.jpg",
  "closets/07.jpg": "better-wardrobes/09.jpg",
  "closets/08.jpg": "better-wardrobes/07.jpg",
  "closets/09.jpg": "better-wardrobes/01.jpg",
  "closets/11.jpg": "wardrobe-with-makeup-table/01.jpg",
  "closets/12.jpg": "classic-wardrobe/04.jpg",
  "closets/13.jpg": "classic-wardrobe/05.jpg",
  "closets/14.jpg": "classic-wardrobe/01.jpg",
  "closets/15.jpg": "classic-wardrobe/03.jpg",
  "closets/16.jpg": "classic-wardrobe/02.jpg",
};

const deletions = Object.entries(REMOVE).flatMap(([folder, files]) =>
  files.map((f) => ({
    web: `/images/${folder}/${f}`,
    key: `${folder}/${f}`,
    path: join("public/images", folder, f),
  }))
);

console.log(`${WRITE ? "APPLYING" : "DRY RUN"} - ${deletions.length} file(s) scheduled for removal\n`);

// Safety: every removal must actually be a duplicate of a file that stays.
async function grid(f) {
  const { data } = await sharp(f).greyscale().resize(32, 32, { fit: "fill" })
    .raw().toBuffer({ resolveWithObject: true });
  return [...data];
}
const mad = (a, b) => a.reduce((s, v, i) => s + Math.abs(v - b[i]), 0) / a.length;

let unsafe = 0;
for (const d of deletions) {
  const survivor = REPOINT[d.key];
  if (!survivor) {
    console.log(`  !! ${d.web} has no mapped survivor - would lose content`);
    unsafe++;
    continue;
  }
  const sp = join("public/images", survivor);
  if (!existsSync(sp)) {
    console.log(`  !! ${d.web} -> ${survivor} missing on disk`);
    unsafe++;
    continue;
  }
  const diff = mad(await grid(d.path), await grid(sp));
  if (diff >= 6) {
    console.log(`  !! ${d.web} vs ${survivor}: mad=${diff.toFixed(2)} - NOT a duplicate, aborting`);
    unsafe++;
    continue;
  }
  console.log(`  ok  ${d.web}  ==  /images/${survivor}   (mad=${diff.toFixed(2)})`);
}
if (unsafe) {
  console.log(`\n${unsafe} unsafe removal(s). Aborting.`);
  process.exit(1);
}

if (!WRITE) {
  console.log("\nDry run clean. Re-run with --write to apply.");
  process.exit(0);
}

// ---- rewrite projects.ts -------------------------------------------------
const projectsPath = "src/lib/projects.ts";
let projects = readFileSync(projectsPath, "utf8");

// 1. Retire closets-2026 entirely: 15 of 16 photos duplicated two other
//    projects, so as a standalone entry it showed the same pictures twice.
const before = projects.length;
projects = projects.replace(
  /\n  \{\n    id: "closets-2026",[\s\S]*?\n  \},/,
  ""
);
if (projects.length === before) throw new Error("closets-2026 block not matched");
console.log('\nremoved the closets-2026 project');

// 2. handless-melanin 6 -> 4 photos.
projects = projects.replace(
  `images: Array.from({ length: 6 }, (_, i) => img("handless-melanin", i + 1)),`,
  `// 01 and 05 each had a re-encoded twin (02, 06); both removed.
    images: [1, 3, 4, 5].map((n) => img("handless-melanin", n)),`
);

// 3. wardropes 7 -> 4 photos (04, 06, 07 duplicated glossy-wardrobe-led-mirror).
projects = projects.replace(
  `images: Array.from({ length: 7 }, (_, i) => img("wardropes", i + 1)),`,
  `// 04, 06 and 07 duplicated glossy-wardrobe-led-mirror; removed.
    images: [1, 2, 3, 5].map((n) => img("wardropes", n)),`
);

// 4. wardrobe-installation-process 2 -> 1 photo (02 was byte-identical).
projects = projects.replace(
  `images: Array.from({ length: 2 }, (_, i) =>
      img("wardrobe-installation-process", i + 1),
    ),`,
  `// 02 was byte-identical to classic-wardrobe-with-mirror/01.jpg.
    images: [img("wardrobe-installation-process", 1)],`
);

writeFileSync(projectsPath, projects, "utf8");

// ---- repoint the homepage slider ----------------------------------------
const sliderPath = "src/components/variants/v6/AtelierIndex.tsx";
let slider = readFileSync(sliderPath, "utf8");
for (const [from, to] of Object.entries(REPOINT)) {
  const needle = `/images/${from}`;
  if (slider.includes(needle)) {
    slider = slider.replace(needle, `/images/${to}`);
    console.log(`slider: ${needle} -> /images/${to}`);
  }
}
writeFileSync(sliderPath, slider, "utf8");

// ---- delete the redundant files -----------------------------------------
for (const d of deletions) {
  unlinkSync(d.path);
  console.log(`deleted ${d.web}`);
}

// ---- regenerate the dimension manifest ----------------------------------
// Required, not optional: the justified gallery sizes every tile from this
// file, and a stale entry would reserve the wrong box for a missing image.
const dimsPath = "src/lib/image-dims.json";
const dims = JSON.parse(readFileSync(dimsPath, "utf8"));
for (const d of deletions) delete dims[d.web];
const sorted = Object.fromEntries(Object.entries(dims).sort(([a], [b]) => a.localeCompare(b)));
writeFileSync(dimsPath, JSON.stringify(sorted, null, 2) + "\n", "utf8");
console.log(`\nimage-dims.json: ${Object.keys(dims).length} entries`);
