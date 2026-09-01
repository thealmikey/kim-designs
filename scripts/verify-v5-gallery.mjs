import { chromium } from "playwright";
const browser = await chromium.launch();
const page = await browser.newContext().then((c) => c.newPage());

const errors = [];
page.on("pageerror", (e) => errors.push(`${e.name}: ${e.message}`));
page.on("console", (m) => {
  if (m.type() === "error") errors.push(`console.error: ${m.text()}`);
});

await page.setViewportSize({ width: 1366, height: 768 });
await page.goto("http://localhost:3000/v5/gallery", { waitUntil: "domcontentloaded", timeout: 120000 });
await page.waitForLoadState("networkidle", { timeout: 30000 }).catch(() => {});

console.log("--- /v5/gallery ---");
console.log("title:", await page.title());
const gridItems = await page.locator("main [data-index]").count();
console.log("grid items:", gridItems, "(expect 6)");

// 1. Select 3 items
const selectButtons = page.locator("button[data-testid^='select-']");
await selectButtons.nth(0).click();
await selectButtons.nth(2).click();
await selectButtons.nth(4).click();
await page.waitForTimeout(200);

const bar = page.locator("[aria-label='Selected projects']");
const barVisible = await bar.isVisible();
console.log("selection bar visible:", barVisible);

const waLink = page.locator("a[href^='https://wa.me/']");
const waHref = await waLink.getAttribute("href");
console.log("WhatsApp href starts with https://wa.me/?text=:", waHref?.startsWith("https://wa.me/?text="));
console.log("WhatsApp href length:", waHref?.length);

await page.locator("[aria-label='Selected projects'] button").click();
await page.waitForTimeout(200);

// 2. Open single-item view (pvc-foilwrap has 10 images → biggest thumbnail strip)
await page.goto("http://localhost:3000/v5/gallery/pvc-foilwrap-and-high-gloss-handless-kitchen", { waitUntil: "domcontentloaded", timeout: 120000 });
await page.waitForLoadState("networkidle", { timeout: 30000 }).catch(() => {});
await page.waitForTimeout(500);

console.log("\n--- /v5/gallery/pvc-foilwrap... ---");
console.log("url:", page.url());
console.log("title:", await page.title());

const singleView = page.locator("[data-testid='single-item-view']");
console.log("single-item-view present:", await singleView.count() === 1);

const breadcrumb = page.locator("a[aria-label='Back to gallery']");
console.log("breadcrumb back link visible:", await breadcrumb.isVisible());

// 3. Main viewer + thumbnail strip
const mainImage = page.locator("[data-testid='image-toggle']");
console.log("main image button present:", await mainImage.count() === 1);

const thumbStrip = page.locator("[aria-label='Image thumbnails']");
console.log("thumbnail strip present:", await thumbStrip.count() >= 1);

const thumbs = page.locator("[data-testid^='thumb-']");
const thumbCount = await thumbs.count();
console.log("thumbnail count (desktop):", thumbCount, "(expect 10)");

// 4. Active state on first thumbnail
const firstThumb = thumbs.first();
const firstClass = await firstThumb.getAttribute("class");
const firstSelected = await firstThumb.getAttribute("aria-selected");
console.log("thumb[0] class includes 'border-aged-brass':", firstClass?.includes("border-aged-brass"));
console.log("thumb[0] aria-selected:", firstSelected, "(expect true)");

const secondThumb = thumbs.nth(1);
const secondClass = await secondThumb.getAttribute("class");
const secondSelected = await secondThumb.getAttribute("aria-selected");
console.log("thumb[1] class includes 'border-transparent':", secondClass?.includes("border-transparent"));
console.log("thumb[1] aria-selected:", secondSelected, "(expect false)");
console.log("thumb[1] class includes 'opacity-50':", secondClass?.includes("opacity-50"));

// 5. Main image src before click
const mainImg = mainImage.locator("img").first();
const srcBefore = await mainImg.getAttribute("src");
console.log("main image src before thumb click (last 40):", srcBefore?.slice(-40));

