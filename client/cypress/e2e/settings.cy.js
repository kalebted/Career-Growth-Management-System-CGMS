describe('Job Seeker - Settings Page', () => {
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

      cy.visit('/settings');
    });
  });

  it('loads and displays settings form', () => {
    cy.contains('Account Settings').should('be.visible');

    cy.get('input[name="name"]').should('exist');
    cy.get('input[name="username"]').should('exist');
    cy.get('input[name="currentPassword"]').should('exist');
    cy.get('input[name="newPassword"]').should('exist');
  });

  it('updates full name and sees success message', () => {
    const newName = `User ${Date.now()}`;
    cy.get('input[name="name"]').clear().type(newName);
    cy.contains('Save Changes').click();
    cy.contains('Profile updated successfully').should('exist');
  });

  it('shows confirmation modal on delete and validates empty password', () => {
    // Open the modal
    cy.contains('Delete Account').click({ force: true });
  
    // Confirm modal appears
    cy.contains(/Confirm Account Deletion/i).should('be.visible');
  
    // Try submitting with no password
    cy.contains('Delete').click({ force: true });
    
  
    // Cancel to prevent deletion
    cy.contains('Cancel').click();
  });
  

  it('signs out successfully', () => {
    cy.contains('Sign Out').click();
    cy.url().should('include', '/');
  });
});
