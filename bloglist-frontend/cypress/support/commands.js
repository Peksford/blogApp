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

Cypress.Commands.add('databaseUserReset', ({ username, password }) => {
  cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`);
  const user = {
    name: 'Etunimi Sukunimi',
    username: username,
    password: password,
  };
  cy.request('POST', `${Cypress.env('BACKEND')}/users`, user);
  cy.visit('');
});

Cypress.Commands.add('login', ({ username, password }) => {
  cy.get('#username').type(username);
  cy.get('#password').type(password);
  cy.get('#login-button').click();
});

Cypress.Commands.add('newBlog', ({ title, author, url }) => {
  cy.contains('create new blog').click();
  cy.get('#title').type(title);
  cy.get('#author').type(author);
  cy.get('#url').type(url);
  cy.get('#create-button').click();
  cy.contains(`a new blog ${title} by ${author} added`);

  cy.wait(1000);
  cy.contains(`${title} ${author}`);
});
