import { func } from 'prop-types'

describe('Blog app', function () {
  beforeEach(function () {
    cy.databaseUserReset({ username: 'testi', password: 'salainen' })
  })

  it('Login form is shown', function () {
    cy.contains('Log in to application')
  })

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.contains('Log in to application')
      cy.login({ username: 'testi', password: 'salainen' })
      cy.wait(1000)
      cy.contains('Etunimi Sukunimi logged in')
    })

    it('fails with wrong credentials', function () {
      cy.contains('Log in to application')
      cy.login({ username: 'testi', password: 'wrong' })

      cy.contains('wrong username or password')
    })
  })

  describe('When logged in', function () {
    beforeEach(function () {
      cy.contains('Log in to application')
      cy.login({ username: 'testi', password: 'salainen' })

      cy.contains('Etunimi Sukunimi logged in')
    })

    it('A blog can be created', function () {
      cy.newBlog({
        title: 'a title by cypress',
        author: 'an author by cypress',
        url: 'an url by cypress',
      })
    })

    //cy.contains('a title by cypress an author by cypress')

    it('A blog can be liked', function () {
      cy.newBlog({
        title: 'a title by cypress',
        author: 'an author by cypress',
        url: 'an url by cypress',
      })

      cy.get('#show-content').click()
      cy.get('#like-button').click()

      cy.contains('likes 1')
    })

    it('A blog can be removed', function () {
      cy.newBlog({
        title: 'a title by cypress',
        author: 'an author by cypress',
        url: 'an url by cypress',
      })

      cy.get('#show-content').click()
      cy.get('#remove-button').click()

      cy.contains('a title by cypress an author by cypress').should('not.exist')
    })
    it('Blogs are arranged by likes', function () {
      cy.newBlog({
        title: 'a title by cypress',
        author: 'an author by cypress',
        url: 'an url by cypress',
      })

      cy.contains('a title by cypress an author by cypress')
        .contains('view')
        .click()
      cy.get('#like-button').click()
      cy.wait(1000)
      cy.get('#like-button').click()
      cy.contains('likes 2')

      cy.newBlog({
        title: 'a second title by cypress',
        author: 'a second author by cypress',
        url: 'a second url by cypress',
      })

      cy.contains('a second title by cypress a second author by cypress')
        .contains('view')
        .click()
      cy.contains('likes 0').contains('like').click()
      cy.wait(1000)
      cy.contains('likes 1').contains('like').click()
      cy.wait(1000)
      cy.get('.blog').eq(1).find('#like-button').should('be.visible').click()
      cy.wait(1000)
      cy.contains('likes 3')

      cy.get('.blog')
        .eq(0)
        .should(
          'contain',
          'a second title by cypress a second author by cypress'
        )
      cy.get('.blog')
        .eq(1)
        .should('contain', 'a title by cypress an author by cypress')
    })
  })
})
