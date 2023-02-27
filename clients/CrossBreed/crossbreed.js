Evergage.init({
    cookieDomain: 'crossbreedholsters.com',
}).then(() => {
    const buildLocale = () => {
        const locale = Evergage.cashDom("meta[property='og:locale']").attr("content");
        return locale;
    }; 

    // Determine if this is an order confirmation page.
    const isOrderConfirmationPage = () => {
        if (window.location.href.includes('/checkout/onepage/success')) {
            // AvantMetrics can take some time to populate.
            return new Promise((resolve, reject) => {
                let maxChecks = 10;
                let currentChecks = 0;
                let orderConfirmationInterval = window.setInterval(function() {
                if (currentChecks === maxChecks) {
                    window.clearInterval(orderConfirmationInterval);
                    reject(new Error("Not on a product page"));
                }
                if (typeof(_AvantMetrics) !== 'undefined') {
                    for (let i = 0; i < _AvantMetrics.length; i++) {
                        if (_AvantMetrics[i]
                            && _AvantMetrics[i][0].toUpperCase() === 'ITEM') {
                            resolve(true);
                            window.clearInterval(orderConfirmationInterval);
                        }
                    }
                }
                currentChecks++;
                }, 100);
            }).then(()=>{return true;}).catch(()=>{return false;});
        } else {
            return false;
        }
    };

    // Cache our ordered items from the order confirmation page.
    let orderedItems;
    // Return cached ordered items or get them from page data and cache them.
    let getOrderedItems = () => {
        if (isOrderConfirmationPage 
            && orderedItems) {
            return orderedItems;
        } else if (isOrderConfirmationPage) {
            let items = [];
            for (let i = 0; i < _AvantMetrics.length; i++) {
                if (_AvantMetrics[i]
                    && _AvantMetrics[i][0].toUpperCase() === 'ITEM') {
                    items.push(_AvantMetrics[i][1]);
                }
            }
            orderedItems = items;
            return orderedItems;
        }
    };

    // Get the retail price on a given product page.
    const getPrice = () => {
        let price = Evergage.cashDom('.old-price .price').text();
        
        if (!price) {
            price = getProductsFromDataLayer() ? getProductsFromDataLayer()[0].price : null;
        }
        
        if (!price) {
            price = Evergage.resolvers.fromSelector('.price', (currency) => sanitizeCurrencyString(currency));
        }
        return price;
    };

    // Get the sale price on a given product page.
    const getSalePrice = () => {
        let price = Evergage.resolvers.fromSelector('[data-price-type="finalPrice"] .price', (currency) => sanitizeCurrencyString(currency))();
        if (price) {
            return price;
        }

        price = Evergage.resolvers.fromSelector('[data-price-type="finalPrice"] .price', (currency) => sanitizeCurrencyString(currency))();
        if (price) {
            return price;
        }

        return getPrice();
    };

    // Get page type to determine if this is a product page.
    const getPageType = () => {
        const pageType = Evergage.cashDom("meta[property='og:type']").attr('content') || {};
        return pageType;
    };

    // Reformat currency string to no longer include a $
    // or any other non-currency related characters.
    const sanitizeCurrencyString = (value) => {
        if (value) {
            const sanitizedValue = value.replace(/[^0-9\.-]+/g,"");
            return sanitizedValue;
        }
        return '';
    };

    // Get visitor information from data layer.
    const getVisitorInfoFromDataLayer = () => {
        if (window.dataLayer) {
            for (let i = 0; i < window.dataLayer.length; i++) {
                if ((window.dataLayer[i].privateData || {}).visitor) {
                    return window.dataLayer[i].privateData.visitor;
                }
            }
        }
    };

    // Get currency code provided by data layer.
    const getCurrencyCode = () => {
        if (window.dataLayer) {
            for (let i = 0; i < window.dataLayer.length; i++) {
                if ((window.dataLayer[i].ecommerce && window.dataLayer[i].ecommerce.currencyCode)) {
                    return window.dataLayer[i].ecommerce.currencyCode;
                }
            }
            return 'USD';
        }
    };

    const getProductsFromDataLayer = () => {
        if (window.dataLayer) {
            for (let i = 0; i < window.dataLayer.length; i++) {
                if ((window.dataLayer[i].ecommerce && window.dataLayer[i].ecommerce.detail || {}).products) {
                    return window.dataLayer[i].ecommerce.detail.products;
                }
            }
        }
    };

    const iwbProductHeaders = ['IWB', 'INSIDE', 'CONCEALED'];
    const owbProductHeaders = ['OWB', 'OUTSIDE THE WAISTBAND'];
    const beltProductHeaders = ['BELTS'];
    const mountProductHeaders = ['MOUNT'];
    const magCarrierProductHeaders = ['MAGAZINE', 'MAG'];
    const accessoryProductHeaders = ['ACCESSORIES'];
    const apparelProductHeaders = ['APPAREL'];
    const closeoutProductHeaders = ['CLOSEOUT'];
    // Determine a product type based on a given selector or product datalayer.
    const resolveProductType = (selector) => {

        let object;
        if (selector) {
            object = Evergage.resolvers.fromSelector(selector)().toUpperCase();
        }
        
        const category = getProductsFromDataLayer() ? getProductsFromDataLayer()[0].category.toUpperCase() : null;
        if (!category &&
            !object) {
            return 'OTHER';
        }

        if (category && iwbProductHeaders.some((type) => category.includes(type)) || 
            object && iwbProductHeaders.some((type) => object.includes(type))) {
            return 'IWB';
        } else if (category && owbProductHeaders.some((type) => category.includes(type)) || 
            object && owbProductHeaders.some((type) => object.includes(type))) {
            return 'OWB';
        } else if (category && beltProductHeaders.some((type) => category.includes(type)) || 
            object && beltProductHeaders.some((type) => object.includes(type))) {
            return 'BELTS';
        } else if (category && accessoryProductHeaders.some((type) => category.includes(type)) || 
            object && accessoryProductHeaders.some((type) => object.includes(type))) {
            return 'ACCESSORIES';
        }  else if (category && magCarrierProductHeaders.some((type) => category.includes(type)) || 
            object && magCarrierProductHeaders.some((type) => object.includes(type))) {
            return 'MAG CARRIERS';
        } else if (category && apparelProductHeaders.some((type) => category.includes(type)) || 
            object && apparelProductHeaders.some((type) => object.includes(type))) {
            return 'APPAREL';
        } else {
            return 'OTHER';
        }
    };

    const config = {
        global: {
            locale: buildLocale(),
            contentZones: [
                {  }
            ],
            listeners: [
                Evergage.listener('click', '.nm-menu-cart-title', (event) => {
                    Evergage.sendEvent({
                        itemAction: Evergage.ItemAction.ViewCart,
                        catalog: {
                            Product: {
                                lineItems: {
                                    id: Evergage.resolvers.fromSelectorMultiple(".nm-cart-panel-product-title"),
                                    price: Evergage.resolvers.fromSelectorMultiple('.woocommerce-Price-amount amount',
                                                    (currency) => sanitizeCurrencyString(currency)),
                                    quantity: [1]
                                }
                            }
                        }
                    });
                }),
                Evergage.listener('click', '#search-holster-finder', (event) => {
                    const $div = Evergage.cashDom(event.currentTarget).parent().parent().parent();
                    const dims = {
                        manufacturer: $div.find('input[vsn-bind="holster_finder.manufacturer"]').val().toUpperCase(),
                        model: $div.find('input[vsn-bind="holster_finder.model"]').val().toUpperCase(),
                        light: $div.find('input[vsn-bind="holster_finder.light_and_laser"]').val().toUpperCase(),
                    };

                    if (dims && dims.manufacturer) {
                        Evergage.sendEvent({
                            action: "Holster Finder Search | Manufacturer",
                            itemAction: Evergage.ItemAction.ViewItem,
                            catalog: {
                                Manufacturer: {
                                    _id: dims.manufacturer,
                                    name: dims.manufacturer
                                }
                            }
                        });
                    }

                    if (dims && dims.model) {
                        Evergage.sendEvent({
                            action: "Holster Finder Search | Model",
                            itemAction: Evergage.ItemAction.ViewItem,
                            catalog: {
                                Model: {
                                    _id: dims.model,
                                    name: dims.model
                                }
                            }
                        });
                    }

                    if (dims && dims.light) {
                        Evergage.sendEvent({
                            action: "Holster Finder Search | Light",
                            itemAction: Evergage.ItemAction.ViewItem,
                            catalog: {
                                Light: {
                                    _id: dims.light,
                                    name: dims.light
                                }
                            }
                        });
                    }
                })
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
                    return /^\/$/.test(window.location.pathname);
                },
                contentZones: [
                    { name: "home_hero", selector: '.slider' },
                    { name: "home_rec", selector: ".product-slider"},
                ],
                listeners: [ ]
            },
            {
                name: 'create_account',
                isMatch: () => {
                    return Evergage.cashDom("meta[name='title']").attr("content") === 'Create New Customer Account';
                },
                listeners: [
                    Evergage.listener("submit", "#form-validate", (event) => {
                        const $form = Evergage.cashDom(event.target);
                        let user = {
                            email: $form.find('#email_address').val(),
                            fName: $form.find('#firstname').val(),
                            lName: $form.find('#lastname').val()
                        };
                        
                        Evergage.sendEvent({
                            action: "Account Created",
                            user: {
                                id: user.email,
                                userId: user.email,
                                userName: user.email,
                                attributes: {
                                    webId: user.email,
                                    emailAddress: user.email,
                                    firstName: user.fName,
                                    lastName: user.lName
                                }
                            }
                        });
                    }),
                ]
            },
            {
                name: 'edit_account',
                isMatch: () => {
                    return window.location.href.includes('/customer/account/edit');
                },
                onActionEvent: (actionEvent) => {
                    const visitorInfo = getVisitorInfoFromDataLayer();
                    let id = undefined;
                    if (visitorInfo) {
                        id = visitorInfo.visitorId ? visitorInfo.visitorId : null;
                    }
                    const $customerTagging = Evergage.cashDom('#nosto_customer_tagging');
                    const email = $customerTagging.find('.email').text();
                    const fName = $customerTagging.find('.first_name').text();
                    const lName = $customerTagging.find('.last_name').text();

                    actionEvent.user = actionEvent.user || {};
                    actionEvent.user.attributes = actionEvent.user.attributes || {};
                    actionEvent.user.attributes.customerId = id || {};
                    actionEvent.user.attributes.emailAddress = email || {};
                    actionEvent.user.attributes.firstName = fName || {};
                    actionEvent.user.attributes.lastName = lName || {};
                    return actionEvent;
                },
                listeners: [
                    Evergage.listener("submit", ".form-edit-account", () => {
                        const user = {
                            email: Evergage.cashDom('#email').val(),
                            fName: Evergage.cashDom('#firstname').val(),
                            lName:  Evergage.cashDom('#lastname').val()
                        };
                        Evergage.sendEvent({
                            action: "Account Created",
                            user: {
                                id: user.email,
                                userId: user.email,
                                userName: user.email,
                                attributes: {
                                    webId: user.email,
                                    emailAddress: user.email,
                                    firstName: user.fName || {},
                                    lastName: user.lName || {}
                                }
                            }
                        });
                    })
                ]
            },
            {
                name: 'account',
                isMatch: () => {
                    return window.location.href.includes('/customer/account/');
                },
                onActionEvent: (actionEvent) => {
                    const $customerTagging = Evergage.cashDom('#nosto_customer_tagging');
                    const user = {
                        id: () => {
                            const visitorInfo = getVisitorInfoFromDataLayer();
                            if (visitorInfo) {
                                return visitorInfo.visitorId !== undefined ? visitorInfo.visitorId : null;
                            }
                        },
                        email: $customerTagging.find('.email').text(),
                        fName: $customerTagging.find('.first_name').text(),
                        lName: $customerTagging.find('.last_name').text()
                    };

                    if (user.id && user.email) {
                        actionEvent.user = actionEvent.user || {};
                        actionEvent.user.attributes = actionEvent.user.attributes || {};
                        actionEvent.user.attributes.customerId = user.id;
                        actionEvent.user.attributes.emailAddress = user.email;
                        actionEvent.user.attributes.firstName = user.fName || {};
                        actionEvent.user.attributes.lastName = user.lName || {};
                    }
                    return actionEvent;
                }
            },
            {
                name: "category",
                action: "Product | View Category",
                isMatch: () => {
                    return Evergage.cashDom('.category-description').length > 0;
                },
                catalog: {
                    Category: {
                        _id: () => {
                            const productType = resolveProductType('.category-description h1');
                            return `HOME|${productType}`;
                        }
                    }
                }
            },
            {
                name: 'product_detail',
                action: 'Product | View Detail',
                isMatch: () => {
                    return getPageType() === 'product';
                },
                catalog: {
                    Product: {
                        _id: getProductsFromDataLayer() ? getProductsFromDataLayer()[0].id : 'UNDEFINED',
                        url: Evergage.resolvers.fromHref(),
                        name: Evergage.cashDom('.product h1').text().trim(),
                        imageUrl: Evergage.resolvers.fromMeta('og:image'),
                        inventoryCount: 1,
                        currency: getCurrencyCode(),
                        price: getPrice(),
                        listPrice: getSalePrice(), 
                        sku: {
                            _id: getProductsFromDataLayer() ? getProductsFromDataLayer()[0].id : ''
                        },
                        categories: () => {
                            const subCategory = resolveProductType();
                            return [`HOME|${subCategory}`];
                        },
                        relatedCatalogObjects: {
                            Type: [resolveProductType('.product h1')]
                        }
                    }
                },
                listeners: [
                    Evergage.listener("submit", "#product_addtocart_form", (event) => {
                        let lineItem = Evergage.util.buildLineItemFromPageState("#qty", '[data-price-type="finalPrice"] .price');
                        lineItem.sku = { 
                            _id: getProductsFromDataLayer() ? getProductsFromDataLayer()[0].id : 'UNDEFINED'
                        };

                        if (!lineItem.quantity) {
                            lineItem.quantity = 1;
                        }

                        Evergage.sendEvent({
                            action: "Product | Add to Cart",
                            itemAction: Evergage.ItemAction.AddToCart,
                            cart: {
                                singleLine: {
                                    Product: lineItem,
                                }
                            }
                        });
                    }),
                ],
                contentZones: [
                    {name: "product_detail_recs_row_1", selector: ".promoted-products"},
                    {name: "product_detail_recs_row_2", selector: "#nosto-page-product3"},
                    {name: "product_detail_recs_row_3", selector: ".yotpo-main-widget"},
                    {name: "product_detail_recs_row_4", selector: ".upsell"}
                ]
            },
            {
                name: 'blog',
                action: 'Blog | View',
                isMatch: () => window.location.href.includes('/blog')
            },
            {
                name: 'cart',
                action: 'Cart | View Cart',
                isMatch: () => window.location.href.includes('/checkout/cart')
            },
            {
                name: 'order_confirmation',
                action: 'Purchase | Order Confirmation',
                itemAction: Evergage.ItemAction.Purchase,
                isMatch: isOrderConfirmationPage,
                catalog: {
                    Product: {
                        orderId: () => {
                            let order;
                            for (let i = 0; i < _AvantMetrics.length; i++) {
                                if (_AvantMetrics && _AvantMetrics[i]
                                    && _AvantMetrics[i][0].toUpperCase() === 'ORDER') {
                                    order = _AvantMetrics[i][1];
                                    break;
                                }
                            }
                            return order.order_id;
                        },
                        totalValue: () => {
                            let items = getOrderedItems();
                            let total = 0;
                            items.forEach(item => {
                                if (item && item.price) {
                                    total += item.price;
                                }
                            })
                            return total;
                        },
                        currency: 'USD',
                        lineItems: {
                            _id: () => {
                                let skus = [];
                                let items = getOrderedItems();
                                items.forEach(item => {
                                    if (item && item.parent_sku) {
                                        const sku = item.parent_sku;
                                        if (sku) {
                                            skus.push(sku.toUpperCase());
                                        }
                                    }
                                })
                                return skus;
                            },
                            sku: () => {
                                let skus = [];
                                let items = getOrderedItems();
                                if(items) {
                                    items.forEach(item => {
                                        if (item && item.parent_sku) {
                                            const sku = {
                                                _id: item.parent_sku.toUpperCase()
                                            }
                                            if (sku) {
                                                skus.push(sku);
                                            }
                                        }
                                    })
                                    return skus;
                                } else {
                                    return null;
                                }
                            },
                            price: () => {
                                let prices = [];
                                let items = getOrderedItems();
                                if(items) {
                                    items.forEach(item => {
                                        if (item && item.price) {
                                            const price = item.price;
                                            if (price) {
                                                prices.push(price);
                                            }
                                        }
                                    })
                                    return prices;
                                } else {
                                    return null;
                                }
                            },
                            quantity: () => {
                                let qtys = [];
                                let items = getOrderedItems();
                                if(items) {
                                    items.forEach(item => {
                                        if (item && item.qty) {
                                            const qty = item.qty;
                                            if (qty) {
                                                qtys.push(qty);
                                            }
                                        }
                                    })
                                    return qtys;
                                } else {
                                    return null;
                                }
                            }
                        }
                    }
                }
            }
        ]
    };
    
    Evergage.initSitemap(config);
});