describe("posts", () => {
  it("passes", () => {
    cy.visit("/posts");
    cy.get("h1").should("have.text", "Blogs");
  });

  specify("with filter", () => {
    cy.visit("/posts?tag=git");
    cy.get("[data-testid=posts]").children().should("have.length", 1);
  });
});
