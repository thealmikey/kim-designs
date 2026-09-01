import { chromium } from "playwright";
const browser = await chromium.launch();
const page = await browser.newContext().then((c) => c.newPage());

const errors = [];
page.on("pageerror", (e) => errors.push(`${e.name}: ${e.message}`));
page.on("requestfailed", (req) =>
  errors.push(`failed: ${req.url()} :: ${req.failure()?.errorText}`)
);

const projectDescription = "seamless, monolithic presence";

async function check(label, w, h, slug) {
  await page.setViewportSize({ width: w, height: h });
  await page.goto(`http://localhost:3000/projects/${slug}`, {
    waitUntil: "domcontentloaded",
    timeout: 120000,
  });
  await page.waitForLoadState("networkidle", { timeout: 30000 }).catch(() => {});
  console.log(`\n--- ${label} (${w}x${h}) ---`);

  // The new meta aside
  const meta = page.locator("main aside").first();
  const metaBox = await meta.boundingBox().catch(() => null);
  const metaStyle = await meta.evaluate((el) => {
    const cs = getComputedStyle(el);
    return { display: cs.display, gridTemplateColumns: cs.gridTemplateColumns, gap: cs.gap, height: cs.height, padding: cs.padding };
  }).catch(() => null);

  // Description paragraph (the project description, by text)
  const desc = page.locator("main p").filter({ hasText: projectDescription });
  const descBox = await desc.boundingBox().catch(() => null);

  // First image in the inner grid (index 1, since 0 is the hero)
  const firstImg = page.locator("main img").nth(1);
  const firstImgBox = await firstImg.boundingBox().catch(() => null);

  // Total images
  const imgCount = await page.locator("main img").count();

  console.log(`meta box: ${metaBox ? `${Math.round(metaBox.width)}x${Math.round(metaBox.height)} @ ${Math.round(metaBox.x)},${Math.round(metaBox.y)}` : "null"}`);
  console.log(`meta style: ${JSON.stringify(metaStyle)}`);
  console.log(`desc box: ${descBox ? `${Math.round(descBox.width)}x${Math.round(descBox.height)} @ ${Math.round(descBox.x)},${Math.round(descBox.y)}` : "null"}`);
  console.log(`first img box: ${firstImgBox ? `${Math.round(firstImgBox.width)}x${Math.round(firstImgBox.height)} @ ${Math.round(firstImgBox.x)},${Math.round(firstImgBox.y)}` : "null"}`);
  console.log(`img count: ${imgCount}`);

  return { metaBox, metaStyle, descBox, firstImgBox, imgCount };
}

const desktop = await check("Desktop 1366x641", 1366, 641, "spray-paint-kitchen");
const tablet = await check("Tablet 820x1024", 820, 1024, "spray-paint-kitchen");
const mobile = await check("Mobile 390x844", 390, 844, "spray-paint-kitchen");

if (errors.length) {
  console.log("\n--- errors ---");
  errors.forEach((e) => console.log(e));
} else {
  console.log("\nno page errors, no failed requests");
}

console.log("\n--- assertions ---");
const checks = [
  // Meta is now a single horizontal band, not a full column
  ["Desktop: meta band is short (< 200px tall)", desktop.metaBox && desktop.metaBox.height < 200],
  ["Desktop: meta band is 3-col", desktop.metaStyle && desktop.metaStyle.gridTemplateColumns.split(" ").length === 3],
  ["Desktop: meta is full-width (≥ 1200px)", desktop.metaBox && desktop.metaBox.width >= 1200],
  ["Desktop: description sits below meta, not beside", desktop.metaBox && desktop.descBox && desktop.descBox.y > desktop.metaBox.y + desktop.metaBox.height - 20],
  ["Desktop: first image in grid", desktop.imgCount >= 4],
  ["Tablet: meta band short", tablet.metaBox && tablet.metaBox.height < 200],
  ["Mobile: meta band reasonable (< 280px)", mobile.metaBox && mobile.metaBox.height < 280],
];
let allPass = true;
for (const [name, ok] of checks) {
  console.log(`${ok ? "✓" : "✗"} ${name}`);
  if (!ok) allPass = false;
}
console.log(allPass ? "\nALL CHECKS PASS" : "\nSOME CHECKS FAILED");

await browser.close();
