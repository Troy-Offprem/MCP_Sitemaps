Evergage.init().then(() => {
    // On insurance product pages, parse the product category through current url.
    const getInsuranceProductCategories = () => {
        const path = window.location.pathname.split('/').filter(function(el) { 
            return el;
        } );
        if (path && path.length > 1) {
            const category = path[1].replaceAll('-', ' ').toUpperCase();
            if (category) {
                return [category];
            }
        }
        return null;
    };

    // Returns an array mirroring the provided array except with all uppercased values.
    function toUpperCaseArray(arr) {
        if (arr) {
            arr = arr.map(e => e.toUpperCase());
        }
        return arr;
    }

    // Creates a pipe delimited list of page categories on article pages.
    // removePathEnd - remove last index of the current pathname when true.
    function buildArticleCategoriesFromPathname(removePathStartAndEnd = true) {
        const path = window.location.pathname.split('/');
        let categories = [];
        // Remove any empty, null, or undefined path elements.
        for (let i = 0; i < path.length - 1; i++) {
            if (path[i]) {
                // Replace all hyphens to allow match up between categories.
                // Category page has hyphens in categories, i.e. MAINTENANCE-AND-TECH, 
                // due to it being pulled from an HRef.
                // All other pages contain no hyphens as they're pulled from headers.
                let category = path[i].toUpperCase().replace(/-/g,' ');
                categories.push(category);
            }
        }
        // The first and last element in the url will be the article name. Remove it.
        if (removePathStartAndEnd) {
            categories.pop();
            categories.shift();
        }
        return categories;
    }

    const faqPageTypeMap = {
        '': 'All Questions',
        'most-popular': 'Most Popular',
        'claims': 'Claims',
        'hagerty-drivers-club': 'Hagerty Drivers Club',
        'policy-features': 'Policy Features',
        'how-do-i': 'How Do I',
        'roadside-assistance': 'Roadside Assistance',
        'general-guidelines': 'General Guidelines'
    };

    // On insurance claims FAQ, get the friendly name of the tab being viewed.
    const getFAQPageType = () => {
        let pathName = window.location.pathname;
        if (pathName.includes('frequently-asked-questions')) {
            const faqPathname = window.location.pathname.split('frequently-asked-questions/');
            const mapping = faqPageTypeMap[faqPathname.length > 1 ? faqPathname[1] : ''];
            return mapping;
        }
    };

    // Remove any query parameters from a provided url and return base path url.
    // Commonly used on imageUrl since query params will not decode in IS.
    const getBaseUrl = (url) => {
        if (url) {
            const newUrl = url.split("?")[0];
            return newUrl;
        }
        return null;
    };

    let valuationResultPath = null;
    const vehicleInfoMap = {
        'Make': 1,
        'Model': 2,
        'Year': 3
    };
    // On valuation tool search result, return various vehicle information based on the current url.
    const getResultPathData = (infoIndex) => {
        if (!valuationResultPath) {
            valuationResultPath = window.location.pathname.substring(1).split('/');
        }
        const index = vehicleInfoMap[infoIndex];
        if (valuationResultPath 
            && valuationResultPath.length > index ) {
            return [valuationResultPath[index].toUpperCase()];
        } else {
            return ['NOT FOUND'];
        }
    };

    const config = {
        global: {
            onActionEvent: (actionEvent) => {
                return actionEvent;
            },
            locale: 'en_US',
            listeners: [
                Evergage.listener("click", 'a[data-testid="nav-cta"]', () => {
                    Evergage.sendEvent({
                        name: "get_a_quote",
                        action: "Valuation Tool | Get a Quote"
                    });
                })
            ]
        },
        pageTypeDefault: {
            name: "default"
        },
        pageTypes: [
            {
                name: "home",
                action: "Home",
                isMatch: () => {
                    return window.location.pathname === '/';
                },
                contentZones: [
                    {name: "home_hero", selector: ".hds-hero-primary"},
                ],
                listeners: [ 
                    Evergage.listener("click", '#newsletter-signup-homepage-widget button', (e) => {
                        const email = Evergage.cashDom('#newsletter-signup-homepage-widget input[type="email"]').val();
                        Evergage.sendEvent({
                            action: "Home Click | Email Subscribe",
                            user: {
                                attributes: {
                                    emailAddress: email
                                }
                            }
                        });
                    })
                ]
            },
            {
                name: "insurance_home",
                action: "Insurance | Home",
                isMatch: () => window.location.pathname.endsWith('/insurance')
            },
            {
                name: "newsletter",
                action: "Newsletter",
                isMatch: () => window.location.href.includes('view.member')
            },
            {
                name: "faq",
                action: `FAQ | ${ getFAQPageType() }`,
                isMatch: () => window.location.href.includes('frequently-asked-questions')
            },
            {
                name: "my_garage",
                action: 'My Garage | Explore',
                isMatch: () => window.location.href.includes('my-garage')
            },
            {
                name: "product_insurance",
                action: "Insurance | View Product",
                itemAction: Evergage.ItemAction.ViewItem,
                isMatch: () => {
                    return window.location.pathname.startsWith('/insurance') &&
                        Evergage.resolvers.fromMeta('og:title')();
                },
                catalog: {
                    Product: {
                        _id: () => {
                            let title = Evergage.resolvers.fromSelector('.billboard-two-title')();
                            if (title) {
                                return title;
                            }
                             
                            title = Evergage.resolvers.fromMeta('og:title')();
                            if (title) {
                                return title;
                            }
                            return null;
                        },
                        name: Evergage.resolvers.fromMeta('og:title')(),
                        description: Evergage.resolvers.fromMeta('og:description')(),
                        url: Evergage.resolvers.fromHref(),
                        imageUrl: getBaseUrl(Evergage.resolvers.fromSelectorAttributeMultiple('picture img', 'src')()[0]),
                        price: 1,
                        listPrice: 1,
                        inventoryCount: 1,
                        currency: 'USD',
                        categories: getInsuranceProductCategories()
                    }
                }
            },
            {
                name: "quote_submission",
                action: "Quote | Submit",
                isMatch: () => window.location.pathname.includes('/Personal/Demographics/Details'),
                contentZones: [ ],
                listeners: [ 
                    Evergage.listener("submit", 'app-dynamic-form form[ng-reflect-form="[object Object]"]', (event) => {
                        const $form = Evergage.cashDom(event.currentTarget);
                        const user = {
                            email: $form.find('input[data-testid="digital-sales:customer/emailaddress"]').val(),
                            firstName: $form.find('#first').val(),
                            lastName: $form.find('#last').val()
                        };
                        Evergage.sendEvent({
                            action: "Quote | Request Quote",
                            user: {
                                attributes: {
                                    email: user.email,
                                    firstName: user.firstName,
                                    lastName: user.lastName,
                                }
                            }
                        });
                    })
                ]
            },
            {
                name: "quote_lookup",
                action: "Quote | Lookup",
                isMatch: () => window.location.pathname.includes('/apps/manifold/lookup'),
                listeners: [ 
                    Evergage.listener("click", '.action-button', (event) => {
                        const user = {
                            email: Evergage.cashDom('#email').val()
                        };
                        Evergage.sendEvent({
                            action: "Quote | Request Lookup",
                            user: {
                                attributes: {
                                    email: user.email
                                }
                            }
                        });
                    })
                ]
            },
            {
                name: "quote",
                action: "Quote | Application",
                isMatch: () => window.location.pathname.includes('/apps/manifold/')
            },

            
            // ***************************************
            // BEGIN Hagerty media and blog Sitemap
            // ***************************************
            {
                name: "media_series_episodes",
                isMatch: () => {
                    return window.location.pathname.includes('/media/series')
                        && Evergage.cashDom('.video-lead_header h3').text().toLowerCase() === 'original series';
                },
                action: "Media | View Series Episodes",
                catalog: {
                    Series: {
                        _id: Evergage.resolvers.fromSelector('.video-lead_header h1')(),
                        name: Evergage.resolvers.fromSelector('.video-lead_header h1')(),
                        url: Evergage.resolvers.fromHref(),
                        imageUrl: getBaseUrl(Evergage.resolvers.fromSelectorAttribute('.card-image', 'src')()),
                        price: () => {
                            return 1.00;
                        },
                        listPrice: () => {
                            return 1.00;
                        },
                        inventoryCount: () => {
                            return 1;
                        },
                        description: Evergage.resolvers.fromMeta("description")(),
                        categories: buildArticleCategoriesFromPathname()
                    }
                }
            },
            {
                name: "media_category",
                isMatch: () => {
                    return window.location.pathname.includes('/media/category');
                },
                action: "Media | View Category",
                catalog: {
                    Category: {
                        _id: () => {
                            return Evergage.resolvers.fromSelector('.box_title')().toUpperCase();
                        },
                        name: () => {
                            return Evergage.resolvers.fromSelector('.box_title')().toUpperCase();
                        },
                        url: Evergage.resolvers.fromHref(),
                        imageUrl: getBaseUrl(Evergage.resolvers.fromSelectorAttribute('.card-image', 'src')()),
                        description: Evergage.resolvers.fromMeta("description")()
                    }
                }
            },
            {
                name: "media_tags",
                isMatch: () => {
                    return window.location.pathname.includes('/media/tags');
                },
                action: "Media | View Tag",
                catalog: {
                    Tags: {
                        _id: () => {
                            const header = Evergage.resolvers.fromSelector('.box_header .text-heading_1')();
                            return header.substring(2).toUpperCase();
                        },
                        name: () => {
                            const header = Evergage.resolvers.fromSelector('.box_header .text-heading_1')();
                            return header.substring(2).toUpperCase();
                        },
                        description: Evergage.resolvers.fromMeta("og:description")(),
                        url: Evergage.resolvers.fromHref()
                    }
                }
            },
            {
                name: "media_home",
                isMatch: () => {
                    return Evergage.cashDom('a[aria-label="Hagerty Media"]').length > 0
                        && Evergage.cashDom('.article_lead .article_heading').length <= 0;
                },
                action: "Media | Home"
            },
            {
                name: "media_article",
                isMatch: () => {
                    return Evergage.cashDom('a[aria-label="Hagerty Media"]').length > 0
                        && Evergage.cashDom('.article_lead .article_heading').length > 0;
                },
                action: "Media | View Article",
                catalog: {
                    Article: {
                        _id: Evergage.resolvers.fromSelector('.article_lead .article_heading')(),
                        name: Evergage.resolvers.fromSelector('.article_lead .article_heading')(),
                        description: Evergage.resolvers.fromMeta("description")(),
                        url: Evergage.resolvers.fromHref(),
                        imageUrl:  getBaseUrl(Evergage.resolvers.fromSelectorAttribute('.media__image', 'src')()),
                        categories: buildArticleCategoriesFromPathname(),
                        published: () => {
                            const publishedDate = Evergage.resolvers.fromSelector('.article_byline .text_1-mono span')();
                            const dateParsed = new Date(publishedDate);
                            return dateParsed;
                        },
                        expiration: () => {
                            const publishedDate = Evergage.resolvers.fromSelector('.article_byline .text_1-mono span')(); 
                            const dateParsed = Date.parse(publishedDate); // Convert string to date.
                            const twoWeeksAway = new Date(dateParsed + 12096e5); // Add two weeks to expiration date.
                            return twoWeeksAway;
                        },
                        relatedCatalogObjects: {
                            Author: () => {
                                return Evergage.util.resolveWhenTrue.bind(() => {
                                    const author = Evergage.resolvers.fromSelector('.article_meta a[rel="author"]')() ||
                                        Evergage.resolvers.fromSelector('.article_meta .link_1')();
                                    if (author) {
                                        return [author.toUpperCase()];
                                    } else {
                                        return false;
                                    }
                                });
                            },
                            Tags: () => {
                                // These are the displayed tags at the bottom of any article.
                                return Evergage.DisplayUtils.pageElementLoaded(".topics-group .nav .nav_item", "html").then(() => {
                                    return Evergage.resolvers.fromSelectorMultiple('.topics-group .nav .nav_item', (elem) => {
                                        return toUpperCaseArray(elem);
                                    })();
                                });
                            },
                            Topics: () => {
                                // These are located in the hidden links at the top of an article.
                                return Evergage.DisplayUtils.pageElementLoaded(".link_4", "html").then(() => {
                                    return Evergage.resolvers.fromSelectorMultiple('.link_4', (elem) => {
                                        return toUpperCaseArray(elem);
                                    })();
                                });
                            }
                        }
                    }
                }
            },

            // ***************************************
            // BEGIN Hagerty Valuation Tools Sitemap
            // ***************************************
            {
                name: "valuation_tool",
                isMatch: () => {
                    return window.location.pathname.endsWith('valuation-tools');
                },
                action: "Valuation Tool | Home",
                listeners: [
                    Evergage.listener("click", 'article[data-testid="LandingHDC"] a[data-testid="Button"]', () => {
                        Evergage.sendEvent({
                            name: "join_the_club",
                            action: "Valuation Tool | Join the Club"
                        });
                    })
                ]
            },
            {
                name: "valuation_tool_search",
                isMatch: () => {
                    return window.location.pathname.endsWith('valuation-tools/search');
                },
                action: "Valuation Tool | Search"
            },
            {
                name: "valuation_tool_result",
                isMatch: () => {
                    return window.location.pathname.includes('/valuation-tools/');
                },
                action: "Valuation Tool | Results",
                itemAction: Evergage.ItemAction.ViewItem,
                catalog: {
                    Vehicle: {
                        _id: () => {
                            return Evergage.DisplayUtils.pageElementLoaded("#valuation", "html").then((ele) => {
                                return Evergage.resolvers.fromSelector('h1[data-testid="Typography"]')();
                            });
                        },
                        url: Evergage.resolvers.fromHref(),
                        relatedCatalogObjects: {
                            GoodConditionValue: () => {
                                return Evergage.DisplayUtils.pageElementLoaded('div[data-testid="ConditionValueItem3"]', "html").then((ele) => {
                                    const $conditionDivs = Evergage.cashDom('div[data-testid="ConditionValueItem3"] span');
                                    let odometerPriceClass = '';
                                    for (let i = 0; i < $conditionDivs.length; i++) {
                                        $conditionDivs[i].classList.forEach((className) => { 
                                            let contains = className.includes('Odometer_number');
                                            if (contains) {
                                                odometerPriceClass = className;
                                                i = $conditionDivs.length;
                                            }
                                        });
                                    }
                                    const priceArray = Evergage.resolvers.fromSelectorMultiple(`.${odometerPriceClass}`)();
                                    const price = priceArray.join('');
                                    return [price];
                                });
                            },
                            Make: () => getResultPathData('Make'),
                            Model: () => getResultPathData('Model'),
                            Year: () => getResultPathData('Year')
                        }
                    }
                }
            }
        ]
    };

    const handleSPAPageChange = () => {
        let pageUrl = window.location.href;
        if (pageUrl.includes('valuation-tools') ||
            pageUrl.includes('apps/manifold') ) {
            const urlChangeInterval = setInterval(() => {
                if (pageUrl !== window.location.href) {
                    pageUrl = window.location.href;
                    Evergage.reinit();
                }
            }, 2000);
        }
    }

    handleSPAPageChange();

    Evergage.initSitemap(config);
});