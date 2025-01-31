describe("posts", () => {
  it("passes", () => {
    cy.visit("http://localhost:3000/posts");
    cy.get("h1").should("have.text", "Blogs");
  });
});
