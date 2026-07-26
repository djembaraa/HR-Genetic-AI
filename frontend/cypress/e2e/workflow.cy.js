describe('Candidate Workflow', () => {
  it('Should login and see resume builder', () => {
    // 1. Visit Login Page
    cy.visit('/login');

    // 2. We assume the DB is seeded or we just try to login with candidate@test.com
    cy.get('input[type="email"]').type('candidate@test.com');
    cy.get('input[type="password"]').type('password123');
    
    // We intercept the network request to mock the backend so tests pass even without seed
    cy.intercept('POST', 'http://localhost:3000/api/auth/login', {
      statusCode: 200,
      body: {
        token: 'fake-jwt-token',
        user: { id: 1, email: 'candidate@test.com', role: 'CANDIDATE' }
      }
    }).as('loginRequest');

    cy.get('button[type="submit"]').click();
    
    cy.wait('@loginRequest');

    // 3. Check if we are redirected to Resume Builder
    cy.url().should('include', '/candidate/resume-builder');
    cy.contains('Resume Builder').should('be.visible');
  });
});
