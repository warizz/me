import { expect, test } from "@playwright/test";

test.describe("homepage", () => {
  test("render", async ({ page }) => {
    await page.goto("/");

    // GA should be disabled in testing
    await expect(page.locator("script#ga_lib")).toHaveCount(0);
    await expect(page.locator("script#ga_datalayer")).toHaveCount(0);

    await expect(page.locator("h1")).toHaveText("WarizzArchive");
  });

  test("color scheme toggle", async ({ page }) => {
    await page.goto("/");
    const toggle = page.getByTestId("color-scheme-toggle");

    await expect(toggle).toHaveText("[ system ]");
    await toggle.click();

    await page.reload();
    await expect(toggle).toHaveText("[ light ]");
    await toggle.click();

    await page.reload();
    await expect(page.locator("html")).toHaveClass(/dark/);
    await expect(toggle).toHaveText("[ dark ]");
    await toggle.click();

    await page.reload();
    await expect(toggle).toHaveText("[ system ]");
  });
});
