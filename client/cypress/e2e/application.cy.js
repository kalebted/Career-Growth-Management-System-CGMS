describe('Job Seeker Applications Page', () => {
  const email = 'Tester01@gmail.com';
  const password = 'Hala@089';

  beforeEach(() => {
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

      cy.visit('/applications');
    });
  });

  it('renders sidebar and app bar on applications page', () => {
    cy.get('[data-testid="sidebar"]', { timeout: 8000 }).should('exist');
    cy.get('header, .MuiAppBar-root').should('exist');
  });

  it('displays recent application history heading', () => {
    cy.contains('Recent Applications History', { timeout: 8000 }).should('exist');
  });

  it('lists application cards or shows loading spinner first', () => {
    // Wait for spinner to disappear
    cy.get('body').then(($body) => {
      if ($body.find('.MuiCircularProgress-root').length) {
        cy.get('.MuiCircularProgress-root').should('not.exist'); // wait for loading to finish
      }
    });

    // Then check for cards
    cy.get('[data-testid="application-card"]').should('have.length.at.least', 1);
  });
});
