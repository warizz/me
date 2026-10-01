import { expect, test } from "@playwright/test";

test.describe("life in weeks", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/life-in-weeks");
  });

  test("renders the page", async ({ page }) => {
    await expect(page.locator("h1")).toHaveText("Life in Weeks");
    const weekCells = page.locator(".week-cell");
    expect(await weekCells.count()).toBeGreaterThan(0);
  });

  test("highlights the current week", async ({ page }) => {
    await expect(page.locator("#current-week")).toHaveCount(1);
  });

  test("shows life progress stats", async ({ page }) => {
    await expect(page.getByText("passed")).toBeVisible();
    await expect(page.getByText("left")).toBeVisible();
  });

  test("renders life events from data.json", async ({ page }) => {
    expect(
      await page.locator('[data-event-id="week-0001"]').count(),
    ).toBeGreaterThan(0);
    expect(
      await page.locator('[data-event-id="week-0131"]').count(),
    ).toBeGreaterThan(0);
    expect(
      await page.locator('[data-event-id="week-0132"]').count(),
    ).toBeGreaterThan(0);
  });

  test("opens and closes the event detail panel", async ({ page }) => {
    await page.locator('[data-event-id="week-0001"]').first().click();

    await expect(page.locator("h2")).toHaveText("🐣 Born in 1984");
    await page.getByText("Close details").click();

    await expect(page.locator("h2")).toHaveCount(0);
  });

  test("toggles the color scheme", async ({ page }) => {
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
