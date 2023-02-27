Evergage.init({
    cookieDomain: 'n8tactical.com',
}).then(() => {

    // Attempts to get a price from the JsonLd.
    const getPriceFromJsonLd = () => {
        const jsonLd = Evergage.resolvers.fromJsonLd('@graph')();
        for (let i = 0; i < jsonLd.length; i++) {
            const elementType = jsonLd[i]['@type'];
            if (elementType === 'Product') {
                const price = jsonLd[i].offers.price;
                return price;
            }
        }
        return null;
    };

    // Retrieve product sku / id from a product page.
    const getSkuOnProductPage = () => {
        let sku = Evergage.resolvers.fromSelectorAttribute('#nm-product-meta .sku_wrapper .sku', 'data-o_content')();
        if (sku &&
            sku != 'N/A') {
            return sku.toUpperCase();
        }

        sku = Evergage.resolvers.fromSelector('#nm-product-meta .sku_wrapper .sku')()
        if (sku &&
            sku != 'N/A') {
            return sku.toUpperCase();
        }

        // Scrapes data to find SKU information when viewing a product page.
        const jsonData = Evergage.cashDom('#nm-variations-form').attr('data-product_variations');
        if (jsonData) {
            sku = JSON.parse(jsonData)[0].sku;
            if (sku &&
                sku != 'N/A') {
                return sku;
            }
        }
        return 'N/A';
    }

    // Remove any query parameters from a provided url and return base path url.
    // Commonly used on imageUrl since query params will not decode in IS.
    const getBaseUrl = (url) => {
        if (url) {
            const newUrl = url.split("?")[0];
            return newUrl;
        }
        return null;
    }

    // Return a locale
    const buildLocale = () => {
        const locale = Evergage.cashDom("meta[property='og:locale']").attr("content");
        return locale;
    };

    // Arrays to assist in determining product types based on a passed selector.
    const iwbProductHeaders = ['IWB', 'INSIDE THE WAISTBAND', 'CONCEALED CARRY','XECUTIVE HOLSTER'];
    const owbProductHeaders = ['OWB', 'OUTSIDE THE WAISTBAND'];
    const mountProductHeaders = ['MOUNT'];
    const accessoryProductHeaders = ['ACCESSORIES'];
    const apparelProductHeaders = ['APPAREL'];
    const closeoutProductHeaders = ['CLOSEOUT'];
    const resolveProductType = (selector) => {
        // Use the object passed through by our user to verify...
        const object = Evergage.resolvers.fromSelector(selector)().toUpperCase();
        // But also check the breadcrumb in case it's not found in the user provided field.
        const breadcrumb = Evergage.resolvers.fromSelector('#nm-breadcrumb')().toUpperCase();
        if (iwbProductHeaders.some((type) => object.includes(type) || 
            breadcrumb.includes(type))) {
            return ['IWB'];
        } else if (owbProductHeaders.some((type) => object.includes(type) || 
            breadcrumb.includes(type))) {
            return ['OWB'];
        } else if (mountProductHeaders.some((type) => object.includes(type) || 
            breadcrumb.includes(type))) {
            return ['MOUNT'];
        } else if (accessoryProductHeaders.some((type) => object.includes(type) || 
            breadcrumb.includes(type))) {
            return ['ACCESSORIES'];
        } else if (apparelProductHeaders.some((type) => object.includes(type) || 
            breadcrumb.includes(type))) {
            return ['APPAREL'];
        } else if (closeoutProductHeaders.some((type) => object.includes(type) || 
            breadcrumb.includes(type))) {
            return ['CLOSEOUT'];
        }
        return ['OTHER'];
    };
    
    // Remove any non-numeric values from a given value.
    const replaceNonNumericValues = (value) => {
        if (value) {
            const result = value.replace(/[^0-9\.-]+/g,"");
            return result;
        }
        return null;
    };

    // Remove any non-numeric values from every element in an array.
    const replaceNonNumericArray = (arr) => {
        let arr2 = [];
        for (let i = 0; i < arr.length; i++) {
            if (arr[i]) {
                const result = arr[i].replace(/[^0-9\.-]+/g,"");
                arr2.push(result);
            }
        }
        return arr2;
    };

    // BEGIN SITEMAP
    const config = {
        global: {
            locale: buildLocale(),
            contentZones: [
                { name: "global_popup", selector: "body" }
            ],
            onActionEvent: (actionEvent) => {
                console.log(actionEvent);
                return actionEvent;
            }
        },
        pageTypeDefault: {
            name: "default"
        },
        pageTypes: [
            {
                name: 'home',
                action: 'Homepage | View Homepage',
                itemAction: 'View Homepage',
                isMatch: () => {
                    return Evergage.cashDom('body.home').length > 0;
                },
                contentZones: [
                    { name: "home_rec_row_1", selector: ".nm-products" },
                    { name: "home_hero", selector: ".nm-banner-slider .slick-list .slick-slide[data-slick-index=\"0\"]" }
                ],
                listeners: [
                    Evergage.listener("submit", "#mc-embedded-subscribe-form", (event) => {
                        const $form = Evergage.cashDom(event.currentTarget);
                        const user = {
                            email: $form.find("#mce-EMAIL").val()
                        };
                        Evergage.sendEvent({
                            action: "Home | Email Subscribe",
                            user: {
                                id: user.email,
                                attributes: {
                                    emailAddress: user.email,
                                    locale: buildLocale(),
                                }
                            }
                        });
                    }),
                    Evergage.listener('change', '#hf-manufacturer', (event) => {
                        const $object = Evergage.cashDom(event.currentTarget);
                        const manufacturer = $object.val();
                        if (manufacturer) {
                            Evergage.sendEvent({
                                action: "Home | HF Search | Manufacturer",
                                itemAction: Evergage.ItemAction.ViewItem,
                                catalog: {
                                    Manufacturer: {
                                        _id: manufacturer.toUpperCase(),
                                        name: manufacturer.toUpperCase()
                                    }
                                }
                            });
                        }
                    }),
                    Evergage.listener('change', '#hf-model', (event) => {
                        const $object = Evergage.cashDom(event.currentTarget);
                        const model = $object.val();
                        if (model) {
                            Evergage.sendEvent({
                                action: "Home | HF Search | Model",
                                itemAction: Evergage.ItemAction.ViewItem,
                                catalog: {
                                    Model: {
                                        _id: model.toUpperCase(),
                                        name: model.toUpperCase()
                                    }
                                }
                            });   
                        }
                    }),
                    Evergage.listener('change', '#hf-light', (event) => {
                        const $object = Evergage.cashDom(event.currentTarget);
                        const light = $object.val();
                        if (light) {
                            Evergage.sendEvent({
                                action: "Home | HF Search | Light",
                                itemAction: Evergage.ItemAction.ViewItem,
                                catalog: {
                                    Light: {
                                        _id: light.toUpperCase(),
                                        name: light.toUpperCase()
                                    }
                                }
                            });
                        }
                    })
                ]
            },
            {
                name: 'cart',
                action: 'Cart | View Cart',
                isMatch: () => { 
                    return window.location.href.includes('/cart');
                }
            },
            {
                name: 'edit_account',
                action: 'Account | View Edit Account',
                itemAction: 'View Edit Account',
                isMatch: () => {
                    return window.location.href.includes('/my-account/edit-account');
                },
                onActionEvent: (actionEvent) => {
                    const $form = Evergage.cashDom('.edit-account');
                    const user = {
                        id: $form.find('#account_display_name').val(),
                        email: $form.find("#account_email").val(),
                        firstName: $form.find("#account_first_name").val(),
                        lastName: $form.find("#account_last_name").val()
                    };

                    if (user.id 
                        && user.email) {
                        actionEvent.user = actionEvent.user || {};
                        actionEvent.user.attributes = actionEvent.user.attributes || {};
                        actionEvent.user.attributes.customerId = user.id;
                        actionEvent.user.attributes.emailAddress = user.email;
                        actionEvent.user.attributes.firstName = user.firstName;
                        actionEvent.user.attributes.lastName = user.lastName;
                    }
                    return actionEvent;
                },
                listeners: [
                    Evergage.listener("submit", ".woocommerce-EditAccountForm", (event) => {
                        const $form = Evergage.cashDom(event.currentTarget);
                        const user = {
                            id: $form.find('#account_display_name').val(),
                            email: $form.find("#account_email").val(),
                            firstName: $form.find("#account_first_name").val(),
                            lastName: $form.find("#account_last_name").val(),
                            locale: buildLocale(),
                        };

                        Evergage.sendEvent({
                            action: "Account | Edit Account",
                            user: {
                                id: user.id,
                                attributes: {
                                    customerId: user.id,
                                    emailAddress: user.email,
                                    firstName: user.firstName,
                                    lastName: user.lastName,
                                    locale: user.locale
                                }
                            }
                        });
                    })
                ]
            },
            {
                name: 'account',
                action: 'Account | View Account',
                itemAction: 'View Account',
                isMatch: () => {
                    return window.location.href.includes('/my-account');
                },
                onActionEvent: (actionEvent) => {
                    const id = Evergage.cashDom(".nm-username").eq(0).find('strong').text().trim();
                    if (id) {
                        actionEvent.user = actionEvent.user || {};
                        actionEvent.user.attributes = actionEvent.user.attributes || {};
                        actionEvent.user.attributes.customerId = id;
                        actionEvent.user.attributes.webId = id;
                        actionEvent.user.attributes.locale = buildLocale();
                    }
                    return actionEvent;
                }
            },
            {
                name: 'product',
                action: 'Product | View Item',
                itemAction: Evergage.ItemAction.ViewItem,
                isMatch: () => {
                    return Evergage.cashDom('body.product-template-default').length > 0;
                },
                catalog: {
                    Product: {
                        _id: getSkuOnProductPage,
                        url: () => {
                            return getBaseUrl(window.location.href);
                        },
                        name: Evergage.resolvers.fromSelector('.product_title'),
                        description: Evergage.resolvers.fromSelector('.product_title'),
                        imageUrl: () => {
                            return getBaseUrl(Evergage.resolvers.fromSelectorAttribute('.wp-post-image', 'src')());
                        },
                        inventoryCount: () => {
                            return 1;
                        },
                        price: () => { 
                            let price = replaceNonNumericValues(Evergage.cashDom('.woocommerce-Price-amount bdi').text());
                            if (price) {
                                return price;
                            }

                            price = replaceNonNumericValues(Evergage.cashDom('.woocommerce-Price-amount bdi').text());
                            if (price) {
                                return price;
                            }
                            
                            // Use JsonLd last because price isn't reflected correctly when on sale.
                            price = getPriceFromJsonLd();

                            return price;
                        },
                        currency: () => {
                            return 'USD';
                        },
                        listPrice: () => {
                            // If there isn't a sale price on this item, populate with standard price amount.
                            return Evergage.resolvers.fromSelector('.nm-single-product-showcase ins .woocommerce-Price-amount', 
                                (currency) => replaceNonNumericValues(currency))() ||
                                Evergage.resolvers.fromSelector('.woocommerce-Price-amount', 
                                    (currency) => replaceNonNumericValues(currency))();
                        },
                        sku: {
                           _id: getSkuOnProductPage()
                        },
                        categories: () => {
                            return [`HOME|${resolveProductType('.product_title')}`];
                        },
                        relatedCatalogObjects: {
                            Type: resolveProductType('.product_title'),
                        }
                    }
                },
                listeners: [
                    Evergage.listener("click", '#nm-variations-form button[type="submit"]', (event) => {
                        //const objectName = `#${Evergage.cashDom(event.currentTarget).parent().parent().parent()[0].id}`;
                        let lineItem = Evergage.util.buildLineItemFromPageState(".qty", "ins .woocommerce-Price-amount");
                        lineItem.sku = { 
                            _id: Evergage.resolvers.fromSelector('#nm-product-meta .sku_wrapper .sku', (val) => { return val.toUpperCase() })()
                        };

                        Evergage.sendEvent({
                            action: "Product | Add to Cart",
                            itemAction: Evergage.ItemAction.AddToCart,
                            cart: {
                                singleLine: {
                                    Product: lineItem,
                                }
                            }
                        });
                    })
                ],
                contentZones: [
                    {name: "add_to_cart_modal_recs", selector: ".wc-pao-addons-container" },
                    {name: "product_detail_recs_row_1", selector: ".nm-products"}
                ]
            },
            {
                name: "category",
                action: 'Category | View Category',
                itemAction: Evergage.ItemAction.ViewCategory,
                isMatch: () => {
                    return Evergage.cashDom('.nm-products').length > 0;
                },
                catalog: {
                    Category: {
                        _id: () => {
                            return  `HOME|${resolveProductType('.wpb_wrapper h1')}`;
                        },
                        url: window.location.href,
                        imageUrl: Evergage.resolvers.fromSelectorAttribute('.nm-header-logo img', 'src'),
                        relatedCatalogObjects: {
                            Type: resolveProductType('.wpb_wrapper h1'),
                        }
                    }
                }
            },
            {
                name: 'billing_info',
                action: 'Billing | View Billing Info',
                actionItem: 'View Billing Info',
                isMatch: () => {
                    return Evergage.cashDom('.woocommerce-billing-fields h3').length > 0; 
                },
                listeners: [
                    Evergage.listener("submit", "form[name='checkout']", (event) => {
                        const $form = Evergage.cashDom(event.currentTarget);
                        const user = {
                            id: $form.find('#account_display_name').val(),
                            email: $form.find("#billing_email").val(),
                            firstName: $form.find("#billing_first_name").val(),
                            lastName: $form.find("#billing_last_name").val(),
                            locale: buildLocale(),
                        };

                        Evergage.sendEvent({
                            action: "Checkout",
                            user: {
                                id: user.id,
                                attributes: {
                                    customerId: user.id,
                                    emailAddress: user.email,
                                    firstName: user.firstName,
                                    lastName: user.lastName,
                                    locale: user.locale,
                                }
                            }
                        });
                    })
                ]
            },
            {
                name: 'order_confirmation',
                action: 'Purchase | Order Confirmation',
                itemAction: Evergage.ItemAction.Purchase,
                isMatch: () => {
                    return window.location.href.includes('/checkout/order-received');
                },
                catalog: {
                    Product: {
                        orderId: () => {
                            return Evergage.DisplayUtils.pageElementLoaded(".order strong", ".woocommerce-thankyou-order-details").then((ele) => {
                                return Evergage.resolvers.fromSelector(".order strong");
                            });
                        },
                        totalValue: () => {
                            return Evergage.DisplayUtils.pageElementLoaded(".amount", ".total").then((ele) => {
                                return Evergage.resolvers.fromSelector(".total .amount", (val) => replaceNonNumericValues(val));
                            });
                        },
                        currency: 'USD',
                        lineItems: {
                            _id: () => {
                                let skus = [];
                                JSON.parse(order.order_items).forEach(item => {
                                    if (item.parent_sku) {
                                        const sku = item.parent_sku;
                                        skus.push(sku);
                                    }
                                })
                                return skus;
                            },
                            sku: () => {
                                let skus = [];
                                JSON.parse(order.order_items).forEach(item => {
                                    if (item.parent_sku) {
                                        const sku = {
                                            _id: item.parent_sku
                                        }
                                        skus.push(sku);
                                    }
                                })
                                return skus;
                            },
                            price: () => {
                                return Evergage.DisplayUtils.pageElementLoaded(".product-total .amount bdi", ".woocommerce-table__line-item").then((ele) => {
                                    return Evergage.resolvers.fromSelectorMultiple(".product-total .amount bdi", (arr) => replaceNonNumericArray(arr));
                                });
                            },
                            quantity: () => {
                                return Evergage.DisplayUtils.pageElementLoaded(".product-quantity", ".woocommerce-table__line-item").then((ele) => {
                                    return Evergage.resolvers.fromSelectorMultiple(".product-quantity", (arr) => replaceNonNumericArray(arr));
                                });
                            }
                        }
                    }
                }
            },
            {
                name: 'contact_us',
                action: 'Contact | Contact Us',
                actionItem: 'Contact Us',
                isMatch: () => {
                    return window.location.href.includes('/contact');
                },
                listeners: [
                    Evergage.listener("submit", ".wpcf7-form", (event) => {
                        const $form = Evergage.cashDom(event.currentTarget);
                        const user = {
                            name: $form.find('input[name="your-name"]').val(),
                            email: $form.find('input[name="your-email"]').val(),
                        };

                        Evergage.sendEvent({
                            action: "Contact | Contact Request",
                            user: {
                                id: user.email,
                                attributes: {
                                    emailAddress: user.email,
                                }
                            }
                        });
                    })
                ]
            }
        ]
    };
    Evergage.initSitemap(config);
});