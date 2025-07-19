describe('Learning Instance Form Test', () => {
    before(() => {
        // Clear session before the test
        cy.clearCookies();
        cy.clearLocalStorage();
        cy.window().then((win) => {
            win.sessionStorage.clear();
        });
    });

    it('it should complete the whole learning Instance flow', () => {
        const username = 'saurabh1.work@gmail.com';
        const password = 'Saurabh@3301';
        const instanceName = 'TestLearningInstance_' + Date.now();
        const fieldName = 'Test_field';
        const fieldLabel = 'Test_field_label';
        cy.login(username, password, true);
        cy.verifyLoggedIn();

        cy.wait(3000);
    
        cy.navigateToDocumentAutomation();
        cy.createLearningInstance(instanceName);
        cy.addFieldConfiguration(fieldName, fieldLabel);
        
      
        cy.log('=== STEP 4: Logout ===');
        cy.logout();
        cy.wait(1000);
        cy.log('Successfully logged out');

    });
});




