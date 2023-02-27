/*
ACTION ITEMS TO DISCUSS:
- Product recs can lead to items which have been sold.

KNOWN ISSUES
- N/A
*/

Evergage.init().then(() => {
    // Remove any non-numeric values from a given object.
    const replaceNonNumericValues = (object) => {
        if (object) {
            const result = object.replace(/[^0-9\.-]+/g,"");
            return result;
        }
        return '';
    };

    // Remove any query parameters from a provided url and return base path url.
    const getPathFromUrl = (url) => {
        const newUrl = url.split("?")[0];
        return newUrl;
    };

    // Return all available vehicle data from datalayer.
    // This data isn't currently available for new or bargain vehicles so fallbacks are required.
    const getVehicleFromDataLayer = () => {
        if (window.dataLayer) {
            for (let i = 0; i < window.dataLayer.length; i++) {
                if (window.dataLayer[i] && window.dataLayer[i].vehicles) {
                    if (window.dataLayer[i].vehicles.length > 0) {
                        return window.dataLayer[i].vehicles[0];
                    }
                }
            }
        }
    };

    // Return all page attributes data from datalayer.
    const getPageAttributesFromDataLayer = () => {
        if (window.dataLayer) {
            for (let i = 0; i < window.dataLayer.length; i++) {
                if (window.dataLayer[i] && window.dataLayer[i].page) {
                    if (window.dataLayer[i].page.attributes) {
                        return window.dataLayer[i].page.attributes;
                    }
                }
            }
        }
        return null;
    };

    // Returns a standardized value for all possible drivetrains.
    // New, certified, used, and bargain vehicles use the abbreviated versions.
    // Showrooom vehicles use the fully spelled out versions.
    const getNormalizedDrivetrain = (drivetrain) => {
        if (exists(drivetrain)) {
            if (drivetrain.includes('quattre')) {
                return 'QAWD';
            } else if (drivetrain.includes('four')) {
                return '4WD';
            } else if (drivetrain.includes('all')) {
                return 'AWD';
            } else if (drivetrain.includes('front')) {
                return 'FWD';
            } else if (drivetrain.includes('rear')) {
                return 'RWD';
            } else {
                return drivetrain.toUpperCase();
            }
        }
        return null;
    };

    // Vehicle pages use various nomenclatures for Body style.
    // New and Used, use 'Body/Seating' and Bargain vehicles use 'Body'.
    // Showroom is completely different and requires its own selector.
    const getBodyStyle = () => {
        let bodyDetails = getProductDetails('Body/Seating') || 
      			getProductDetails('Body') || 
      			Evergage.resolvers.fromSelectorAttribute('.vehicle-media', 'data-bodystyle')();
        if (bodyDetails && bodyDetails.length > 0) {
            let body = bodyDetails.split("/")[0];
            return body;
        }
        
        // If other methods have failed, attempt to determine body style from naming nomenclature.
        let name = Evergage.cashDom('.vehicle-title .font-weight-normal span').text().toUpperCase() ||
            Evergage.cashDom(".ddc-page-title").text().toUpperCase();
        if (exists(name)) {
            if (name.includes('SUV')) {
                return 'SUV';
            }
            else if (name.includes('TRUCK')) {
                return 'Truck';    
            }
            else if (name.includes('CAR')) {
                return 'Car';
            }
            else if (name.includes('VAN')) {
                return 'Van';
            }
            else if (name.includes('CROSSOVER')) {
                return 'Crossover';
            }
            else if (name.includes('HATCHBACK')) {
                return 'Hatchback';
            }
        }

        // Nothing was found and no additional fallbacks exist.
        return null;
    };

    // Return the high level category type of the current window location href.
    const getCategoryFromWindow = () => {
        const url = window.location.href;
        if (url.includes('new')) {
            return 'New';
        } else if (url.includes('used')) {
            return 'Used';
        } else if (url.includes('bargain')) {
            return 'Bargain';
        } else if (url.includes('showroom')) {
            return 'Showroom';
        } else if (url.includes('certified')) {
            return 'Certified';
        } else if (url.includes('all-inventory')) {
            return 'Search';
        } else {
            return 'Other';
        }
    };

    // Return a boolean value indicating if a
    // provided value is not null, empty, or undefined.
    const exists = (value) => {
        let exists = false;
        if (value &&
            typeof(value) !== 'undefined' &&
            value !== 'undefined' &&
            value !== null &&
            value !== '') {
            exists = true;
        }
        return exists;
    };

    // On the home page "I'm interested in" search,
    // there is a "vehicle in-stock" count following all of the select values.
    // Function was created to remove this data point which is unnecessary for our purposes.
    const removeInStockCountFromSelector = (selector1, selector2) => {
        let inStockSelector = Evergage.cashDom(selector2).text();
        let selector = Evergage.cashDom(selector1).text();
        selector = selector.substring(0, selector.length - inStockSelector.length);
        return selector;
    };

    // Used to verify an email is properly formatted.
    const validateEmail = (email) => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    };
    
    // Variable created to easily modify requirements for product page 
    // since it is tested in multiple locations.
    const isProductPage = Evergage.cashDom("#media1-app-root").length > 0;

    // Returns a breadcrumb category list.
    const constructBreadcrumb = () => {
        let category = getCategoryFromWindow();
        if (exists(category)) {
            const body = getBodyStyle();
            if (exists(body)) {
                category = `${category}|${body}`;
            }
            return [category];
        }
        return null;
    };

    // On product pages there are no identifiers to collect vehicle specification details.
    // We can instead iterate through each of the options to return the one we require.    
    var kvp = [];
    const scrapeProductDetails = () => {
        // If we aren't on a product page, immediately exit.
        if (!isProductPage) {
            return null;
        }

        const dataList = document.querySelectorAll(".dl-horizontal");
        let kvp = [];
        for (var i = 0; i < dataList.length; i++) {
            let dataTerm = dataList[i].querySelectorAll("dt");
            let descriptionDetails = dataList[i].querySelectorAll("dd");
            
            for (var j = 0; j < dataTerm.length; j++) {
                let data = {
                    dataTerm: dataTerm[j].textContent,
                    descriptionDetails: descriptionDetails[j].textContent
                };
                kvp.push(data);
            }
        }
        return kvp;
    };
    kvp = scrapeProductDetails();

    // Search our existing set of scraped data to see if it contains an entry 
    // for the provided data term.
    const getProductDetails = (key) => {
        if (kvp === null) {
            return null;
        }
        for (var i = 0; i < kvp.length; i++) {
            if (kvp[i].dataTerm === key) {
                return kvp[i].descriptionDetails;
            }
        }
        return null;
    };

    const showroomKvp = Evergage.cashDom('#category2 li');
    // Retrieves data from the powertrain details section of the showroom page.
    // Uses a lookup to find key words within a given list item.
    const getShowroomPowertrainDetails = (key) => {
        for (let i = 0; i < showroomKvp.length; i++) {
            if (exists(showroomKvp[i].innerHTML)) {
                if (showroomKvp[i].innerHTML.includes(key)) {
                    const textObject = showroomKvp[i].getElementsByTagName('span')[0];
                    return textObject.innerHTML;
                }
            }
        }
        for (let i = 0; i < showroomKvp.length; i++) {
            if (showroomKvp[i].innerText.includes(key)) {
                return Evergage.resolvers.fromSelectorMultiple('#category2 li span')()[i];
            }
        }
        return null;
    }

    const getLocale = () => {
        let locale = getPageAttributesFromDataLayer().locale;
        if (exists(locale)) {
            return locale;
        }

        locale = Evergage.resolvers.fromMeta('locale')();
        if (exists(locale)) {
            return locale;
        }
        return null;
    }

    const config = {
        global: { 
            locale: getLocale(),
            onActionEvent: (actionEvent) => {
                console.log("evg: ", actionEvent);
                const accountInfo = Evergage.cashDom('.logout-content').eq(0).find('.logout-link').text().trim();
                if (!exists(accountInfo)) {
                    return; 
                } else {
                    const splitInfo = accountInfo.split(' ');
                    let email = splitInfo[5];
                    if (email) {
                        email = email.substring(0, splitInfo[5].length-1);
                    }
                    if (exists(email)) {
                        actionEvent.user = actionEvent.user || {};
                        actionEvent.user.attributes = actionEvent.user.attributes || {};
                        actionEvent.user.attributes.emailAddress = email;
                    }
                    return actionEvent;
                }
            },
            contentZones: [
                { name: "global_popup", selector: "body" }
            ],
            listeners: [
                Evergage.listener("submit", '.login-form', (event) => {
                    const $form = Evergage.cashDom(event.currentTarget);
                    const email = $form.find('.email').val();
                    if (validateEmail(email)) {
                        Evergage.sendEvent({
                            action: "User Login",
                            user: {
                                attributes: {
                                    emailAddress: email
                                }
                            }
                        });
                    }  
                }),
                Evergage.listener("submit", 'form[data-form-tracking-id="CONTACT"]', (event) => {
                    // This covers both the navigation menu contact us as well as the contact us page.
                    const $form = Evergage.cashDom(event.target);
                    const user = {
                        firstName: $form.find('input[name="contact.firstName"]').val(),
                        lastName: $form.find('input[name="contact.lastName"]').val(),
                        email: $form.find('input[name="contact.email"]').val()
                    }

                    if (validateEmail(user.email)) {
                        Evergage.sendEvent({
                            action: "Form Submission | Contact Us",
                            user: {
                                attributes: {
                                    emailAddress: user.email,
                                    firstName: user.firstName,
                                    lastName: user.lastName
                                }
                            }
                        });
                    } 
                }),
            ],
        },
        pageTypeDefault: {
            name: "default"
        },
        pageTypes: [
            {
                name: "home",
                action: "Homepage",
                isMatch: () => /^\/$/.test(window.location.pathname),
                contentZones: [
                    {name: "home_hero", selector: ".slideshow-background"},
                    {name: "home_recs", selector: 'ul[data-recommendation-ab-source="recommended"]'}
                ],
                listeners: [
                    // No other items on "Home Search" currently correspond to personalization and 
                    // are therefor, not captured.
                    Evergage.listener("change", "select.normalBodyStyle", (event) => {
                        const value = Evergage.cashDom(event.currentTarget).val();
                        if (exists(value)) {
                            Evergage.sendEvent({
                                action: "Home Search | Body Filter",
                                itemAction: Evergage.ItemAction.ViewItem,
                                catalog: {
                                    Body: {
                                        _id: value.split("/")[0].toUpperCase(),
                                        name: value.split("/")[0].toUpperCase()
                                    }
                                }
                            })
                        }
                    })
                ]
            },
            {
                name: "category",
                isMatch: () => Evergage.cashDom("#inventory-results1-app-root").length > 0 ||
                     /\/showroom\/index/.test( window.location.href),
                action: "View Category",
                catalog: {
                    Category: {
                        _id: () => {
                            const id = getCategoryFromWindow();
                            if (exists(id)) {
                                return id;
                            }
                            return 'Unmapped Category Id';
                        },
                        url: window.location.href,
                        imageUrl: Evergage.resolvers.fromSelectorAttribute('.header-logo img', 'src', (url) => {
                            return getPathFromUrl(url);
                        }),
                        name: getCategoryFromWindow
                    }
                },
                listeners: [
                    Evergage.listener("change", '#normalBodyStyle--body li input', (event) => {
                        const $input = Evergage.cashDom(event.currentTarget).parent();
                        let bodyStyle = $input.find('.facet-list-facet-label-text').text();
                        if (exists(bodyStyle)) {
                            // In order to keep data uniformed, we'll need to strip off an inventory counts.
                            // Inventory counts are appended onto the body style.
                            const bodyStyleInventoryCount = $input.find('.facet-list-facet-label-text .ddc-font-size-xsmall').text();
                            bodyStyle = bodyStyle.substring(0, bodyStyle.length - bodyStyleInventoryCount.length).toUpperCase();
                            if (exists(bodyStyle)) {
                                Evergage.sendEvent({
                                    action: "Category View | Filter",
                                    itemAction: Evergage.ItemAction.ViewItem,
                                    catalog: {
                                        Body: {
                                            _id: bodyStyle.split('/')[0],
                                            name: bodyStyle.split('/')[0]
                                        }
                                    }
                                })
                            }
                        }
                    }),
                ],
                contentZones: []
            },
            {
                name: "out_of_stock",
                isMatch: () => {
                    return Evergage.cashDom('.ddc-page-title').text().toUpperCase().includes('OOPS');
                },
                action: Evergage.ItemAction.ViewItemOutOfStock,
                catalog: {
                    Product: {
                        _id: () => {
                            const path = window.location.pathname.split('/');
                            return path[path.length - 1].substring(0, path[path.length-1].length - 37).replaceAll('-', ' ');
                        },
                        name: () => {
                            const path = window.location.pathname.split('/');
                            return path[path.length - 1].substring(0, path[path.length-1].length - 37).replaceAll('-', ' ');
                        },
                        url: window.location.href,
                        inventoryCount: () => {
                            return 0;
                        },
                        price: () => {
                            return 0;
                        },
                        listPrice: () => {
                            return 0;
                        },
                        currency: () => {
                            return 'USD'
                        },
                        categories: constructBreadcrumb,
                        relatedCatalogObjects: { 
                        }
                    }
                }
            },
            {
                name: "product_detail",
                isMatch: () => isProductPage,
                action: "View Product",
                itemAction: Evergage.ItemAction.ViewItem,
                catalog: {
                    Product: {
                        _id: () => {
                            const id = Evergage.resolvers.fromSelector(".vehicle-title")();
                            if (exists(id)) {
                                return id;
                            }
                            return "Unmapped Product Id";
                        },
                        name: () => {
                            //This method returns the name without year and make.
                            const title = Evergage.cashDom('.vehicle-title .font-weight-normal span').text();
                            if (title) {
                                return title;
                            }
                            return null;
                        },
                        url: window.location.href,
                        imageUrl: Evergage.resolvers.fromSelectorAttribute('.slider-slide img', 'src', (url) => {
                            return getPathFromUrl(url);
                        }),
                        inventoryCount: 1,
                        currency: 'USD',
                        price: Evergage.resolvers.fromSelector('.price-value', 
                            (val) => replaceNonNumericValues(val)),
                        listPrice: Evergage.resolvers.fromSelector('.final-price .price-value', 
                            (val) => replaceNonNumericValues(val)),
                        categories: constructBreadcrumb,
                        relatedCatalogObjects: { 
                            FuelEconomy: [getProductDetails('Fuel Economy')],
                            CityMPG: () => {
                                // Attempt to grab data from the datalayer first.
                                let value = getVehicleFromDataLayer().cityFuelEfficiency;
                                if (exists(value)) {
                                    return [`${value}.0`];
                                }

                                // If not found in datalayer, pull from vehicle details on page.
                                const fuelEconomy = getProductDetails('Fuel Economy');
                                if (exists(fuelEconomy)) {
                                    const mpg = replaceNonNumericValues(fuelEconomy.split('/')[0]);
                                    if (exists(mpg)) {
                                        return [mpg];
                                    }
                                }
                                return null;
                            },
                            HighwayMPG: () => {
                                // Attempt to grab data from the datalayer first.
                                let value = getVehicleFromDataLayer().highwayFuelEfficiency;
                                if (exists(value)) {
                                    return [`${value}.0`];
                                }
                                
                                // If not found in datalayer, pull from vehicle details on page.
                                const fuelEconomy = getProductDetails('Fuel Economy');
                                if (exists(fuelEconomy)) {
                                    value = replaceNonNumericValues(fuelEconomy.split('/')[1]);
                                    if (exists(value)) {
                                        return [value];
                                    }
                                }
                                return null;
                            },
                            ExteriorColor: () => {
                                let value = getVehicleFromDataLayer().exteriorColor;
                                if (exists(value)) {
                                    return [value];
                                }
                                value = getProductDetails('Exterior Color');
                                if (exists(value)) {
                                    return [value];
                                }
                                return null;
                            },
                            InteriorColor:  () => {
                                let value = getVehicleFromDataLayer().interiorColor;
                                if (exists(value)) {
                                    return [value];
                                }
                                value = getProductDetails('Interior Color');
                                if (exists(value)) {
                                    return [value];
                                }
                                return null;
                            },
                            Body: () => {
                                let value = getVehicleFromDataLayer().bodyStyle;
                                if (exists(value)) {
                                    return [value];
                                }
                                value = getBodyStyle();
                                return exists(value) ? [value] : null;
                            },
                            Transmission: () => {
                                let value = getVehicleFromDataLayer().transmision;
                                if (exists(value)) {
                                    return [value];
                                }
                                value = getProductDetails('Transmission')
                                if (exists(value)) {
                                    return [value];
                                }
                                return null;
                            },
                            Drivetrain: () => {
                                let value = getVehicleFromDataLayer().driveLine;
                                if (exists(value)) {
                                    return [value.toUpperCase()];
                                }
                                value = getNormalizedDrivetrain(getProductDetails('Drivetrain'));
                                if (exists(value)) {
                                    return [value];
                                }
                                return null;
                            },
                            Engine: () => {
                                const engine = getVehicleFromDataLayer().engine;
                                const engineSize = getVehicleFromDataLayer().engineSize;
                                let value = null;

                                if (exists(engine) &&
                                    exists(engineSize)) {
                                    value = `${engineSize} ${engine}`;
                                    return [value];
                                }

                                value = getProductDetails('Engine');
                                if (exists(value)) {
                                    return [value];
                                }
                                return;
                            }
                        }
                    }
                },
                contentZones: [
                    { name: "product_detail_recs_row_1", selector: ".recommendations-vehicles .vehicle-list" }
                ],
            },
            {
                name: "product_showroom",
                isMatch: () => {
                    return /\/showroom/.test( window.location.href);
                },
                action: "View Product Showroom",
                itemAction: Evergage.ItemAction.ViewItem,
                catalog: {
                    Product: {
                        _id: () => {
                            const id = Evergage.resolvers.fromSelector(".ddc-page-title")();
                            if (exists(id)) {
                                return id;
                            }
                            return "Unmapped Showroom Product Id";
                        },
                        name: Evergage.resolvers.fromSelector(".ddc-page-title"),
                        url: Evergage.resolvers.fromHref(),
                        imageUrl: Evergage.resolvers.fromSelectorAttribute('.vehicle-media img', 'src', (url) => {
                            return getPathFromUrl(url);
                        }),
                        inventoryCount: 1,
                        price: Evergage.resolvers.fromSelectorAttribute('.showroom-price','data-showroom-price'),
                        listPrice: Evergage.resolvers.fromSelectorAttribute('.showroom-price','data-showroom-price'),
                        currency: 'USD',
                        categories: constructBreadcrumb,
                        relatedCatalogObjects: { 
                            FuelEconomy:  () => {
                                const cityMpg = Evergage.cashDom('.city .xlarge').text();
                                const highwayMpg = Evergage.cashDom('.highway .xlarge').text();
                                
                                const fuelEcon = `${cityMpg}.0/${highwayMpg}.0 mpg City/Hwy`;
                                return [fuelEcon];
                            },
                            CityMPG:  () => {
                                let value = Evergage.cashDom('.city .xlarge').text();
                                if (exists(value)) {
                                    return [`${value}.0`];
                                }
                                return null;
                            },
                            HighwayMPG: () => {
                                let value = Evergage.cashDom('.highway .xlarge').text();
                                if (exists(value)) {
                                    return [`${value}.0`];
                                }
                                return null;
                            },
                            ExteriorColor:  Evergage.resolvers.fromSelectorMultiple('.color span')(),
                            InteriorColor:  null,
                            Body: () => {
                                const type = Evergage.resolvers.fromSelectorAttribute('.vehicle-media', 'data-bodystyle')();
                                if (exists(type)) {
                                    return [type];
                                }
                                return null;
                            },
                            Transmission: () => {
                                const value = getShowroomPowertrainDetails('Transmission');
                                if (exists(value)) {
                                    if (value.includes('automatic')) {
                                        return ['Automatic'];
                                    } else if (value.includes('manual')) {
                                        return ['Manual'];
                                    }
                                    return null;
                                }
                                return null;
                            }, //[Evergage.resolvers.fromSelectorMultiple('#category2 li span')()[8]],
                            Drivetrain: () => {
                                const value = getShowroomPowertrainDetails('Drive type');
                                if (exists(value)) {
                                    return [getNormalizedDrivetrain(value)];
                                }
                                return null;
                            },
                            Engine: () => {
                                const value = getShowroomPowertrainDetails('Engine liters');
                                if (exists(value)) {
                                    return [value];
                                }
                                return null;
                            }
                        }
                    }
                },
                listeners: [
                    Evergage.listener("submit", 'form[data-form-tracking-id="SHOWROOM"]', (event) => {
                        // This covers both the navigation menu contact us as well as the contact us page.
                        const $form = Evergage.cashDom(event.target);
                        const user = {
                            firstName: $form.find('input[name="contact.firstName"]').val(),
                            lastName: $form.find('input[name="contact.lastName"]').val(),
                            email: $form.find('input[name="contact.email"]').val(),
                            phone: $form.find('input[name="contact.phone"]').val()
                        }

                        if (validateEmail(user.email)) {
                            Evergage.sendEvent({
                                action: "Showroom | I'm Interested",
                                user: {
                                    attributes: {
                                        emailAddress: user.email,
                                        firstName: user.firstName,
                                        lastName: user.lastName,
                                        phone: user.phone
                                    }
                                }
                            });
                        } 
                    }),
                ],
                contentZones: [],
            },
            {
                 name: "quick_quote",
                isMatch: () => {
                    return Evergage.resolvers.fromMeta("og:title")().includes('Quick Quote')
                },
                action: "Quick Quote",
                listeners: [
                    Evergage.listener("submit", 'form[data-form-tracking-id="QUICKQUOTE"]', (event) => {
                        // This covers both the navigation menu contact us as well as the contact us page.
                        const $form = Evergage.cashDom(event.target);
                        const user = {
                            firstName: $form.find('input[name="contact.firstName"]').val(),
                            lastName: $form.find('input[name="contact.lastName"]').val(),
                            email: $form.find('input[name="contact.email"]').val(),
                            phone: $form.find('input[name="contact.phone"]').val()
                        }

                        if (validateEmail(user.email)) {
                            Evergage.sendEvent({
                                action: "Quick Quote | I'm Interested",
                                user: {
                                    attributes: {
                                        emailAddress: user.email,
                                        firstName: user.firstName,
                                        lastName: user.lastName,
                                        phone: user.phone
                                    }
                                }
                            });
                        } 
                    }),
                ],
                contentZones: [],
            }
        ]
    };
    Evergage.initSitemap(config);
});