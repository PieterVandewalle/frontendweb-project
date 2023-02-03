describe("posts test", () => {
    it("show posts", () => {
        cy.intercept(
            "GET",
            "http://localhost:9000/api/posts?order=date-desc&limit=5&offset=0", {
                fixture: "posts.json",
            },
        );
        cy.visit("http://localhost:3000");
        cy.get("[data-cy=post]").should("have.length", 2);
        cy.get("[data-cy=post_title]").eq(0).contains("GeForce GTX 1070 ARMOR 8G OC");
        cy.get("[data-cy=post_price]").eq(0).contains("170,75");
    });

    it("very slow response", () => {
        cy.intercept(
            "http://localhost:9000/api/posts?order=date-desc&limit=5&offset=0",
            (req) => {
                req.on("response", (res) => {
                    res.setDelay(500);
                });
            },
        ).as("slowResponse");
        cy.visit("http://localhost:3000");
        cy.get("[data-cy=loading]").should("be.visible");
        cy.wait("@slowResponse");
        cy.get("[data-cy=loading]").should("not.exist");
    });

    it("check price filter", () => {
        cy.intercept("http://localhost:9000/api/posts?minPrice=170&maxPrice=500&order=date-desc&limit=5&offset=0").as('getFilteredPosts');
        cy.visit("http://localhost:3000");
        cy.get("[data-cy=posts_minPrice_input]").type("170");
        cy.get("[data-cy=posts_maxPrice_input]").type("500");
        cy.get("[data-cy=submit_price_filter]").click();

        cy.wait('@getFilteredPosts').then(() => {
            cy.get("[data-cy=post_price]").each((el) => {
                const price = parseFloat(String(el[0].textContent).slice(2));
                expect(price).to.be.at.least(170);
                expect(price).to.be.at.most(500);
            });
        })
    });

    it("check invalid price filter (minPrice > maxPrice)", () => {
        cy.visit("http://localhost:3000");
        cy.get("[data-cy=posts_minPrice_input]").type("170");
        cy.get("[data-cy=posts_maxPrice_input]").type("165");
        cy.get("[data-cy=submit_price_filter]").click();
        cy.get("[data-cy=price_filter_error]").should("be.visible");
    });

    it("check deliveryType filter", () => {
        cy.intercept("http://localhost:9000/api/posts?deliveryTypeId=1&order=date-desc&limit=5&offset=0").as('getFilteredPosts');
        cy.visit("http://localhost:3000");
        cy.get("[data-cy=posts_deliveryType_input]").select("Pick up");
        cy.wait('@getFilteredPosts').then(() => {
            cy.get("[data-cy=post_deliveryType]").each((el) => {
                const deliveryType = el[0].textContent;
                expect(deliveryType).to.equal("Pick up");
            })
        });
    });

    it("check order", () => {
        cy.intercept("http://localhost:9000/api/posts?order=price-desc&limit=5&offset=0").as('getSortedPosts');
        cy.visit("http://localhost:3000");
        cy.get("[data-cy=posts_order_input]").select("price-desc");
        cy.get("[data-cy=post_price]").each((el, i, elements) => {
            // Get the current post's price and convert it to a number
            const price = parseFloat(String(el[0].textContent.slice(2).replaceAll(".", "")));
            // Get the next post's price and convert it to a number
            const next = i+1 < elements.length ? elements.eq(i+1) : "";
            const priceNext = next ? parseFloat(next.text().slice(2).replaceAll(".", "")):0;
          
            // Use the expect library to check that the current post's price is at least the next post's price
            expect(price).to.be.at.least(priceNext);
          });
    });

    it("reset filters", () => {
        cy.intercept("http://localhost:9000/api/posts?order=price-desc&limit=5&offset=0").as('getSortedPosts');
        cy.intercept(
            "GET",
            "http://localhost:9000/api/post*", {
                fixture: "posts.json",
            },
        );
        cy.visit("http://localhost:3000");
        cy.get("[data-cy=posts_minPrice_input]").type("2000");
        cy.get("[data-cy=posts_maxPrice_input]").type("2500");
        cy.get("[data-cy=submit_price_filter]").click();
        cy.get("[data-cy=posts_order_input]").select("price-desc");
        cy.get("[data-cy=posts_deliveryType_input]").select("Pick up");
        cy.get("[data-cy=reset_filters_btn").click();
        cy.get("[data-cy=post]").should("have.length", 2);
    });

    it("no posts found", () => {
        cy.intercept("http://localhost:9000/api/posts?order=price-desc&limit=5&offset=0").as('getSortedPosts');
        cy.intercept(
            "GET",
            "http://localhost:9000/api/post*",
            '{"items": [], "count":0, "total_posts": 0, "limit":5, "offset":0, "hasNext":false}',
        );
        cy.visit("http://localhost:3000");
        cy.get("[data-cy=no_posts_yet]").should("be.visible");        
    });

    it("error from backend", () => {
      cy.intercept(
        "GET",
        "http://localhost:9000/api/posts*",

        {
          statusCode: 500,
          body: {
            error: "internal server error",
          },
        },
      );
      cy.visit("http://localhost:3000");
      cy.get("[data-cy=post]").should("have.length", 0);
      cy.get("[data-cy=error_loading]").should("be.visible");
    });
});