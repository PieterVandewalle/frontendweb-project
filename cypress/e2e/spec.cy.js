describe('mijn eerste test', () => {
  it('draait de applicatie', () => {
    cy.visit('http://localhost:3000/');
    cy.get('h1').should('exist');
    cy.login();
    cy.logout();
  });
});