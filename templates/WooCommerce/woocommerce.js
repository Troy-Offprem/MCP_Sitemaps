Evergage.init({
    cookieDomain: 'woocommerce.offprem.tech',
    trackerUrl: 'https://partneroffpremus.us-4.evergage.com',
  }).then(() => {
    const config = {
      global: {
        contentZones: [
          { name: 'global-header', selector: 'header.site-header' },
          { name: 'global-footer', selector: 'footer.site-footer' },
        ],
        listeners: [
          Evergage.listener('click', 'button[name=register]', () => {
            const email = Evergage.cashDom('#reg_email').val();
            if (email) {
              Evergage.sendEvent({
                action: 'Register User',
                user: {
                  attributes: {
                    emailAddress: email,
                  },
                },
              });
            }
          }),
           Evergage.listener('click', '.add_to_cart_button', () => {
              const lineItem = Evergage.util.buildLineItemFromPageState(
                '.site-main .product'
              );
  
              lineItem.sku = { _id: Evergage.resolvers.fromSelectorAttribute('.add_to_cart_button', 'data-product_sku') };
              Evergage.sendEvent({
                itemAction: Evergage.ItemAction.AddToCart,
                cart: {
                  singleLine: {
                    Product: lineItem,
                  },
                },
              });
            }),
        ],
      },
      pageTypeDefault: {
        name: 'default',
      },
      pageTypes: [
        {
          name: 'product_detail',
          itemAction: Evergage.ItemAction.ViewItemDetail,
          isMatch: () => {
              return Evergage.DisplayUtils.pageElementLoaded("body.product-template-default", "html").then(() => true);
          },
          catalog: {
            Product: {
              _id: Evergage.resolvers.fromSelectorAttribute(
                '[name=add-to-cart]',
                'value'
              ),
              name: () => {
                  console.log(Evergage.resolvers.fromSelector('h1.product_title')())
                  return Evergage.resolvers.fromSelector('h1.product_title')();
              },
              url: Evergage.resolvers.fromHref(),
              imageUrl: Evergage.resolvers.fromSelectorAttribute(
                '.wp-post-image',
                'src'
              ),
              price: Evergage.resolvers.fromSelector('.price .amount bdi'),
              categories: Evergage.resolvers.buildCategoryId(
                '.woocommerce-breadcrumb a',
                1,
                null,
                (categoryId) => [categoryId.toUpperCase()]
              ),
              Attributes: {
                  salePrice: '50.00',
                  sku: Evergage.resolvers.fromSelector('.sku')()
              },
              relatedCatalogObjects: {
                Color: () => {
                  return Evergage.resolvers.buildCategoryId(
                    '#pa_color option',
                    1,
                    null,
                    (categoryId) => [categoryId.toUpperCase()]
                  );
                },
                Features: () => {
                  return Evergage.resolvers.buildCategoryId(
                    '#logo option',
                    1,
                    null,
                    (categoryId) => [categoryId.toUpperCase()]
                  );
                },
              },
            },
          },
          contentZones: [
            {
              name: 'recommended-products',
              selector: 'section.related.products',
            },
            { name: 'widget-sidebar', selector: 'div.widget-area' },
          ],
          listeners: [
            Evergage.listener('click', '.single_add_to_cart_button', () => {
              const lineItem = Evergage.util.buildLineItemFromPageState(
                '.site-main .product'
              );
  
              lineItem.sku = { _id: Evergage.cashDom('.sku_wrapper .sku') };
              Evergage.sendEvent({
                itemAction: Evergage.ItemAction.AddToCart,
                cart: {
                  singleLine: {
                    Product: lineItem,
                  },
                },
              });
            }),
          ],
        },
        {
          name: 'category',
          isMatch: () => {
            return Evergage.cashDom('.tax-product_cat').length > 0;
          },
          catalog: {
            Category: {
              _id: Evergage.resolvers.fromSelector(
                'h1.woocommerce-products-header__title'
              ),
            },
          },
          contentZones: [
            { name: 'widget-sidebar', selector: 'div.widget-area' },
          ],
        },
        {
          name: 'home',
          action: 'Homepage',
          isMatch: () => {
            return Evergage.cashDom('body.home').length > 0;
          },
          contentZones: [
            { name: 'home_hero', selector: '.wp-block-cover' },
            {
              name: 'home_sub_hero',
              selector: '.wp-block-cover__inner-container',
            },
            // { name: 'home_popup' }
          ],
        },
      ],
    };
  
    const getProductsFromDataLayer = () => {
      if (window.dataLayer) {
        for (let i = 0; i < window.dataLayer.length; i++) {
          if (
            (
              (window.dataLayer[i].ecommerce &&
                window.dataLayer[i].ecommerce.detail) ||
              {}
            ).products
          ) {
            return window.dataLayer[i].ecommerce.detail.products;
          }
        }
      }
    };
  
    Evergage.initSitemap(config);
  });
  