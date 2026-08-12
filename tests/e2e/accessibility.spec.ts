import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { gotoRoute, routes } from "./helpers";

for (const route of routes) {
  test(`${route} has no automatically detectable WCAG A/AA violations`, async ({ page }) => {
    await gotoRoute(page, route);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();

    expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
  });
}
