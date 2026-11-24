import { expect, test } from "@playwright/test";

test.describe("thai econ dashboard", () => {
  test("no horizontal overflow on mobile viewport", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 720 });
    await page.goto("/thai-econ");
    const overflow = await page.evaluate(
      () =>
        document.scrollingElement!.scrollWidth -
        document.scrollingElement!.clientWidth,
    );
    expect(overflow).toBe(0);
  });

  test("homepage link and page title use the full word", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("link", { name: "thai economy dashboard" }),
    ).toBeVisible();
    await page.goto("/thai-econ");
    await expect(page.locator("h1")).toContainText("Thai Economy Dashboard");
  });

  test("breadcrumb uses the full word", async ({ page }) => {
    await page.goto("/thai-econ");
    await expect(page.getByRole("navigation")).toContainText("thai economy");
  });
});

test.describe("page background", () => {
  test("body paints the theme background, not transparent", async ({
    page,
  }) => {
    await page.goto("/");
    expect(
      await page.evaluate(
        () => getComputedStyle(document.body).backgroundColor,
      ),
    ).toBe("rgb(255, 255, 255)");

    const toggle = page.getByTestId("color-scheme-toggle");
    await toggle.click(); // system -> light
    await toggle.click(); // light -> dark
    await expect(page.locator("html")).toHaveClass(/dark/);
    expect(
      await page.evaluate(
        () => getComputedStyle(document.body).backgroundColor,
      ),
    ).toBe("rgb(0, 0, 0)");
  });
});
