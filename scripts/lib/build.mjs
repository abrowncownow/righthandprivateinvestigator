import { run } from "./process.mjs";

const repositoryParts = process.env.GITHUB_REPOSITORY?.split("/") ?? [];
const repositoryOwner = process.env.GITHUB_REPOSITORY_OWNER || repositoryParts[0];
const repositoryName = repositoryParts[1];
const isRootPagesRepository = repositoryName?.toLowerCase() === `${repositoryOwner?.toLowerCase()}.github.io`;

export const PREVIEW_BASE_PATH = `${
  process.env.PUBLIC_BASE_PATH ||
  (repositoryName && !isRootPagesRepository ? `/${repositoryName}` : "/right-hand-private-investigator")
}`.replace(/\/+$/, "") + "/";
export const PREVIEW_SITE_URL =
  process.env.PUBLIC_SITE_URL ||
  (repositoryOwner ? `https://${repositoryOwner}.github.io` : "https://example.github.io");
export const PRODUCTION_SITE_URL = process.env.PUBLIC_SITE_URL || "https://righthandpi.com";
export const PRODUCTION_BASE_PATH = `${process.env.PUBLIC_BASE_PATH || "/"}`.replace(/\/+$/, "") || "/";

export function environmentFor(mode, overrides = {}) {
  if (mode === "preview") {
    return {
      ...process.env,
      PUBLIC_PREVIEW_MODE: "true",
      PUBLIC_SITE_URL: PREVIEW_SITE_URL,
      PUBLIC_BASE_PATH: PREVIEW_BASE_PATH,
      PUBLIC_FORM_ENDPOINT: "",
      GITHUB_ACTIONS: "false",
      GITHUB_REPOSITORY: "",
      GITHUB_REPOSITORY_OWNER: "",
      ...overrides
    };
  }

  if (mode === "production") {
    return {
      ...process.env,
      PUBLIC_PREVIEW_MODE: "false",
      PUBLIC_SITE_URL: PRODUCTION_SITE_URL,
      PUBLIC_BASE_PATH: PRODUCTION_BASE_PATH,
      PUBLIC_FORM_ENDPOINT: process.env.PUBLIC_FORM_ENDPOINT || "",
      GITHUB_ACTIONS: "false",
      GITHUB_REPOSITORY: "",
      GITHUB_REPOSITORY_OWNER: "",
      ...overrides
    };
  }

  throw new Error(`Unknown build mode: ${mode}. Expected preview or production.`);
}

export function buildSite(mode, overrides = {}) {
  return run(process.execPath, ["node_modules/astro/bin/astro.mjs", "build"], { env: environmentFor(mode, overrides) });
}
