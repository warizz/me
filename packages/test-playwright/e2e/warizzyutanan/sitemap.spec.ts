import { expect, test } from "@playwright/test";

test.describe("sitemap.xml", () => {
  test("responds with 200", async ({ request }) => {
    const response = await request.get("/sitemap.xml");
    expect(response.status()).toBe(200);
  });
});
