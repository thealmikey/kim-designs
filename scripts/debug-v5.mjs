import { chromium } from "playwright";
const b = await chromium.launch();
const p = await b.newContext().then((c) => c.newPage());
await p.setViewportSize({ width: 1366, height: 768 });
await p.goto("http://localhost:3000/v5/gallery/melanin-finish-mahogany", { waitUntil: "domcontentloaded", timeout: 120000 });
await p.waitForLoadState("networkidle", { timeout: 30000 }).catch(() => {});
await p.waitForTimeout(500);
await p.locator("[data-testid=image-toggle]").click();
await p.waitForTimeout(700);
const loc = p.locator("p").filter({ hasText: /[a-z]{30,}/i });
console.log("locator count:", await loc.count());
const allLoc = p.locator("p");
const n = await allLoc.count();
console.log("all p count:", n);
for (let i = 0; i < n; i++) {
  const text = await allLoc.nth(i).innerText();
  const match = /[a-z]{30,}/i.test(text);
  console.log(`p[${i}] match=${match} text=${JSON.stringify(text.slice(0, 60))}`);
}
await b.close();
