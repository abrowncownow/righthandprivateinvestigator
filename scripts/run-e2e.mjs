import { spawn } from "node:child_process";
import { buildSite, environmentFor, PREVIEW_BASE_PATH } from "./lib/build.mjs";
import { run } from "./lib/process.mjs";

const filters = process.argv.slice(2);
// Keep the randomized test server inside a Chromium-safe port range.
const port = 4600 + (process.pid % 300);
const baseURL = `http://127.0.0.1:${port}${PREVIEW_BASE_PATH}`;
const previewEnvironment = {
  ...environmentFor("preview"),
  PLAYWRIGHT_BASE_URL: baseURL,
  TEST_SERVER_PORT: String(port)
};

function startServer() {
  return spawn(process.execPath, ["scripts/preview-foreground.mjs"], {
    env: previewEnvironment,
    stdio: ["ignore", "pipe", "pipe"]
  });
}
async function waitForServer(child) {
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("Timed out waiting for the preview test server")), 15_000);
    child.once("exit", (code) => {
      clearTimeout(timer);
      reject(new Error(`Preview test server exited with code ${code}`));
    });
    child.stdout.on("data", (chunk) => {
      if (chunk.toString().includes("Static test server listening")) {
        clearTimeout(timer);
        resolve();
      }
    });
  });
}

console.log("Building the safe preview before browser tests...");
await buildSite("preview");

const server = startServer();
try {
  await waitForServer(server);
  await run(process.execPath, ["node_modules/@playwright/test/cli.js", "test", ...filters], {
    env: previewEnvironment
  });
} finally {
  if (!server.killed) server.kill();
}
