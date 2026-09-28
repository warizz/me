import { expect, test } from "@playwright/test";

test.describe("posts", () => {
  test("renders the blog list", async ({ page }) => {
    await page.goto("/posts");
    await expect(page.locator("h1")).toHaveText("Blogs");
  });
});
