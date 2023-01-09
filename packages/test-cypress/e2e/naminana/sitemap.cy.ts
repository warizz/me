describe("sitemap.xml", () => {
  it("passes", () => {
    cy.visit("http://localhost:3001/sitemap.xml");
  });
});
