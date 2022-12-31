describe("post", () => {
  it("passes", () => {
    cy.visit("http://localhost:3001/posts/laparoscopic-surgery");
    cy.get("h1").should(
      "have.text",
      "บันทึก ตัดเนื้องอกและมดลูก ของนามิ (Laparoscopic Surgery: Myomectomy + Hysteroscopy)"
    );
  });
});
