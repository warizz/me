import { test, expect } from "playwright-test-coverage";

test("Homepage", async ({ page }) => {
  await page.goto("http://localhost:3000/");

  await expect(page.locator("h1")).toHaveText("About me");
});
