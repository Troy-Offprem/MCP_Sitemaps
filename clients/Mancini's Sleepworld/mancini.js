Evergage.init({}).then(() => {
	console.log('ver: 10');

	// helpers
	const getPageType = () => {
		let pageType;
		if (window.location.pathname.indexOf('/customer/account/login') > -1) {
			pageType = 'login';
		} else if (window.location.pathname.indexOf('/mattresses/') > -1 && window.location.pathname.toLowerCase().split('/').filter(Boolean).length == 2) {
			pageType = 'mattress-filter-page';
		} else if (window.location.pathname.indexOf('/furniture/') > -1 && window.location.pathname.toLowerCase().split('/').filter(Boolean).length == 2) {
			pageType = 'furniture-subcategory-page';
		} else if (window.location.pathname.indexOf('/furniture/') > -1 && window.location.pathname.toLowerCase().split('/').filter(Boolean).length == 3) {
			pageType = 'furniture-filter-page';
		} else if (window.location.pathname.indexOf('/bedding/') > -1 && window.location.pathname.toLowerCase().split('/').filter(Boolean).length == 2) {
			pageType = 'bedding-subcategory-page';
		} else if (window.location.pathname.indexOf('/bedding/') > -1 && window.location.pathname.toLowerCase().split('/').filter(Boolean).length == 3) {
			pageType = 'bedding-filter-page';
		} else if (window.location.pathname.indexOf('/locations/') > -1 && window.location.pathname.toLowerCase().split('/').filter(Boolean).length == 2) {
			pageType = 'store-locator-details';
		} else if (window.location.pathname.indexOf('/sleep-tips/') > -1 && window.location.pathname.toLowerCase().split('/').filter(Boolean).length == 2) {
			pageType = 'blog-category-page';
		} else if (window.location.pathname.indexOf('/sleep-tips/') > -1 && window.location.pathname.toLowerCase().split('/').filter(Boolean).length == 3) {
			pageType = 'blog-post-page';
		} else if (window.location.pathname.indexOf('/brand/') > -1 && window.location.pathname.toLowerCase().split('/').filter(Boolean).length == 2) {
			pageType = 'brand-landing-page';
		} else {
			switch (window.location.pathname.toLowerCase()) {
				case '/':
					pageType = 'home';
					break;
				case '/matress-deals/':
					pageType = 'other';
					break;
				case '/financing-option/':
					pageType = 'other';
					break;
				case '/flash-sale/':
					pageType = 'other';
					break;
				case '/about-us/':
					pageType = 'other';
					break;
				case '/mattress-finder/':
					pageType = 'other';
					break;
				case '/sleepmatch/':
					pageType = 'other';
					break;
				case '/privacy-policy/':
					pageType = 'other';
					break;
				case '/social-responsibility/':
					pageType = 'other';
					break;
				case '/sweepstakes-rules/':
					pageType = 'other';
					break;
				case '/terms-conditions/':
					pageType = 'other';
					break;
				case '/faq/':
					pageType = 'other';
					break;
				case '/contact-us/':
					pageType = 'contact-us';
					break;
				case '/customer/account/create/':
					pageType = 'register';
					break;
				case '/mattress-store/':
					pageType = 'mattress-landing-page';
					break;
				case '/customer/account/edit/':
					pageType = 'account-edit';
					break;
				case '/customer/address/new/':
					pageType = 'account-address-new';
					break;
				case '/checkout/onepage/success/':
					pageType = 'order-confirmation';
					break;
				case '/mattress-by-size/':
					pageType = 'mattress-by-size-landing-page';
					break;
				case '/mattress-by-type/':
					pageType = 'mattress-by-type-landing-page';
					break;
				case '/mattress-by-comfort/':
					pageType = 'mattress-by-comfort-landing-page';
					break;
				case '/bed-in-a-box/':
					pageType = 'bed-in-a-box-landing-page';
					break;
				case '/furniture-store/':
					pageType = 'furniture-landing-page';
					break;
				case '/furniture/':
					pageType = 'furniture-category-page';
					break;
				case '/bedding-store/':
					pageType = 'bedding-landing-page';
					break;
				case '/bedding/':
					pageType = 'bedding-category-page';
					break;
				case '/locations/':
					pageType = 'store-locator-list-page';
					break;
				case '/faq/':
					pageType = 'faq-page';
					break;
				case '/sleep-tips/':
					pageType = 'blog-list-page';
					break;
				case '/mattresses/':
					pageType = 'mattress-category-page';
					break;
				case '/all-mattress-brand/':
					pageType = 'mattress-brand-landing-page';
					break;
			}
		}
		return pageType;
	};

	const findDimension = (dimensionString, dimensionArray) => {
		for (var i = 0; i < dimensionArray.length; i++) {
			if (dimensionArray[i].indexOf(dimensionString) >= 0) {
				return dimensionArray[i].split(' ').pop();
			}
		}
		return null;
	};

	//**** datalyaer.push handler ****//
	const dlPushHandler = {
		apply: function (target, thisArg, args) {
			if (args[0].event) {
				if (args[0].event == 'addToCart') {
					let lineItem = {
						_id: args[0].ecommerce.add.products[0].id,
						price: parseFloat(args[0].ecommerce.add.products[0].price),
						quantity: parseInt(args[0].ecommerce.add.products[0].quantity)
					};
					Evergage.sendEvent({
						action: 'AddToCart',
						itemAction: Evergage.ItemAction.AddToCart,
						cart: {
							singleLine: {
								Product: lineItem
							}
						}
					});
				} else if (args[0].event == 'removeFromCart') {
					let lineItem = {
						_id: args[0].ecommerce.remove.products[0].id,
						price: parseFloat(args[0].ecommerce.remove.products[0].price),
						quantity: 0
					};
					Evergage.sendEvent({
						action: 'RemoveFromCart',
						itemAction: Evergage.ItemAction.UpdateLineItem,
						cart: {
							singleLine: {
								Product: lineItem
							}
						}
					});
				}
			}
			return Reflect.apply(target, thisArg, args);
		}
	};
	//**** end datalyaer.push handler ****//

	const config = {
		global: {
			onActionEvent: (actionEvent) => {
				//The below should only be uncommented while testing - shows up in developer console
				//console.log("evg: ", actionEvent);
				//
				return actionEvent;
				//
			},
			listeners: [
				//FOOTER EMAIL SIGNUP
				Evergage.listener('submit', '.subscribe', () => {
					const email = Evergage.cashDom(".subscribe input[name='email']").val();
					let actionEvent = {
						user: {
							attributes: {
								emailAddress: email
							}
						},
						action: 'Email Sign Up - Footer'
					};
					if (email) {
						actionEvent.user.id = email;
					}
					Evergage.sendEvent(actionEvent);
				}),

				Evergage.listener('click', '.action.custom-wishlist', (e) => {
					if (e.srcElement.parentElement && e.srcElement.parentElement.attributes && e.srcElement.parentElement.attributes['title'] && e.srcElement.parentElement.attributes['title']['value'] == 'Add to Wish List') {
						const id = e.srcElement.parentElement.attributes['data-productsku']['value'];
						Evergage.sendEvent({
							action: 'Add To WishList',
							itemAction: Evergage.ItemAction.Favorite,
							catalog: {
								Product: {
									_id: id
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
				name: 'home',
				action: 'Home',
				isMatch: () =>
					new Promise((resolve, reject) => {
						let intervalId = setInterval(() => {
							if (getPageType() === 'home') {
								clearInterval(intervalId);
								resolve(true);
							}
						}, 2000);
					}),
				contentZones: [
					{ name: 'product_recomm', selector: '#home-product-recommend-widget' },
					{ name: 'matress_deals', selector: '.home-page-matress-deals' }
				]
			},
			{
				name: 'mattress-filter-page',
				action: 'Mattress Filter Page',
				isMatch: () =>
					new Promise((resolve, reject) => {
						let intervalId = setInterval(() => {
							if (getPageType() === 'mattress-filter-page') {
								clearInterval(intervalId);
								resolve(true);
							}
						}, 2000);
					})
			},
			{
				name: 'mattress-brand-landing-page',
				action: 'Mattress Brand Landing Page',
				isMatch: () =>
					new Promise((resolve, reject) => {
						let intervalId = setInterval(() => {
							if (getPageType() === 'mattress-brand-landing-page') {
								clearInterval(intervalId);
								resolve(true);
							}
						}, 2000);
					})
			},
			{
				name: 'brand-landing-page',
				action: 'Brand Landing Page',
				isMatch: () =>
					new Promise((resolve, reject) => {
						let intervalId = setInterval(() => {
							if (getPageType() === 'brand-landing-page') {
								clearInterval(intervalId);
								resolve(true);
							}
						}, 2000);
					})
			},
			{
				name: 'other',
				action: 'Other',
				isMatch: () =>
					new Promise((resolve, reject) => {
						let intervalId = setInterval(() => {
							if (getPageType() === 'other') {
								clearInterval(intervalId);
								resolve(true);
							}
						}, 2000);
					}),
				catalog: {
					Article: {
						_id: () => Evergage.util.getLastPathComponentWithoutExtension(window.location.pathname).toLowerCase(),
						name: () => Evergage.cashDom("meta[name='title']").first().attr('content'),
						url: Evergage.resolvers.fromCanonical()
					}
				}
			},
			{
				name: 'other',
				action: 'Other',
				isMatch: () =>
					new Promise((resolve, reject) => {
						let intervalId = setInterval(() => {
							if (getPageType() === 'contact-us') {
								clearInterval(intervalId);
								resolve(true);
							}
						}, 2000);
					}),
				catalog: {
					Article: {
						_id: () => Evergage.util.getLastPathComponentWithoutExtension(window.location.pathname).toLowerCase(),
						name: () => Evergage.cashDom("meta[name='title']").first().attr('content'),
						url: Evergage.resolvers.fromCanonical()
					}
				},
				listeners: [
					Evergage.listener('submit', '#contact-form', () => {
						const name = Evergage.cashDom('#name').val();
						const phone = Evergage.cashDom('#telephone').val();
						const email = Evergage.cashDom('#email').val();

						if (email) {
							Evergage.sendEvent({ action: 'Contact-Us Form Submit', user: { id: email, attributes: { emailAddress: email, telephone: phone, fullName: name } } });
						}
					})
				]
			},
			{
				name: 'login',
				action: 'Login',
				isMatch: () =>
					new Promise((resolve, reject) => {
						let intervalId = setInterval(() => {
							if (getPageType() === 'login') {
								clearInterval(intervalId);
								resolve(true);
							}
						}, 2000);
					}),
				listeners: [
					Evergage.listener('submit', '#login-form', () => {
						const email = Evergage.cashDom('#loginEmail').val();
						if (email) {
							Evergage.sendEvent({ action: 'Login Form Submit', user: { id: email, attributes: { emailAddress: email } } });
						}
					})
				]
			},
			{
				name: 'register',
				action: 'Register',
				isMatch: () =>
					new Promise((resolve, reject) => {
						let intervalId = setInterval(() => {
							if (getPageType() === 'register') {
								clearInterval(intervalId);
								resolve(true);
							}
						}, 2000);
					}),
				listeners: [
					Evergage.listener('submit', '#form-validate', () => {
						const fname = Evergage.cashDom('#firstname').val();
						const lname = Evergage.cashDom('#lastname').val();
						const email = Evergage.cashDom('#email_address').val();
						const phone = Evergage.cashDom('#mobile').val();

						if (email) {
							Evergage.sendEvent({ action: 'Register Form Submit', user: { id: email, attributes: { emailAddress: email, telephone: phone, firstName: fname, lastName: lname } } });
						}
					})
				]
			},
			{
				name: 'account',
				action: 'Account',
				isMatch: () =>
					new Promise((resolve, reject) => {
						let intervalId = setInterval(() => {
							if (getPageType() === 'account-edit') {
								clearInterval(intervalId);
								resolve(true);
							}
						}, 2000);
					}),
				listeners: [
					Evergage.listener('submit', '#form-validate', () => {
						const fname = Evergage.cashDom('#firstname').val();
						const lname = Evergage.cashDom('#lastname').val();

						if (email) {
							Evergage.sendEvent({ action: 'Account Edit Submit', user: { id: email, attributes: { emailAddress: email, firstName: fname, lastName: lname } } });
						}
					})
				]
			},
			{
				name: 'mattress-landing-page',
				action: 'Mattress Landing Page',
				isMatch: () =>
					new Promise((resolve, reject) => {
						let intervalId = setInterval(() => {
							if (getPageType() === 'mattress-landing-page') {
								clearInterval(intervalId);
								resolve(true);
							}
						}, 2000);
					}),
				catalog: {
					Article: {
						_id: () => Evergage.util.getLastPathComponentWithoutExtension(window.location.pathname).toLowerCase(),
						name: () => Evergage.cashDom("meta[name='title']").first().attr('content'),
						url: Evergage.resolvers.fromCanonical()
					}
				}
			},
			{
				name: 'mattress-category-page',
				action: 'Mattress Category Page',
				isMatch: () =>
					new Promise((resolve, reject) => {
						let intervalId = setInterval(() => {
							if (getPageType() === 'mattress-category-page') {
								clearInterval(intervalId);
								resolve(true);
							}
						}, 2000);
					})
			},
			{
				name: 'mattress-by-size-landing-page',
				action: 'Mattress By Size Landing Page',
				isMatch: () =>
					new Promise((resolve, reject) => {
						let intervalId = setInterval(() => {
							if (getPageType() === 'mattress-by-size-landing-page') {
								clearInterval(intervalId);
								resolve(true);
							}
						}, 2000);
					})
			},
			{
				name: 'mattress-by-type-landing-page',
				action: 'Mattress By Type Landing Page',
				isMatch: () =>
					new Promise((resolve, reject) => {
						let intervalId = setInterval(() => {
							if (getPageType() === 'mattress-by-type-landing-page') {
								clearInterval(intervalId);
								resolve(true);
							}
						}, 2000);
					})
			},
			{
				name: 'mattress-by-comfort-landing-page',
				action: 'Mattress By Comfort Landing Page',
				isMatch: () =>
					new Promise((resolve, reject) => {
						let intervalId = setInterval(() => {
							if (getPageType() === 'mattress-by-comfort-landing-page') {
								clearInterval(intervalId);
								resolve(true);
							}
						}, 2000);
					})
			},
			{
				name: 'bed-in-a-box-landing-page',
				action: 'Bed in a Box Landing Page',
				isMatch: () =>
					new Promise((resolve, reject) => {
						let intervalId = setInterval(() => {
							if (getPageType() === 'bed-in-a-box-landing-page') {
								clearInterval(intervalId);
								resolve(true);
							}
						}, 2000);
					})
			},
			{
				name: 'furniture-landing-page',
				action: 'Furniture Landing Page',
				isMatch: () =>
					new Promise((resolve, reject) => {
						let intervalId = setInterval(() => {
							if (getPageType() === 'furniture-landing-page') {
								clearInterval(intervalId);
								resolve(true);
							}
						}, 2000);
					})
			},
			{
				name: 'furniture-category-page',
				action: 'Furniture Category Page',
				isMatch: () =>
					new Promise((resolve, reject) => {
						let intervalId = setInterval(() => {
							if (getPageType() === 'furniture-category-page') {
								clearInterval(intervalId);
								resolve(true);
							}
						}, 2000);
					})
			},
			{
				name: 'furniture-subcategory-page',
				action: 'Furniture Subcategory Page',
				isMatch: () =>
					new Promise((resolve, reject) => {
						let intervalId = setInterval(() => {
							if (getPageType() === 'furniture-subcategory-page') {
								clearInterval(intervalId);
								resolve(true);
							}
						}, 2000);
					})
			},
			{
				name: 'furniture-filter-page',
				action: 'Furniture Filter Page',
				isMatch: () =>
					new Promise((resolve, reject) => {
						let intervalId = setInterval(() => {
							if (getPageType() === 'furniture-filter-page') {
								clearInterval(intervalId);
								resolve(true);
							}
						}, 2000);
					})
			},
			{
				name: 'bedding-landing-page',
				action: 'Bedding Landing Page',
				isMatch: () =>
					new Promise((resolve, reject) => {
						let intervalId = setInterval(() => {
							if (getPageType() === 'bedding-landing-page') {
								clearInterval(intervalId);
								resolve(true);
							}
						}, 2000);
					})
			},
			{
				name: 'bedding-category-page',
				action: 'Bedding Category Page',
				isMatch: () =>
					new Promise((resolve, reject) => {
						let intervalId = setInterval(() => {
							if (getPageType() === 'bedding-category-page') {
								clearInterval(intervalId);
								resolve(true);
							}
						}, 2000);
					})
			},
			{
				name: 'bedding-subcategory-page',
				action: 'Bedding Subcategory Page',
				isMatch: () =>
					new Promise((resolve, reject) => {
						let intervalId = setInterval(() => {
							if (getPageType() === 'bedding-subcategory-page') {
								clearInterval(intervalId);
								resolve(true);
							}
						}, 2000);
					})
			},
			{
				name: 'bedding-filter-page',
				action: 'Bedding Filter Page',
				isMatch: () =>
					new Promise((resolve, reject) => {
						let intervalId = setInterval(() => {
							if (getPageType() === 'bedding-filter-page') {
								clearInterval(intervalId);
								resolve(true);
							}
						}, 2000);
					})
			},
			{
				name: 'store-locator-list-page',
				action: 'Store Locator List Page',
				isMatch: () =>
					new Promise((resolve, reject) => {
						let intervalId = setInterval(() => {
							if (getPageType() === 'store-locator-list-page') {
								clearInterval(intervalId);
								resolve(true);
							}
						}, 2000);
					})
			},
			{
				name: 'store-locator-details',
				action: 'Store Locator Details',
				isMatch: () =>
					new Promise((resolve, reject) => {
						let intervalId = setInterval(() => {
							if (getPageType() === 'store-locator-details') {
								clearInterval(intervalId);
								resolve(true);
							}
						}, 2000);
					})
			},
			{
				name: 'faq-page',
				action: 'FAQ Page',
				isMatch: () =>
					new Promise((resolve, reject) => {
						let intervalId = setInterval(() => {
							if (getPageType() === 'faq-page') {
								clearInterval(intervalId);
								resolve(true);
							}
						}, 2000);
					})
			},
			{
				name: 'blog-list-page',
				action: 'Blog List Page',
				isMatch: () =>
					new Promise((resolve, reject) => {
						let intervalId = setInterval(() => {
							if (getPageType() === 'blog-list-page') {
								clearInterval(intervalId);
								resolve(true);
							}
						}, 2000);
					})
			},
			{
				name: 'blog-category-page',
				action: 'Blog Category Page',
				isMatch: () =>
					new Promise((resolve, reject) => {
						let intervalId = setInterval(() => {
							if (getPageType() === 'blog-category-page') {
								clearInterval(intervalId);
								resolve(true);
							}
						}, 2000);
					})
			},
			{
				name: 'blog-post-page',
				action: 'Blog Post Page',
				isMatch: () =>
					new Promise((resolve, reject) => {
						let intervalId = setInterval(() => {
							if (getPageType() === 'blog-post-page') {
								clearInterval(intervalId);
								resolve(true);
							}
						}, 2000);
					})
			},
			{
				name: 'product-detail',
				action: 'Product Detail Page',
				isMatch: () =>
					new Promise((resolve, reject) => {
						let intervalId = setInterval(() => {
							if (
								Evergage.cashDom("meta[property='" + 'og:type' + "']")
									.first()
									.attr('content') == 'product'
							) {
								clearInterval(intervalId);
								resolve(true);
							}
						}, 2000);
					}),
				catalog: {
					Product: {
						_id: () => {
							if (window.dataLayer && window.dataLayer[0] && window.dataLayer[0]['ecommerce'] && window.dataLayer[0]['ecommerce']['detail'] && window.dataLayer[0]['ecommerce']['detail']['products'] && window.dataLayer[0]['ecommerce']['detail']['products'][0] && window.dataLayer[0]['ecommerce']['detail']['products'][0]['id']) {
								return window.dataLayer[0]['ecommerce']['detail']['products'][0]['id'];
							} else {
								return false;
							}
						}
					}
				},
				listeners: []
			},
			{
				name: 'cart',
				action: 'Cart',
				isMatch: () =>
					new Promise((resolve, reject) => {
						let intervalId = setInterval(() => {
							if (
								Evergage.cashDom("meta[name='" + 'title' + "']")
									.first()
									.attr('content') == 'Shopping Cart'
							) {
								clearInterval(intervalId);
								resolve(true);
							}
						}, 3000);
					}),
				itemAction: Evergage.ItemAction.ViewCart,
				catalog: {
					Product: {
						lineItems: {
							_id: () => {
								return Evergage.resolvers.fromSelectorAttributeMultiple('#shopping-cart-table .item-info .control-qty .input-text.qty', 'data-cart-item-id', (ids) => {
									return ids.map((id) => {
										return id.trim();
									});
								});
							},
							price: () => {
								return Evergage.resolvers.fromSelectorMultiple('#shopping-cart-table .cart-price-box .cart-price .price', (prices) => {
									return prices.map((price) => {
										return parseFloat(price.trim().replace('$', '').replace(',', ''));
									});
								});
							},
							quantity: () => {
								return Evergage.resolvers.fromSelectorAttributeMultiple('#shopping-cart-table .product-qty .control-qty .input-text', 'value', (quantities) => {
									return quantities.map((quantity) => {
										return parseInt(quantity.trim());
									});
								});
							}
						}
					}
				}
			},
			{
				name: 'order_confirmation',
				action: 'OrderConfirmation',
				isMatch: () =>
					new Promise((resolve, reject) => {
						let intervalId = setInterval(() => {
							if (getPageType() === 'order-confirmation') {
								clearInterval(intervalId);
								resolve(true);
							}
						}, 3000);
					}),
				itemAction: Evergage.ItemAction.Purchase,
				catalog: {
					Product: {
						orderId: () => {
							let reqObj = window.dataLayer.filter((obj) => {
								return obj.pageType == 'purchase';
							});
							return reqObj[0].ecommerce.purchase.actionField.orderId;
						},
						totalValue: () => {
							let reqObj = window.dataLayer.filter((obj) => {
								return obj.pageType == 'purchase';
							});
							return parseFloat(reqObj[0].ecommerce.purchase.actionField.revenue);
						},
						lineItems: {
							_id: () => {
								let reqObj = window.dataLayer.filter((obj) => {
									return obj.pageType == 'purchase';
								});
								return reqObj[0].ecommerce.purchase.products.map((product) => {
									return product.id;
								});
							},
							price: () => {
								let reqObj = window.dataLayer.filter((obj) => {
									return obj.pageType == 'purchase';
								});
								return reqObj[0].ecommerce.purchase.products.map((product) => {
									return parseFloat(product.price);
								});
							},
							quantity: () => {
								let reqObj = window.dataLayer.filter((obj) => {
									return obj.pageType == 'purchase';
								});
								return reqObj[0].ecommerce.purchase.products.map((product) => {
									return parseInt(product.quantity);
								});
							}
						}
					}
				}
			}
		]
	};
	if (window.dataLayer) window.dataLayer.push = new Proxy(window.dataLayer.push, dlPushHandler);
	else {
		let promise = new Promise(function (resolve, reject) {
			let intervalId = setInterval(() => {
				if (window.dataLayer) {
					clearInterval(intervalId);
					window.dataLayer.push = new Proxy(window.dataLayer.push, dlPushHandler);
					resolve(true);
				}
			}, 2000);
		});
	}
	Evergage.initSitemap(config);
});
//sleepworld
