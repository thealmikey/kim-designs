import { chromium } from "playwright";
const browser = await chromium.launch();
const page = await browser.newContext().then((c) => c.newPage());
await page.setViewportSize({ width: 1366, height: 768 });
await page.goto("http://localhost:3000/work", { waitUntil: "domcontentloaded", timeout: 120000 });
await page.waitForLoadState("networkidle", { timeout: 30000 }).catch(() => {});

const html = await page.content();
// Find every "Selected" mention in the body and the surrounding context
const matches = [...html.matchAll(/Selected[^<]{0,80}/g)].map(m => m[0]);
console.log("'Selected' substring matches in full HTML:");
matches.forEach((m, i) => console.log(`  [${i}] ${m}`));

const h2s = await page.locator("h2").all();
for (const h of h2s) {
  const text = await h.innerText();
  const visible = await h.isVisible();
  const box = await h.boundingBox();
  console.log(`H2: text=${JSON.stringify(text)}  visible=${visible}  box=${box ? `${Math.round(box.width)}x${Math.round(box.height)} @ ${Math.round(box.x)},${Math.round(box.y)}` : "null"}`);
}

await browser.close();
