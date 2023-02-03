describe("add post test", () => {

    beforeEach(() => {
        cy.login();
    });

    it('add post test', () => {
        cy.goToCreatePost();
        cy.get("[data-cy=title_input]").type("MSI GeForce RTX 3080");
        cy.get("[data-cy=price_input]").type("1525");
        cy.get("[data-cy=category_input]").select("Graphics Cards");
        cy.get("[data-cy=deliveryType_input]").select("Ship");
        cy.get("[data-cy=city_input]").type("Melle"); 
        cy.get("[data-cy=image_0_input]").selectFile("cypress/images/graphics_card_1.jpg");
        cy.get("[data-cy=image_1_input]").selectFile("cypress/images/graphics_card_2.jpg"); 
        cy.get("[data-cy=image_2_input]").selectFile("cypress/images/graphics_card_3.jpg");
        cy.get("[data-cy=description_input]")
        .type("Licht op als nooit tevoren! \n Nu kunt u de verlichting synchroniseren met andere compatibele apparaten om een licht- en effectshow te creëren. Torx 4.0-ventilatorparen zijn gekoppeld aan een externe ringaansluiting waarmee de luchtstroom in het TRI FROZR 2-koelsysteem kan worden geconcentreerd \n Geen buiging om de structuur van de videokaart te versterken, we garanderen dat er een steunbeugel aan de behuizing wordt bevestigd voor extra versteviging. \n NVIDIA DLSS is een revolutionaire AI-rendering die de framesnelheid verhoogt met compromisloze beeldkwaliteit dankzij Tensor Cores."); 
        cy.get("[data-cy=submit_post").click();
    
        cy.get("[data-cy=view_created_post_btn").click();
        cy.get("[data-cy=post_title]").should("have.text","MSI GeForce RTX 3080");
        cy.get("[data-cy=post_date]").should("have.text", "Less than 1 hour ago");
        cy.get("[data-cy=post_price]").should("contain.text", "1.525,00");
        cy.get("[data-cy=post_image]").should("have.length", 3);

    });

    it('should be visible on the homepage in category: Graphics Cards', () => {
        cy.goToCategories();
        cy.get("[data-cy=cat_graphics_cards_btn]").click();
        cy.get("[data-cy=post_title]").first().should("have.text","MSI GeForce RTX 3080");
    });

    it('remove again', () => {
        cy.goToMyPosts();
        cy.get('[data-cy=post_remove_btn]').last().click();
        cy.get('[data-cy=delete_confirm_btn]').click();
    });
});