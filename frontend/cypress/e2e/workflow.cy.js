describe('Candidate Workflow E2E', () => {
  it('Should sign up, build resume, and publish profile', () => {
    // 1. Visit Login Page
    cy.visit('/login');

    // 2. Click sign up
    cy.contains("Create an account").click();
    cy.url().should('include', '/signup');
    
    // 3. Fill sign up form
    const randomEmail = `candidate${Date.now()}@test.com`;
    cy.get('input[type="text"]').type('Test Candidate');
    cy.get('input[type="email"]').type(randomEmail);
    // Password needs uppercase, lowercase, and number
    cy.get('input[type="password"]').type('Password123');
    
    // Mock the alert so it doesn't block Cypress
    cy.on('window:alert', (text) => {
      expect(text).to.contains('Account created!');
    });

    cy.get('button[type="submit"]').click();
    
    // 4. Check if redirected to login, then login
    cy.url().should('include', '/login');
    
    cy.get('input[type="email"]').type(randomEmail);
    cy.get('input[type="password"]').type('Password123');
    cy.get('button[type="submit"]').click();
    
    // 5. Navigate to Candidate Dashboard
    cy.url().should('include', '/candidate');
    
    // 6. Navigate to Resume Builder
    cy.visit('/candidate/resume-builder');
    cy.contains('Resume Builder').should('be.visible');
    
    // 7. Add Experience
    cy.get('#input-company').type('Google');
    cy.get('#input-title').type('Software Engineer');
    cy.get('#input-start-date').type('2020-01-01');
    cy.get('#input-description').type('Did some coding.');
    cy.get('#btn-add-experience').click();
    
    // 8. Verify Experience added
    cy.contains('Google').should('be.visible');

    // 9. Finalize profile
    cy.get('#btn-vectorize-profile').click();
  });
});
