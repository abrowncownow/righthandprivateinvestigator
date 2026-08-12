import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { createServer as createTcpServer } from "node:net";
import { tmpdir } from "node:os";
import path from "node:path";
import { chromium } from "@playwright/test";
import lighthouse, { desktopConfig } from "lighthouse";
import { buildSite, environmentFor } from "./lib/build.mjs";

const endpoint = "/__test-intake-endpoint";
const port = 4322;
const origin = `http://127.0.0.1:${port}`;
const pages = ["home", "organizations", "individuals", "contact"];
const routes = ["/", "/organizations/", "/individuals/", "/contact/"];
const categories = ["performance", "accessibility", "best-practices", "seo"];
const minimums = { performance: 0.95, accessibility: 1, "best-practices": 1, seo: 1 };

function startServer() {
  return spawn(process.execPath, ["scripts/preview-foreground.mjs", String(port)], {
    env: environmentFor("production", { PUBLIC_FORM_ENDPOINT: endpoint }),
    stdio: ["ignore", "pipe", "pipe"]
  });
}

async function waitForServer(child) {
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("Timed out waiting for the Lighthouse server")), 15_000);
    child.once("exit", (code) => {
      clearTimeout(timer);
      reject(new Error(`Lighthouse server exited with code ${code}`));
    });
    child.stdout.on("data", (chunk) => {
      if (chunk.toString().includes("Static test server listening")) {
        clearTimeout(timer);
        resolve();
      }
    });
  });
}

async function availablePort() {
  const probe = createTcpServer();
  await new Promise((resolve, reject) => {
    probe.once("error", reject);
    probe.listen(0, "127.0.0.1", resolve);
  });
  const address = probe.address();
  const port = typeof address === "object" && address ? address.port : 9223;
  await new Promise((resolve) => probe.close(resolve));
  return port;
}

function chromeExecutable() {
  const candidates = [
    process.env.CHROME_PATH,
    process.platform === "win32" ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" : undefined,
    process.platform === "win32" ? "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe" : undefined,
    process.platform === "win32" && process.env.LOCALAPPDATA
      ? path.join(process.env.LOCALAPPDATA, "Google", "Chrome", "Application", "chrome.exe")
      : undefined,
    chromium.executablePath()
  ];
  const executable = candidates.find((candidate) => candidate && existsSync(candidate));
  if (!executable) throw new Error("No compatible Chrome or Chromium installation was found");
  return executable;
}

console.log("Building an indexable production artifact for Lighthouse...");
await buildSite("production", { PUBLIC_FORM_ENDPOINT: endpoint });

let server;
let userDataDir;
let chromeProcess;
let failure;
try {
  server = startServer();
  await waitForServer(server);
  userDataDir = await mkdtemp(path.join(tmpdir(), "right-hand-lighthouse-"));
  const chromePort = await availablePort();
  const executablePath = chromeExecutable();
  chromeProcess = spawn(executablePath, [
    `--user-data-dir=${userDataDir}`,
    "--headless=new",
    `--remote-debugging-port=${chromePort}`,
    "--disable-gpu",
    "--disable-breakpad",
    "--disable-crash-reporter",
    "--no-sandbox",
    "--remote-allow-origins=*",
    "--no-first-run",
    "--no-default-browser-check",
    "about:blank"
  ], { stdio: "ignore" });

  await new Promise((resolve, reject) => {
    const started = Date.now();
    const check = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:${chromePort}/json/version`);
        if (response.ok) return resolve();
      } catch {}
      if (Date.now() - started > 15_000) return reject(new Error("Timed out starting Chrome for Lighthouse"));
      setTimeout(check, 100);
    };
    check();
  });

  await mkdir(".lighthouseci", { recursive: true });
  const scores = [];
  try {
    for (let index = 0; index < routes.length; index += 1) {
      const result = await lighthouse(`${origin}${routes[index]}`, {
        port: chromePort,
        logLevel: "error",
        output: "json"
      }, {
        ...desktopConfig,
        settings: { ...desktopConfig.settings, onlyCategories: categories }
      });
      if (!result) throw new Error(`Lighthouse produced no result for ${routes[index]}`);
      await writeFile(`.lighthouseci/${pages[index]}.report.json`, JSON.stringify(result.lhr));
      const pageScores = Object.fromEntries(categories.map((category) => [category, result.lhr.categories[category].score]));
      scores.push({ page: pages[index], ...pageScores });
      for (const category of categories) {
        if (pageScores[category] < minimums[category]) {
          throw new Error(`${pages[index]} ${category} score ${pageScores[category]} is below ${minimums[category]}`);
        }
      }
    }
  } finally {
    chromeProcess.kill();
    chromeProcess = undefined;
  }
  console.table(scores);
} catch (error) {
  failure = error;
} finally {
  if (chromeProcess && !chromeProcess.killed) chromeProcess.kill();
  if (server && !server.killed) server.kill();
  if (userDataDir) await rm(userDataDir, { recursive: true, force: true, maxRetries: 8, retryDelay: 250 }).catch(() => {});
  console.log("Restoring the safe preview artifact in dist/...");
  await buildSite("preview");
}

if (failure) throw failure;
