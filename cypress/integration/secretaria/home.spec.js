describe('Login', function() {
    it("Gets, types and asserts", function() {
      cy.visit('/home')
  
      cy.get('section.principal').contains('Pacientes')
      // cy.get('section.principal').contains('Pacientes').click()

  
      // cy.url().should('include', '/pacientes')
  
    })
  })