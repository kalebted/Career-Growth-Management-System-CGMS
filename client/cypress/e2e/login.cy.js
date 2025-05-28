describe('Login Page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/login');
  });

  it('logs in with valid credentials', () => {
    cy.get('input[name="email"]').type('Tester01@gmail.com');
    cy.get('input[name="password"]').type('Hala@089');
    cy.get('button[type="submit"]').click();

    cy.contains('Login successful').should('be.visible');
  });

  it('shows error for invalid credentials', () => {
    cy.get('input[name="email"]').type('fakeuser@example.com');
    cy.get('input[name="password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();

    cy.contains('Invalid email or password').should('be.visible');
  });
});
