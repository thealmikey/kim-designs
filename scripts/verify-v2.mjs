import { chromium } from "playwright";

const URLS = [
  "http://localhost:3000/v2/work",
  "http://localhost:3000/v2/work/wardropes",
  "http://localhost:3000/v3/work",
  "http://localhost:3000/v3/work/wardropes",
  "http://localhost:3000/v4/work",
  "http://localhost:3000/v4/work/wardropes",
  "http://localhost:3000/work",
  "http://localhost:3000/",
];

const browser = await chromium.launch();
const context = await browser.newContext();
const page = await context.newPage();

const consoleMessages = [];
const pageErrors = [];
const failedRequests = [];

page.on("console", (msg) => {
  consoleMessages.push(`[${msg.type()}] ${msg.text()}`);
});
page.on("pageerror", (err) => {
  pageErrors.push(`${err.name}: ${err.message}`);
});
page.on("requestfailed", (req) => {
  failedRequests.push(`${req.method()} ${req.url()} :: ${req.failure()?.errorText}`);
});

for (const url of URLS) {
  console.log(`\n========== ${url} ==========`);
  consoleMessages.length = 0;
  pageErrors.length = 0;
  failedRequests.length = 0;

  try {
    const res = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 120000 });
    console.log(`HTTP status: ${res?.status()}`);
  } catch (e) {
    console.log(`NAV ERROR: ${e.message}`);
  }

  // wait briefly for any client hydration / image attempts
  await page.waitForLoadState("networkidle", { timeout: 30000 }).catch(() => {
    console.log("networkidle timed out (non-fatal)");
  });

  const title = await page.title();
  const bodyTextSample = (await page.locator("body").innerText().catch(() => "")).slice(0, 400);
  const h1 = await page.locator("h1, h2, h3").first().innerText().catch(() => "(no heading)");
  const imgCount = await page.locator("img").count();
  const navReady = await page.locator("header nav").count();

  console.log(`title: ${title}`);
  console.log(`first heading: ${h1}`);
  console.log(`<img> count: ${imgCount}`);
  console.log(`<header><nav> count: ${navReady}`);
  console.log(`body sample:\n${bodyTextSample}`);

  if (consoleMessages.length) {
    console.log(`-- console (${consoleMessages.length}) --`);
    consoleMessages.forEach((m) => console.log(m));
  }
  if (pageErrors.length) {
    console.log(`-- page errors (${pageErrors.length}) --`);
    pageErrors.forEach((m) => console.log(m));
  }
  if (failedRequests.length) {
    console.log(`-- failed requests (${failedRequests.length}) --`);
    failedRequests.forEach((m) => console.log(m));
  }
}

await browser.close();
