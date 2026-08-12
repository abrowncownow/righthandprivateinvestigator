import type { Page } from "@playwright/test";

export const previewBaseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:4323/right-hand-private-investigator/";
export const previewBasePath = new URL(previewBaseURL).pathname;

export const routes = [
  "/",
  "/organizations/",
  "/individuals/",
  "/services/",
  "/about/",
  "/contact/",
  "/privacy/",
  "/terms/",
  "/thank-you/"
] as const;

export function urlFor(route: string) {
  return new URL(route.replace(/^\/+/, ""), previewBaseURL).href;
}

export async function gotoRoute(page: Page, route: string) {
  const response = await page.goto(urlFor(route), { waitUntil: "networkidle" });
  if (!response) throw new Error(`Navigation returned no response: ${route}`);
  return response;
}
