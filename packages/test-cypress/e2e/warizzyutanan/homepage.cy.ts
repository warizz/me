describe("homepage", () => {
  specify("Render", () => {
    cy.visit("http://localhost:3000");

    // GA should be disabled in testing
    cy.get("script#ga_lib").should("not.exist");
    cy.get("script#ga_datalayer").should("not.exist");

    cy.get("h1").should("have.text", "Warizz's whatever");
  });

  specify("Color scheme toggle", () => {
    cy.visit("http://localhost:3000");
    cy.get("button[data-testid='color-scheme-toggle']")
      .should("have.text", "color: system")
      .click();

    cy.reload();
    cy.get("button[data-testid='color-scheme-toggle']")
      .should("have.text", "color: light")
      .click();

    cy.reload();
    cy.get("html").should("have.class", "dark");
    cy.get("button[data-testid='color-scheme-toggle']")
      .should("have.text", "color: dark")
      .click();

    cy.reload();
    cy.get("button[data-testid='color-scheme-toggle']").should(
      "have.text",
      "color: system"
    );
  });
});
