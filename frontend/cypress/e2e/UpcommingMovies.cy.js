describe('Upcoming Movies Component', () => {
    const baseUrl = 'https://theater-reservation-system-production.up.railway.app';
  
    beforeEach(() => {
      cy.visit('/'); 
    });
  
    it('should display a loading spinner while fetching data', () => {
      cy.get('svg').should('exist'); 
    });
  
    it('should fetch and display upcoming movies', () => {
      cy.get('svg').should('not.exist');
  
      cy.get('.transform').should('have.length.greaterThan', 0); 
  
      cy.get('.text-xl').first().should('exist');
    });
  
    
  
    it('should open the trailer link in a new tab when the "Watch Trailer" button is clicked', () => {
      cy.get('svg').should('not.exist');
  
      cy.get('button').first().click();
  
    });
  
    it('should cycle through movie cards every 5 seconds on mobile view', () => {
      cy.viewport('iphone-6'); 
  
      cy.get('svg').should('not.exist');
  
      cy.get('.text-xl').first().invoke('text').then((firstTitle) => {
        cy.wait(6000); 
  
        cy.get('.text-xl').first().should('not.have.text', firstTitle);
      });
    });
  
    
  });
  