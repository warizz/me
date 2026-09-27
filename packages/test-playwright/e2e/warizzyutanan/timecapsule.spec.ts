import { expect, test, type Page } from "@playwright/test";

async function goDark(page: Page) {
  await page.addInitScript(() =>
    localStorage.setItem("preferredColorScheme", "dark"),
  );
}

async function settleLazyImages(page: Page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    await new Promise<void>((resolve) => {
      let y = 0;
      const total = document.body.scrollHeight;
      const step = window.innerHeight;
      const timer = setInterval(() => {
        y += step;
        window.scrollTo(0, y);
        if (y >= total) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
    await Promise.all(
      Array.from(document.images).map((img) =>
        img.complete
          ? undefined
          : new Promise((done) => {
              img.onload = () => done(null);
              img.onerror = () => done(null);
            }),
      ),
    );
    window.scrollTo(0, 0);
  });
}

test.describe("timecapsule index", () => {
  test("renders header, disclaimer and timeline", async ({ page }) => {
    await page.goto("/timecapsule");

    await expect(page.locator("h1")).toHaveText("Moments worth remembering");
    await expect(page.locator("header p", { hasText: "timecapsule" })).toBeVisible();
    await expect(page.getByText("AI-generated summaries")).toBeVisible();

    const items = page.locator("ol > li");
    expect(await items.count()).toBeGreaterThan(0);
  });

  test("shows the bangkok flood event as ongoing", async ({ page }) => {
    await page.goto("/timecapsule");

    const item = page.locator("ol > li", {
      has: page.getByRole("link", { name: "Eastern Bangkok Under Water" }),
    });
    await expect(item.locator("time")).toContainText("ongoing");
    await expect(item.getByText("#weather")).toBeVisible();
  });

  test("navigates to the event page", async ({ page }) => {
    await page.goto("/timecapsule");
    await page
      .getByRole("link", { name: "Eastern Bangkok Under Water" })
      .click();
    await expect(page).toHaveURL(/\/timecapsule\/2026-0926-bangkok-flood$/);
  });

  test("matches the visual baseline", async ({ page }) => {
    // ponytail: darwin baselines won't match linux CI rendering (fonts/antialias) — local-only visual regression
    test.skip(!!process.env.CI, "visual baselines are local-only");
    await page.goto("/timecapsule");
    await expect(page.locator("h1")).toBeVisible();
    await page.waitForLoadState("networkidle");
    await page.evaluate(() => document.fonts.ready);
    await expect(page).toHaveScreenshot("timecapsule-index.png", {
      fullPage: true,
    });
  });
});

test.describe("timecapsule event", () => {
  test("renders the event header", async ({ page }) => {
    await page.goto("/timecapsule/2026-0926-bangkok-flood");

    await expect(page.locator("h1")).toHaveText("Eastern Bangkok Under Water");
    await expect(page.locator("article > header time")).toContainText(
      "ongoing",
    );
    await expect(page.getByText("AI-generated summary")).toBeVisible();
  });

  test("renders all four timeline nodes", async ({ page }) => {
    await page.goto("/timecapsule/2026-0926-bangkok-flood");

    const headings = page.locator("h3");
    await expect(headings).toHaveCount(4);
    await expect(page.getByRole("heading", { name: "the rain begins", level: 3 })).toBeVisible();
    await expect(page.getByRole("heading", { name: "warnings stack up", level: 3 })).toBeVisible();
    await expect(page.getByRole("heading", { name: "eastern Bangkok under water", level: 3 })).toBeVisible();
    await expect(page.getByRole("heading", { name: "risk lingers", level: 3 })).toBeVisible();
  });

  test("lazy-loads every photo with a datestamped badge", async ({ page }) => {
    await page.goto("/timecapsule/2026-0926-bangkok-flood");

    const images = page.locator("article img");
    const count = await images.count();
    expect(count).toBeGreaterThan(10);

    for (let i = 0; i < count; i++) {
      expect(await images.nth(i).getAttribute("loading")).toBe("lazy");
    }

    const badges = page.locator(".tc-photo-id");
    await expect(badges).toHaveCount(count);
    await expect(badges.first()).toContainText("08-hero");
  });

  test("links at least 10 external sources with no markdown leakage", async ({
    page,
  }) => {
    await page.goto("/timecapsule/2026-0926-bangkok-flood");

    const sources = page.locator(
      'a[href*="bangkokpost.com"], a[href*="nationthailand.com"], a[href*="thestandard.co"]',
    );
    expect(await sources.count()).toBeGreaterThanOrEqual(10);

    const body = await page.locator("body").innerText();
    expect(body).not.toContain("](");
  });

  test("navigates back to all moments", async ({ page }) => {
    await page.goto("/timecapsule/2026-0926-bangkok-flood");
    await page.getByRole("link", { name: "← all moments" }).click();
    await expect(page).toHaveURL(/\/timecapsule$/);
  });

  test("matches the visual baseline", async ({ page }) => {
    // ponytail: darwin baselines won't match linux CI rendering (fonts/antialias) — local-only visual regression
    test.skip(!!process.env.CI, "visual baselines are local-only");
    await page.goto("/timecapsule/2026-0926-bangkok-flood");
    await expect(page.locator("h1")).toBeVisible();
    await page.waitForLoadState("networkidle");
    await settleLazyImages(page);
    await expect(page).toHaveScreenshot("timecapsule-event.png", {
      fullPage: true,
    });
  });

  test("renders both pages in dark mode", async ({ page }) => {
    await goDark(page);

    await page.goto("/timecapsule");
    await expect(page.locator("html")).toHaveClass(/dark/);
    await expect(page.locator("h1")).toHaveText("Moments worth remembering");

    await page.goto("/timecapsule/2026-0926-bangkok-flood");
    await expect(page.locator("html")).toHaveClass(/dark/);
    await expect(page.locator("h3").first()).toBeVisible();
  });

  test("matches the dark visual baseline", async ({ page }) => {
    // ponytail: darwin baselines won't match linux CI rendering (fonts/antialias) — local-only visual regression
    test.skip(!!process.env.CI, "visual baselines are local-only");
    await goDark(page);
    await page.goto("/timecapsule");
    await expect(page.locator("html")).toHaveClass(/dark/);
    await expect(page.locator("h1")).toBeVisible();
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("timecapsule-index-dark.png", {
      fullPage: true,
    });
  });

  test("matches the dark event visual baseline", async ({ page }) => {
    // ponytail: darwin baselines won't match linux CI rendering (fonts/antialias) — local-only visual regression
    test.skip(!!process.env.CI, "visual baselines are local-only");
    await goDark(page);
    await page.goto("/timecapsule/2026-0926-bangkok-flood");
    await expect(page.locator("html")).toHaveClass(/dark/);
    await expect(page.locator("h1")).toBeVisible();
    await page.waitForLoadState("networkidle");
    await settleLazyImages(page);
    await expect(page).toHaveScreenshot("timecapsule-event-dark.png", {
      fullPage: true,
    });
  });
});
