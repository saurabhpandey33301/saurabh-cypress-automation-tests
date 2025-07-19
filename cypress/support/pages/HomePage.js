class HomePage {
  elements = {
    // Wait for and find user menu button
    userMenu: () => cy.get('button[name="mysettings"]', { timeout: 15000 }),
    logoutButton: () => cy.contains('Log out', { timeout: 10000 }),
    homePageHeader: () => cy.get('.homepage-welcome-title'),
    userAvatar: () => cy.get('.rio-avatar'),
    userMenuDropdown: () => cy.get('[data-testid="user-menu-dropdown"]'),
    // Bot creation elements - updated to match actual HTML structure
    createBotButton: () => cy.get('[data-text="Create a bot…"]').parent('button'),
    createBotModal: () => cy.get('[role="dialog"]'),
    botNameInput: () => cy.get('input[name="name"]'),
    createAndEditButton: () => cy.get('button[name="submit"]'),
    cancelButton: () => cy.get('button[name="cancel"]'),
    modalTitle: () => cy.contains('Create Task Bot'),
    // Alternative selectors for create bot button if the main one doesn't work
    createBotButtonAlt: () => cy.contains('button', 'Create a bot…'),
    createBotButtonContainer: () => cy.get('.command-button').contains('Create a bot…'),
    // Login elements for re-authentication
    loginUsernameInput: () => cy.get('input[name="username"]'),
    loginPasswordInput: () => cy.get('input[name="password"]'),
    loginSubmitButton: () => cy.get('button[name="submitLogin"]')
  };

  reAuthenticate(username, password) {
    cy.log('Re-authenticating due to automatic logout');

    // Fill in credentials if we're on login page
    this.elements.loginUsernameInput()
      .should('be.visible')
      .clear()
      .type(username);

    this.elements.loginPasswordInput()
      .should('be.visible')
      .clear()
      .type(password);

    // Click login button
    this.elements.loginSubmitButton()
      .should('be.visible')
      .click();

    // Wait for redirect to home page
    cy.url({ timeout: 15000 }).should('satisfy', (url) => {
      return url.includes('/#/home') || url.includes('/#/index');
    });
  }

  verifySuccessfulLogin() {
    // Wait for final redirect to complete - the logs show /#/index then /#/home
    cy.url({ timeout: 15000 }).should('satisfy', (url) => {
      return url.includes('/#/home') || url.includes('/#/index');
    });

    // Wait for the home page content to be visible
    this.elements.homePageHeader()
      .should('be.visible')
      .and('contain', 'WELCOME');

    // Wait for user menu to be available
    this.elements.userMenu().should('be.visible');

    cy.log('Successfully verified login - user is on home page');
  }

  openUserMenu() {
    // First check if we're still logged in
    cy.url().then((url) => {
      if (url.includes('/login')) {
        throw new Error('User was logged out automatically');
      }
    });

    // Click on user menu to open dropdown
    this.elements.userMenu()
      .should('be.visible')
      .click();

    // Wait a moment for dropdown to appear
    cy.wait(1000);
    return this;
  }

  createBot(botName) {
    cy.log(`Creating bot with name: ${botName}`);

    // Click on "Create a bot..." button using the most direct approach
    cy.contains('Create a bot…').should('be.visible').click();

    // Wait for modal/dialog to appear
    cy.get('[role="dialog"]', { timeout: 10000 }).should('be.visible');

    // Work within the modal dialog
    cy.get('[role="dialog"]').within(() => {
      // Wait a moment for the modal to fully load
      cy.wait(1000);

      // Try to find the name field by looking for input with "Untitled" value
      cy.get('input').then(($inputs) => {
        let nameInput = null;

        // Look for input with "Untitled" value
        $inputs.each((index, input) => {
          if (input.value === 'Untitled') {
            nameInput = input;
          }
        });

        if (nameInput) {
          cy.wrap(nameInput).clear().type(botName);
        } else {
          // Fallback: use the first visible input
          cy.get('input').first().clear().type(botName);
        }
      });

      // Click the "Create & edit" button
      cy.contains('button', 'Create & edit').should('be.visible').click();
    });

    // Wait for modal to close or page to change
    cy.get('[role="dialog"]').should('not.exist');

    cy.log(`Bot "${botName}" created successfully`);
  }

  logout() {
    // Check if we're already logged out
    cy.url().then((url) => {
      if (url.includes('/login')) {
        cy.log('Already logged out, skipping logout process');
        return this;
      }

      // Wait for the page to be fully loaded
      cy.get('body').then(() => {
        // Try to find homepage elements, if not found, we might be logged out
        cy.get('button.pathfinder-items__item-button--variant_user[title="saurabh1.work@gmail.com"]')
          .should('be.visible')
          .click({ force: true });

      });
      cy.wait(1000);
      cy.contains('button', 'Log out')
        .should('be.visible')
        .click({ force: true });
    });

    return this;
  }
}

module.exports = { HomePage };