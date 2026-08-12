import { expect, test } from "@playwright/test";
import { gotoRoute, previewBasePath, previewBaseURL, routes, urlFor } from "./helpers";

test.describe("rendered routes", () => {
  for (const route of routes) {
    test(`${route} renders a complete page`, async ({ page }) => {
      const response = await gotoRoute(page, route);
      expect(response.ok()).toBeTruthy();
      await expect(page.locator("html")).toHaveAttribute("lang", "en");
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page).toHaveTitle(/Right Hand/i);
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex, nofollow");
    });
  }
});

test("the preview has no active intake submission path", async ({ page }) => {
  await gotoRoute(page, "/contact/");
  await expect(page.getByRole("heading", { name: /online intake is not active/i })).toBeVisible();
  await expect(page.locator("form")).toHaveCount(0);
  await expect(page.getByText(/does not transmit or store case information/i)).toBeVisible();
  await expect(page.locator('button[type="submit"], input[type="submit"]')).toHaveCount(0);
});

test("the process-service handoff is explicit and external", async ({ page }) => {
  await gotoRoute(page, "/");
  const link = page.locator('a[href="https://righthandprofessionalprocessservice.com/"]:visible').first();
  await expect(link).toBeVisible();
  await expect(link).toHaveAttribute("target", "_blank");
  await expect(link).toHaveAttribute("rel", /noopener/);
});

test("root-relative links and assets retain the GitHub Pages subpath", async ({ page }) => {
  for (const route of routes) {
    await gotoRoute(page, route);
    const references = await page.locator("[href], [src], [action]").evaluateAll((elements) =>
      elements.flatMap((element) => ["href", "src", "action"]
        .map((name) => element.getAttribute(name))
        .filter((value): value is string => Boolean(value)))
    );
    for (const reference of references) {
      if (!reference.startsWith("/")) continue;
      expect(reference, `${route} emitted a root path outside ${previewBasePath}`).toMatch(
        new RegExp(`^${previewBasePath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`)
      );
    }
  }
});

test("all discovered local navigation links resolve", async ({ page, request }) => {
  const origin = new URL(previewBaseURL).origin;
  const localLinks = new Set<string>();

  for (const route of routes) {
    await gotoRoute(page, route);
    const hrefs = await page.locator("a[href]").evaluateAll((links) => links.map((link) => (link as HTMLAnchorElement).href));
    for (const href of hrefs) {
      const url = new URL(href);
      if (url.origin === origin) localLinks.add(url.href.split("#", 1)[0]);
    }
  }

  for (const href of localLinks) {
    expect(new URL(href).pathname, `Local link escaped preview subpath: ${href}`).toMatch(
      new RegExp(`^${previewBasePath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`)
    );
    const response = await request.get(href);
    expect(response.ok(), `Broken local link: ${href} (${response.status()})`).toBeTruthy();
  }

  expect(localLinks).toContain(urlFor("/contact/"));
});
