describe("sitemap.xml", () => {
  it("passes", () => {
    cy.request("http://localhost:3000/sitemap.xml").then((res) => {
      expect(res.status).to.eq(200);
    });
  });
});
