context('Timer', () => {
  beforeEach(() => {
    cy.visit('https://gerkirill.github.io/cypress-demo/')
  })

  it('should count 3 seconds properly', () => {
    cy.get('.startStop')
      .should('have.value', 'Start')
      .click()
      .should('have.value', 'Stop')
    ;
    cy.wait(3000);
    cy.get('.tablo')
      .should('have.text', '00:00:03')
    ;
    cy.get('.startStop')
      .click()
    ;
  })
})
