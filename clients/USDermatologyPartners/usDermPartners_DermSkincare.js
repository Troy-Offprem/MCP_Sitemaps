const getCookieDomain = () => {
	const currentDomain = window.location.hostname;
	if (currentDomain === 'www.usdermatologypartners.com') {
		return 'www.usdermatologypartners.com';
	} else if (currentDomain === 'dermskincare.com') {
		return 'dermskincare.com';
	}
};
const currentCookieDomain = getCookieDomain();

Evergage.init({
	cookieDomain: currentCookieDomain
}).then(() => {
	const configA = {
		global: {
			listeners: [
				Evergage.listener('click', '#gform_submit_button_23', () => {
					const email = Evergage.cashDom('#input_23_1').val();
					Evergage.sendEvent({
						name: 'USDP Newsletter Signup',
						action: 'USDP Newsletter Signup',
						user: {
							id: email
						}
					});
				})
			]
		},
		pageTypeDefault: {
			name: 'default'
		},
		pageTypes: [
			{
				name: 'Home - USDP',
				action: 'USDP Home | View',
				isMatch: () => {
					return Evergage.DisplayUtils.pageElementLoaded('body', 'html').then((ele) => {
						return Evergage.cashDom('.home').length > 0;
					});
				},
				contentZones: [{ name: 'Blog Posts', selector: '#InteractionStudio' }]
			},
			{
				name: 'Services Landing Page - USDP',
				action: 'USDP Services Landing Page | View',
				isMatch: () => {
					return Evergage.DisplayUtils.pageElementLoaded('body', 'html').then((ele) => {
						return Evergage.cashDom('.services-hero').length > 0;
					});
				}
			},
			{
				name: 'Services Detail Page - USDP',
				action: 'USDP Services Detail Page | View',
				isMatch: () => {
					return Evergage.DisplayUtils.pageElementLoaded('body', 'html').then((ele) => {
						return Evergage.cashDom('.single-service').length > 0;
					});
				},
				catalog: {
					Article: {
						_id: () => {
							return Evergage.resolvers.fromMeta('og:title')().split(' | ')[0];
						},
						name: () => {
							return Evergage.resolvers.fromMeta('og:title')().split(' | ')[0];
						},
						url: () => {
							return Evergage.resolvers.fromMeta('og:url')();
						},
						imageUrl: () => {
							return Evergage.resolvers.fromMeta('og:image')();
						},
						description: () => {
							return Evergage.resolvers.fromMeta('og:description')();
						},
						categories: () => {
							return Evergage.resolvers.buildCategoryId('.bread-crumbs a', 1, 3, (categoryId) => [categoryId])();
						}
					}
				}
			},
			{
				name: 'Blog Landing Page - USDP',
				action: 'USDP Blog Landing Page | View',
				isMatch: () => {
					return Evergage.DisplayUtils.pageElementLoaded('body', 'html').then((ele) => {
						return Evergage.cashDom('.page-us-dermatology-partners-blog').length > 0 && window.location.pathname.includes('/blog/');
					});
				}
			},
			{
				name: 'News Landing Page - USDP',
				action: 'USDP News Landing Page | View',
				isMatch: () => {
					return Evergage.DisplayUtils.pageElementLoaded('body', 'html').then((ele) => {
						return Evergage.cashDom('.page-news').length > 0 && window.location.pathname.includes('/news/');
					});
				}
			},
			{
				name: 'Press & Media Landing Page - USDP',
				action: 'USDP Press & Media Landing Page | View',
				isMatch: () => {
					return Evergage.DisplayUtils.pageElementLoaded('body', 'html').then((ele) => {
						return Evergage.cashDom('.page-press-media').length > 0 && window.location.pathname.includes('/press-and-media/');
					});
				}
			},
			{
				name: 'Awards & Honors Landing Page - USDP',
				action: 'USDP Awards & Honors Landing Page | View',
				isMatch: () => {
					return Evergage.DisplayUtils.pageElementLoaded('body', 'html').then((ele) => {
						return Evergage.cashDom('.page-awards').length > 0 && window.location.pathname.includes('/awards/');
					});
				}
			},
			{
				name: 'Blog Detail Page - USDP',
				action: 'USDP Blog Detail Page | View',
				isMatch: () => {
					return Evergage.DisplayUtils.pageElementLoaded('body', 'html').then((ele) => {
						return Evergage.cashDom('.single-post').length > 0 && window.location.pathname.includes('/blog/');
					});
				},
				catalog: {
					Blog: {
						_id: () => {
							return Evergage.resolvers.fromMeta('og:title')();
						},
						name: () => {
							const json = JSON.parse(document.querySelectorAll('script[type="application/ld+json"]')[0].innerText);
							const headline = json['@graph'][0].headline;
							return headline;
						},
						url: () => {
							return Evergage.resolvers.fromMeta('og:url')();
						},
						imageUrl: () => {
							return Evergage.resolvers.fromMeta('og:image')();
						},
						description: () => {
							return Evergage.resolvers.fromMeta('og:description')();
						},
						published: () => {
							return Evergage.resolvers.fromMeta('article:modified_time')();
						},
						categories: () => {
							const json = JSON.parse(document.querySelectorAll('script[type="application/ld+json"]')[0].innerText);
							const articleSection = json['@graph'][0].articleSection;
							const keywords = json['@graph'][0].keywords || '';
							const categories = articleSection + keywords;
							return [categories];
						},
						relatedCatalogObjects: {
							Author: () => {
								return [Evergage.resolvers.fromMeta('author')()];
							}
						}
					}
				}
			},
			{
				name: 'News Detail Page - USDP',
				action: 'USDP News Detail Page | View',
				isMatch: () => {
					return Evergage.DisplayUtils.pageElementLoaded('body', 'html').then((ele) => {
						return Evergage.cashDom('.single-post').length > 0 && window.location.pathname.includes('/news/');
					});
				},
				catalog: {
					Blog: {
						_id: () => {
							return Evergage.resolvers.fromMeta('og:title')();
						},
						name: () => {
							const json = JSON.parse(document.querySelectorAll('script[type="application/ld+json"]')[0].innerText);
							const headline = json['@graph'][0].headline;
							return headline;
						},
						url: () => {
							return Evergage.resolvers.fromMeta('og:url')();
						},
						imageUrl: () => {
							return Evergage.resolvers.fromMeta('og:image')();
						},
						description: () => {
							return Evergage.resolvers.fromMeta('og:description')();
						},
						published: () => {
							return Evergage.resolvers.fromMeta('article:modified_time')();
						},
						categories: () => {
							const json = JSON.parse(document.querySelectorAll('script[type="application/ld+json"]')[0].innerText);
							const articleSection = json['@graph'][0].articleSection;
							const keywords = json['@graph'][0].keywords || '';
							const categories = articleSection + keywords;
							return [categories];
						},
						relatedCatalogObjects: {
							Author: [Evergage.resolvers.fromMeta('author')()]
						}
					}
				}
			},
			{
				name: 'Press & Media Detail Page - USDP',
				action: 'USDP Press & Media Detail Page | View',
				isMatch: () => {
					return Evergage.DisplayUtils.pageElementLoaded('body', 'html').then((ele) => {
						return Evergage.cashDom('.single-press-media').length > 0 && window.location.pathname.includes('/press-media/');
					});
				},
				catalog: {
					Blog: {
						_id: () => {
							return Evergage.resolvers.fromMeta('og:title')();
						},
						name: () => {
							const json = JSON.parse(document.querySelectorAll('script[type="application/ld+json"]')[0].innerText);
							const headline = json['@graph'][0].headline;
							return headline;
						},
						url: () => {
							return Evergage.resolvers.fromMeta('og:url')();
						},
						imageUrl: () => {
							return Evergage.resolvers.fromMeta('og:image')();
						},
						description: () => {
							return Evergage.resolvers.fromMeta('og:description')();
						},
						published: () => {
							return Evergage.resolvers.fromMeta('article:modified_time')();
						},
						categories: () => {
							const json = JSON.parse(document.querySelectorAll('script[type="application/ld+json"]')[0].innerText);
							const articleSection = json['@graph'][0].articleSection;
							const keywords = json['@graph'][0].keywords || '';
							const categories = articleSection + keywords;
							return [categories];
						}
					}
				}
			},
			{
				name: 'Request an Appointment - USDP',
				action: 'USDP Request an Appointment',
				isMatch: () => {
					return Evergage.DisplayUtils.pageElementLoaded('.page-request-an-appointment', 'html').then((ele) => {
						return Evergage.cashDom('.page-request-an-appointment').length > 0;
					});
				},
				listeners: [
					Evergage.listener('click', '#gform_submit_button_22', (e) => {
						const $form = Evergage.cashDom(e.currentTarget).parents('#gform_22');
						const firstName = $form.find('input[placeholder="First Name"]').val();
						const lastName = $form.find('input[placeholder="Last Name"]').val();
						const phone = $form.find('input[type="tel"]').val();
						const email = $form.find('input[type="email"]').val();
						const patientType = $form.find('#input_22_23 option[selected="selected"]').val();
						const state = $form.find('#input_22_3 option[selected="selected"]').val();
						const city = $form.find('#input_22_22 option[selected="selected"]').val();
						const skinCondition = $form.find('#input_22_24 option[selected="selected"]').val();
						Evergage.sendEvent({
							name: 'Request an Appointment',
							action: 'Request an Appointment | Form',
							user: {
								id: email,
								attributes: {
									firstName: firstName,
									lastName: lastName,
									phone: phone,
									emailAddress: email,
									patientType: patientType,
									state: state,
									city: city,
									skinCondition: skinCondition
								}
							}
						});
					})
				]
			},
			{
				name: 'Contact Us - USDP',
				action: 'USDP Contact Us',
				isMatch: () => {
					return Evergage.DisplayUtils.pageElementLoaded('.page-contact-us', 'html').then((ele) => {
						return Evergage.cashDom('.page-contact-us').length > 0;
					});
				},
				listeners: [
					Evergage.listener('click', '#gform_submit_button_16', (e) => {
						const $form = Evergage.cashDom(e.currentTarget).parents('#gform_16');
						const firstName = $form.find('input[placeholder="First Name"]').val();
						const lastName = $form.find('input[placeholder="Last Name"]').val();
						const phone = $form.find('input[type="tel"]').val();
						const email = $form.find('input[type="email"]').val();
						const patientType = $form.find('#input_16_23 option[selected="selected"]').val();
						const state = $form.find('#input_16_3 option[selected="selected"]').val();
						const city = $form.find('#input_16_22 option[selected="selected"]').val();
						Evergage.sendEvent({
							name: 'Contact Us',
							action: 'Contact Us | Form',
							user: {
								id: email,
								attributes: {
									firstName: firstName,
									lastName: lastName,
									phone: phone,
									emailAddress: email,
									patientType: patientType,
									state: state,
									city: city
								}
							}
						});
					})
				]
			},
			{
				name: 'USDP Locations Landing Page',
				action: 'USDP Locations Landing Page | View',
				isMatch: () => {
					return Evergage.DisplayUtils.pageElementLoaded('body.page-our-locations', 'html').then((ele) => {
						return Evergage.cashDom('body.page-our-locations').length > 0 || Evergage.resolvers.fromSelectorMultiple('.bread-crumbs a')().includes('Locations');
					});
				}
			},
			{
				name: 'USDP Location Detail Page',
				action: 'USDP Location Detail Page | View',
				isMatch: () => {
					return Evergage.DisplayUtils.pageElementLoaded('body', 'html').then((ele) => {
						return Evergage.cashDom('body.single-location').length > 0;
					});
				},
				catalog: {
					Location: {
						_id: () => {
							return Evergage.DisplayUtils.pageElementLoaded('.locations', '.location-hero').then(() => {
								return Evergage.resolvers.fromSelector('.locations li span')();
							});
						},
						name: () => {
							return Evergage.resolvers.fromSelector('.locations li span')();
						},
						description: () => {
							return Evergage.resolvers.fromMeta('description')();
						},
						imageUrl: () => {
							return Evergage.resolvers.fromMeta('og:image')();
						},
						url: window.location.href,
						phone: () => {
							return Evergage.resolvers.fromSelector('span[itemprop="telephone"]')();
						},
						relatedCatalogObjects: {
							Tags: () => {
								return Evergage.resolvers.buildCategoryId('.locations li a', 1, null, (categoryId) => [categoryId])();
							}
						}
					}
				}
			},
			{
				name: 'USDP Providers Landing Page',
				action: 'USDP Providers Landing Page | View',
				isMatch: () => {
					return Evergage.DisplayUtils.pageElementLoaded('body', 'html').then((ele) => {
						return Evergage.cashDom('.page-providers').length > 0;
					});
				}
			},
			{
				name: 'USDP Provider Detail Page',
				action: 'USDP Provider Detail Page | View',
				isMatch: () => {
					return Evergage.DisplayUtils.pageElementLoaded('body', 'html').then((ele) => {
						return Evergage.cashDom('body.single-provider').length > 0;
					});
				},
				catalog: {
					Provider: {
						_id: () => {
							return Evergage.resolvers.fromMeta('og:title')().split(' | ')[0];
						},
						name: () => {
							return Evergage.resolvers.fromMeta('og:title')().split(' | ')[0];
						},
						url: () => {
							return Evergage.resolvers.fromMeta('og:url')();
						},
						imageUrl: () => {
							return Evergage.resolvers.fromMeta('og:image')();
						},
						description: () => {
							return Evergage.resolvers.fromMeta('description')();
						},
						relatedCatalogObjects: {
							Location: () => {
								return Evergage.resolvers.buildCategoryId('.locations h6.location a', 0, null, (categoryId) => [categoryId])();
							},
							Tags: () => {
								return Evergage.resolvers.buildCategoryId('.provider-services ul.sidebar-submenu li a', 0, null, (categoryId) => [categoryId])();
							}
						}
					}
				}
			},
			{
				name: 'USDP Covid-19 Information Page',
				action: 'USDP Covid-19 Information | View',
				isMatch: () => {
					return Evergage.DisplayUtils.pageElementLoaded('body', 'html').then((ele) => {
						return Evergage.cashDom('.page-coronavirus-information').length > 0;
					});
				}
			},
			{
				name: 'USDP Resources Page',
				action: 'USDP Resources Page | View',
				isMatch: () => {
					return Evergage.DisplayUtils.pageElementLoaded('body', 'html').then((ele) => {
						return window.location.pathname.includes('resources');
					});
				},
				catalog: {
					Category: {
						_id: () => {
							return Evergage.DisplayUtils.pageElementLoaded('.bread-crumbs', 'html').then((ele) => {
								return Evergage.resolvers.buildCategoryId('.bread-crumbs a', 1, null)();
							});
						}
					}
				}
			},
			{
				name: 'Careers - USDP',
				action: 'USDP Career Page | View',
				isMatch: () => {
					return Evergage.DisplayUtils.pageElementLoaded('body', 'html').then((ele) => {
						return Evergage.cashDom('.page-join-our-team').length > 0;
					});
				}
			},
			{
				name: 'About Us Landing Page - USDP',
				action: 'USDP About Us Page | View',
				isMatch: () => {
					return Evergage.DisplayUtils.pageElementLoaded('body', 'html').then((ele) => {
						return Evergage.cashDom('.page-about-us').length > 0;
					});
				}
			}
		]
	};

	const configB = {
		global: {
			contentZones: [],
			listeners: [
				Evergage.listener('click', '.footer-block3 button.needsclick', () => {
					const email = Evergage.cashDom('#email_26765002').val();
					Evergage.sendEvent({
						action: 'Newsletter Sign-up',
						user: {
							id: email
						}
					});
				})
			]
		},
		pageTypeDefault: {
			name: 'default'
		},
		pageTypes: [
			{
				name: 'Home - DermSkincare',
				action: 'Dermskincare Home | View',
				isMatch: () => {
					return Evergage.DisplayUtils.pageElementLoaded('body', 'html').then((ele) => {
						return Evergage.cashDom('.cms-homeusdermatologypartners').length > 0;
					});
				}
			},
			{
				name: 'Category Page - DermSkincare',
				action: 'Dermskincare Category | View',
				isMatch: () => {
					return Evergage.DisplayUtils.pageElementLoaded('body', 'html').then((ele) => {
						return Evergage.cashDom('.catalog-category-view').length > 0;
					});
				},
				catalog: {
					Category: {
						_id: () => {
							return Evergage.DisplayUtils.pageElementLoaded('.breadcrumbs', 'html').then((ele) => {
								return `Dermskincare|${Evergage.resolvers.buildCategoryId('.breadcrumbs li', 1, null, (categoryId) => [categoryId])()}`;
							});
						}
					}
				},
				listeners: [
					Evergage.listener('click', 'button[title="Add to Cart"]', (e) => {
						const $productCard = Evergage.cashDom(e.currentTarget).parents('li.product-item');
						const price = $productCard.find('[id^="product-price"]').attr('data-price-amount');
						const id = $productCard.find('input[name="product"]').attr('value');
						const lineItem = [];
						lineItem.sku = { _id: id };
						lineItem.price = price;
						lineItem.quantity = 1;
						Evergage.sendEvent({
							itemAction: Evergage.ItemAction.AddToCart,
							cart: {
								singleLine: {
									Product: lineItem
								}
							}
						});
					})
				]
			},
			{
				name: 'Product Detail Page - Dermskincare',
				action: 'Dermskincare Product Detail | View',
				isMatch: () => {
					return Evergage.DisplayUtils.pageElementLoaded('body', 'html').then((ele) => {
						return Evergage.cashDom('.catalog-product-view').length > 0;
					});
				},
				catalog: {
					Product: {
						_id: () => {
							return Evergage.DisplayUtils.pageElementLoaded('#product_addtocart_form', 'html').then(() => {
								const id = Evergage.resolvers.fromSelectorAttribute('input[name="product"]', 'value')();
								return id;
							});
						},
						name: () => {
							return Evergage.resolvers.fromMeta('title')();
						},
						imageUrl: () => {
							return Evergage.resolvers.fromMeta('og:image')();
						},
						description: () => {
							return Evergage.resolvers.fromMeta('og:description')();
						},
						url: () => {
							return Evergage.resolvers.fromMeta('og:url')();
						},
						price: () => {
							return Evergage.resolvers.fromMeta('product:price:amount')();
						},
						category: () => {
							return `DermSkincare|${Evergage.resolvers.buildCategoryId('.breadcrumbs .items li', 1, true, (categoryId) => [categoryId])()}`;
						},
						relatedCatalogObjects: {
							Brand: () => {
								return [Evergage.resolvers.fromSelectorAttribute('meta[itemprop="brand"]', 'content')()];
							}
						}
					}
				},
				listeners: [
					Evergage.listener('click', '#product-addtocart-button', () => {
						const lineItem = Evergage.util.buildLineItemFromPageState('#qty');
						lineItem.sku = { _id: Evergage.resolvers.fromSelectorAttribute('.product-add-form form', 'data-product-sku')() };
						Evergage.sendEvent({
							itemAction: Evergage.ItemAction.AddToCart,
							cart: {
								singleLine: {
									Product: lineItem
								}
							}
						});
					})
				]
			},
			{
				name: 'Cart - Dermskincare',
				action: 'Dermskincare Cart | View',
				isMatch: () => {
					return window.location.pathname == '/checkout/cart/';
				},
				itemAction: Evergage.ItemAction.ViewCart,
				catalog: {
					Product: {
						lineItems: {
							_id: () => {
								return Evergage.DisplayUtils.pageElementLoaded('#shopping-cart-table', 'div.cart').then((ele) => {
									return Evergage.resolvers.fromSelectorAttributeMultiple('tbody.cart .qty input', 'data-cart-item-id')();
								});
							},
							price: () => {
								return Evergage.DisplayUtils.pageElementLoaded('#shopping-cart-table', 'div.cart').then((ele) => {
									return Evergage.resolvers.fromSelectorMultiple('tbody.cart .price .price')();
								});
							},
							quantity: () => {
								return Evergage.DisplayUtils.pageElementLoaded('#shopping-cart-table', 'div.cart').then((ele) => {
									return Evergage.resolvers.fromSelectorAttributeMultiple('tbody.cart .qty input', 'value')();
								});
							}
						}
					}
				}
			},
			{
				name: 'Checkout - Dermskincare',
				action: 'Dermskincare Checkout | View',
				isMatch: () => {
					return Evergage.DisplayUtils.pageElementLoaded('body', 'html').then((ele) => {
						return Evergage.cashDom('#checkout').length > 0;
					});
				},
				listeners: [
					Evergage.listener('click', '.checkout-payment-method button', () => {
						const $form = Evergage.cashDom('#checkout-step-shipping form');
						const email = $form.find('input[name="username"]').val();
						const firstName = $form.find('input[name="firstname"]').val();
						const lastName = $form.find('input[name="lastname"]').val();
						const address = $form.find('input[name="street[0]"]').val();
						const city = $form.find('input[name="city"]').val();
						const state = $form.find('select[name="region_id"]').val();
						const phone = $form.find('input[name="telephone"]').val();
						Evergage.sendEvent({
							name: 'Placed Order',
							action: 'Placed Order',
							user: {
								id: email,
								attributes: {
									emailAddress: email,
									firstName: firstName,
									lastName: lastName,
									address: address,
									city: city,
									state: state,
									phone: phone
								}
							}
						});
					})
				]
			},
			{
				name: 'Customer Login - Dermskincare',
				action: 'Dermskincare - Customer Login',
				isMatch: () => {
					return Evergage.DisplayUtils.pageElementLoaded('body', 'html').then((ele) => {
						return Evergage.cashDom('.customer-account-login').length > 0;
					});
				},
				listeners: [
					Evergage.listener('click', '#send2', (e) => {
						const email = Evergage.cashDom('#email').val();
						Evergage.sendEvent({
							action: 'Login',
							user: {
								id: email,
								attributes: {
									emailAddress: email
								}
							}
						});
					})
				]
			},
			{
				name: 'Sign Up - Dermskincare',
				action: 'Dermskincare Account Sign Up',
				isMatch: () => {
					return Evergage.DisplayUtils.pageElementLoaded('body', 'html').then((ele) => {
						return Evergage.cashDom('.customer-account-create').length > 0;
					});
				},
				listeners: [
					Evergage.listener('click', 'button[title="Sign Up"]', (e) => {
						const $form = Evergage.cashDom(e.currentTarget).parents('#form-validate');
						const firstname = $form.find('#firstname').val();
						const lastname = $form.find('#lastname').val();
						const email_address = $form.find('#email_address').val();
						const dob = $form.find('#dob').val();
						const gender = $form.find('#gender').val();
						Evergage.sendEvent({
							action: 'Account Sign-up',
							name: 'Account Sign Up',
							user: {
								id: email_address,
								attributes: {
									firstName: firstname,
									lastName: lastname,
									emailAddress: email_address,
									birthday: dob,
									gender: gender
								}
							}
						});
					})
				]
			},
			{
				name: 'Dermskincare Account Dashboard',
				action: 'Dermskincare Account Dashboard | View',
				isMatch: () => {
					return Evergage.DisplayUtils.pageElementLoaded('body', 'html').then((ele) => {
						return Evergage.cashDom('.customer-account-index').length > 0;
					});
				}
			},
			{
				name: 'Dermskincare My Orders',
				action: 'Dermskincare My Orders | View',
				isMatch: () => {
					return Evergage.DisplayUtils.pageElementLoaded('body', 'html').then((ele) => {
						return Evergage.cashDom('.sales-order-history').length > 0;
					});
				}
			},
			{
				name: 'Dermskincare Wish List',
				action: 'Dermskincare Wish List | View',
				isMatch: () => {
					return Evergage.DisplayUtils.pageElementLoaded('body', 'html').then((ele) => {
						return Evergage.cashDom('.wishlist-index-index').length > 0;
					});
				}
			},
			{
				name: 'Dermskincare Address Book',
				action: 'Dermskincare Address Book | View',
				isMatch: () => {
					return Evergage.DisplayUtils.pageElementLoaded('body', 'html').then((ele) => {
						return Evergage.cashDom('.customer-address-form').length > 0;
					});
				},
				listeners: [
					Evergage.listener('click', 'button[type="submit"]', (e) => {
						const $form = Evergage.cashDom(e.currentTarget).parents('#form-validate');
						const firstName = $form.find('#firstname').val();
						const lastname = $form.find('#lastname').val();
						const telephone = $form.find('#telephone').val();
						const street_1 = $form.find('#street_1').val();
						const city = $form.find('input[name="city"]').val();
						const state = $form.find('#region_id').val();
						const zip = $form.find('#zip').val();
						const country = $form.find('#country').val();
						Evergage.sendEvent({
							action: 'Update Address',
							name: 'Update Address',
							user: {
								attributes: {
									firstName: firstName,
									lastName: lastname,
									phone: telephone,
									address: street_1,
									city: city,
									state: state,
									zip: zip,
									country: country
								}
							}
						});
					})
				]
			},
			{
				name: 'Dermskincare Account Info',
				action: 'Dermskincare Account Info | View',
				isMatch: () => {
					return Evergage.DisplayUtils.pageElementLoaded('body', 'html').then((ele) => {
						return Evergage.cashDom('.customer-account-edit').length > 0;
					});
				},
				listeners: [
					Evergage.listener('click', 'button[type="submit"]', (e) => {
						const $form = Evergage.cashDom(e.currentTarget).parents('#form-validate');
						const firstName = $form.find('#firstname').val();
						const lastname = $form.find('#lastname').val();
						const dob = $form.find('#dob').val();
						const gender = $form.find('#gender').val();
						Evergage.sendEvent({
							action: 'Update Account',
							name: 'Update Account',
							user: {
								attributes: {
									firstName: firstName,
									lastName: lastname,
									birthday: dob,
									gender: gender
								}
							}
						});
					})
				]
			},
			{
				name: 'Dermskincare Product Reviews',
				action: 'Dermskincare Product Reviews | View',
				isMatch: () => {
					return Evergage.DisplayUtils.pageElementLoaded('body', 'html').then((ele) => {
						return Evergage.cashDom('.review-customer-index').length > 0;
					});
				}
			},
			{
				name: 'Dermskincare Newsletter Subscriptions',
				action: 'Dermskincare Newsletter Subscriptions | View',
				isMatch: () => {
					return Evergage.DisplayUtils.pageElementLoaded('body', 'html').then((ele) => {
						return Evergage.cashDom('.newsletter-manage-index').length > 0;
					});
				}
			},
			{
				name: 'Dermskincare Payment Methods',
				action: 'Dermskincare Payment Methods | View',
				isMatch: () => {
					return Evergage.DisplayUtils.pageElementLoaded('body', 'html').then((ele) => {
						return Evergage.cashDom('.payment-customer-storedacct').length > 0;
					});
				}
			},
			{
				name: 'Dermskincare My Rewards',
				action: 'Dermskincare My Rewards | View',
				isMatch: () => {
					return Evergage.DisplayUtils.pageElementLoaded('body', 'html').then((ele) => {
						return Evergage.cashDom('.customer-rewards-index').length > 0;
					});
				}
			},
			{
				name: 'Dermskincare My Subscriptions',
				action: 'Dermskincare My Subscriptions | View',
				isMatch: () => {
					return Evergage.DisplayUtils.pageElementLoaded('body', 'html').then((ele) => {
						return Evergage.cashDom('.customer-subscriptions-index').length > 0;
					});
				}
			},
			{
				name: 'Dermskincare My Gift Cards',
				action: 'Dermskincare My Gift Cards | View',
				isMatch: () => {
					return Evergage.DisplayUtils.pageElementLoaded('body', 'html').then((ele) => {
						return Evergage.cashDom('.mpgiftcard-index-index').length > 0;
					});
				}
			},
			{
				name: 'Blog Landing Page - Dermskincare',
				action: 'Dermskincare - Blog Landing Page | View',
				isMatch: () => {
					return Evergage.DisplayUtils.pageElementLoaded('body', 'html').then((ele) => {
						return Evergage.cashDom('body.is-blog').length > 0 && Evergage.cashDom('.breadcrumbs li.post').length === 0;
					});
				}
			},
			{
				name: 'Blog Detail Page - Dermskincare',
				action: 'Dermskincare - Blog Detail Page | View',
				isMatch: () => {
					return Evergage.DisplayUtils.pageElementLoaded('body', 'html').then((ele) => {
						return Evergage.cashDom('body.is-blog').length > 0 && Evergage.cashDom('.breadcrumbs li.post').length > 0;
					});
				},
				catalog: {
					Blog: {
						_id: () => {
							return Evergage.resolvers.fromSelector('h1.page-title span')();
						},
						name: () => {
							return Evergage.resolvers.fromSelector('h1.page-title span')();
						},
						description: () => {
							return Evergage.resolvers.fromMeta('description')();
						},
						category: () => {
							return `[Dermskincare|${Evergage.resolvers.buildCategoryId('.post-meta .post-categories a', 0, null)()}]`;
						}
					}
				},
				listeners: [
					Evergage.listener('click', '#post-the-comment', (e) => {
						const $form = Evergage.cashDom(e.currentTarget).parents('#respond');
						const name = $form.find('#author').val();
						const email = $form.find('#email').val();
						Evergage.sendEvent({
							name: 'Reply on Blog',
							action: 'Reply on Blog',
							user: {
								_id: email,
								attributes: {
									emailAddress: email,
									name: name
								}
							}
						});
					})
				]
			},
			{
				name: 'Dermskincare Contact Us',
				action: 'Dermskincare Contact Us',
				isMatch: () => {
					return Evergage.DisplayUtils.pageElementLoaded('body', 'html').then((ele) => {
						return Evergage.cashDom('.contact-index-index').length > 0;
					});
				},
				listeners: [
					Evergage.listener('click', 'form.contact button[type="submit"]', (e) => {
						const $form = Evergage.cashDom(e.currentTarget).parents('#contact-form');
						const first_name = $form.find('#name').val();
						const last_name = $form.find('#last_name').val();
						const phone = $form.find('#telephone').val();
						const email = $form.find('#email').val();
						Evergage.sendEvent({
							name: 'Contact Us',
							action: 'Contact Us',
							user: {
								_id: email,
								attributes: {
									emailAddress: email,
									firstName: first_name,
									lastName: last_name,
									phone: phone
								}
							}
						});
					})
				]
			}
		]
	};

	if (currentCookieDomain === 'www.usdermatologypartners.com') {
		Evergage.initSitemap(configA);
	} else if (currentCookieDomain === 'dermskincare.com') {
		Evergage.initSitemap(configB);
	}
});
