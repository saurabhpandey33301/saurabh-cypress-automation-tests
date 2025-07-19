// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })


// Import page objects using CommonJS syntax
import '@4tw/cypress-drag-drop';

const { LoginPage, HomePage, BotConfigPage , DocumentAutomationPage} = require('./pages');

// Create instances of page objects
const loginPage = new LoginPage();
const homePage = new HomePage();
const botConfigPage = new BotConfigPage();
const documentAutomationPage = new DocumentAutomationPage();


// Store credentials for re-authentication
let storedCredentials = {
  username: null,
  password: null
};

Cypress.Commands.add('login', (username, password, remember = true) => {
  // Store credentials for potential re-authentication
  storedCredentials.username = username;
  storedCredentials.password = password;
  
  // Set environment variables for re-authentication
  Cypress.env('TEST_USERNAME', username);
  Cypress.env('TEST_PASSWORD', password);
  
  loginPage.login(username, password, remember);
});

Cypress.Commands.add('logout', () => {
  homePage.logout();
});

Cypress.Commands.add('verifyLoggedIn', () => {
  homePage.verifySuccessfulLogin();
});

Cypress.Commands.add('createBot', (botName) => {
  homePage.createBot(botName);
});

// Bot configuration commands
Cypress.Commands.add('configureBotActions', (message = 'test message') => {
  botConfigPage.configureBotActions(message);
});

Cypress.Commands.add('searchForMessages', (searchTerm = 'message') => {
  botConfigPage.searchForMessages(searchTerm);
});

Cypress.Commands.add('dragMessagesToActionSection', () => {
  botConfigPage.dragMessagesToActionSection();
});

Cypress.Commands.add('writeMessageInDisplayBox', (message) => {
  botConfigPage.writeMessageInDisplayBox(message);
});

Cypress.Commands.add('clickSaveButton', () => {
  botConfigPage.saveBot();
});



// Command to handle re-authentication if needed
Cypress.Commands.add('handleAutoLogout', () => {
  cy.url().then((url) => {
    if (url.includes('/login')) {
      cy.log('Automatic logout detected, re-authenticating...');
      
      if (storedCredentials.username && storedCredentials.password) {
        homePage.reAuthenticate(storedCredentials.username, storedCredentials.password);
      } else {
        throw new Error('No stored credentials available for re-authentication');
      }
    }
  });
});

//commands for document automation page
Cypress.Commands.add('navigateToDocumentAutomation', () => {
  documentAutomationPage.navigateToDocumentAutomation();
});

Cypress.Commands.add('createLearningInstance', (instanceName) => {
  documentAutomationPage.createLearningInstance(instanceName);
});

Cypress.Commands.add('addFieldConfiguration', (fieldName, fieldLabel) => {
  documentAutomationPage.addFieldConfiguration(fieldName, fieldLabel);
});







