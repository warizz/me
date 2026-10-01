import { expect, test } from "@playwright/test";

test.describe("sale", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/sale");
  });

  test("renders the page with noindex", async ({ page }) => {
    await expect(page.locator("h1")).toHaveText("Garage sale");
    await expect(
      page.locator('meta[name="robots"][content*="noindex"]'),
    ).toHaveCount(1);
  });

  test("renders items from items.yaml as a table on desktop", async ({
    page,
  }) => {
    await expect(page.locator("table")).toBeVisible();
    const rows = page.locator("tbody tr");
    expect(await rows.count()).toBe(2);
    const table = page.locator("table");
    await expect(table.getByText("หนังสือ ชีวิตเรามีแค่สี่พันสัปดาห์")).toBeVisible();
    await expect(table.getByText("-51%")).toBeVisible(); // 130 from 265
    await expect(table.getByText("-50%")).toBeVisible(); // 110 from 220
  });

  test("switches to stacked cards on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 720 });
    await expect(page.locator("table")).toBeHidden();
    await expect(page.locator("ul.md\\:hidden > li")).toHaveCount(2);
  });

  test("opens the lightbox and navigates photos", async ({ page }) => {
    const thumb = page.locator("tbody tr").first().locator("button");
    await thumb.click();

    const dialog = page.locator("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog.locator("img")).toBeVisible();
    await expect(dialog.getByText("1/2")).toBeVisible();

    if (await dialog.getByLabel("next photo").isVisible()) {
      await dialog.getByLabel("next photo").click();
      await expect(dialog.getByText("2/2")).toBeVisible();
      await expect(dialog.locator("img")).toHaveAttribute(
        "src",
        /four-thousand-weeks-2\.webp/,
      );
    }

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
  });
});
