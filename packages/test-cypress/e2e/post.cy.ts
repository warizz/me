describe("post", () => {
  it("passes", () => {
    cy.visit("/posts/resume");
    cy.get("h1").should("have.text", "Warizz Yutanan");
  });
});
