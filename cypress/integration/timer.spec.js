context('Timer', () => {
  beforeEach(() => {
    cy.visit('https://codepen.io/gerkirill/full/BVyLgK/')
  })


  it('start', () => {
    cy.get('.startStop')
      .should('have.text', 'Start')
      .click()
    ;
  })
})
