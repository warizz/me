describe("sitemap.xml", () => {
  it("passes", () => {
    cy.visit("http://localhost:3000/sitemap.xml");
  });
});
