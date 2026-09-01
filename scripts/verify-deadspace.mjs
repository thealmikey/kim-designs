import { chromium } from "playwright";
const browser = await chromium.launch();
const page = await browser.newContext().then((c) => c.newPage());

const errors = [];
page.on("pageerror", (e) => errors.push(`${e.name}: ${e.message}`));
page.on("console", (m) => { if (m.type() === "error") errors.push(`console.error: ${m.text()}`); });

await page.setViewportSize({ width: 1366, height: 641 });
await page.goto("http://localhost:3000/v5/gallery/wardropes", { waitUntil: "domcontentloaded", timeout: 120000 });
await page.waitForLoadState("networkidle", { timeout: 30000 }).catch(() => {});
await page.waitForTimeout(500);

console.log("--- /v5/gallery/wardropes (1366x641) ---");
console.log("url:", page.url());

// Top bar
const topBar = page.locator("[data-testid='single-item-view'] > div").first();
const topBarBox = await topBar.boundingBox();
console.log(`top bar: y=${Math.round(topBarBox.y)} h=${Math.round(topBarBox.height)} (ends at y=${Math.round(topBarBox.y + topBarBox.height)})`);

// Main image
const mainImg = page.locator("[data-testid='image-toggle'] img").first();
const mainImgBox = await mainImg.boundingBox();
console.log(`main img: y=${Math.round(mainImgBox.y)} h=${Math.round(mainImgBox.height)} (top at y=${Math.round(mainImgBox.y)}, bottom at y=${Math.round(mainImgBox.y + mainImgBox.height)})`);

// Main image button (parent that holds the badges + image)
const mainBtn = page.locator("[data-testid='image-toggle']");
const mainBtnBox = await mainBtn.boundingBox();
console.log(`main btn: y=${Math.round(mainBtnBox.y)} h=${Math.round(mainBtnBox.height)}`);

// Dead space above image (top of image - bottom of top bar)
const imgTop = mainImgBox.y;
const topBarBottom = topBarBox.y + topBarBox.height;
const deadSpaceAbove = imgTop - topBarBottom;
console.log(`dead space above image (imgTop - topBarBottom): ${Math.round(deadSpaceAbove)}px (expect ~0, small padding OK)`);

// Total viewport usage
const viewport = page.viewportSize();
const viewBox = await page.locator("[data-testid='single-item-view']").boundingBox();
console.log(`view spans ${Math.round(viewBox.height)}px of ${viewport.height}px viewport`);

// Confirm description panel toggle still works
const expandedBefore = await mainBtn.getAttribute("aria-expanded");
await mainBtn.click();
await page.waitForTimeout(700);
const expandedAfter1 = await mainBtn.getAttribute("aria-expanded");
await mainBtn.click();
await page.waitForTimeout(700);
const expandedAfter2 = await mainBtn.getAttribute("aria-expanded");
console.log(`toggle: before=${expandedBefore} 1st=${expandedAfter1} 2nd=${expandedAfter2}`);

if (errors.length) {
  console.log("\n--- errors ---");
  errors.forEach((e) => console.log(e));
} else {
  console.log("\nno page errors");
}

await browser.close();
