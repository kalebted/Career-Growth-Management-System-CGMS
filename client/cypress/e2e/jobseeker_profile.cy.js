// cypress/e2e/jobseeker_profile.cy.js

describe('Job Seeker Profile Page', () => {
  const email = 'Tester01@gmail.com';
  const password = 'Hala@089';

  beforeEach(() => {
    // Login and set localStorage
    cy.request('POST', 'http://localhost:3001/auth/login', {
      email,
      password,
    }).then((res) => {
      const { token, user } = res.body;
      expect(user.role).to.eq('job_seeker');

      cy.visit('/');
      cy.window().then((win) => {
        win.localStorage.setItem('token', token);
        win.localStorage.setItem('userData', JSON.stringify(user));
      });

      cy.visit('/jobseeker_profile');
    });
  });

  it('renders sidebar, appbar, and tab switcher', () => {
    cy.get('[data-testid="sidebar"]').should('exist');
    cy.get('header, .MuiAppBar-root').should('exist');
    cy.get('[data-testid="jobseeker-profile"]').should('exist');
    cy.contains('My Profile').should('exist');
    cy.contains('CVs').should('exist');
    cy.contains('Experience').should('exist');
    cy.contains('Skills').should('exist');
  });

  it('switches between tabs and displays their content', () => {
    // Tab 0: My Profile
    cy.contains('Full Name').should('exist');

    // Tab 1: CVs
    cy.contains('CVs').click();
    cy.contains('My Main CV').should('exist');
    cy.contains('CV History').should('exist');

    // Tab 2: Experience
    cy.contains('Experience').click();
    cy.contains('Work Experience').should('exist');
    cy.contains('Title / Role').should('exist');

    // Tab 3: Skills
    cy.contains('Skills').click();
    cy.contains('My Skills').should('exist');
  });
});
