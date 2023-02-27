SalesforceInteractions.init({
	cookieDomain: 'felina.com'
}).then(() => {
	const config = {
		global: {
			listeners: [
				SalesforceInteractions.listener('click', '.klaviyo-form button.needsclick', () => {
					const email = SalesforceInteractions.resolvers.fromSelector('input[type="email"]').val();
					SalesforceInteractions.sendEvent({
						interaction: { name: 'Footer Newsletter Signup' },
						user: {
							identities: {
								emailAddress: email
							}
						}
					});
				})
			]
		},
		pageTypes: [
			{
				name: 'Home',
				isMatch: () => {
					return /^\/$/.test(window.location.pathname);
				},
				interaction: {
					name: 'Homepage'
				},
				contentZones: []
			},
			{
				name: 'Category Page',
				isMatch: () => {
					return SalesforceInteractions.cashDom('.template-collection').length > 0;
				},
				interaction: {
					name: SalesforceInteractions.CatalogObjectInteractionName.ViewCatalogObject,
					catalogObject: {
						type: 'Category',
						id: () => {
							return SalesforceInteractions.resolvers.fromMeta('og:title')();
						}
					}
				},
				listeners: [
					SalesforceInteractions.listener('click', '.product-buttons button', (e) => {
						const pid = SalesforceInteractions.cashDom(e.target).attr('data-product-handle');
						if (!pid) {
							return;
						}
						SalesforceInteractions.sendEvent({
							interaction: {
								name: SalesforceInteractions.CatalogObjectInteractionName.QuickViewCatalogObject,
								catalogObject: {
									type: 'Product',
									id: pid
								}
							}
						});
						SalesforceInteractions.reinit();
					}),
					SalesforceInteractions.listener('click', 'body', (e) => {
						if (SalesforceInteractions.cashDom(e.target).closest('button.boost-pfs-quickview-close').length > 0) {
							SalesforceInteractions.sendEvent({
								interaction: {
									name: SalesforceInteractions.mcis.CatalogObjectInteractionName.StopQuickViewCatalogObject
								}
							});
						} else if (SalesforceInteractions.cashDom(e.target).closest('#quickViewModal').length > 0 && SalesforceInteractions.cashDom(e.target).find('#quickViewModal .modal-dialog').length > 0) {
							SalesforceInteractions.sendEvent({
								interaction: {
									name: SalesforceInteractions.mcis.CatalogObjectInteractionName.StopQuickViewCatalogObject
								}
							});
						}
					}),
					SalesforceInteractions.listener('click', 'button[name="add"]', () => {
						const productId = SalesforceInteractions.resolvers.fromSelectorAttribute('#product-selector option[selected="selected"]', 'value')();
						const quantity = 1;
						const price = SalesforceInteractions.resolvers.fromSelectorAttribute('#product-selector option[selected="selected"]', 'data-variant-price')();
						SalesforceInteractions.sendEvent({
							interaction: {
								name: SalesforceInteractions.CartInteractionName.AddToCart,
								catalogObject: {
									id: productId,
									quantity: quantity,
									price: price,
									sku: { _id: SalesforceInteractions.resolvers.fromSelectorAttribute('#product-selector option[selected="selected"]', 'value')() }
								}
							}
						});
					})
				]
			},
			{
				name: 'Product Detail Page',
				isMatch: () => {
					return SalesforceInteractions.cashDom('#product-detail').length > 0;
				},
				interaction: {
					name: SalesforceInteractions.CatalogObjectInteractionName.ViewCatalogObject,
					catalogObject: {
						type: 'Product',
						id: () => {
							return SalesforceInteractions.resolvers.fromSelectorAttribute('.pdp-right .flair-badge-layout', 'data-product-id')();
						},
						attributes: {
							name: () => {
								return SalesforceInteractions.resolvers.fromMeta('og:title')();
							},
							description: () => {
								return SalesforceInteractions.resolvers.fromMeta('description')();
							},
							url: SalesforceInteractions.resolvers.fromHref(),
							imageUrl: () => {
								return SalesforceInteractions.resolvers.fromMeta('og:image')();
							},
							price: () => {
								return SalesforceInteractions.resolvers.fromMeta('og:price:amount')();
							},
							sku: {
								_id: () => {
									return SalesforceInteractions.resolvers.fromSelectorAttributeMultiple('#product-selector option', 'value')();
								}
							}
						},
						relatedCatalogObjects: {
							Color: () => {
								const colors = SalesforceInteractions.resolvers.fromSelectorAttributeMultiple('form .product-colors [class^="product-color"]', 'data-color-name')();
								return colors;
							},
							Size: () => {
								const sizes = SalesforceInteractions.resolvers.fromSelectorMultiple('form .product-sizes option')();
								return sizes;
							}
						}
					}
				},
				listeners: [
					SalesforceInteractions.listener('click', '#btn-add', () => {
						const item = SalesforceInteractions.mcis.buildLineItemFromPageState('#product-quantity');
						item.sku = { _id: SalesforceInteractions.resolvers.fromSelectorAttribute('#product-selector option[selected="selected"]', 'value')() };
						SalesforceInteractions.sendEvent({
							interaction: {
								name: SalesforceInteractions.CartInteractionName.AddToCart,
								lineItem: item
							}
						});
					})
				],
				contentZones: []
			},
			{
				name: 'Cart',
				isMatch: () => {
					return SalesforceInteractions.cashDom('#your-shopping-cart').length > 0;
				},
				interaction: {
					name: 'View Cart'
				}
			},
			{
				name: 'Checkout',
				isMatch: () => {
					return SalesforceInteractions.cashDom('.shopify-checkout').length > 0 && SalesforceInteractions.cashDom('.os-order-number').length == 0;
				},
				interaction: {
					name: SalesforceInteractions.CartInteractionName.ReplaceCart,
					lineItems: SalesforceInteractions.DisplayUtils.pageElementLoaded('#order-summary', 'html').then(() => {
						const cartLineItems = [];
						SalesforceInteractions.cashDom('.product-table .product').each((index, ele) => {
							const itemQuantity = parseInt(SalesforceInteractions.cashDom(ele).find('.product__quantity span').text());
							if (itemQuantity && itemQuantity > 0) {
								const lineItem = {
									catalogObjectType: 'Product',
									catalogObjectId: SalesforceInteractions.cashDom(ele).attr('data-variant-id'),
									price: SalesforceInteractions.cashDom(ele).find('.product__price span').text().replace('$', '') / itemQuantity,
									quantity: itemQuantity
								};
								cartLineItems.push(lineItem);
							}
						});
						return cartLineItems;
					})
				},
				listeners: [
					SalesforceInteractions.listener('click', '#continue_button', (e) => {
						const $form = SalesforceInteractions.cashDom(e.currentTarget).parents('.edit_checkout');
						const email = $form.find('#checkout_email').val();
						const firstName = $form.find('#checkout_shipping_address_first_name').val();
						const lastName = $form.find('#checkout_shipping_address_last_name').val();
						const address = $form.find('#checkout_shipping_address_address1').val();
						const city = $form.find('#checkout_shipping_address_city').val();
						const state = $form.find('#checkout_shipping_address_province').val();
						const zip = $form.find('#checkout_shipping_address_zip').val();
						const phone = $form.find('#checkout_shipping_address_phone').val();
						SalesforceInteractions.sendEvent({
							interaction: {
								name: 'Confirm Shipping Address'
							},
							user: {
								attributes: {
									firstName: firstName,
									lastName: lastName,
									address: address,
									city: city,
									state: state,
									zip: zip,
									phone: phone,
									emailAddress: email
								}
							}
						});
					})
				]
			},
			{
				name: 'Order Confirmation',
				isMatch: () => {
					return SalesforceInteractions.cashDom('.shopify-checkout').length > 0 && SalesforceInteractions.cashDom('.os-order-number').length > 0;
				},
				interaction: {
					name: SalesforceInteractions.OrderInteractionName.Purchase,
					order: {
						id: SalesforceInteractions.DisplayUtils.pageElementLoaded('.os-order-number', 'html').then((ele) => {
							return SalesforceInteractions.resolvers.fromSelector('.os-order-number');
						}),
						lineItems: () => {
							const purchaseLineItems = [];
							SalesforceInteractions.cashDom('.product-table .product').each((index, ele) => {
								const itemQuantity = parseInt(SalesforceInteractions.cashDom(ele).find('.product__quantity span').text());
								if (itemQuantity && itemQuantity > 0) {
									const lineItem = {
										catalogObjectType: 'Product',
										catalogObjectId: SalesforceInteractions.cashDom(ele).attr('data-product-id'),
										price: SalesforceInteractions.cashDom(ele).find('.product__price span').text().replace('$', '') / itemQuantity,
										quantity: itemQuantity
									};
									purchaseLineItems.push(lineItem);
								}
							});
							return purchaseLineItems;
						}
					}
				}
			},
			{
				name: 'Sign In',
				isMatch: () => {
					return SalesforceInteractions.cashDom('#customer_login').length > 0;
				},
				interaction: {
					name: 'Sign In'
				},
				contentZones: [],
				listeners: [
					SalesforceInteractions.listener('click', '.login-form__input', (e) => {
						const $form = SalesforceInteractions.cashDom(e.currentTarget).parents('#customer_login');
						const email = $form.find('#CustomerEmail').val();
						SalesforceInteractions.sendEvent({
							interaction: {
								name: 'Account Sign in'
							},
							user: {
								identities: {
									emailAddress: email
								}
							}
						});
					})
				]
			},
			{
				name: 'Account Creation',
				isMatch: () => {
					return SalesforceInteractions.cashDom('#create_customer').length > 0;
				},
				interaction: {
					name: 'Account Creation'
				},
				contentZones: [],
				listeners: [
					SalesforceInteractions.listener('click', 'input[value="Create"]', (e) => {
						const $form = SalesforceInteractions.cashDom(e.currentTarget).parents('#create_customer');
						const firstName = $form.find('#FirstName').val();
						const lastName = $form.find('#LastName').val();
						const email = $form.find('#Email').val();
						SalesforceInteractions.sendEvent({
							interaction: {
								name: 'Account Sign in'
							},
							user: {
								attributes: {
									firstName: firstName,
									lastName: lastName,
									emailAddress: email
								}
							}
						});
					})
				]
			},
			{
				name: 'Returns and Exchanges',
				isMatch: () => {
					return SalesforceInteractions.resolvers.fromMeta('og:url')() === 'https://www.felina.com/';
				},
				interaction: {
					name: 'Returns and Exchanges'
				},
				contentZones: []
			},
			{
				name: 'Account Dashboard',
				isMatch: () => {
					return SalesforceInteractions.cashDom('div[data-section-type="account-dashboard"]').length > 0;
				},
				interaction: {
					name: 'Account Dashboard'
				},
				contentZones: []
			},
			{
				name: 'Update Address',
				isMatch: () => {
					return SalesforceInteractions.cashDom('div[data-section-type="account-address"]').length > 0;
				},
				interaction: {
					name: 'Update Address'
				},
				listeners: [
					SalesforceInteractions.listener('click', 'input[value="Create New Address"]', () => {
						const $form = SalesforceInteractions.cashDom(e.currentTarget).parents('#address_form_new');
						const firstName = $form.find('#AddressFirstNameNew').val();
						const lastName = $form.find('#AddressLastNameNew').val();
						const address = $form.find('#AddressAddress1New').val();
						const country = $form.find('#AddressCountryNew').val();
						const city = $form.find('#AddressCityNew').val();
						const zip = $form.find('#AddressZipNew').val();
						const phone = $form.find('#AddressPhoneNew').val();
						SalesforceInteractions.sendEvent({
							interaction: {
								name: 'Update Address'
							},
							user: {
								attributes: {
									firstName: firstName,
									lastName: lastName,
									emailAddress: email,
									address: address,
									city: city,
									zip: zip,
									country: country,
									phone: phone
								}
							}
						});
					})
				]
			},
			{
				name: 'Find Your Bra Size',
				isMatch: () => {
					return SalesforceInteractions.cashDom('#bra-measurement-calculator').length > 0;
				},
				interaction: {
					name: 'Find Your Bra Size'
				}
			},
			{
				name: 'Felina Rewards',
				isMatch: () => {
					return SalesforceInteractions.cashDom('#felina-rewards').length > 0;
				},
				interactions: {
					name: 'Felina Rewards'
				}
			},
			{
				name: 'Customer Reviews',
				isMatch: () => {
					return SalesforceInteractions.cashDom('#felina-com-reviews-bras-panties-lounge-lingerie').length > 0;
				},
				interaction: {
					name: 'Customer Reviews'
				}
			},
			{
				name: 'Felina in the Press',
				isMatch: () => {
					return SalesforceInteractions.cashDom('#felina-in-the-press').length > 0;
				},
				interaction: {
					name: 'Felina in the Press'
				}
			},
			{
				name: 'Felina Journal',
				isMatch: () => {
					return SalesforceInteractions.cashDom('#the-felina-journal').length > 0;
				},
				interaction: {
					name: 'Felina Journal'
				}
			},
			{
				name: 'Felina Journal Detail Page',
				isMatch: () => {
					return SalesforceInteractions.cashDom('#the-felina-journal').length == 0 && window.location.pathname.includes('/blogs/the-felina-journal');
				},
				interaction: {
					name: SalesforceInteractions.CatalogObjectInteractionName.ViewCatalogObject,
					catalogObject: {
						type: 'Blog',
						id: () => {
							return SalesforceInteractions.resolvers.fromMeta('og:title')();
						},
						attributes: {
							name: () => {
								return SalesforceInteractions.resolvers.fromMeta('og:title')();
							},
							description: () => {
								return SalesforceInteractions.resolvers.fromMeta('description')();
							},
							url: window.location.href,
							imageUrl: () => {
								return SalesforceInteractions.resolvers.fromMeta('og:image')();
							}
						}
					}
				}
			},
			{
				name: 'FAQs',
				isMatch: () => {
					return SalesforceInteractions.cashDom('#hc-faq-content-wrapper').length > 0;
				},
				interaction: {
					name: 'FAQs'
				}
			},
			{
				name: 'Accessibility',
				isMatch: () => {
					return SalesforceInteractions.cashDom('#felina-accessibility-statement').length > 0;
				},
				interaction: {
					name: 'Accessibility'
				}
			},
			{
				name: 'Terms and Conditions',
				isMatch: () => {
					return SalesforceInteractions.cashDom('#terms-of-service').length > 0;
				},
				interaction: {
					name: 'Terms and Conditions'
				}
			},
			{
				name: 'Privacy and Policy',
				isMatch: () => {
					return SalesforceInteractions.cashDom('#privacy-amp-cookie-policy').length > 0;
				},
				interaction: {
					name: 'Privacy and Policy'
				}
			}
		]
	};

	SalesforceInteractions.initSitemap(config);
});
