describe('Core Workflow', () => {
  it('loads the landing page', () => {
    cy.visit('/')
    cy.contains('NexHire AI')
  })

  it('allows admin login and viewing dashboard', () => {
    cy.visit('/login')
    cy.get('input[type="email"]').type('admin@nexhire.ai')
    cy.get('input[type="password"]').type('admin123')
    cy.get('button[type="submit"]').click()
    
    // Should navigate to admin dashboard
    cy.url().should('include', '/admin')
    cy.contains('Dashboard Overview')
    
    // Navigate to Candidates
    cy.contains('Candidates').click()
    cy.url().should('include', '/admin/candidates')
    
    // Navigate to Jobs
    cy.contains('Jobs').click()
    cy.url().should('include', '/admin/jobs')
    
    // Test Logout
    cy.contains('Logout').click()
    cy.url().should('include', '/login')
  })
})
