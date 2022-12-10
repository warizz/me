describe("homepage", () => {
  it("passes", () => {
    cy.visit("/");
    cy.get("h1").should("have.text", "About me");
  });
});
