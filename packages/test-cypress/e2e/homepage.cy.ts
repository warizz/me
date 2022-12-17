describe("homepage", () => {
  specify("Render", () => {
    cy.visit("/");
    cy.get("h1").should("have.text", "Warizz");
  });

  specify("Color scheme toggle", () => {
    cy.visit("/");
    cy.get("button[data-testid='color-scheme-toggle']")
      .should("have.text", "color: system")
      .click();
    cy.get("button[data-testid='color-scheme-toggle']")
      .should("have.text", "color: light")
      .click();

    cy.get("html").should("have.class", "dark");
    cy.get("button[data-testid='color-scheme-toggle']")
      .should("have.text", "color: dark")
      .click();
    cy.get("button[data-testid='color-scheme-toggle']").should(
      "have.text",
      "color: system"
    );
  });
});
