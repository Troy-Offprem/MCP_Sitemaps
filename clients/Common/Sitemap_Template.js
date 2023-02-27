/*
    ACTION ITEMS TO DISCUSS:
    - N/A

    KNOWN ISSUES
    - N/A

    TODO:
    - N/A

    -CATALOG AND PROFILE OBJECT SETTINGS
        - PRODUCT
            - RELATED CATALOG OBJECTS
                - 
*/

Evergage.init({
    cookieDomain: 'domain.com',
}).then(() => {
    /**************************************************
     *  GLOBAL FUNCTIONS AND VARIABLES
    ***************************************************/
    const getLocale = function() {
        return 'US-EN';
    };
    
    /**************************************************
     *  BEGIN SITEMAPPING
    ***************************************************/
    const config = {
        global: {
            locale: getLocale(),
            contentZones: [
                {  }
            ],
            onActionEvent: (actionEvent) => {
                return actionEvent;
            },
            listeners: [ 

            ]
        },
        pageTypeDefault: {
            name: "default"
        },
        pageTypes: [
            {
                /**************************************************
                 *  HOME PAGE SITEMAP TEMPLATE
                ***************************************************/
                name: 'home',
                action: 'Homepage | View',
                itemAction: 'View Homepage',
                isMatch: () => {
                    return /^\/$/.test(window.location.pathname);
                },
                contentZones: [
                    { name: "home_hero", selector: '.home-hero' }
                ],
                listeners: [
                    Evergage.listener("submit", "#submit-button", (event) => {
                        const $form = Evergage.cashDom(event.target) ||
                            Evergage.cashDom(event.currentTarget) ;

                        const user = {
                            email: $form.find('#Email'),
                            firstName: $form.find('#FirstName'),
                            lastName: $form.find('#LastName'),
                        };

                        Evergage.sendEvent({
                            action: "Home | Subscribe",
                            user: {
                                id: user.email,
                                attributes: {
                                    emailAddress: user.email,
                                    firstName: user.firstName,
                                    lastName: user.lastName
                                }
                            }
                        });
                    }),
                ]
            },
            {
                /**************************************************
                 *  PRODUCT SITEMAP TEMPLATE
                ***************************************************/
                name: "product",
                isMatch: () => {
                    return /\/product/.test(window.location.pathname);
                },
                action: "Product | View Item",
                itemAction: Evergage.ItemAction.ViewItem,
                catalog: {
                    Product: {
                        _id: Evergage.resolvers.fromSelector("#id"),
                        name: Evergage.resolvers.fromSelector("#name"),
                        url: Evergage.resolvers.fromHref(),
                        imageUrl: Evergage.resolvers.fromSelectorAttribute('.img', 'src'),
                        inventoryCount: 0,
                        price: Evergage.resolvers.fromSelector('#price'),
                        listPrice: Evergage.resolvers.fromSelector('#list-price'),
                        categories: Evergage.resolvers.buildCategoryId('.breadcrumbs ul li', null, null, categoryId), 
                        relatedCatalogObjects: { 
                            Type: Evergage.resolvers.fromSelector('#type')  
                        }
                    }
                },
                contentZones: [
                    { name: "product_detail_recs_row_1", selector: ".recommendations" }
                ],
            },
        ]
    };
    Evergage.initSitemap(config);
});