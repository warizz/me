import { expect, test } from "@playwright/test";

test.describe("post", () => {
  test("renders a post", async ({ page }) => {
    await page.goto("/posts/resume");
    await expect(page.locator("h1")).toHaveText("Warizz Yutanan");
  });

  test("renders code blocks with syntax-highlighting", async ({ page }) => {
    await page.goto("/posts/dependency-injection-in-react");
    await expect(page.locator("h1")).toHaveText("Dependency Injection in React");
  });
});
