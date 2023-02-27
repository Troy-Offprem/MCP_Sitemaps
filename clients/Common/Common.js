/**************************************************
 *  COMMON.js
 *  A centralized collection of generic functions 
 *  utilized across various sitemaps during code
 *  creation.
 **************************************************/

/**************************************************
 *  GENERIC FUNCTIONS
 **************************************************/

// Return a boolean value indicating if a 
// provided email address is properly formatted.
const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

// Remove any non-numeric values from a given value.
const replaceNonNumericValues = (value) => {
    if (value) {
        const result = value.replace(/[^0-9\.-]+/g,"");
        return result;
    }
    return '';
};

// Remove any query parameters from a provided url and return base path url.
// Commonly used on imageUrl since query params will not decode in IS.
const getBaseUrl = (url) => {
    if (url) {
        const newUrl = url.split("?")[0];
        return newUrl;
    }
    return null;
}

/**************************************************
 *  PRODUCT SCRAPING
 **************************************************/
// Basic template for a catalog product.
 catalog: {
    Product: {
        _id: () => {
            return null;
        },
        name: Evergage.resolvers.fromMeta('name')(),
        description: Evergage.resolvers.fromMeta('description')(),
        url: Evergage.resolvers.fromHref(),
        imageUrl: getBaseUrl(Evergage.resolvers.fromSelectorAttributeMultiple('img', 'src')()[0]),
        price: 1,
        listPrice: 1,
        inventoryCount: 1,
        currency: 'USD',
        categories: getCategories(),
        relatedCatalogObjects: {
            Dimension: Evergage.cashDom('Dimension')
        }
    }
},

// Debug event logging to see payload forwarded to IS.
onActionEvent: (actionEvent) => {
    console.log("evg: ", actionEvent);
    return actionEvent;
},

// Check multiple points for a possible id and return if found.
// If no value is found, return "Unmapped".
catalog: {
    Product: {
        _id: () => {
            const id = Evergage.cashDom('#possible-id-1').text() || 
                Evergage.cashDom('#possible-id-2').text();
            if (exists(id)){
                return id;
            }
            return "Unmapped";
        }
    }
}
