import { chromium } from "playwright";
const browser = await chromium.launch();
const page = await browser.newContext().then((c) => c.newPage());

const errors = [];
page.on("pageerror", (e) => errors.push(`${e.name}: ${e.message}`));
page.on("console", (m) => { if (m.type() === "error") errors.push(`console.error: ${m.text()}`); });

await page.setViewportSize({ width: 1366, height: 768 });

async function probe(url, label) {
  try {
    const res = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 120000 });
    await page.waitForLoadState("networkidle", { timeout: 30000 }).catch(() => {});
    const title = await page.title();
    const h1 = await page.locator("h1").first().innerText().catch(() => "(no h1)");
    const h2 = await page.locator("h2").first().innerText().catch(() => "(no h2)");
    const gridItems = await page.locator("main [data-index]").count();
    const singleView = await page.locator("[data-testid='single-item-view']").count();
    const galleryGrid = await page.locator("main [data-testid^='select-']").count();
    const selectionBar = await page.locator("[aria-label='Selected projects']").count();
    console.log(`\n[${label}] ${url}  →  ${res?.status()}  title="${title}"`);
    console.log(`  h1="${h1.replace(/\n/g, " ")}"  h2="${h2.replace(/\n/g, " ")}"`);
    console.log(`  grid items: ${gridItems}  gallery select buttons: ${galleryGrid}  single-item-view: ${singleView}  selection bar mounted: ${selectionBar}`);
  } catch (e) {
    console.log(`\n[${label}] ${url}  →  ERROR: ${e.message}`);
  }
}

await probe("http://localhost:3000/", "/ (home — should be v5)");
await probe("http://localhost:3000/work", "/work (should be v5)");
await probe("http://localhost:3000/projects/wardropes", "/projects/wardropes (should be v5 single-item view)");
await probe("http://localhost:3000/v5/gallery", "/v5/gallery (alias)");
await probe("http://localhost:3000/v5/gallery/wardropes", "/v5/gallery/wardropes (alias)");
await probe("http://localhost:3000/v2/work", "/v2/work (variant)");
await probe("http://localhost:3000/v3/work", "/v3/work (variant)");
await probe("http://localhost:3000/v4/work", "/v4/work (variant)");
await probe("http://localhost:3000/studio", "/studio (other page)");
await probe("http://localhost:3000/contact", "/contact (other page)");

// Confirm selection persists across route changes (SelectionProvider is in root layout)
await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded", timeout: 120000 });
await page.waitForLoadState("networkidle", { timeout: 30000 }).catch(() => {});
await page.locator("button[data-testid^='select-']").first().click();
await page.locator("button[data-testid^='select-']").nth(2).click();
await page.waitForTimeout(300);
const onHome = await page.locator("[aria-label='Selected projects']").isVisible();
console.log(`\nselection bar visible on /: ${onHome}  (expect true)`);

await page.goto("http://localhost:3000/work", { waitUntil: "domcontentloaded", timeout: 120000 });
await page.waitForLoadState("networkidle", { timeout: 30000 }).catch(() => {});
const onWork = await page.locator("[aria-label='Selected projects']").isVisible();
console.log(`selection bar visible on /work: ${onWork}  (expect true — state persists across routes)`);

await page.goto("http://localhost:3000/projects/wardropes", { waitUntil: "domcontentloaded", timeout: 120000 });
await page.waitForLoadState("networkidle", { timeout: 30000 }).catch(() => {});
const onDetail = await page.locator("[aria-label='Selected projects']").count();
console.log(`selection bar present on /projects/wardropes: ${onDetail}  (expect 1 — rendered in root layout)`);

if (errors.length) {
  console.log("\n--- errors ---");
  errors.forEach((e) => console.log(e));
} else {
  console.log("\nno page errors");
}

await browser.close();
