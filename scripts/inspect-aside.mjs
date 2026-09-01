import { chromium } from "playwright";
const browser = await chromium.launch();
const page = await browser.newContext().then((c) => c.newPage());
await page.setViewportSize({ width: 1366, height: 641 });
await page.goto("http://localhost:3000/projects/spray-paint-kitchen", { waitUntil: "domcontentloaded", timeout: 120000 });
await page.waitForLoadState("networkidle", { timeout: 30000 }).catch(() => {});

const asides = await page.locator("aside").all();
console.log(`Total <aside> count: ${asides.length}`);
for (let i = 0; i < asides.length; i++) {
  const a = asides[i];
  const box = await a.boundingBox().catch(() => null);
  const style = await a.evaluate((el) => {
    const cs = getComputedStyle(el);
    return { display: cs.display, gridTemplateColumns: cs.gridTemplateColumns, gap: cs.gap, height: cs.height, classes: el.className.slice(0, 100) };
  }).catch(() => null);
  console.log(`aside[${i}]: box=${box ? `${Math.round(box.width)}x${Math.round(box.height)} @ ${Math.round(box.x)},${Math.round(box.y)}` : "null"}  style=${JSON.stringify(style)}`);
}

await browser.close();
