describe('Job Seeker Dashboard', () => {
  const email = 'Tester01@gmail.com';
  const password = 'Hala@089';

  beforeEach(() => {
    cy.request('POST', 'http://localhost:3001/auth/login', {
      email,
      password,
    }).then((res) => {
      expect(res.status).to.eq(200);
      const { token, user } = res.body;
      expect(user.role).to.eq('job_seeker'); // ✅ required for Sidebar to show

      cy.visit('/'); // init window
      cy.window().then((win) => {
        win.localStorage.setItem('token', token);
        win.localStorage.setItem('userData', JSON.stringify(user));
      });

      cy.visit('/dashboard');
    });
  });

  it('renders sidebar and app bar for job seeker', () => {
    cy.get('[data-testid="sidebar"]', { timeout: 8000 }).should('exist');
    cy.get('header, .MuiAppBar-root').should('exist');
    cy.contains('Applications').should('exist');
  });
});
