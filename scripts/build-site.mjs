import { buildSite } from "./lib/build.mjs";

const mode = process.argv[2] ?? "preview";

if (!new Set(["preview", "production"]).has(mode)) {
  console.error("Usage: node scripts/build-site.mjs [preview|production]");
  process.exitCode = 2;
} else {
  console.log(`Building the ${mode} site...`);
  await buildSite(mode);
}
