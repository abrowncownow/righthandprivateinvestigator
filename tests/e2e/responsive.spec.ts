import { expect, test } from "@playwright/test";
import { gotoRoute, routes } from "./helpers";

const widths = [320, 390, 768, 1280] as const;

for (const width of widths) {
  test.describe(`${width}px viewport`, () => {
    test.use({ viewport: { width, height: 900 } });

    for (const route of routes) {
      test(`${route} has no horizontal page overflow`, async ({ page }) => {
        await gotoRoute(page, route);
        const dimensions = await page.evaluate(() => ({
          body: document.body.scrollWidth,
          document: document.documentElement.scrollWidth,
          viewport: document.documentElement.clientWidth
        }));
        expect(Math.max(dimensions.body, dimensions.document)).toBeLessThanOrEqual(dimensions.viewport + 1);
      });
    }
  });
}

test.describe("mobile navigation", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("opens, closes with Escape, and preserves focus", async ({ page }) => {
    await gotoRoute(page, "/");
    const toggle = page.getByRole("button", { name: "Open navigation" });
    const navigation = page.getByRole("navigation", { name: "Primary" });

    await expect(toggle).toBeVisible();
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await expect(navigation).toBeHidden();

    await toggle.click();
    await expect(page.getByRole("button", { name: "Close navigation" })).toHaveAttribute("aria-expanded", "true");
    await expect(navigation).toBeVisible();
    await expect(navigation.getByRole("link", { name: "Organizations" })).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(navigation).toBeHidden();
    await expect(toggle).toBeFocused();
  });
});
