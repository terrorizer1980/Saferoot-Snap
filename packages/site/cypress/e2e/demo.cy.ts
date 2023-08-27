describe('Test User Login', () => {

    it('Connects with Metamask', () => {
        cy.visit('http://localhost:8000')
        cy.contains('Connect Wallet').click();
    })
})