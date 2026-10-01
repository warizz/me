import { expect, test, type Page } from "@playwright/test";

async function openTagNav(page: Page) {
  const details = page.locator("details");
  if (!(await details.getAttribute("open"))) {
    await page.locator("details summary").click();
  }
}

test.describe("posts", () => {
  test("renders the blog list", async ({ page }) => {
    await page.goto("/posts");
    await expect(page.locator("h1")).toHaveText("Posts");
  });

  test("filters the list by tag", async ({ page }) => {
    await page.goto("/posts");
    await openTagNav(page);
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

  test("filters the list by multiple tags (OR)", async ({ page }) => {
    await page.goto("/posts");
    await openTagNav(page);
    const chips = page.locator("nav a", { hasText: /^#/ });
    const first = chips.nth(0);
    const second = chips.nth(1);
    const t1 = (await first.textContent())!.replace(/^#/, "");
    const t2 = (await second.textContent())!.replace(/^#/, "");

    await first.click();
    await expect(page).toHaveURL(new RegExp(`tag=${t1}$`));
    await expect(first).toHaveAttribute("aria-current", "page");
    await second.click();
    await expect(page).toHaveURL(new RegExp(`tag=${t1}&tag=${t2}$`));
    const rows = page.locator("li[data-tags]");
    const count = await rows.count();
    expect(count).toBeGreaterThan(0);
    const either = new RegExp(`(?:^|,)(${t1}|${t2})(?:,|$)`);
    for (let i = 0; i < count; i++) {
      await expect.soft(rows.nth(i)).toHaveAttribute("data-tags", either);
    }
  });
});
