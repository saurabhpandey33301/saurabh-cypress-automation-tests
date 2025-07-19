

class BotConfigPage {

  searchForMessages() {
    cy.get('.main-layout-upgrade-banner__close').click();
    cy.wait(1000);
    cy.get('input[placeholder*="Search actions"]')
      .clear({ force: true })
      .type('message{enter}', { force: true });
    cy.wait(2000);
    return this;
  }

  dragMessagesToActionSection() {
    cy.log('Adding Message box action to workflow...');

    // Target the specific Message box button using its data attributes
    cy.get('button[name="item-button"]')
      .contains('Message box')
      .should('be.visible')
      .as('messageBoxButton');

    // Target the specific drop zone for actions
    cy.get('.taskbot-canvas-flow-point--end .taskbotcode-dropzone--nodes-empty')
      .should('be.visible')
      .as('actionDropZone');

    // Perform complete drag sequence
    cy.get('@messageBoxButton')
      .trigger('dragstart', {
        dataTransfer: new DataTransfer(),
        which: 1
      });

    cy.get('@actionDropZone')
      .trigger('dragenter', { dataTransfer: new DataTransfer() })
      .trigger('dragover', { dataTransfer: new DataTransfer() })
      .trigger('drop', { dataTransfer: new DataTransfer() });

    cy.get('@messageBoxButton')
      .trigger('dragend');

    cy.wait(2000);

    // Verify by checking if the empty text is gone
    cy.get('.taskbot-canvas-flow-point--end')
      .should('not.contain.text', 'Drag an action here');

    cy.log('Message box action added successfully');
    return this;
  }

  writeMessageInDisplayBox(message) {
    cy.log(`Entering message: ${message}`);

    // Wait for the action configuration panel to appear
    cy.wait(2000);

    // Look for the message input field in the configuration panel
    // Try multiple common selectors for message input
    cy.get('[role="textbox"][name="content"]')
      .should('be.visible')
      .clear()
      .type('test message');

    return this;
  }

  saveBot() {
    cy.wait(2000);
    cy.get('button[name="save"]').click();
    cy.wait(10000);
    return this;
  }


}

module.exports = { BotConfigPage };




