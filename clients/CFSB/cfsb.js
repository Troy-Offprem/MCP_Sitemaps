Evergage.init({
	cookieDomain: 'cfsbky.com'
}).then(() => {
	const config = {
		global: {
			listeners: [
				Evergage.listener('click', 'button.helpButtonEnabled', () => {
					setTimeout(() => {
						Evergage.reinit();
					}, 5000);
				}),
				Evergage.listener('click', '.btn-common', () => {
					setTimeout(() => {
						Evergage.reinit();
					}, 1000);
				}),
				Evergage.listener('click', 'button.startButton', () => {
					const firstName = Evergage.cashDom('#FirstName').val();
					const lastName = Evergage.cashDom('#LastName').val();
					const email = Evergage.cashDom('#Email').val();
					Evergage.sendEvent({
						action: 'Chatbot submit',
						user: {
							attributes: {
								firstName: firstName,
								lastName: lastName,
								emailAddress: email
							}
						}
					});
				})
			],
			contentZones: [{ name: 'Global Pop-up' }]
		},
		pageTypeDefault: {
			name: 'default'
		},
		pageTypes: [
			{
				name: 'Home',
				action: 'Home | View',
				isMatch: () => {
					return Evergage.cashDom('.home-main-tabbing-section').length > 0;
				},
				contentZones: [{ name: 'home_hero', selector: '.home-main-tabbing-section .uk-grid' }, { name: 'Home Pop-Up' }]
			},
			{
				name: 'Personal Banking',
				action: 'Personal Banking | View',
				isMatch: () => {
					return Evergage.resolvers.fromSelector('#breadcrumb')().includes('Personal Banking');
				},
				catalog: {
					Article: {
						_id: () => {
							return Evergage.resolvers.fromMeta('og:title')().split(' - ')[0].split(' – ')[0];
						},
						name: () => {
							return Evergage.resolvers.fromMeta('og:title')().split(' - ')[0].split(' – ')[0];
						},
						description: () => {
							if (Evergage.cashDom('.product-page-intro-section-inner').length > 0) {
								return Evergage.resolvers.fromSelector('.product-page-intro-section-inner h1')();
							} else if (Evergage.cashDom('.page-name-title')) {
								return Evergage.resolvers.fromSelector('.page-name-title h1')();
							}
						},
						url: () => {
							return window.location.href;
						},
						imageUrl: () => {
							if (Evergage.cashDom('div.mainimage').length > 0) {
								const img = Evergage.resolvers.fromSelectorAttribute('div.mainimage img', 'src')();
								return img;
							} else {
								return Evergage.resolvers.fromSelectorAttribute('div.uk-container img', 'src')();
							}
						},
						categories: () => {
							return [Evergage.resolvers.fromSelectorMultiple('#breadcrumb a')().join('|').slice(5)];
						}
					}
				},
				listeners: [
					Evergage.listener('click', 'a.side-menu__action', () => {
						Evergage.reinit();
					}),
					Evergage.listener('click', 'a.btn-common', () => {
						Evergage.reinit();
					}),
					Evergage.listener('click', '#CFSB-Common-Form input[name="submit"]', () => {
						const $form = Evergage.cashDom('#CFSB-Common-Form');
						const firstName = $form.find('#first_name').val();
						const lastName = $form.find('#last_name').val();
						const email = $form.find('#email').val();
						const phone = $form.find('#phone').val();
						const location = $form.find('select[title="Banking Center"]').val();
						Evergage.sendEvent({
							action: 'Apply for Personal Loan',
							name: 'Apply for Personal Loan',
							user: {
								attributes: {
									firstName: firstName,
									lastName: lastName,
									emailAddress: email,
									phone: phone,
									prefBank: location
								}
							}
						});
					})
				],
				contentZones: [{ name: 'Footer Card', selector: 'ul.uk-grid li' }]
			},
			{
				name: 'Business Banking',
				action: 'Business Banking | View',
				isMatch: () => {
					return Evergage.resolvers.fromSelector('#breadcrumb')().includes('Business Banking');
				},
				catalog: {
					Article: {
						_id: () => {
							return Evergage.resolvers.fromMeta('og:title')().split(' - ')[0].split(' – ')[0];
						},
						name: () => {
							return Evergage.resolvers.fromMeta('og:title')().split(' - ')[0].split(' – ')[0];
						},
						description: () => {
							if (Evergage.cashDom('.product-page-intro-section-inner').length > 0) {
								return Evergage.resolvers.fromSelector('.product-page-intro-section-inner h1')();
							} else if (Evergage.cashDom('.page-name-title')) {
								return Evergage.resolvers.fromSelector('.page-name-title h1')();
							}
						},
						url: () => {
							return window.location.href;
						},
						imageUrl: () => {
							if (Evergage.cashDom('div.mainimage').length > 0) {
								const img = Evergage.resolvers.fromSelectorAttribute('div.mainimage img', 'src')();
								return img;
							} else {
								return Evergage.resolvers.fromSelectorAttribute('div.uk-container img', 'src')();
							}
						},
						categories: () => {
							return [Evergage.resolvers.fromSelectorMultiple('#breadcrumb a')().join('|').slice(5)];
						}
					}
				},
				listeners: [
					Evergage.listener('click', 'a.side-menu__action', () => {
						Evergage.reinit();
					}),
					Evergage.listener('click', 'a.btn-common', () => {
						Evergage.reinit();
					}),
					Evergage.listener('click', '#CFSB-Common-Form input[name="submit"]', () => {
						const $form = Evergage.cashDom('#CFSB-Common-Form');
						const firstName = $form.find('#first_name').val();
						const lastName = $form.find('#last_name').val();
						const email = $form.find('#email').val();
						const phone = $form.find('#phone').val();
						Evergage.sendEvent({
							action: 'Apply for Business Loan',
							name: 'Apply for Business Loan',
							user: {
								attributes: {
									firstName: firstName,
									lastName: lastName,
									emailAddress: email,
									phone: phone
								}
							}
						});
					})
				],
				contentZones: [{ name: 'Footer Card', selector: 'ul.uk-grid li' }]
			},
			{
				name: 'Services & Tools',
				action: 'Services & Tools | View',
				isMatch: () => {
					return Evergage.resolvers.fromSelector('#breadcrumb')().includes('Services & Tools');
				},
				catalog: {
					Article: {
						_id: () => {
							return Evergage.resolvers.fromMeta('og:title')().split(' - ')[0].split(' – ')[0];
						},
						name: () => {
							return Evergage.resolvers.fromMeta('og:title')().split(' - ')[0].split(' – ')[0];
						},
						description: () => {
							if (Evergage.cashDom('.product-page-intro-section-inner').length > 0) {
								return Evergage.resolvers.fromSelector('.product-page-intro-section-inner h1')();
							} else if (Evergage.cashDom('.page-name-title')) {
								return Evergage.resolvers.fromSelector('.page-name-title h1')();
							}
						},
						url: () => {
							return window.location.href;
						},
						imageUrl: () => {
							if (Evergage.cashDom('div.mainimage').length > 0) {
								const img = Evergage.resolvers.fromSelectorAttribute('div.mainimage img', 'src')();
								return img;
							} else {
								return Evergage.resolvers.fromSelectorAttribute('div.uk-container img', 'src')();
							}
						},
						categories: () => {
							return [Evergage.resolvers.fromSelectorMultiple('#breadcrumb a')().join('|').slice(5)];
						}
					}
				},
				contentZones: [{ name: 'Footer Card', selector: 'ul.uk-grid li' }]
			},
			{
				name: 'About CFSB',
				action: 'About CFSB | View',
				isMatch: () => {
					return Evergage.resolvers.fromSelector('.topnav .navON')() == 'About Us';
				},
				catalog: {
					Category: {
						_id: () => {
							const breadcrumb = Evergage.resolvers.fromSelectorMultiple('#breadcrumb a')();
							const name = '|' + Evergage.resolvers.fromMeta('og:title')().split(' - ')[0];
							if (breadcrumb.length > 1) {
								return breadcrumb[1] + name;
							} else {
								return 'About CFSB' + name;
							}
						}
					}
				},
				listeners: [
					Evergage.listener('click', '#CFSB-Common-Form input[name="submit"]', () => {
						const $form = Evergage.cashDom('#CFSB-Common-Form');
						const firstName = $form.find('#first_name').val();
						const lastName = $form.find('#last_name').val();
						const email = $form.find('#email').val();
						const phone = $form.find('#phone').val();
						const company = $form.find('#company').val();
						const city = $form.find('#city').val();
						const state = $form.find('#state').val();
						const location = $form.find('select[title="Banking Center"]').val();
						Evergage.sendEvent({
							action: 'Apply for Sponsorship Request',
							name: 'Apply for Sponsorship Request',
							user: {
								attributes: {
									firstName: firstName,
									lastName: lastName,
									emailAddress: email,
									phone: phone,
									prefBank: location,
									city: city,
									state: state,
									company: company
								}
							}
						});
					})
				]
			},
			{
				name: 'Blog Landing Page',
				action: 'Blog Landing Page | View',
				isMatch: () => {
					return Evergage.cashDom('.bloglisting-page').length > 0;
				}
			},
			{
				name: 'Blog Detail Page',
				action: 'Blog Detail Page | View',
				isMatch: () => {
					return Evergage.cashDom('.blog-detail-page').length > 0;
				},
				catalog: {
					Blog: {
						_id: () => {
							return Evergage.resolvers.fromMeta('og:title')();
						},
						name: () => {
							return Evergage.resolvers.fromMeta('og:title')();
						},
						description: () => {
							return Evergage.resolvers.fromMeta('og:description')();
						},
						imageUrl: () => {
							return Evergage.resolvers.fromMeta('og:image')();
						},
						url: () => {
							return window.location.href;
						},
						categories: () => {
							return ['Blog|' + Evergage.resolvers.fromSelector('.blogpost-category a')()];
						}
					}
				}
			},
			{
				name: 'Online Loan Payment',
				action: 'Online Loan Payment | View',
				isMatch: () => {
					return Evergage.resolvers.fromSelector('#breadcrumb')().includes('Online Loan Payment');
				},
				listeners: [
					Evergage.listener('click', '.btn-common', (e) => {
						const $btn = Evergage.cashDom(e.currentTarget);
						const btnTitle = $btn.find('span.sr-only').text();
						Evergage.sendEvent({
							action: `${btnTitle} - Online Loan Payment`
						});
					})
				]
			},
			{
				name: 'Thank a Banker',
				action: 'Thank a Banker | View',
				isMatch: () => {
					return Evergage.resolvers.fromSelector('#breadcrumb')().includes('Thank a Banker');
				},
				listeners: [
					Evergage.listener('click', 'input[name="submit"]', () => {
						const $form = Evergage.cashDom('#CFSB-Common-Form');
						const firstName = $form.find('#first_name').val();
						const lastName = $form.find('#last_name').val();
						const email = $form.find('#email').val();
						const phone = $form.find('#phone').val();
						const prefBank = $form.find('select[title="Banking Center"]').val();
						Evergage.sendEvent({
							action: 'Thank a Banker form submitted',
							user: {
								attributes: {
									firstName: firstName,
									lastName: lastName,
									emailAddress: email,
									phone: phone,
									prefBank: bankingCenter
								}
							}
						});
					})
				]
			},
			{
				name: 'Locations and Hours',
				action: 'Location and Hours Page | View',
				isMatch: () => {
					return Evergage.cashDom('body.location-listing').length > 0;
				},
				listeners: [
					Evergage.listener('click', '.phone .agphoneavailable', (e) => {
						const $locationCard = Evergage.cashDom(e.currentTarget).parents('.Bank');
						const bankId = $locationCard.attr('data-agency-locationid');
						const name = $locationCard.find('a.titleclick-mapbox').text();
						Evergage.sendEvent({
							action: `Called ${name}`,
							catalog: {
								Location: {
									_id: bankId
								}
							}
						});
					}),
					Evergage.listener('click', '.direction-cta a', (e) => {
						const $locationCard = Evergage.cashDom(e.currentTarget).parents('.Bank');
						const bankId = $locationCard.attr('data-agency-locationid');
						const name = $locationCard.find('a.titleclick-mapbox').text();
						Evergage.sendEvent({
							action: `Directions to ${name}`,
							catalog: {
								Location: {
									_id: bankId
								}
							}
						});
					})
				]
			},
			{
				name: 'Location Detail Page',
				action: 'Location Detail Page | View',
				isMatch: () => {
					return Evergage.cashDom('.location-detail').length > 0;
				},
				catalog: {
					Location: {
						_id: () => {
							return Evergage.cashDom('.location-details h1')[0].childNodes[0].nodeValue.trim();
						},
						name: () => {
							return Evergage.cashDom('.location-details h1')[0].childNodes[0].nodeValue.trim();
						},
						imageUrl: () => {
							return Evergage.resolvers.fromSelectorAttribute('.about-this-location img', 'src')();
						},
						url: () => {
							return window.location.href;
						},
						description: () => {
							if (Evergage.cashDom('.product-page-intro-section-inner').length > 0) {
								return Evergage.resolvers.fromSelector('.product-page-intro-section-inner h1')();
							} else if (Evergage.cashDom('.page-name-title')) {
								return Evergage.resolvers.fromSelector('.page-name-title h1')();
							}
						}
					}
				}
			},
			{
				name: 'Contact Us',
				action: 'Contact Us Page | View',
				isMatch: () => {
					return Evergage.cashDom('.contact-us-body').length > 0;
				},
				listeners: [
					Evergage.listener('click', 'input[name="submit"]', () => {
						const $form = Evergage.cashDom('#CFSB-Common-Form');
						const firstName = $form.find('#first_name').val();
						const lastName = $form.find('#last_name').val();
						const phone = $form.find('#phone').val();
						const email = $form.find('#email').val();
						Evergage.sendEvent({
							action: 'Contact Us Form Submitted',
							name: 'Contact Us Form Submitted',
							user: {
								attributes: {
									emailAddress: email,
									firstName: firstName,
									lastName: lastName,
									phone: phone
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
