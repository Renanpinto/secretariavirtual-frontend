describe('Login', function() {
    it("Gets, types and asserts", function() {
      cy.visit('/')
  
      cy.get('input#email')
        .type('email@email.com')
        .should('have.value', 'email@email.com')
      
      cy.get('input#password')
        .type('1234')
      
        cy.get('input.submit').click()

  
      cy.url().should('include', '/home')
  
    })
  })