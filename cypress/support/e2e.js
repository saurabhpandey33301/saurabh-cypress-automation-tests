// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:

// import './commands';
// import { LoginPage } from './pages';

// beforeEach(() => {
//   cy.clearCookies();
//   cy.clearLocalStorage();
  
//   // Only include if using Cypress v8.2.0 or later
//   if (Cypress.Commands.querying && 'clearSessionStorage' in Cypress.Commands.querying) {

//     cy.clearAllSessionStorage();
//   }
// });


import './commands';
import 'cypress-real-events'

beforeEach(() => {
  // Clear all session data
  cy.clearCookies();
  cy.clearLocalStorage();
  
  // Polyfill for clearSessionStorage if needed
  if (!Cypress.Commands.querying || !('clearSessionStorage' in Cypress.Commands.querying)) {
    Cypress.Commands.add('clearSessionStorage', () => {
      cy.window().then((win) => {
        win.sessionStorage.clear();
      });
    });
  }
  cy.clearSessionStorage();
});