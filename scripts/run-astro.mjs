import { run } from "./lib/process.mjs";

const astroArguments = process.argv.slice(2);

if (astroArguments.length === 0) {
  console.error("Usage: node scripts/run-astro.mjs <astro command> [...arguments]");
  process.exitCode = 2;
} else {
  await run(process.execPath, ["node_modules/astro/bin/astro.mjs", ...astroArguments]);
}
