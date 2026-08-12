import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { loadEnv } from "vite";

function normalizeBase(value) {
  const trimmed = value?.trim();
  if (!trimmed || trimmed === "/") return "/";
  return `/${trimmed.replace(/^\/+|\/+$/g, "")}`;
}

// Astro 7 expects a plain config object. Resolve environment input before
// defineConfig so Pages values cannot be silently skipped.
const command = process.argv[2] || "build";
const mode = command === "dev" ? "development" : "production";
const environment = { ...loadEnv(mode, process.cwd(), ""), ...process.env };
const repository = environment.GITHUB_REPOSITORY?.split("/")[1];
const owner = environment.GITHUB_REPOSITORY_OWNER;
const isPagesBuild = environment.GITHUB_ACTIONS === "true" && Boolean(repository && owner);
const isUserPagesRepository = repository?.toLowerCase() === `${owner?.toLowerCase()}.github.io`;
const previewMode = environment.PUBLIC_PREVIEW_MODE !== "false";

const site =
  environment.PUBLIC_SITE_URL?.trim() ||
  (isPagesBuild ? `https://${owner}.github.io` : "http://localhost:4321");

const base = normalizeBase(
  environment.PUBLIC_BASE_PATH ??
    (isPagesBuild && !isUserPagesRepository ? `/${repository}` : "/")
);

export default defineConfig({
  site,
  base,
  output: "static",
  build: {
    format: "directory"
  },
  trailingSlash: "always",
  integrations: previewMode
    ? []
    : [
        sitemap({
          filter: (page) => !page.endsWith("/thank-you/") && !page.endsWith("/404/")
        })
      ]
});
