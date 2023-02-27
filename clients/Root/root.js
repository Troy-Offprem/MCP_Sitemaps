Evergage.init({
	cookieDomain: 'joinroot.com'
}).then(() => {
	const handleSPAPageChange = () => {
		let url = window.location.href;
		const urlChangeInterval = setInterval(() => {
			if (url !== window.location.href) {
				url = window.location.href;

				Evergage.reinit();
			}
		}, 2000);
	};

	// handleSPAPageChange();

	const config = {
		global: {
			contentZones: [],
			listeners: []
		},
		pageTypeDefault: {
			name: 'default'
		},
		pageTypes: [
			{
				name: 'Home',
				action: 'Home | View',
				isMatch: () => {
					return /^\/$/.test(window.location.pathname);
				}
			},
			{
				name: 'Car Coverage',
				action: 'Car Coverage | View',
				isMatch: () => {
					return Evergage.resolvers.fromSelector('li[class$="navListItem"] a.active')() == 'Coverage';
				},
				catalog: {
					Category: {
						_id: () => {
							const pathName = window.location.pathname;
							const tagArray = pathName.split('/');
							const removeLast = tagArray.pop();
							const category = tagArray
								.slice(1)
								.map((i) => i.toUpperCase().split('-').join(' '))
								.join('|');
							return category;
						}
					}
				}
			},
			{
				name: 'Renters Insurance',
				action: 'Renters Insurance | View',
				isMatch: () => {
					return window.location.pathname.startsWith('/renters-insurance/');
				},
				catalog: {
					Category: {
						_id: () => {
							const pathName = window.location.pathname;
							const tagArray = pathName.split('/');
							const removeLast = tagArray.pop();
							const category = tagArray
								.slice(1)
								.map((i) => i.toUpperCase().split('-').join(' '))
								.join('|');
							return category;
						}
					}
				}
			},
			{
				name: 'Homeowners Insurance',
				action: 'Homeowners Insurance | View',
				isMatch: () => {
					return window.location.pathname.startsWith('/homeowners-insurance/');
				},
				catalog: {
					Category: {
						_id: () => {
							const pathName = window.location.pathname;
							const tagArray = pathName.split('/');
							const removeLast = tagArray.pop();
							const category = tagArray
								.slice(1)
								.map((i) => i.toUpperCase().split('-').join(' '))
								.join('|');
							return category;
						}
					}
				},
				listeners: [
					Evergage.listener('click', '#zip-code-input', () => {
						const zip = Evergage.resolvers.fromSelector('#zip-code-input').val();
						Evergage.sendEvent({
							user: {
								attributes: {
									zip: zip
								}
							}
						});
						Evergage.reinit();
					}),
					Evergage.listener('click', '#email-input', () => {
						const email = Evergage.resolvers.fromSelector('#email-input').val();
						Evergage.sendEvent({
							action: 'Homeowner Insurance not available in area',
							user: {
								emailAddress: email
							}
						});
					})
				]
			},
			{
				name: 'Claims',
				action: 'Claims | View',
				isMatch: () => {
					return Evergage.resolvers.fromSelector('li[class$="navListItem"] a.active')() == 'Claims';
				}
			},
			{
				name: 'Test Drive',
				action: 'Test Drive | View',
				isMatch: () => {
					return Evergage.resolvers.fromSelector('li[class$="navListItem"] a.active')() == 'Test Drive';
				}
			},
			{
				name: 'Availability',
				action: 'Availability | View',
				isMatch: () => {
					return Evergage.resolvers.fromSelector('li[class$="navListItem"] a.active')() == 'Availability' || window.location.pathname.includes('/availability/');
				},
                listeners: [
                    Evergage.listener('click', 'g[role="state"]', () => {
                        Evergage.reinit()
                    }),
                    Evergage.listener('click', '#state-select', () => {
                        setTimeout(() => {
                            Evergage.reinit()
                        }, 100)
                    }),
                    Evergage.listener('click', 'div.product-available p', () => {
                        const insurance = Evergage.resolvers.fromSelector('.product-available p')();
                        const state = Evergage.resolvers.fromSelector('div.modalContentContainer h2')();
                        Evergage.sendEvent({
                            action: `Get a quote for ${insurance} Insurance in ${state}`
                        })
                    }),
                    Evergage.listener('click', 'div[data-testid="select-dropdown"]', () => {
                        setTimeout(() => {
                            Evergage.reinit()
                        }, 500)
                    }),
                    Evergage.listener('click', 'div[class$="productTile"] a[class$="primary-button"]', (e) => {
                        const $card = Evergage.cashDom(e.currentTarget).parents('div[class$="productTile"]');
                        const state = Evergage.resolvers.fromSelector('#state-select')();
                        const insurance = $card.find('h4')(); 
                    }),

                ]
			},
			{
				name: 'Referral',
				action: 'Referral | View',
				isMatch: () => {
					return window.location.pathname.endsWith('/referrals/');
				}
			},
			{
				name: 'Blog Landing',
				action: 'Blog Landing | View',
				isMatch: () => {
					return window.location.pathname.endsWith('/blog/') && Evergage.cashDom('section[data-testid="category-section-sliding"]').length > 1;
				},
				listeners: [
					Evergage.listener('click', 'section div.tile', (e) => {
						const $blogCard = Evergage.cashDom(e.currentTarget);
						const id = $blogCard.find('h4').text();
						const img = $blogCard.find('picture').attr('srcset');
						const category = $blogCard.find('[class$="textContent"] a').text();
						Evergage.sendEvent({
							catalog: {
								Blog: {
									_id: id,
									imageUrl: img,
									category: category
								}
							}
						});
					})
				]
			},
			{
				name: 'Blog Detail',
				action: 'Blog Detail | View',
				isMatch: () => {
					return window.location.pathname.startsWith('/blog/') && Evergage.cashDom('section[data-testid="richTextSectionBlock"]').length > 1;
				},
				catalog: {
					Blog: {
						_id: () => {
							return Evergage.resolvers.fromSelector('h1')();
						},
						name: () => {
							return Evergage.resolvers.fromSelector('h1')();
						},
						description: () => {
							return Evergage.resolvers.fromMeta('description')();
						},
						imageUrl: () => {
							Evergage.DisplayUtils.pageElementLoaded('section picture img', 'html').then(() => {
								return Evergage.resolvers.fromSelectorAttribute('section picture img', 'src')();
							});
						},
						published: () => {
							return new Date(Evergage.resolvers.fromSelector('section[data-testid="richTextSectionBlock"] h6')());
						}
					}
				}
			},
			{
				name: 'FAQ',
				action: 'FAQ | View',
				isMatch: () => {
					return window.location.pathname.endsWith('/help/');
				}
			},
			{
				name: 'Car Insurance Comparison',
				action: 'Car Insurance Comparison | View',
				isMatch: () => {
					return window.location.pathname.endsWith('/car-insurance-comparison/');
				}
			},
			{
				name: 'Contact Us',
				action: 'Contact Us | View',
				isMatch: () => {
					return window.location.pathname.endsWith('/contact/');
				}
			}
		]
	};

	Evergage.initSitemap(config);
});
