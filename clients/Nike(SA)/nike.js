SalesforceInteractions.init({
	cookieDomain: 'nike.marathon.store'
}).then(() => {
	const config = {
		global: {
			contentZones: [],
			listeners: []
		},
		pageTypes: [
			{
				name: 'Home',
				isMatch: () => {
					return SalesforceInteractions.cashDom('#homepage').length > 0;
				},
				interaction: {
					name: 'Homepage'
				},
				contentZones: [{ name: 'Carousel #1', selector: '#carouselMostPopular' }]
			},
			{
				name: 'Category Landing Page',
				isMatch: () => {
					return SalesforceInteractions.cashDom('#plp').length > 0 || SalesforceInteractions.cashDom('.clp-wrapper').length > 0;
				},
				interaction: {
					name: SalesforceInteractions.CatalogObjectInteractionName.ViewCatalogObject,
					catalogObject: {
						type: 'Category',
						id: () => {
							if (SalesforceInteractions.cashDom('#plp').length > 0) {
								return SalesforceInteractions.resolvers.buildCategoryId('.breadcrumb .breadcrumb-item a', 0, null, (categoryId) => categoryId.toUpperCase())();
							} else if (SalesforceInteractions.cashDom('.clp-wrapper').length > 0) {
								return SalesforceInteractions.resolvers.fromSelector('.category-link a.title')().toUpperCase();
							}
						}
					}
				},
				listeners: [
					SalesforceInteractions.listener('click', '.wishlistTile span i.fa-heart-o', (e) => {
						const productID = SalesforceInteractions.cashDom(e.currentTarget).parents('div.product').attr('data-pid');
						SalesforceInteractions.sendEvent({
							name: SalesforceInteractions.CatalogObjectInteractionName.FavoriteCatalogObject,
							catalogObject: {
								id: () => {
									return productID;
								}
							}
						});
					})
				],
				contentZones: [{ name: 'Category Product Tiles', selector: 'div[itemid="#product"]' }]
			},
			{
				name: 'Search Results Page',
				isMatch: () => {
					return window.location.pathname.includes('/search') && SalesforceInteractions.cashDom('#product-search-results').length > 0;
				},
				interaction: { name: 'Search results page' },
				listeners: [
					SalesforceInteractions.listener('click', '.wishlistTile span i.fa-circle', (e) => {
						const productID = SalesforceInteractions.cashDom(e.currentTarget).parents('div.product').attr('data-pid');
						SalesforceInteractions.sendEvent({
							name: SalesforceInteractions.CatalogObjectInteractionName.FavoriteCatalogObject,
							catalogObject: {
								id: () => {
									return productID;
								}
							}
						});
					})
				]
			},
			{
				name: 'SNKRS Landing Page',
				isMatch: () => {
					return SalesforceInteractions.cashDom('#snkrs-nav').length > 0 && !SalesforceInteractions.cashDom('#pdp-snkrs');
				},
				interaction: {
					name: SalesforceInteractions.CatalogObjectInteractionName.ViewCatalogObject,
					catalogObject: {
						type: 'Category',
						id: () => {
							const tab = SalesforceInteractions.resolvers.fromSelector('#snkrs-nav a.active')();
							if (tab === '') {
								return 'SNKRS';
							} else {
								return `SNKRS|${tab.toUpperCase()}`;
							}
						}
					}
				}
			},
			{
				name: 'Product Detail Page',
				isMatch: () => {
					return SalesforceInteractions.cashDom('#pdp').length > 0 || SalesforceInteractions.cashDom('#pdp-snkrs').length > 0;
				},
				interaction: {
					name: SalesforceInteractions.CatalogObjectInteractionName.ViewCatalogObject,
					catalogObject: {
						type: 'Product',
						id: () => {
							return SalesforceInteractions.resolvers.fromSelectorAttribute('div.product-detail', 'data-pid')();
						},
						attributes: {
							sku: {
								id: () => {
									return SalesforceInteractions.resolvers.fromSelectorAttribute('div.product-detail', 'data-pid')();
								}
							},
							name: () => {
								if (SalesforceInteractions.cashDom('#pdp').length > 0) {
									return SalesforceInteractions.resolvers.fromSelector('h1[data-product-field="name"]')();
								} else if (SalesforceInteractions.cashDom('#pdp-snkrs').length > 0) {
									return SalesforceInteractions.resolvers.fromSelector('span.name-title')();
								}
							},
							price: () => {
								return parseInt(SalesforceInteractions.resolvers.fromSelectorAttribute('#Precio', 'value')()).toFixed(2);
							},
							description: () => {
								return SalesforceInteractions.resolvers.fromSelectorAttribute('#Descripcion', 'value')();
							},
							imageUrl: () => {
								if (SalesforceInteractions.cashDom('#pdp').length > 0) {
									const image = SalesforceInteractions.resolvers.fromSelectorAttribute('.primary-images .image-wrapper img', 'src')();
									return image;
								} else if (SalesforceInteractions.cashDom('#pdp-snkrs').length > 0) {
									const imageSnkr = SalesforceInteractions.resolvers.fromSelectorAttribute('div.primary-images img', 'src')();
									return imageSnkr;
								}
							},
							url: () => {
								return window.location.href;
							},
							currency: 'PEN',
							inventoryCount: () => {
								return parseInt(SalesforceInteractions.resolvers.fromSelectorAttribute('#Inventario', 'value')());
							},
							oferta: () => {
								return SalesforceInteractions.resolvers.fromSelectorAttribute('#Oferta', 'value')();
							},
							jalavista: () => {
								return SalesforceInteractions.resolvers.fromSelectorAttribute('#Jalavista', 'value')();
							},
							lanzamiento: () => {
								return SalesforceInteractions.resolvers.fromSelectorAttribute('#Lanzamiento', 'value')();
							},
							promoflag: () => {
								return SalesforceInteractions.resolvers.fromSelectorAttribute('#PromoFlag', 'value')();
							}
						},
						relatedCatalogObjects: {
							Talla: () => {
								return SalesforceInteractions.resolvers.fromSelectorAttributeMultiple('.attributes .attribute .size-attribute', 'aria-describedby')();
							},
							Color: () => {
								return SalesforceInteractions.resolvers
									.fromSelectorAttributeMultiple('.attributes .attribute .color-attribute', 'aria-label')()
									.map((i) => i.replace('Seleccione color ', ''));
							},
							Category: () => {
								return [SalesforceInteractions.resolvers.fromSelectorAttribute('#Categoria', 'value')()];
							},
							Actividad: () => {
								return [SalesforceInteractions.resolvers.fromSelectorAttribute('#Actividad', 'value')()];
							},
							Linea: () => {
								return [SalesforceInteractions.resolvers.fromSelectorAttribute('#Linea', 'value')()];
							},
							Genero: () => {
								return [SalesforceInteractions.resolvers.fromSelectorAttribute('#Genero', 'value')()];
							},
							Equipo: () => {
								return [SalesforceInteractions.resolvers.fromSelectorAttribute('#Equipo', 'value')()];
							},
							Coleccion: () => {
								return [SalesforceInteractions.resolvers.fromSelectorAttribute('#Coleccion', 'value')()];
							},
							Marca: () => {
								return [SalesforceInteractions.resolvers.fromSelectorAttribute('#Marca', 'value')()];
							},
							Edad: () => {
								return [SalesforceInteractions.resolvers.fromSelectorAttribute('#Edad', 'value')()];
							},
							Grupo: () => {
								return [SalesforceInteractions.resolvers.fromSelectorAttribute('#Grupo', 'value')()];
							}
						}
					}
				},
				listeners: [
					SalesforceInteractions.listener('click', '.add-to-cart', () => {
						const lineItem = SalesforceInteractions.mcis.buildLineItemFromPageState('select.quantity-select option[selected]');
						lineItem.price = SalesforceInteractions.resolvers.fromSelectorAttribute('.prices .price .value', 'content')();
						lineItem.sku = { id: SalesforceInteractions.resolvers.fromJsonLd('sku')() };
						SalesforceInteractions.sendEvent({
							interaction: {
								name: SalesforceInteractions.CartInteractionName.AddToCart,
								lineItem: lineItem
							}
						});
					}),
					SalesforceInteractions.listener('click', '.add-to-wish-list', () => {
						SalesforceInteractions.sendEvent({
							name: SalesforceInteractions.CatalogObjectInteractionName.FavoriteCatalogObject,
							catalogObject: {
								id: () => {
									return SalesforceInteractions.resolvers.fromSelector('span.product-id')();
								}
							}
						});
					})
				],
				contentZones: [{ name: 'Product recommendation carousel', selector: '.experience-nike_layouts-carouselSimple' }]
			},
			{
				name: 'Cart',
				isMatch: () => {
					return SalesforceInteractions.cashDom('.cart').length > 0;
				},
				interaction: {
					name: SalesforceInteractions.CartInteractionName.ReplaceCart,
					lineItems: SalesforceInteractions.DisplayUtils.pageElementLoaded('.cart-page, .checkout-continue', 'html').then(() => {
						const cartLineItems = [];
						SalesforceInteractions.cashDom('.product-info').each((index, ele) => {
							const itemQuantity = parseInt(SalesforceInteractions.cashDom(ele).find('.quantity option[selected]').text());
							if (itemQuantity && itemQuantity > 0) {
								const lineItem = {
									catalogObjectType: 'Product',
									catalogObjectId: SalesforceInteractions.cashDom(ele).find('.line-item-quantity select.quantity').attr('data-pid'),
									price: SalesforceInteractions.cashDom(ele).find('.price .sales .value').attr('content'),
									quantity: itemQuantity
								};
								cartLineItems.push(lineItem);
							}
						});
						return cartLineItems;
					})
				},
				contentZones: [{ name: 'Cart Carousel', selector: '.homepage-product-listing' }]
			},
			{
				name: 'Checkout',
				isMatch: () => {
					return SalesforceInteractions.cashDom('#checkout-main').length > 0;
				},
				interaction: {
					name: 'Checkout'
				},
				listeners: [
					SalesforceInteractions.listener('click', '.submit-shipping', (e) => {
						const $form = SalesforceInteractions.cashDom(e.currentTarget).parents('#dwfrm_shipping');
						const firstName = $form.find('#shippingFirstNamedefault').val();
						const lastName = $form.find('#shippingLastNamedefault').val();
						const address = $form.find('#shippingAddressOnedefault').val();
						const departamento = $form.find('#shippingDepartmentdefault').val();
						const provincia = $form.find('#shippingProvincedefault').val();
						const distrito = $form.find('#shippingDistrictdefault').val();
						const zip = $form.find('#shippingZipCodedefault').val();
						const phone = $form.find('#shippingPhoneNumberdefault').val();
						if (SalesforceInteractions.resolvers.fromSelectorAttribute('a.ship-to-store', 'href')() === '#menu2') {
							return;
						} else {
							SalesforceInteractions.sendEvent({
								interaction: { name: 'Checkout - Shipping Address' },
								user: {
									attributes: {
										firstName: firstName,
										lastName: lastName,
										address: address,
										departamento: departamento,
										provincia: provincia,
										distrito: distrito,
										zip: zip,
										phone: phone
									}
								}
							});
						}
						SalesforceInteractions.reinit();
					}),
					SalesforceInteractions.listener('click', '.submit-payment', (e) => {
						const $form = SalesforceInteractions.cashDom(e.currentTarget).parents('#accordion-billing');
						const firstName = $form.find('#billingFirstName').val();
						const lastName = $form.find('#billingLastName').val();
						const address = $form.find('#billingAddressOne').val();
						const departamento = $form.find('#billingDepartment').val();
						const provincia = $form.find('#billingProvince').val();
						const distrito = $form.find('#billingDistrict').val();
						const zip = $form.find('#billingZipCode').val();
						SalesforceInteractions.sendEvent({
							interaction: { name: 'Checkout - Billing Address' },
							user: {
								attributes: {
									firstName: firstName,
									lastName: lastName,
									billingAddress: address,
									billingDepartamento: departamento,
									billingProvincia: provincia,
									billingDistrito: distrito,
									billingZip: zip
								}
							}
						});
						SalesforceInteractions.reinit();
					})
				]
			},
			{
				name: 'Order Confirmation',
				isMatch: () => {
					return SalesforceInteractions.cashDom('.receipt').length > 0;
				},
				interaction: {
					name: SalesforceInteractions.OrderInteractionName.Purchase,
					order: {
						id: () => {
							SalesforceInteractions.DisplayUtils.pageElementLoaded('.order-number', 'html').then((ele) => {
								return SalesforceInteractions.resolvers.fromSelector('.order-number')();
							});
						},
						lineItems: SalesforceInteractions.DisplayUtils.pageElementLoaded('.product-line-item', 'html').then(() => {
							const purchaseLineItems = [];
							SalesforceInteractions.cashDom('.product-line-item').each((index, ele) => {
								const itemQuantity = parseInt(SalesforceInteractions.cashDom(ele).find('.qty-card-quantity-count').text());
								if (itemQuantity && itemQuantity > 0) {
									const lineItem = {
										catalogObjectType: 'Product',
										catalogObjectId: SalesforceInteractions.cashDom(ele).find('.lineItem-id .line-item-attributes:not(.mr-2)').text(),
										price: SalesforceInteractions.cashDom(ele).find('.price .value').attr('content'),
										quantity: itemQuantity
									};
									purchaseLineItems.push(lineItem);
								}
							});
							return purchaseLineItems;
						})
					}
				}
			},
			{
				name: 'Register',
				isMatch: () => {
					return SalesforceInteractions.cashDom('.login-page').length > 0 && SalesforceInteractions.cashDom('form.register').length > 0;
				},
				interaction: {
					name: 'Register'
				},
				listeners: [
					SalesforceInteractions.listener('click', 'button[type="submit"]', (e) => {
						const $form = SalesforceInteractions.cashDom(e.currentTarget).parents('form.registration');
						const email = $form.find('#registration-form-email').val();
						const firstName = $form.find('#registration-form-fname').val();
						const lastName = $form.find('#registration-form-lname').val();
						const birthday = $form.find('#birthday').val();
						SalesforceInteractions.sendEvent({
							interaction: { name: 'Register for Account' },
							user: {
								attributes: {
									firstName: firstName,
									emailAddress: email,
									lastName: lastName,
									birthday: birthday
								}
							}
						});
					})
				]
			},
			{
				name: 'Track Order',
				isMatch: () => {
					return SalesforceInteractions.cashDom('.login-page').length > 0 && SalesforceInteractions.cashDom('form.trackorder').length > 0;
				},
				interaction: {
					name: 'Track Order'
				},
				listeners: [
					SalesforceInteractions.listener('click', 'button[type="submit"]', (e) => {
						const $form = SalesforceInteractions.cashDom(e.currentTarget).parents('form.trackorder');
						const email = $form.find('#trackorder-form-email').val();
						SalesforceInteractions.sendEvent({
							interaction: { name: 'Track Order' },
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
				name: 'Login',
				isMatch: () => {
					return SalesforceInteractions.cashDom('.login-page').length > 0 && SalesforceInteractions.cashDom('form.login').length > 0;
				},
				interaction: {
					name: 'Login'
				},
				listeners: [
					SalesforceInteractions.listener('click', 'button[type="submit"]', (e) => {
						const $form = SalesforceInteractions.cashDom(e.currentTarget).parents('form.login');
						const email = $form.find('#login-form-email').val();
						SalesforceInteractions.sendEvent({
							interaction: { name: 'Login' },
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
				name: 'Ayuda',
				isMatch: () => {
					return window.location.pathname.includes('/ayuda/');
				},
				interaction: {
					name: 'Ayuda'
				}
			},
			{
				name: 'Join Us',
				isMatch: () => {
					return SalesforceInteractions.cashDom('#join-us').length > 0;
				},
				interaction: {
					name: 'Join Us'
				}
			},
			{
				name: 'User Dashboard',
				isMatch: () => {
					return SalesforceInteractions.cashDom('#dashboard-wrapper').length > 0 && SalesforceInteractions.cashDom('.wishlist-container').length === 0;
				},
				interaction: {
					name: 'User Dashboard'
				}
			},
			{
				name: 'Order History',
				isMatch: () => {
					return SalesforceInteractions.cashDom('#order-list-wrapper').length > 0;
				},
				interaction: {
					name: 'Order History'
				}
			},
			{
				name: 'Favorites',
				isMatch: () => {
					return SalesforceInteractions.cashDom('.wishlist-container').length > 0;
				},
				interaction: {
					name: 'Favorites'
				},
				listeners: [
					SalesforceInteractions.listener('click', '.add-to-cart', (e) => {
						const $productCard = SalesforceInteractions.cashDom(e.currentTarget).parents('.product-info');
						const productId = $productCard.find('button.add-to-cart').attr('data-pid');
						const price = $productCard.find('.price .sales .value').attr('content');
						const lineItem = {};
						lineItem.catalogObjectType = 'Product';
						lineItem.catalogObjectId = productId;
						lineItem.price = price;
						lineItem.quantity = 1;
						SalesforceInteractions.sendEvent({
							interaction: {
								name: SalesforceInteractions.CartInteractionName.AddToCart,
								lineItem: lineItem
							}
						});
					})
				]
			},
			{
				name: 'Shipping Policy',
				isMatch: () => {
					return SalesforceInteractions.cashDom('#politicas-de-envio').length > 0;
				},
				interaction: {
					name: 'Shipping Policy'
				}
			},
			{
				name: 'Returns',
				isMatch: () => {
					return SalesforceInteractions.cashDom('#cambios-devoluciones-y-garantias').length > 0;
				},
				interaction: {
					name: 'Returns'
				}
			},
			{
				name: 'Help Page',
				isMatch: () => {
					return window.location.pathname.includes('/ayuda/#contacts');
				},
				interaction: {
					name: 'Help Page'
				}
			},
			{
				name: 'Privacy Policy',
				isMatch: () => {
					return SalesforceInteractions.cashDom('#politicas-de-privacidad').length > 0;
				},
				interaction: {
					name: 'Privacy Policy'
				}
			},
			{
				name: 'Terms and Conditions',
				isMatch: () => {
					return SalesforceInteractions.cashDom('#terminos-y-condiciones').length > 0;
				},
				interaction: {
					name: 'Terms and Conditions'
				}
			},
			{
				name: 'Giftcards',
				isMatch: () => {
					return SalesforceInteractions.cashDom('#giftcards').length > 0;
				},
				interaction: {
					name: 'Giftcards'
				}
			},
			{
				name: 'Store Locator',
				isMatch: () => {
					return SalesforceInteractions.cashDom('.store-locator-container').length > 0;
				},
				interaction: {
					name: 'Store Locator'
				}
			},
			{
				name: 'Find out first',
				isMatch: () => {
					return SalesforceInteractions.cashDom('.newsletter-subscribe').length > 0;
				},
				interaction: {
					name: 'Find out first'
				},
				listeners: [
					SalesforceInteractions.listener('click', '.btn-login', (e) => {
						const $form = SalesforceInteractions.cashDom(e.currentTarget).parents('form');
						const email = $form.find('#login-form-email').val();
						const birthday = $form.find('#birthday').val();
						SalesforceInteractions.sendEvent({
							interaction: { name: 'Newsletter Sign up' },
							user: {
								attributes: {
									email: email,
									birthday: birthday
								}
							}
						});
					})
				]
			},
			{
				name: 'Careers',
				isMatch: () => {
					return SalesforceInteractions.cashDom('#trabaja-con-nosotros').length > 0;
				},
				interaction: {
					name: 'Careers'
				}
			},
			{
				name: 'Checkout Login',
				isMatch: () => {
					return SalesforceInteractions.cashDom('#checkout-login-container').length > 0;
				},
				interaction: {
					name: 'Checkout Login'
				}
			}
		]
	};
	SalesforceInteractions.initSitemap(config);
});
