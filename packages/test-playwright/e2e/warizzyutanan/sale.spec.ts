import { expect, test } from "@playwright/test";
import { existsSync, readFileSync } from "fs";
import path from "path";

// derive expected counts from items.yaml so the spec survives item additions
function itemCounts() {
  // walk up from cwd to the pnpm workspace root, then into the app
  let dir = process.cwd();
  const yamlPath = path.join(
    "apps/warizzyutanan/resource/sale/items.yaml",
  );
  while (!existsSync(path.join(dir, yamlPath))) {
    const parent = path.dirname(dir);
    if (parent === dir) throw new Error(`items.yaml not found above ${process.cwd()}`);
    dir = parent;
  }
  const yaml = readFileSync(path.join(dir, yamlPath), "utf8");
  const ids = yaml.match(/^- id:/gm)?.length ?? 0;
  const available = yaml.match(/^  status: available$/gm)?.length ?? 0;
  return { total: ids, available };
}

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
    const { available } = itemCounts();
    await expect(page.locator("table")).toBeVisible();
    const rows = page.locator("tbody tr");
    expect(await rows.count()).toBe(available);
    const table = page.locator("table");
    await expect(
      table.getByText("หนังสือ ชีวิตเรามีแค่สี่พันสัปดาห์"),
    ).toBeVisible();
    await expect(table.getByText("-51%")).toBeVisible(); // 130 from 265
    await expect(table.getByText("-50%").first()).toBeVisible(); // 110 from 220
    await expect(table.getByText("● ยังไม่ขาย")).toHaveCount(available);
  });

  test("switches to stacked cards on mobile", async ({ page }) => {
    const { available } = itemCounts();
    await page.setViewportSize({ width: 375, height: 720 });
    await expect(page.locator("table")).toBeHidden();
    await expect(page.locator("ul.md\\:hidden > li")).toHaveCount(available);
  });

  test("filters by status, default all", async ({ page }) => {
    const { total } = itemCounts();
    const filters = page.getByTestId("sale-filters");
    const rows = page.locator("tbody tr");
    await expect(rows).toHaveCount(total); // default ทั้งหมด

    await filters.getByRole("button", { name: "ยังไม่ขาย" }).click();
    await expect(rows).toHaveCount(total);

    await filters.getByRole("button", { name: "ขายแล้ว" }).click();
    await expect(rows).toHaveCount(0);

    await filters.getByRole("button", { name: "ทั้งหมด" }).click();
    await expect(rows).toHaveCount(total);
  });

  test("opens the lightbox and navigates photos", async ({ page }) => {
    // newest item first (sorted by addedAt desc) — target the 1984 book
    const row = page.locator("tbody tr").filter({ hasText: "1984" });
    await row.locator("button").first().click();

    const dialog = page.locator("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog.locator("img")).toBeVisible();
    await expect(dialog.getByText("1/2")).toBeVisible();

    if (await dialog.getByLabel("next photo").isVisible()) {
      await dialog.getByLabel("next photo").click();
      await expect(dialog.getByText("2/2")).toBeVisible();
      await expect(dialog.locator("img")).toHaveAttribute(
        "src",
        /1984-2\.webp/,
      );
    }

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
  });

  test.describe("dark mode", () => {
    test.use({ colorScheme: "dark" });

    test("applies dark theme and stays readable", async ({ page }) => {
      await expect(page.locator("html")).toHaveClass(/dark/);
      const color = await page.locator("h1").evaluate(
        (el) => getComputedStyle(el).color,
      );
      expect(color).not.toBe("rgb(0, 0, 0)"); // text must not be black-on-black
    });

    test("toggles to light and back", async ({ page }) => {
      const toggle = page.getByTestId("color-scheme-toggle");
      await expect(toggle).toHaveText("[ system ]");
      await toggle.click(); // system -> light
      await expect(page.locator("html")).not.toHaveClass(/dark/);
      await toggle.click(); // light -> dark
      await expect(page.locator("html")).toHaveClass(/dark/);
    });
  });

  // WCAG AA: every visible text element must contrast >= 4.5:1 against its
  // (alpha-blended) background. Page bg is opaque white/black from the layout.
  const contrastCheck = async (page: import("@playwright/test").Page) => {
    const failures = await page.evaluate(() => {
      const lum = (r: number, g: number, b: number) => {
        const f = [r, g, b].map((v) => {
          const c = v / 255;
          return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
        });
        return 0.2126 * f[0] + 0.7152 * f[1] + 0.0722 * f[2];
      };
      const parse = (str: string) => {
        const m = /rgba?\((\d+), (\d+), (\d+)(?:, ([\d.]+))?\)/.exec(str);
        return m
          ? { r: +m[1], g: +m[2], b: +m[3], a: m[4] === undefined ? 1 : +m[4] }
          : null;
      };
      const bg = document.documentElement.classList.contains("dark")
        ? { r: 0, g: 0, b: 0 }
        : { r: 255, g: 255, b: 255 };
      const bad: string[] = [];
      const selectors =
        "main h1, main th, main td, main p, main button, main span, main s";
      document.querySelectorAll(selectors).forEach((el) => {
        const text = (el as HTMLElement).innerText?.trim();
        if (!text || !el.checkVisibility()) return;
        // greyed-out (opacity) elements are inactive UI — WCAG-exempt
        let node: HTMLElement | null = el as HTMLElement;
        while (node && node !== document.body) {
          if (parseFloat(getComputedStyle(node).opacity) < 1) return;
          node = node.parentElement;
        }
        const fg = parse(getComputedStyle(el).color);
        if (!fg) return;
        const blended = {
          r: fg.r * fg.a + bg.r * (1 - fg.a),
          g: fg.g * fg.a + bg.g * (1 - fg.a),
          b: fg.b * fg.a + bg.b * (1 - fg.a),
        };
        const ratio =
          (Math.max(lum(blended.r, blended.g, blended.b), lum(bg.r, bg.g, bg.b)) +
            0.05) /
          (Math.min(lum(blended.r, blended.g, blended.b), lum(bg.r, bg.g, bg.b)) +
            0.05);
        if (ratio < 4.5) {
          bad.push(
            `"${text.slice(0, 24)}" ${getComputedStyle(el).color} → ${ratio.toFixed(2)}:1`,
          );
        }
      });
      return bad;
    });
    expect(failures).toEqual([]);
  };

  test("text contrast passes WCAG AA (light)", async ({ page }) => {
    await contrastCheck(page);
  });

  test("text contrast passes WCAG AA (dark)", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/sale");
    await contrastCheck(page);
  });
});
