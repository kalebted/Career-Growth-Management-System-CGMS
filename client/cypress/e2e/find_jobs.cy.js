describe('Find Jobs Page - Job Seeker Filters and Search', () => {
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

      cy.visit('/find_jobs');
    });
  });

  it('renders sidebar, app bar, search box, and filters', () => {
    cy.get('[data-testid="sidebar"]').should('exist');
    cy.get('header, .MuiAppBar-root').should('exist');
    cy.get('[data-testid="search-box"]').should('exist');
    cy.get('[data-testid="filters-sidebar"]').should('exist');
    cy.get('[data-testid="job-results"]').should('exist');
  });

  it('applies and resets filters', () => {
    cy.get('[data-testid="work-type-full-time"] input[type="checkbox"]').check({ force: true });
    cy.get('[data-testid="work-mode-remote"] input[type="checkbox"]').check({ force: true });

    cy.get('input[name="company_name"]').type('OpenAI');

    cy.get('[name="sort"]').parent().click();
    cy.get('ul[role="listbox"]').contains('Newest').click();

    cy.get('[data-testid="apply-filters-btn"]').click();
    cy.get('[data-testid="filters-sidebar"]').should('exist');

    cy.get('[data-testid="reset-filters-btn"]').click();
  });

  it('allows typing into keyword and location search box', () => {
    cy.get('[data-testid="search-box"]').first().within(() => {
      cy.get('[data-testid="keyword-input"]').type('developer');
      cy.get('[data-testid="location-input"]').type('Addis Ababa');
    });
  });
});
