describe('Profile Component', () => {
    beforeEach(() => {
      // Visit the component URL or render it within the testing context
      cy.visit('/profile'); // Adjust the URL as necessary
    });
  
    it('should display the profile form', () => {
      cy.get('h2').contains('User Profile').should('be.visible');
      cy.get('input[name="full_name"]').should('be.visible');
      cy.get('input[name="address"]').should('be.visible');
      cy.get('input[name="birthday"]').should('be.visible');
      cy.get('select[name="gender"]').should('be.visible');
      cy.get('input[name="phone_number"]').should('be.visible');
      cy.get('button').contains('Save Changes').should('be.visible');
    });
  
    
    ;
  });
  