Evergage.init({
    cookieDomain: 'cubii.com'
}).then(() => {
    const config = {
        global: {
            contentZones: [
                { name: 'global_popup' }
            ],
            listeners: [
                Evergage.listener('submit', ".form.subscribe", () => {
                    
                    const email = Evergage.cashDom("#newsletter").val();
                    if (email) {
                        Evergage.sendEvent({
                            action: "Email Sign Up - Footer",
                            user: {
                                attributes: {
                                    emailAddress: email,
                                }
                            }
                        });
                    }
                }),
                Evergage.listener('submit', "form.create.account", (e) => {
                    const $form = Evergage.cashDom(e.target);

                    const email = $form.find("#email_address").val();
                    const firstname = $form.find('#firstname').val();
                    const lastname = $form.find('#lastname').val();
                    if (email) {
                        Evergage.sendEvent({
                            action: "Account Creation",
                            user: {
                                attributes: {
                                    emailAddress: email,
                                    firstName: firstname,
                                    lastName: lastname,
                                    name: `${firstname} ${lastname}`
                                }
                            }
                        });
                    }
                })
            ]
        },
        pageTypeDefault: {
            name: 'default'
        },
        pageTypes: [
            {
                name: "create_account",
                isMatch: () => /\/account\/create/.test(window.location.href),
                action: 'Account Creation Page'
            },
            {
                name: "checkout",
                isMatch: () => /\/checkout\/$/.test(window.location.href),
                action: 'Checkout',
                listeners: [
                    Evergage.listener('click', '.action.primary.checkout', () => {
                        console.log('submitted');

                        const $form = Evergage.cashDom('#co-shipping-form');

                        const firstName = $form.find('input[name=firstname]').val();
                        const lastName = $form.find('input[name=lastname]').val();
                        const emailAddress = Evergage.cashDom('.amcheckout-form-login input[type=email]').val();
                        const phoneNumber = $form.find('input[name=telephone]').val();


                        Evergage.sendEvent({
                            action: "Checkout - Shipping and Contact Info",
                            user: {
                                attributes: {
                                    emailAddress: emailAddress,
                                    firstName: firstName,
                                    lastName: lastName,
                                    phoneNumber: phoneNumber
                                }
                            }
                        });
                    })
                ]
            },
            {
                name: "order_confirmation",
                isMatch: () => {
                    return Evergage.util.resolveWhenTrue.bind(() => {
                        const pageInfo = getPageInfoFromDataLayer();
                        if (!pageInfo) {
                            // we can't pull the page data yet
                            return false;
                        }

                        return pageInfo.pageType == 'purchase';

                    });
                },
                itemAction: Evergage.ItemAction.Purchase,
                catalog: {
                    Product: {
                        orderId: () => {
                            const pageInfo = getPageInfoFromDataLayer();
                            return pageInfo.wp_order_id;
                        },
                        currency: 'USD',
                        totalValue: () => {
                            const pageInfo = getPageInfoFromDataLayer();
                            return pageInfo.ecommerce.purchase.actionField.revenue;
                        },
                        lineItems: {
                            sku: () => {
                                const pageInfo = getPageInfoFromDataLayer();
                                const products = pageInfo.ecommerce.purchase.products;
                                return products.map(product => { return product.id.replace(' ', '') } );
                            },
                            price:  () => {
                                const pageInfo = getPageInfoFromDataLayer();
                                const products = pageInfo.ecommerce.purchase.products;
                                return products.map(product => { return product.price } );
                            },
                            quantity:  () => {
                                const pageInfo = getPageInfoFromDataLayer();
                                const products = pageInfo.ecommerce.purchase.products;
                                return products.map(product => { return product.quantity } );
                            }
                        }
                    }
                }
            },
            {
                name: "cart",
                isMatch: () => /\/cart/.test(window.location.href),
                itemAction: Evergage.ItemAction.ViewCart,
                catalog: {
                    Product: {
                        lineItems: {
                            _id: () => {
                                
                                return Evergage.resolvers.fromSelectorAttributeMultiple(".product-info .product-details .line-item-quanity-info", "data-pid")
                            },
                            price: () => {
                                return Evergage.resolvers.fromSelectorMultiple('.item-info .col.price .price');
                            },
                            quantity: () => {
                                return Evergage.resolvers.fromSelectorAttributeMultiple('.item-info .col.qty input', 'value');
                            },
                        }
                    }
                }
            },
            {
                name: 'product_detail',
                itemAction: Evergage.ItemAction.ViewItemDetail,
                isMatch: () => {
                    return Evergage.cashDom('body.catalog-product-view').length > 0;
                },
                onActionEvent: (actionEvent) => {
                   
                    // if the item is out of stock, we'll swap out the item action to
                    // an out of stock event
                    if (Evergage.cashDom('.stock.unavailable').length) {
                        actionEvent.itemAction = Evergage.ItemAction.ViewItemOutOfStock;
                    }
                    return actionEvent;
                },
                listeners: [
                    Evergage.listener('submit', '#product_addtocart_form', () => {
                        let productId = Evergage.resolvers.fromSelectorAttribute('.price-final_price', 'data-product-id')();
                        const productPrice = fixPrice(Evergage.resolvers.fromSelector('.price-final_price .price')());

                        // if (Evergage.resolvers.fromSelector('.product-options-wrapper select')().length) {
                        //     const productOption = Evergage.cashDom('.product-options-wrapper select').val();
                        //     productId = productOption;
                        // }
                        // if (Evergage.resolvers.fromSelector('.swatch-attribute.color')().length) {
                        //     const colorOption = Evergage.resolvers.fromSelectorAttribute('.swatch-option.color.selected', 'data-option-id')();
                        //     productId = colorOption;
                        // }

                        if (Evergage.resolvers.fromSelector('.studioplus-radio')().length) {
                            const plusOption = Evergage.resolvers.fromSelectorAttribute('.product-custom-option:checked', 'value')();
                            if (plusOption) {
                                // they've selected an option for studio+
                                // we are just going to fire another add to cart event
                                // since it only supports a single product at a time
                                // 1 - monthly
                                // 2 - annual
                                Evergage.sendEvent({
                                    itemAction: Evergage.ItemAction.AddToCart,
                                    cart: {
                                        singleLine: {
                                            Product: {
                                                quantity: 1,
                                                _id: 148,
                                                price: (plusOption == 1) ? 7.99 : 74.99,
                                                sku: { _id: 148 }
                                            }
                                        }
                                    }
                                });
                            }

                        }

                        // this is if we have a product that requires an option
                        // but one hasn't been selected
                        if (!productId) {
                            return;
                        }
                        const lineItem = {
                            quantity: 1,
                            _id: productId,
                            price: productPrice 
                        }
                        lineItem.sku = { _id: productId };
                        Evergage.sendEvent({
                            itemAction: Evergage.ItemAction.AddToCart,
                            cart: {
                                singleLine: {
                                    Product: lineItem
                                }
                            }
                        });
                    })
                ],
                catalog: {
                    Product: {
                        _id: () => Evergage.resolvers.fromSelectorAttribute('.price-final_price', 'data-product-id'),
                        name: () => {
                            const itemProp = Evergage.resolvers.fromItemProp('name')();
                            const pageTitle = Evergage.resolvers.fromSelector('.page-title span')();

                            return (itemProp) ? itemProp : pageTitle;
                        },
                        url: Evergage.resolvers.fromHref(),
                        imageUrl: () => {
                            return Evergage.resolvers.fromMeta('og:image')();
                        },
                        inventoryCount: () => (Evergage.cashDom('.stock.unavailable').length) ? 0 : 1,
                        price: () => {
                            const oldPrice = fixPrice(Evergage.cashDom('[data-price-type=oldPrice] .price').text());
                            const finalPrice = Evergage.resolvers.fromItemProp('price')();

                            if (oldPrice.length) {
                                return oldPrice;
                            }
                            return finalPrice;
                        },
                        categories: () => {
                            return Evergage.util.resolveWhenTrue.bind(() => {
                                const products = getProductsFromDataLayer() || [];
                                if (!products.length) {
                                    // we can't pull category ID
                                    return false;
                                }

                                const categories = products[0].category.split('/');
                                categories.shift();
                                let category = '';

                                for (let i = 0; i < categories.length; i++) {
                                    if (category) {
                                        category += '|';
                                    }
                                    category += categories[i];
                                }
                                return [category];
                            }); 
                        },
                        relatedCatalogObjects: {
                            ProductType: () => {
                                return Evergage.util.resolveWhenTrue.bind(() => {
                                    const products = getProductsFromDataLayer() || [];
                                    if (!products.length) {
                                        // we can't pull product type
                                        return false;
                                    }

                                    const productTypes = [];

                                    const categories = products[0].category.split('/');

                                    productTypes.push(categories.pop().toUpperCase());
                                    
                                    if (/Cubii Pro/.test(products[0].name)) {
                                        productTypes.push('CONNECTED');
                                    }
                                    
                                    return productTypes;
                                }); 
                                
                            }
                        }
                    }
                }
            },
            {
                name: 'category',
                action: 'View Category',
                isMatch: () => {
                    const pageInfo = getPageInfoFromDataLayer();
                    return pageInfo && pageInfo.pageType == 'category';
                },
                listeners: [
                    Evergage.listener('submit', '[data-role=tocart-form]', (e) => {
                        let productId = Evergage.cashDom('[name=product]', e.target).val();
                        const productPrice = fixPrice(Evergage.cashDom('#product-price-' + productId + ' .price').text());
                        if (productId == 137 || productId == 148) {
                            // you can't add these from category page, you have to view details
                            // would be better to know this programmatically
                            return;
                        }

                        // now that we have a productId, we need to determine if there's
                        // color choices
                        // if there are and one is selected, trigger the event
                        // if there are and none are selected, don't do anything
                        // because the page will redirect to product_details

                        const colorCheck = Evergage.cashDom('.swatch-opt-' + productId + ' .swatch-option.color');

                        if (colorCheck.length) {
                            const colorOption = Evergage.resolvers.fromSelectorAttribute('.swatch-opt-' + productId + ' .swatch-option.color.selected', 'data-option-id')();

                            if (!colorOption) {
                                return;
                            }

                        }
                        
                        const lineItem = {
                            quantity: 1,
                            _id: productId,
                            price: productPrice
                        }
                        lineItem.sku = { _id: productId.replace(' ', '') };
                        Evergage.sendEvent({
                            itemAction: Evergage.ItemAction.AddToCart,
                            cart: {
                                singleLine: {
                                    Product: lineItem
                                }
                            }
                        });
                    })
                ],
                catalog: {
                    Category: {
                        _id: () => {
                            const pageInfo = getPageInfoFromDataLayer();
                            const category = pageInfo.eventLabel.split('/').pop();
                            return category;
                        },
                        name: () => {
                            return Evergage.resolvers.fromSelector('.section-header__title')();
                        },
                        url: Evergage.resolvers.fromHref(),
                        categories: () => {
                            return Evergage.util.resolveWhenTrue.bind(() => {
                                const pageInfo = getPageInfoFromDataLayer() || [];
                                if (!pageInfo.length) {
                                    // we can't pull category ID
                                    return false;
                                }

                                const categories = pageInfo.google_tag_params.ecomm_category.split('/');

                                let category = '';

                                for (let i = 0; i < categories.length; i++) {
                                    if (category) {
                                        category += '|';
                                    }
                                    category += categories[i];
                                }
                                return [category];
                            }); 
                        }
                    },
                    relatedCatalogObjects: {
                        ProductType: () => {
                            const productTypes = [];

                            const pageInfo = getPageInfoFromDataLayer() || [];

                            const category = pageInfo.eventLabel.split('/').pop();
                            

                            productTypes.push(category.toUpperCase());
                            
                            return productTypes;
                        }
                    }
                }
            },
            {
                name: 'login',
                isMatch: () => /\/account\/login/.test(window.location.href)
            },
            {
                name: 'account',
                isMatch: () => {
                    return Evergage.cashDom('body.customer-account-index').length > 0
                },
                onActionEvent: (actionEvent) => {
                    const accountInfo = Evergage.cashDom('.box-content').eq(0).find('p').text().trim();

                    const splitInfo = accountInfo.split('\n');

                    const name = splitInfo[0];
                    const email = splitInfo[1].trim();


                    if (name && email) {
                        actionEvent.user = actionEvent.user || {};
                        actionEvent.user.attributes = actionEvent.user.attributes || {};
                        actionEvent.user.attributes.emailAddress = email;
                        actionEvent.user.attributes.name = name;
                    };
                    return actionEvent;
                }
            },
            {
                name: 'home',
                action: 'Homepage',
                isMatch: () => {
                    return Evergage.cashDom("body.cms-index-index").length > 0
                },
                contentZones: [
                    { name: 'home_hero', selector: '.hero.media' },
                    { namE: 'home-content-bottom', selector: '.home-content-bottom' }
                ]
            }

        ]
    };

    const getPageInfoFromDataLayer = () => {
        if (window.dataLayer) {
            for (let i = 0; i < window.dataLayer.length; i++) {
                if (window.dataLayer[i].pageType && window.dataLayer[i].pageName) {
                    return window.dataLayer[i];
                }
            }
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

    const fixPrice = (price) => {
        if (price.indexOf('$') !== -1) {
            return price.substring(price.indexOf('$') + 1);
        }
        return price;
    }

    Evergage.initSitemap(config);

});