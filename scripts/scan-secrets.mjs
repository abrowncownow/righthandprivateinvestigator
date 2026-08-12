import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const OMIT = new Set([".git", ".astro", ".tooling", "dist", "node_modules", "playwright-report", "test-results"]);
const TEXT_EXTENSIONS = new Set([
  ".astro", ".cjs", ".css", ".env", ".example", ".html", ".js", ".json", ".jsx", ".md", ".mjs", ".ts", ".tsx", ".txt", ".yaml", ".yml"
]);
const RULES = [
  ["private key", /-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/],
  ["AWS access key", /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/],
  ["GitHub token", /\bgh(?:p|o|u|s|r)_[A-Za-z0-9]{30,}\b/],
  ["OpenAI API key", /\bsk-(?:proj-)?[A-Za-z0-9_-]{24,}\b/],
  ["Slack token", /\bxox[baprs]-[A-Za-z0-9-]{20,}\b/],
  ["Stripe live key", /\b(?:sk|rk)_live_[A-Za-z0-9]{16,}\b/]
];

async function visit(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (OMIT.has(entry.name)) continue;
    const candidate = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await visit(candidate));
    else if (TEXT_EXTENSIONS.has(path.extname(entry.name).toLowerCase()) || entry.name.startsWith(".env")) files.push(candidate);
  }
  return files;
}
const findings = [];
for (const file of await visit(ROOT)) {
  const text = await readFile(file, "utf8");
  for (const [label, pattern] of RULES) {
    const match = text.match(pattern);
    if (match) {
      const line = text.slice(0, match.index).split(/\r?\n/).length;
      findings.push(`${path.relative(ROOT, file)}:${line} — possible ${label}`);
    }
  }
}

if (findings.length) {
  console.error("Potential secrets found:\n" + findings.join("\n"));
  process.exitCode = 1;
} else {
  console.log("Secret scan passed.");
}
