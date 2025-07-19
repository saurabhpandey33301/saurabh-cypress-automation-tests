describe('Authentication Flow', () => {
  before(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.window().then((win) => {
      win.sessionStorage.clear();
    });
  });


  it('should login, create bot, configure bot with detailed steps, and logout', () => {
    const username = 'saurabh1.work@gmail.com';
    const password = 'Saurabh@3301';
    cy.login(username, password, true);
    cy.verifyLoggedIn();

    cy.wait(3000);

    const uniqueBotName = `TestBot_${Date.now()}`;
    cy.createBot(uniqueBotName);

    cy.wait(10000);

    cy.searchForMessages('message');

    cy.wait(3000);

    cy.dragMessagesToActionSection();

    cy.writeMessageInDisplayBox('test message');

    cy.clickSaveButton();
    
    cy.logout();
    cy.wait(1000);
    
  });

  
});