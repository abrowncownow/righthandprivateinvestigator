import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import {
  buildSite,
  PREVIEW_BASE_PATH,
  PREVIEW_SITE_URL,
  PRODUCTION_SITE_URL
} from "./lib/build.mjs";

const DIST = path.resolve("dist");
const ROUTES = [
  "/",
  "/organizations/",
  "/individuals/",
  "/services/",
  "/about/",
  "/contact/",
  "/privacy/",
  "/terms/",
  "/thank-you/"
];

function routeFile(route) {
  return route === "/" ? path.join(DIST, "index.html") : path.join(DIST, route, "index.html");
}

async function filesUnder(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const candidate = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await filesUnder(candidate));
    else files.push(candidate);
  }
  return files;
}

function attributeValues(html) {
  return [...html.matchAll(/\b(?:href|src|action)\s*=\s*["']([^"']+)["']/gi)].map((match) => match[1]);
}

function localOutputPath(reference, basePath) {
  const cleaned = reference.split(/[?#]/, 1)[0];
  if (!cleaned || /^(?:https?:|mailto:|tel:|data:|javascript:|#)/i.test(reference)) return null;

  let pathname = cleaned;
  if (pathname.startsWith("/")) {
    assert.ok(
      basePath === "/" || pathname === basePath.slice(0, -1) || pathname.startsWith(basePath),
      `Root-relative reference escaped configured base ${basePath}: ${reference}`
    );
    pathname = basePath === "/" ? pathname.slice(1) : pathname.slice(basePath.length);
  }

  pathname = decodeURIComponent(pathname).replace(/^\.\//, "");
  const resolved = path.resolve(DIST, pathname);
  assert.ok(resolved.startsWith(DIST), `Reference resolves outside dist: ${reference}`);
  return resolved;
}

async function assertReferenceExists(reference, htmlFile, basePath) {
  const isRootRelative = reference.startsWith("/");
  let candidate = localOutputPath(reference, basePath);
  if (!candidate) return;

  if (!isRootRelative) {
    const pathname = reference.split(/[?#]/, 1)[0];
    candidate = path.resolve(path.dirname(htmlFile), decodeURIComponent(pathname));
    assert.ok(candidate.startsWith(DIST), `Relative reference resolves outside dist: ${reference}`);
  }
  if (existsSync(candidate) && (await stat(candidate)).isDirectory()) candidate = path.join(candidate, "index.html");
  if (!path.extname(candidate) && existsSync(`${candidate}.html`)) candidate = `${candidate}.html`;
  if (!path.extname(candidate) && existsSync(path.join(candidate, "index.html"))) candidate = path.join(candidate, "index.html");

  // Form actions can intentionally point at a future server-side endpoint.
  if (reference.includes("__test-intake-endpoint")) return;
  assert.ok(existsSync(candidate), `Broken local reference in ${path.relative(DIST, htmlFile)}: ${reference}`);
}

async function verifyCommon(basePath) {
  for (const route of ROUTES) {
    assert.ok(existsSync(routeFile(route)), `Missing rendered route: ${route}`);
  }
  assert.ok(existsSync(path.join(DIST, "404.html")), "Missing custom 404.html");

  const htmlFiles = (await filesUnder(DIST)).filter((file) => file.endsWith(".html"));
  assert.ok(htmlFiles.length >= ROUTES.length, "Expected rendered HTML pages");

  for (const htmlFile of htmlFiles) {
    const html = await readFile(htmlFile, "utf8");
    assert.match(html, /<html\s+lang=["']en["']/i, `Missing language in ${htmlFile}`);
    assert.match(html, /<meta\s+name=["']viewport["']/i, `Missing viewport in ${htmlFile}`);
    assert.match(html, /<h1(?:\s|>)/i, `Missing h1 in ${htmlFile}`);
    assert.doesNotMatch(html, /(?:TODO|FIXME|lorem ipsum|example\.com\/form)/i, `Placeholder copy in ${htmlFile}`);
    for (const reference of attributeValues(html)) await assertReferenceExists(reference, htmlFile, basePath);
  }
}

async function verifyProduction() {
  await verifyCommon("/");
  const home = await readFile(routeFile("/"), "utf8");
  const contact = await readFile(routeFile("/contact/"), "utf8");
  const thankYou = await readFile(routeFile("/thank-you/"), "utf8");

  assert.match(home, /<meta\s+name=["']robots["']\s+content=["']index, follow["']/i);
  assert.match(home, new RegExp(`<link\\s+rel=["']canonical["']\\s+href=["']${PRODUCTION_SITE_URL.replaceAll("/", "\\/")}`));
  assert.match(contact, /<form\b[^>]*data-contact-form/i, "Production contact form should render when an endpoint exists");
  assert.doesNotMatch(home, /Proof of concept/i, "Production must not display the preview banner");
  assert.doesNotMatch(contact, /POC \/ INTAKE|Online intake is (?:not active|currently unavailable)/i);
  assert.match(contact, /name="_honey"/, "FormSubmit honeypot should use the supported field name");
  assert.match(contact, /href="mailto:righthandpi.id@gmail.com"/);
  assert.match(contact, /href="tel:\+13607910707"/);
  assert.match(thankYou, /<meta\s+name=["']robots["']\s+content=["']noindex, nofollow["']/i);
  assert.ok(
    existsSync(path.join(DIST, "sitemap-index.xml")) || existsSync(path.join(DIST, "sitemap-0.xml")),
    "Production build should include a sitemap"
  );
}

async function verifyPreview() {
  await verifyCommon(PREVIEW_BASE_PATH);
  const htmlFiles = (await filesUnder(DIST)).filter((file) => file.endsWith(".html"));
  const home = await readFile(routeFile("/"), "utf8");
  const contact = await readFile(routeFile("/contact/"), "utf8");

  for (const htmlFile of htmlFiles) {
    const html = await readFile(htmlFile, "utf8");
    assert.match(html, /<meta\s+name=["']robots["']\s+content=["']noindex, nofollow["']/i, `Preview must be noindex: ${htmlFile}`);
  }
  assert.match(home, /Proof of concept/i);
  assert.match(home, new RegExp(`${PREVIEW_SITE_URL.replaceAll("/", "\\/")}${PREVIEW_BASE_PATH}`));
  assert.match(contact, /Online intake is not active on this preview/i);
  assert.doesNotMatch(contact, /<form\b[^>]*data-contact-form/i, "Preview must not render an active intake form");
  assert.ok(!existsSync(path.join(DIST, "sitemap-index.xml")), "Preview should not advertise a sitemap");
  assert.ok(!existsSync(path.join(DIST, "sitemap-0.xml")), "Preview should not advertise a sitemap");
}

console.log("Building and checking an indexable production artifact...");
await buildSite("production", { PUBLIC_FORM_ENDPOINT: "/__test-intake-endpoint" });
await verifyProduction();

console.log("Building and checking the noindex GitHub Pages preview...");
await buildSite("preview");
await verifyPreview();

console.log("Static verification passed. dist/ contains the safe preview build.");
