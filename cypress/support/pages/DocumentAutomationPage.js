class DocumentAutomation {


    navigateToDocumentAutomation() {

        cy.log('=== STEP 1: Navigate to AI → Document Automation ===');

        cy.get('button[data-path="Pathfinder.button"][name="ai"]').click();

        cy.wait(2000);

        cy.get('a[title="Document Automation"]').click();
        cy.url().should('include', '/learning-instances');

        cy.wait(2000);

        cy.get('.main-layout-upgrade-banner__close').click();

        cy.get('.main-layout-upgrade-banner').should('not.exist');

        cy.get('.modulepage-frame').then((iframedata) => {
            const idata = iframedata.contents().find('body')
            cy.wrap(idata).as('iframe')
        })
        cy.wait(5000)

        return this;
    }

    createLearningInstance(instanceName) {

        cy.log('=== STEP 2: Create Learning Instance ===');

        cy.get('@iframe').find('button:contains("Create Learning Instance")').click();
        cy.log('@iframe', '@iframe')

        cy.wait(3000)

        cy.get('@iframe').within(() => {
            // Fill the Name field
            cy.get('input[aria-label="Name"]')
                .should('be.visible')
                .clear()
                .type(instanceName, { delay: 50 });
            cy.log('Successfully filled Name field with:', instanceName);
            cy.wait(2000);

        });


        // First, locate the iframe and get its body
        // First get the iframe and alias its body content
        cy.get('.modulepage-frame').then(($iframe) => {
            const $body = $iframe.contents().find('body');
            cy.wrap($body).as('iframeBody');
        });

        // Now use the aliased iframe body to interact with elements
        cy.get('@iframeBody').then(($body) => {
            cy.wrap($body).within(() => {
                // Target the Document Type dropdown specifically
                cy.contains('.field-label__label-content', 'Document Type')
                    .parents('.field-label')
                    .find('[data-name="domainId"]') // More specific selector using data-name
                    .click({ force: true }); // Force click in case element is covered

                // Wait for dropdown options to appear
                cy.get('.rio-select-input-dropdown-option-label', { timeout: 10000 })
                    .should('be.visible')
                    .contains('User-defined')
                    .click();
            });
        });
        
        cy.get('@iframe').within(() => {
            cy.wait(2000);
            cy.get('button[name="submit"]').then($button => {
                const isDisabled = $button.attr('data-input-status') === 'DISABLED';
                if (!isDisabled) {
                    cy.log('Next button is enabled, clicking it');
                    cy.get('button[name="submit"]').click();
                } else {
                    cy.log('Next button is still disabled, checking form validation');
                    cy.get('button[name="submit"]').click({ force: true });
                }
            });
        })

        cy.wait(3000);

        cy.log('Form submitted, waiting for next step...');
        return this;

    }

    addFieldConfiguration(fieldName, fieldLabel) {
        cy.log('=== STEP 3: Add Field Configuration ===');

        cy.wait(3000);

        cy.get('@iframe').find('button[aria-label="Add a field"]').first().click();

        cy.wait(2000);

        cy.get('@iframe').within(() => {
            cy.get('input[aria-label="Field name"]')
                .should('be.visible')
                .clear()
                .type('test field', { delay: 50 }); // Typing with slight delay

            cy.get('input[aria-label="Field label"]').should('be.visible').clear().type(fieldLabel, { delay: 50 });
            cy.get('button[aria-label="Submit"]').click();

        });

        cy.wait(2000);

        cy.get('@iframe').find('button[aria-label="Create"]').first().click();

        cy.wait(30000);
        cy.log('Field configuration completed');
        return this;
    }

}

module.exports = { DocumentAutomationPage: DocumentAutomation };