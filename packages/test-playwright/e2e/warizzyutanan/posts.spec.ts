import { expect, test } from "@playwright/test";

test.describe("posts", () => {
  test("renders the blog list", async ({ page }) => {
    await page.goto("/posts");
    await expect(page.locator("h1")).toHaveText("Posts");
  });

  test("filters the list by tag", async ({ page }) => {
    await page.goto("/posts");
    const chip = page.locator("nav a", { hasText: /^#/ }).first();
    const tag = (await chip.textContent())!.replace(/^#/, "");

    await chip.click();
    await expect(page).toHaveURL(new RegExp(`tag=${tag}$`));
    await expect(chip).toHaveAttribute("aria-current", "page");
    const rows = page.locator("li[data-tags]");
    const count = await rows.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      await expect
        .soft(rows.nth(i))
        .toHaveAttribute("data-tags", new RegExp(`(?:^|,)${tag}(?:,|$)`));
    }

    await chip.click();
    await expect(page).toHaveURL(/\/posts$/);
    await expect(chip).toHaveAttribute("aria-current", "false");
  });
});
