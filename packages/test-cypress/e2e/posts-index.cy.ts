describe("posts", () => {
  it("passes", () => {
    cy.visit("/posts");
    cy.get("h1").should("have.text", "Blogs");
  });
});
