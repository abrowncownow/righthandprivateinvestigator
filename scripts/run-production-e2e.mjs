import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { buildSite, environmentFor, PRODUCTION_SITE_URL } from "./lib/build.mjs";

const endpoint = "https://formsubmit.co/righthandpi.id@gmail.com";
const port = 4324;
const origin = `http://127.0.0.1:${port}`;

function startServer() {
  return spawn(process.execPath, ["scripts/preview-foreground.mjs"], {
    env: {
      ...environmentFor("production", { PUBLIC_FORM_ENDPOINT: endpoint }),
      TEST_SERVER_PORT: String(port)
    },
    stdio: ["ignore", "pipe", "pipe"]
  });
}
async function waitForServer(child) {
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("Timed out waiting for the production test server")), 15_000);
    child.once("exit", (code) => {
      clearTimeout(timer);
      reject(new Error(`Production test server exited with code ${code}`));
    });
    child.stdout.on("data", (chunk) => {
      if (chunk.toString().includes("Static test server listening")) {
        clearTimeout(timer);
        resolve();
      }
    });
  });
}

console.log("Building production mode; form submissions will be intercepted locally...");
await buildSite("production", { PUBLIC_FORM_ENDPOINT: endpoint });

let browser;
let server;
try {
  server = startServer();
  await waitForServer(server);
  browser = await chromium.launch();
  const page = await browser.newPage();
  let formPayload;
  await page.route(endpoint, async (route) => {
    formPayload = new URLSearchParams(route.request().postData() || "");
    await route.fulfill({ status: 200, contentType: "text/html", body: "<p>Submission intercepted locally.</p>" });
  });
  let submitted = false;
  page.on("request", (request) => {
    if (request.method() === "POST") submitted = true;
  });

  let response = await page.goto(`${origin}/contact/?audience=individual&matter=infidelity`, { waitUntil: "domcontentloaded" });
  if (!response?.ok()) throw new Error("Production contact route did not load successfully");
  const form = page.locator("form[data-contact-form]");
  await form.waitFor({ state: "visible" });
  if (await form.getAttribute("action") !== endpoint) throw new Error("Production form used the wrong test endpoint");
  if (!await form.locator('input[name="audience"][value="Individual"]').isChecked()) throw new Error("Individual CTA prefill failed");
  if (await form.locator('select[name="matter_type"]').inputValue() !== "Infidelity or relationship concern") throw new Error("Infidelity matter prefill failed");

  response = await page.goto(`${origin}/contact/?audience=organization&matter=claims`, { waitUntil: "domcontentloaded" });
  if (!response?.ok()) throw new Error("Second production contact route did not load successfully");
  if (!await page.locator('input[name="audience"][value="Organization"]').isChecked()) throw new Error("Organization CTA prefill failed");
  if (await page.locator('select[name="matter_type"]').inputValue() !== "Claims investigation") throw new Error("Claims matter prefill failed");

  response = await page.goto(`${origin}/contact/?audience=organization&matter=employment`, { waitUntil: "domcontentloaded" });
  if (!response?.ok()) throw new Error("Employment screening contact route did not load successfully");
  if (await page.locator('select[name="matter_type"]').inputValue() !== "Employment background screening") throw new Error("Employment screening prefill failed");

  response = await page.goto(`${origin}/contact/?audience=individual&matter=detection`, { waitUntil: "domcontentloaded" });
  if (!response?.ok()) throw new Error("Electronic surveillance contact route did not load successfully");
  if (!await page.locator('input[name="audience"][value="Individual"]').isChecked()) throw new Error("Electronic surveillance audience prefill failed");
  if (await page.locator('select[name="matter_type"]').inputValue() !== "Electronic surveillance detection") throw new Error("Electronic surveillance prefill failed");
  if (submitted) throw new Error("Production-form test made an unexpected submission");
  assert.equal(await page.locator(".preview-banner").count(), 0);
  assert.equal(await page.locator('input[name="_next"]').inputValue(), `${PRODUCTION_SITE_URL}/thank-you/`);
  await form.locator('input[name="name"]').fill("Local form test");
  await form.locator('input[name="email"]').fill("test@example.com");
  await form.locator('input[name="phone"]').fill("208-555-0100");
  await form.locator('input[name="location"]').fill("Boise");
  await form.locator('textarea[name="overview"]').fill("Local test; this request must never reach the form service.");
  await form.locator('input[name="terms_accepted"]').check();
  await Promise.all([
    page.waitForURL(endpoint),
    form.locator('button[type="submit"]').click()
  ]);
  assert.ok(formPayload, "Expected a locally intercepted form submission");
  assert.equal(formPayload.get("email"), "test@example.com");
  assert.equal(formPayload.get("_honey"), "");
  assert.equal(formPayload.get("_next"), `${PRODUCTION_SITE_URL}/thank-you/`);
  assert.equal(formPayload.get("audience"), "Individual");
  assert.equal(formPayload.get("matter_type"), "Electronic surveillance detection");
  assert.equal(formPayload.get("terms_accepted"), "yes");
  assert.equal(formPayload.get("_captcha"), null, "Keep FormSubmit's default CAPTCHA enabled");
  console.log("Production form, CTA prefill, and submission payload checks passed without contacting the form service.");
} finally {
  await browser?.close();
  if (server && !server.killed) server.kill();
  console.log("Restoring the safe preview artifact in dist/...");
  await buildSite("preview");
}
