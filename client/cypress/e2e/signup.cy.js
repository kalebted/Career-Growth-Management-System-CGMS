describe('Signup Page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/signup');
  });

  it('registers a new job seeker account', () => {
    const timestamp = Date.now();
    cy.get('input[name="name"]').type('Test User');
    cy.get('input[name="email"]').type(`testuser${timestamp}@example.com`);
    cy.get('input[name="username"]').type(`testuser${timestamp}`);
    cy.get('input[name="password"]').type('TestPassword123');
    cy.get('input[name="birth_date"]').type('1995-05-10');
    cy.get('button[type="submit"]').click();

    cy.contains('Registration successful').should('be.visible');
  });

  it('shows error if email is already taken', () => {
    cy.get('input[name="name"]').type('Existing User');
    cy.get('input[name="email"]').type('user@example.com'); // existing email
    cy.get('input[name="username"]').type('existinguser');
    cy.get('input[name="password"]').type('SomePassword123');
    cy.get('input[name="birth_date"]').type('1990-01-01');
    cy.get('button[type="submit"]').click();

    cy.contains('already exists').should('be.visible');
  });
});
