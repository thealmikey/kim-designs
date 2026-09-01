import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newContext().then((c) => c.newPage());

const errors = [];
page.on("pageerror", (e) => errors.push(`${e.name}: ${e.message}`));
page.on("requestfailed", (req) =>
  errors.push(`failed: ${req.url()} :: ${req.failure()?.errorText}`)
);

await page.goto("http://localhost:3000/v4/work", { waitUntil: "domcontentloaded", timeout: 120000 });
await page.waitForLoadState("networkidle", { timeout: 30000 }).catch(() => {});

console.log("--- /v4/work (default: All) ---");
console.log("title:", await page.title());
console.log("first h1:", (await page.locator("h1").first().innerText()).trim());
console.log("first h2:", (await page.locator("h2").first().innerText()).trim());
console.log("eyebrow 'Latest':", await page.getByText("Latest", { exact: true }).count());
console.log("'Browse the collection' h2:", await page.getByText("Browse the collection").count());
console.log("'Why Kim' eyebrow:", await page.getByText("Why Kim", { exact: true }).count());
console.log("PropertyCard count (a with aria-label starting 'Open '):", await page.locator("a[aria-label^='Open ']").count());
console.log("Filter button 'All':", await page.getByRole("button", { name: /^All/ }).count());
console.log("Filter button 'Kitchens':", await page.getByRole("button", { name: /^Kitchens/ }).count());
console.log("Filter button 'Cabinetry':", await page.getByRole("button", { name: /^Cabinetry/ }).count());

// click Kitchen
const kitchenBtn = page.getByRole("button", { name: /^Kitchen/ });
await kitchenBtn.click();
await page.waitForTimeout(300);
console.log("\n--- after click 'Kitchen' ---");
console.log("PropertyCard count:", await page.locator("a[aria-label^='Open ']").count());
console.log("§ heading:", (await page.locator("p").filter({ hasText: /^§/ }).first().innerText()).trim());
console.log("First card title:", (await page.locator("a[aria-label^='Open '] h3").first().innerText()).trim());

// click Cabinetry (has 2 projects)
const cabinetryBtn = page.getByRole("button", { name: /^Cabinetry/ });
await cabinetryBtn.click();
await page.waitForTimeout(300);
console.log("\n--- after click 'Cabinetry' ---");
console.log("PropertyCard count:", await page.locator("a[aria-label^='Open ']").count());
console.log("First card title:", (await page.locator("a[aria-label^='Open '] h3").first().innerText()).trim());

// back to All
await page.getByRole("button", { name: /^All/ }).click();
await page.waitForTimeout(300);
console.log("\n--- after click 'All' ---");
console.log("PropertyCard count:", await page.locator("a[aria-label^='Open ']").count());

if (errors.length) {
  console.log("\n--- errors ---");
  errors.forEach((e) => console.log(e));
} else {
  console.log("\nno page errors, no failed requests");
}

await browser.close();
