import { run } from "./lib/process.mjs";

await run(process.execPath, ["node_modules/astro/bin/astro.mjs", "check"]);
await run(process.execPath, ["node_modules/secretlint/bin/secretlint.js", "**/*"]);
await run(process.execPath, ["scripts/scan-secrets.mjs"]);
await run(process.execPath, ["scripts/verify-builds.mjs"]);

const e2eCommand = process.platform === "win32" ? "npm.cmd run test:e2e" : "npm run test:e2e";
console.log(`Core quality checks passed. Run ${e2eCommand} for browser and accessibility checks.`);
