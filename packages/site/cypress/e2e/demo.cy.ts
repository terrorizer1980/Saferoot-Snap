describe('Explore', () => {

    it('Explore Login Page', () => {
        cy.visit('http://localhost:8000')
        cy.contains('Connect Wallet').click();
        cy.contains('MetaMask').click();
        cy.contains('GET').click();
    })
})