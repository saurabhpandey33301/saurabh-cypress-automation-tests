// cypress/support/pages/index.js
const { LoginPage } = require('./LoginPage');
const { HomePage } = require('./HomePage');
const { BotConfigPage } = require('./BotConfigPage');
const { DocumentAutomationPage } = require('./DocumentAutomationPage');

module.exports = {
  LoginPage,
  HomePage,
  BotConfigPage,
  DocumentAutomationPage
};