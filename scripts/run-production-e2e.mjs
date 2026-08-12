import { chromium } from "@playwright/test";
import { spawn } from "node:child_process";
import { buildSite, environmentFor } from "./lib/build.mjs";

const endpoint = "/__test-intake-endpoint";
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

console.log("Building production mode with the harmless test endpoint...");
await buildSite("production", { PUBLIC_FORM_ENDPOINT: endpoint });

let browser;
let server;
try {
  server = startServer();
  await waitForServer(server);
  browser = await chromium.launch();
  const page = await browser.newPage();
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
  if (await page.locator('select[name="matter_type"]').inputValue() !== "Claims fact-gathering") throw new Error("Claims matter prefill failed");
  if (submitted) throw new Error("Production-form test made an unexpected submission");
  console.log("Production form and CTA prefill checks passed without submitting.");
} finally {
  await browser?.close();
  if (server && !server.killed) server.kill();
  console.log("Restoring the safe preview artifact in dist/...");
  await buildSite("preview");
}
