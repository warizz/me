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

test.describe("gdp world map", () => {
  test("dashboard links to the separate gdp page", async ({ page }) => {
    await page.goto("/thai-econ");
    await expect(
      page.getByRole("link", { name: /GDP world map/ }),
    ).toHaveAttribute("href", "/thai-econ/gdp");
    await page.goto("/thai-econ/gdp");
    await expect(page.locator("h1")).toContainText("GDP world map");
    await expect(page.getByRole("navigation")).toContainText("gdp map");
    // the dashboard no longer embeds the map
    await page.goto("/thai-econ");
    expect(await page.locator("svg[data-testid='gdp-map']").count()).toBe(0);
  });

  test("renders pure gradient map centered on Thailand", async ({ page }) => {
    await page.goto("/thai-econ/gdp");
    const map = page.locator("svg[data-testid='gdp-map']");
    await expect(map).toBeVisible();
    expect(await map.locator("path").count()).toBeGreaterThanOrEqual(150);
    // hm 5 (user pick): pure gradient map — no bubbles, no ranked column
    expect(await map.locator("circle").count()).toBe(0);
    await expect(map.locator("path[data-iso='THA']")).toHaveAttribute(
      "stroke",
      "#ffffff",
    );
    // legend strip: 41 gradient swatches + THA center label
    expect(await map.locator("rect").count()).toBeGreaterThanOrEqual(41);
    await expect(map).toContainText("THA 2%");
  });

  test("choropleth fill encodes growth relative to Thailand (continuous gradient)", async ({
    page,
  }) => {
    await page.goto("/thai-econ/gdp");
    const map = page.locator("svg[data-testid='gdp-map']");
    const pathFill = (iso: string) =>
      map
        .locator(`path[data-iso='${iso}']`)
        .evaluate((el) => el.getAttribute("fill"));
    // continuous scale centered at 2% (THA_G), +/-6pp range:
    // IDN ~5.1% -> green side; JPN ~0.7% -> red side; THA ~2.1% -> near-center
    const idn = (await pathFill("IDN"))!;
    const jpn = (await pathFill("JPN"))!;
    const tha = (await pathFill("THA"))!;
    const g = (b: string, i: number) => parseInt(b.slice(i, i + 2), 16); // hex channel
    // red channel separates the sides: Japan (0.7%, below THA) is red-side (~248),
    // Indonesia (5.1%) and Thailand (~2.1%) are green-side (dark red ~20-45)
    expect(g(jpn, 1)).toBeGreaterThan(200);
    expect(g(idn, 1)).toBeLessThan(100);
    expect(g(tha, 1)).toBeLessThan(100);
    // green channel orders within the green side: further above THA = greener
    expect(g(idn, 3)).toBeGreaterThan(g(tha, 3));
    // gradient legend strip present (41 swatches)
    expect(await map.locator("rect").count()).toBeGreaterThanOrEqual(41);
  });

  test("SEA + peers growth matrix, 28 years, on the heat scale", async ({
    page,
  }) => {
    await page.goto("/thai-econ/gdp");
    const sec = page.getByTestId("gdp-developed");
    const matrix = page.locator("svg[data-testid='gdp-matrix']");
    await expect(matrix).toBeVisible();
    for (const name of [
      "Thailand",
      "United States",
      "China",
      "Japan",
      "Vietnam",
      "Singapore",
    ]) {
      await expect(sec).toContainText(name, { ignoreCase: true });
    }
    const cells = await matrix.locator("rect[data-iso]").count();
    expect(cells).toBe(13 * 29); // 13 countries x 29 years (1998-2026)
    // year labels: 98..26 -> 29 columns
    await expect(matrix).toContainText("20");
    // COVID sinks every row: THA 2020 cell is red-side
    const fillOf = async (iso: string, yr: string) =>
      (await matrix
        .locator(`rect[data-iso='${iso}'][data-year='${yr}']`)
        .getAttribute("fill"))!;
    const r = (b: string) => parseInt(b.slice(1, 3), 16);
    expect(r(await fillOf("THA", "2020"))).toBeGreaterThan(120); // -6.1% -> deep red #7f1d1d
    expect(r(await fillOf("THA", "2020"))).toBeGreaterThan(
      r(await fillOf("THA", "2026")),
    ); // crisis much redder than today
    expect(r(await fillOf("THA", "2026"))).toBeLessThan(100); // 2.1% ~ center
    expect(r(await fillOf("VNM", "2026"))).toBeLessThan(100); // 8.4% -> green side
    // Thailand row outlined
    await expect(
      matrix.locator("rect[data-iso='THA'][data-year='2026']"),
    ).toHaveAttribute("stroke", "#ffffff");
    // legend present
    await expect(matrix).toContainText("THA 2%");
  });

  test("year toggle group repaints the gradient (map + bars share it)", async ({
    page,
  }) => {
    await page.goto("/thai-econ/gdp");
    const toggle = page.getByTestId("gdp-year-toggle");
    await expect(toggle).toBeVisible();
    // shadcn-style toggle group: one button per year, single pressed
    const buttons = toggle.locator("button");
    expect(await buttons.count()).toBe(29);
    await expect(toggle.locator("button[aria-pressed='true']")).toHaveText(
      /26/,
    );
    const fill = async (iso: string) =>
      (await page
        .locator(`svg[data-testid='gdp-map'] path[data-iso='${iso}']`)
        .evaluate((el) => el.getAttribute("fill")))!;
    const usa2026 = await fill("USA");
    // click "20" (2020): USA -2.9% -> red-side
    await toggle.locator("button", { hasText: "20" }).first().click();
    await page.waitForTimeout(200);
    const usa2020 = await fill("USA");
    const r = (b: string) => parseInt(b.slice(1, 3), 16);
    expect(r(usa2020)).toBeGreaterThan(r(usa2026)); // COVID year much redder
    // map and GDP-size bars now share ONE selector: no second select/toggle exists
    expect(await page.locator("select").count()).toBe(0);
    expect(await page.getByTestId("gdp-year-toggle").count()).toBe(1);
    // the bars re-read the same selected year
    await expect(page.getByTestId("gdp-size-bars")).toContainText("2020");
  });

  test("GDP size bars: same countries, selectable year, Thailand marked", async ({
    page,
  }) => {
    await page.goto("/thai-econ/gdp");
    const bars = page.locator("svg[data-testid='gdp-size-svg']");
    await expect(bars).toBeVisible();
    // 13 countries, linear size encoding
    expect(await bars.locator("rect").count()).toBe(13);
    const w = async (iso: string) =>
      Number(
        await bars.locator(`rect[data-iso='${iso}']`).getAttribute("width"),
      );
    expect(await w("USA")).toBeGreaterThan((await w("THA")) * 5);
    await expect(bars.locator("rect[data-iso='THA']")).toHaveAttribute(
      "stroke",
      "#ffffff",
    );
    // selecting 1998 via the shared toggle re-reads values: THA ~$114bn then
    const toggle = page.getByTestId("gdp-year-toggle");
    await toggle.locator("button", { hasText: "98" }).first().click();
    await page.waitForTimeout(200);
    const usa1998 = await w("USA");
    const tha1998 = await w("THA");
    expect(usa1998).toBeGreaterThan(tha1998 * 10); // 1998 gap is bigger
  });
});
