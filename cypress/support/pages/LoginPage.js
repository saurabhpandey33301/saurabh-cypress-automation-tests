const { HomePage } = require('./HomePage');

class LoginPage {

  elements = {
    // Multiple fallback selectors for robustness
    usernameInput: () => {
      return cy.get('body').then($body => {
        if ($body.find('input[name="username"]').length > 0) {
          return cy.get('input[name="username"]');
        } else if ($body.find('input[type="email"]').length > 0) {
          return cy.get('input[type="email"]');
        } else if ($body.find('input[placeholder*="email" i]').length > 0) {
          return cy.get('input[placeholder*="email" i]');
        } else if ($body.find('input[placeholder*="username" i]').length > 0) {
          return cy.get('input[placeholder*="username" i]');
        } else {
          // Fallback to first input field
          return cy.get('input').first();
        }
      });
    },
    passwordInput: () => {
      return cy.get('body').then($body => {
        if ($body.find('input[name="password"]').length > 0) {
          return cy.get('input[name="password"]');
        } else if ($body.find('input[type="password"]').length > 0) {
          return cy.get('input[type="password"]');
        } else {
          // Fallback to second input field
          return cy.get('input').eq(1);
        }
      });
    },
    loginButton: () => {
      return cy.get('body').then($body => {
        if ($body.find('button[name="submitLogin"]').length > 0) {
          return cy.get('button[name="submitLogin"]');
        } else if ($body.find('button[type="submit"]').length > 0) {
          return cy.get('button[type="submit"]');
        } else if ($body.find('button:contains("Login")').length > 0) {
          return cy.contains('button', 'Login');
        } else if ($body.find('button:contains("Sign In")').length > 0) {
          return cy.contains('button', 'Sign In');
        } else {
          // Fallback to any button
          return cy.get('button').first();
        }
      });
    },
    rememberCheckbox: () => cy.get('input[name="rememberUsername"]'),
    rememberLabel: () => cy.contains('label', 'Remember')
  };

  visit() {
    cy.visit('https://community.cloud.automationanywhere.digital/#/login?next=/index');
    // Wait for page to load and debug what elements are present
    cy.get('body').should('be.visible');
    cy.wait(3000); // Give more time for SPA to load
    
    // Debug: Log what elements are actually on the page
    cy.get('body').then($body => {
      cy.log('=== DEBUGGING LOGIN PAGE ===');
      cy.log(`Page title: ${$body.find('title').text()}`);
      cy.log(`Body text contains: ${$body.text().substring(0, 200)}...`);
      
      // Check for input elements
      cy.get('input').then($inputs => {
        cy.log(`Found ${$inputs.length} input elements:`);
        $inputs.each((index, input) => {
          cy.log(`Input ${index}: name="${input.name}", type="${input.type}", id="${input.id}"`);
        });
      });
    });
    
    return this;
  }

  // Debug method to help identify actual page elements
  debugPageElements() {
    cy.get('body').then(() => {
      cy.log('=== DEBUGGING PAGE ELEMENTS ===');
      
      // Log all input elements
      cy.get('input').then(($inputs) => {
        cy.log(`Found ${$inputs.length} input elements:`);
        $inputs.each((index, input) => {
          cy.log(`Input ${index}: name="${input.name}", type="${input.type}", id="${input.id}", class="${input.className}", placeholder="${input.placeholder}"`);
        });
      });
      
      // Log all button elements
      cy.get('button').then(($buttons) => {
        cy.log(`Found ${$buttons.length} button elements:`);
        $buttons.each((index, button) => {
          cy.log(`Button ${index}: name="${button.name}", type="${button.type}", id="${button.id}", text="${button.textContent?.trim()}"`);
        });
      });
    });
    return this;
  }

  typeUsername(username) {
    // Wait for page to load and then find username input
    cy.wait(2000); // Additional wait for dynamic content
    
    // Try multiple approaches to find username field
    cy.get('body').then($body => {
      if ($body.find('input[name="username"]').length > 0) {
        cy.get('input[name="username"]').clear().type(username);
      } else if ($body.find('input[type="email"]').length > 0) {
        cy.get('input[type="email"]').clear().type(username);
      } else if ($body.find('input').length > 0) {
        // Use first input as fallback
        cy.get('input').first().clear().type(username);
      } else {
        cy.log('No input fields found on page');
        cy.screenshot('no-input-fields-found');
      }
    });
    return this;
  }

  typePassword(password) {
    // Find password input and type
    this.elements.passwordInput().then($input => {
      cy.wrap($input).clear().type(password);
    });
    return this;
  }

  toggleRememberMe(remember = true) {
    if (remember) {
      // Cypress automatically waits for elements to be actionable
      this.elements.rememberLabel().click();
    } else {
      // Check current state and toggle if needed
      this.elements.rememberCheckbox().then(($el) => {
        if ($el.prop('checked')) {
          this.elements.rememberLabel().click();
        }
      });
    }
    return this;
  }

  submit() {
    // Cypress automatically waits for elements to be actionable before clicking
    this.elements.loginButton().click();
    return new HomePage();
  }

  login(username, password, remember = true) {
    this.visit()
      .typeUsername(username)
      .typePassword(password)
      .toggleRememberMe(remember)
      .submit();
  }

}

module.exports = { LoginPage };