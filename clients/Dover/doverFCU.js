Evergage.init({
    cookieDomain: "doverfcu.com",
}).then(() => {
    // Page titles for category type page matches.
    const categoryPages = [
        'Personal Accounts',
        'Personal Loans',
        'Business',
        'Business Loans',
        'Commercial Loans',
        'Our Services'
    ];

    // Get product ID on product pages.
    const getProductID = () => {
        const id = Evergage.cashDom('#block-doverfcu-pagetitle span').text() || 
        Evergage.cashDom('#block-pagetitle h1').text();
        if (id){
            return id;
        }
        return "Unmapped";
    }
    
    // BEGIN SITEMAP
    const config = {
        global: {
            listeners: [
                
            ],
            locale: 'en_US',
            contentZones: [
                {name: 'content_callout_blue', selector: 'div.content-callout-full'},
                {name: 'global_popup'}
            ]
        },
        pageTypeDefault: {
            name: "default"
        },
        pageTypes: [
            {
                name: 'home',
                action: 'Homepage',
                isMatch: () => {
                    // Need to confirm page-node-216 is a static, non-generated value.
                    return Evergage.cashDom("body.page-node-216").length > 0;
                },
                contentZones: [
                    {name: "home_hero", selector: 'section[aria-label="Slideshow Area"] .primary-slideshow'}, //.views-row
                    {name: "home_recs", selector: "#block-homepageloanspanel-2"},
                 ],
                listeners: [ ],
            },
            { 
                name: 'category',
                action: 'Category | View Category',
                isMatch: () => {
                    const pageTitle = Evergage.cashDom('#block-doverfcu-pagetitle span').text();
                    return categoryPages.includes(pageTitle);
                },
                catalog: {
                    Category: {
                        _id: () => {
                            const category = Evergage.cashDom('#block-doverfcu-pagetitle span').text().toUpperCase();
                            if (category){
                                const id = `HOME|${category}`;
                                return id;
                            }
                            return "Unmapped";
                        },
                        name: () => {
                            return Evergage.cashDom('#block-doverfcu-pagetitle span').text();
                        },
                        url: Evergage.resolvers.fromHref(),
                        imageUrl: () => {
                            const origin = window.location.origin;
                            const path = Evergage.resolvers.fromSelectorAttribute('.field--name-field-slide-image img', 'src')();
                            return `${origin}${path}`;
                        },
                    }
                }
            },
            { 
                name: 'application',
                action: 'Application',
                isMatch: () => {
                    return Evergage.cashDom('.webform-submission-form').length > 0;
                },
                listeners: [
                    Evergage.listener("submit", ".webform-submission-form", (event) => {
                        const $form = Evergage.cashDom(event.currentTarget);
                        const user = {
                            firstName: $form.find('[data-drupal-selector="edit-first-name"]').val(),
                            lastName: $form.find('[data-drupal-selector="edit-last-name"]').val(),
                            email: $form.find('[data-drupal-selector="edit-email-address"]').val(),
                            phone: $form.find('[data-drupal-selector="edit-telephone"]').val(),
                        };

                        Evergage.sendEvent({ 
                            action: `${Evergage.resolvers.fromMeta('og:title')()} | Submit`,  
                            user: {
                                attributes: {
                                    firstName: user.firstName || {},
                                    lastName: user.lastName || {},
                                    emailAddress: user.email,
                                    phone: user.phone || {}
                                }
                            }
                        });
                    })
                ],
            },
            {
                name: 'contact_us',
                action: 'Contact Us | View Contact Us',
                isMatch: () => {
                    return /contact-us/.test( window.location.href);
                },
                listeners: [
                    Evergage.listener("submit", "#contact", (event) => {
                        const $form = Evergage.cashDom(event.currentTarget);

                        // There is only a single line for names so we should split it up to account for first / last names.
                        const name = $form.find('#name').val().split(' ');
                        const user = {
                            firstName: name[0],
                            lastName: name.length > 1 ? name[1] : '',
                            email: $form.find('#email').val(),
                            phone: $form.find('#phone').val(),
                        };

                        Evergage.sendEvent({ 
                            action: "Contact Us | Ask a Question",
                            user: {
                                attributes: {
                                    firstName: user.firstName || {},
                                    lastName: user.lastName || {},
                                    emailAddress:  user.email ,
                                    phone: user.phone || {}
                                }
                            }
                        });
                    })
                ]
            },
            {
                name: 'product',
                action: 'Product | View Product',
                isMatch: () => {
                    const arr = Evergage.cashDom('#block-doverfcu-breadcrumbs li');
                    if (arr.length <= 0) {
                        return false;
                    }
                    return !categoryPages.includes(arr.last()[0].outerText) 
                        && Evergage.cashDom('.webform-submission-form').length === 0
                },
                catalog: {
                    Product: {
                        _id: getProductID,
                        url: Evergage.resolvers.fromHref,
                        name: () => {
                            return Evergage.resolvers.fromSelector('#block-doverfcu-pagetitle span')();
                        },
                        Price: () => {
                            return 1.00;
                        },
                        listPrice: () => {
                            return 1.00;
                        },
                        inventoryCount: () => {
                            return 1;
                        },
                        currency: () => {
                            return 'USD';
                        },
                        imageUrl: () => {
                            const origin = window.location.origin;
                            const path = Evergage.resolvers.fromSelectorAttribute('.field--name-field-slide-image img', 'src')();
                            return `${origin}${path}`;
                        },
                        categories: Evergage.resolvers.buildCategoryId('#block-doverfcu-breadcrumbs ul li', null, true,
                            (categoryId) => [categoryId.toUpperCase()]),
                        sku: {
                            _id: getProductID(),
                        },
                        relatedCatalogObjects: {
                            Type: () => {
                                 if (/business/.test(window.location.href) || /card-processing/.test(window.location.href)) {
                                    return ['BUSINESS'];
                                }
                                return ['PERSONAL'];
                            }
                        }
                    }
                }
            }
        ]
    };

    Evergage.initSitemap(config);
});