// 6. Click 3rd thumbnail → main image should change
await thumbs.nth(2).click();
await page.waitForTimeout(500);
const srcAfter = await mainImg.getAttribute("src");
console.log("main image src after thumb[2] click (last 40):", srcAfter?.slice(-40));
console.log("main image changed:", srcBefore !== srcAfter);
const thirdSelected = await thumbs.nth(2).getAttribute("aria-selected");
console.log("thumb[2] aria-selected after click:", thirdSelected, "(expect true)");

// 7. Tap-to-toggle details
const expandedBefore = await mainImage.getAttribute("aria-expanded");
await mainImage.click();
await page.waitForTimeout(700);
const expandedAfter1 = await mainImage.getAttribute("aria-expanded");
await mainImage.click();
await page.waitForTimeout(700);
const expandedAfter2 = await mainImage.getAttribute("aria-expanded");
console.log("\ntoggle aria-expanded: before=", expandedBefore, "1st=", expandedAfter1, "2nd=", expandedAfter2);
console.log("toggle reveals:", expandedAfter1 === "true", "hides:", expandedAfter2 === "false");

// 8. Project-level navigation (prev/next, keyboard)
const currentUrl = page.url();
await page.locator("button[aria-label='Next project']").click();
await page.waitForURL((u) => u.toString() !== currentUrl, { timeout: 10000 });
await page.waitForLoadState("networkidle", { timeout: 30000 }).catch(() => {});
const nextUrl = page.url();
console.log("\n--- next project ---");
console.log("url changed:", currentUrl !== nextUrl);
console.log("new url:", nextUrl);

// ArrowRight
const beforeArrow = page.url();
await page.keyboard.press("ArrowRight");
await page.waitForURL((u) => u.toString() !== beforeArrow, { timeout: 10000 });
await page.waitForLoadState("networkidle", { timeout: 30000 }).catch(() => {});
console.log("ArrowRight: url changed from", beforeArrow, "→", page.url());

// 9. Back to grid
await page.locator("a[aria-label='Back to gallery']").click();
await page.waitForURL(/\/v5\/gallery$/, { timeout: 10000 });
await page.waitForLoadState("networkidle", { timeout: 30000 }).catch(() => {});
console.log("\nback to:", page.url());

// 10. Mobile layout — thumbnail strip should be horizontal below main image
console.log("\n--- mobile viewport (390x844) ---");
await page.setViewportSize({ width: 390, height: 844 });
await page.goto("http://localhost:3000/v5/gallery/pvc-foilwrap-and-high-gloss-handless-kitchen", { waitUntil: "domcontentloaded", timeout: 120000 });
await page.waitForLoadState("networkidle", { timeout: 30000 }).catch(() => {});

// On mobile the desktop strip is `hidden md:block` and the mobile strip is
// `md:hidden`. Scope to the visible (mobile) strip only.
const mobileStrip = page.locator("aside[aria-label='Project thumbnails'] > div.md\\:hidden");
const mobileStripVisible = await mobileStrip.isVisible();
console.log("mobile strip visible:", mobileStripVisible);
const mobileThumbs = mobileStrip.locator("button[role='tab']");
const mobileThumbCount = await mobileThumbs.count();
console.log("mobile thumb count:", mobileThumbCount, "(expect 10)");

// Click a mobile thumb
await mobileThumbs.nth(3).click();
await page.waitForTimeout(400);
const mobileSrcAfter = await page.locator("[data-testid='image-toggle'] img").first().getAttribute("src");
console.log("mobile main image changed after click:", mobileSrcAfter?.length > 0);
const mobileActiveAfter = await mobileThumbs.nth(3).getAttribute("aria-selected");
console.log("mobile thumb[3] aria-selected after click:", mobileActiveAfter, "(expect true)");

if (errors.length) {
  console.log("\n--- errors ---");
  errors.forEach((e) => console.log(e));
} else {
  console.log("\nno page errors");
}

await browser.close();
