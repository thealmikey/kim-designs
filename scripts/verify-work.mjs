import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newContext().then((c) => c.newPage());

const errors = [];
page.on("pageerror", (e) => errors.push(`${e.name}: ${e.message}`));
page.on("requestfailed", (req) =>
  errors.push(`failed: ${req.url()} :: ${req.failure()?.errorText}`)
);

async function measure(label) {
  const url = "http://localhost:3000/work";
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 120000 });
  await page.waitForLoadState("networkidle", { timeout: 30000 }).catch(() => {});
  const vp = page.viewportSize();
  console.log(`\n--- ${label} (${vp.width}x${vp.height}) ---`);

  // Count occurrences of "Portfolio" and "Selected" (case-insensitive)
  const portfolio = await page.getByText(/^Portfolio$/i).count();
  const selectedWork = await page.getByText("Selected").count();

  // First H1 (page-level heading) and any H2s (should be none in /work)
  const h1s = await page.locator("h1").allInnerTexts();
  const h2s = await page.locator("h2").allInnerTexts();

  // Project cards
  const cards = page.locator("a.project-card");
  const cardCount = await cards.count();

  // Measure each card's bounding box to verify they fit within the viewport
  const boxes = [];
  for (let i = 0; i < cardCount; i++) {
    const box = await cards.nth(i).boundingBox();
    if (box) boxes.push({ i: i + 1, w: Math.round(box.width), h: Math.round(box.height) });
  }
  const maxRight = Math.max(...boxes.map(b => b.w + 0));
  const maxBottom = Math.max(...boxes.map(b => b.h + 0));
  const viewport = page.viewportSize();

  // Detect grid layout: at desktop, expect 3 columns; first row y-offsets should be similar
  const ys = [];
  for (let i = 0; i < cardCount; i++) {
    const box = await cards.nth(i).boundingBox();
    if (box) ys.push(Math.round(box.y));
  }
  const uniqueYTop = [...new Set(ys)].sort((a, b) => a - b);

  console.log(`title: ${await page.title()}`);
  console.log(`"Portfolio" occurrences: ${portfolio}  (expect 1)`);
  console.log(`"Selected" occurrences: ${selectedWork}  (expect 1)`);
  console.log(`H1 count: ${h1s.length}  H1 texts: ${JSON.stringify(h1s)}`);
  console.log(`H2 count: ${h2s.length}  H2 texts: ${JSON.stringify(h2s)}`);
  console.log(`project-card count: ${cardCount}  (expect 6)`);
  console.log(`unique card top-y: ${JSON.stringify(uniqueYTop)}`);
  console.log(`viewport: ${viewport.width}x${viewport.height}`);
  console.log(`max card width: ${maxRight}px  max card height: ${maxBottom}px`);
  console.log(`fits viewport: ${maxRight <= viewport.width && maxBottom <= viewport.height}`);

  // Card aspect ratios
  for (const b of boxes) {
    console.log(`  card ${b.i}: ${b.w}x${b.h}  ratio ${(b.h / b.w).toFixed(2)}  (expect ~1.25 for 4/5)`);
  }

  return { portfolio, selectedWork, h1s, h2s, cardCount, boxes };
}

// Desktop (laptop)
await page.setViewportSize({ width: 1366, height: 768 });
const desktop = await measure("Desktop 1366x768");

// Tablet
await page.setViewportSize({ width: 820, height: 1024 });
const tablet = await measure("Tablet 820x1024");

// Mobile
await page.setViewportSize({ width: 390, height: 844 });
const mobile = await measure("Mobile 390x844");

if (errors.length) {
  console.log("\n--- errors ---");
  errors.forEach((e) => console.log(e));
} else {
  console.log("\nno page errors, no failed requests");
}

// Final assertions
console.log("\n--- assertions ---");
const checks = [
  ["Desktop: 1 Portfolio", desktop.portfolio === 1],
  ["Desktop: 1 Selected", desktop.selectedWork === 1],
  ["Desktop: exactly 1 H1", desktop.h1s.length === 1],
  ["Desktop: 0 H2 (no duplicate header)", desktop.h2s.length === 0],
  ["Desktop: 6 cards", desktop.cardCount === 6],
  ["Tablet: 1 Portfolio", tablet.portfolio === 1],
  ["Tablet: 6 cards", tablet.cardCount === 6],
  ["Mobile: 1 Portfolio", mobile.portfolio === 1],
  ["Mobile: 6 cards", mobile.cardCount === 6],
];
let allPass = true;
for (const [name, ok] of checks) {
  console.log(`${ok ? "✓" : "✗"} ${name}`);
  if (!ok) allPass = false;
}
console.log(allPass ? "\nALL CHECKS PASS" : "\nSOME CHECKS FAILED");

await browser.close();
