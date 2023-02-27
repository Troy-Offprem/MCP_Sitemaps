Evergage.init({
	cookieDomain: 'cmgfi.com'
}).then(() => {
	const changeSPAPage = () => {
		Evergage.reinit();
	};
	const config = {
		global: {
			contentZones: [],
			onActionEvent: (actionEvent) => {
				let gaAvailable = window.ga;
				let loName = document.URL.split('/mysite/');
				let utmAvail = window.location.href.split('utm_');
				if (loName.length > 1) {
					const nameTransform = loName[1]
						.split('/')[0]
						.split('?')[0]
						.replace('-', ' ')
						.replace(/(^\w|\s\w)/g, (m) => m.toUpperCase());
					actionEvent.user = actionEvent.user || {};
					actionEvent.user.attributes = actionEvent.user.attributes || {};
					actionEvent.user.attributes.loMySite = nameTransform;
				}
				if (gaAvailable) {
					const gaClientId = window.ga.getAll()[0].get('clientId');
					actionEvent.user = actionEvent.user || {};
					actionEvent.user.attributes = actionEvent.user.attributes || {};
					actionEvent.user.attributes.gaClientId = gaClientId;
				}
				if (utmAvail.length > 1) {
					const url = window.location.search.replace('?', '').replace(/;/gi, '&');
					const urlParams = new URLSearchParams(url);
					const utm_medium = urlParams.get('utm_medium');
					const utm_campaign = urlParams.get('utm_campaign');
					actionEvent.user = actionEvent.user || {};
					actionEvent.user.attributes = actionEvent.user.attributes || {};
					actionEvent.user.attributes.utmMedium = utm_medium;
					actionEvent.user.attributes.utmCampaign = utm_campaign;
				}
				return actionEvent;
			},
			listeners: [
				Evergage.listener('click', '#navGetStarted', () => {
					Evergage.sendEvent({
						action: 'Get Started | Loan Application'
					});
				}),
				Evergage.listener('click', 'a[href="/corporate/apply-now"]', () => {
					Evergage.sendEvent({
						action: 'Get Started | Loan Application'
					});
				})
			]
		},
		pageTypeDefault: {
			name: 'default'
		},
		pageTypes: [
			{
				name: 'Home',
				action: 'Viewed Homepage',
				isMatch: () => {
					return /^\/$/.test(window.location.pathname);
				},
				contentZones: [
					{ name: 'home_hero', selector: '.hero-section' },
					{
						name: 'home_featured_nav',
						selector: '#resources_navigation_partial_view'
					}
				],
				listeners: [
					Evergage.listener('click', 'a.button-tertiary', (e) => {
						const $videoPlay = Evergage.cashDom(e.currentTarget);
						const videoURL = $videoPlay[0].href;
						Evergage.sendEvent({
							action: 'Video View',
							itemAction: Evergage.ItemAction.ViewItem,
							catalog: {
								Video: {
									_id: 'CMG Home Mobile App',
									name: 'CMG Home Mobile App',
									url: videoURL
								}
							}
						});
					}),
					Evergage.listener('click', 'div.cmg-product a[data-role="play-button"]', (e) => {
						const $videoPlay = Evergage.cashDom(e.currentTarget);
						const $video = $videoPlay.parents('.cmg-product');
						const name = $video.find('a.button-primary').attr('href');
						const videoURL = $videoPlay.attr('href');
						Evergage.sendEvent({
							action: 'Video View',
							itemAction: Evergage.ItemAction.ViewItem,
							catalog: {
								Video: {
									_id: name,
									name: name,
									url: videoURL
								}
							}
						});
					}),
					Evergage.listener('click', 'a.card', (e) => {
						const $card = Evergage.cashDom(e.currentTarget);
						const pdfURL = $card.attr('href');
						const name = $card.find('.card-body h6').text();
						if (pdfURL.includes('.pdf')) {
							Evergage.sendEvent({
								action: `PDF Download | ${name}`,
								itemAction: Evergage.ItemAction.ViewItem,
								catalog: {
									PDF: {
										_id: name,
										name: name,
										url: pdfURL
									}
								}
							});
						}
					})
				]
			},
			{
				name: 'Login',
				action: 'Viewed Login Screen',
				isMatch: () => {
					return window.location.pathname.includes('/login/');
				},
				listeners: [
					Evergage.listener('click', 'button[aria-label="SIGN IN"]', (e) => {
						const $login = Evergage.cashDom(e.currentTarget);
						const $loginCard = $login.parents('.v-card__text');
						const email = $loginCard.find('input[name="Your Email"]').val();
						Evergage.sendEvent({
							action: 'Login Email Submitted',
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
				name: 'Sign Up',
				action: 'Viewed Sign Up Page',
				isMatch: () => {
					return window.location.pathname.includes('/onboarding/') || window.location.pathname.includes('/signup/');
				},
				listeners: [
					Evergage.listener('click', 'button.sel_button_get_started div.v-btn__content', () => {
						const email = Evergage.cashDom('input[aria-label="Your Email"]').val();
						Evergage.sendEvent({
							action: 'Sign Up email submitted',
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
				name: 'Application',
				action: 'Viewed Application page',
				isMatch: () => {
					return window.location.pathname.includes('/borrower/custom_form') && Evergage.cashDom('#first_name').length == 0 && Evergage.cashDom('#address').length == 0;
				},
				listeners: [
					Evergage.listener('click', 'button.sel_button_save_and_continue, button.sel_button_go_back', () => {
						changeSPAPage();
					})
				]
			},
			{
				name: 'Personal Info',
				action: 'Viewed Personal Info page',
				isMatch: () => {
					if (window.location.pathname.includes('/borrower/')) {
						return Evergage.cashDom('#first_name').length > 0;
					} else {
						return false;
					}
				},
				listeners: [
					Evergage.listener('click', '#action_buttons button.sel_button_save_and_continue', () => {
						const $form = Evergage.cashDom('main.v-content form');
						const firstName = $form.find('#first_name').val();
						const lastName = $form.find('#last_name').val();
						const email = $form.find('#email').val();
						if (firstName == '') {
							return;
						}
						Evergage.sendEvent({
							action: 'Personal Information Submitted on Application',
							user: {
								attributes: {
									firstName: firstName,
									lastName: lastName,
									emailAddress: email
								}
							}
						});
						changeSPAPage();
					}),
					Evergage.listener('click', 'button.sel_button_go_back', () => {
						changeSPAPage();
					})
				]
			},
			{
				name: 'Address Info',
				action: 'Viewed Address Info page',
				isMatch: () => {
					if (window.location.pathname.includes('/borrower/')) {
						return Evergage.cashDom('#address').length > 0;
					} else {
						return false;
					}
				},
				listeners: [
					Evergage.listener('click', '#action_buttons button.sel_button_save_and_continue', () => {
						const $form = Evergage.cashDom('main.v-content form');
						const street = $form.find('#address').val();
						const city = $form.find('#city').val();
						const state = $form.find('#state').val();
						const zip = $form.find('#zip').val();
						if (street == '') {
							return;
						}
						Evergage.sendEvent({
							action: 'Address Information Submitted on Application',
							user: {
								attributes: {
									address: street,
									city: city,
									state: state,
									zip: zip
								}
							}
						});
						changeSPAPage();
					}),
					Evergage.listener('click', 'button.sel_button_go_back', () => {
						changeSPAPage();
					})
				]
			},
			{
				name: 'User Dashboard',
				action: 'Viewed User Dashboard',
				isMatch: () => {
					if (window.location.pathname.includes('/homehub/dashboard/')) {
						return Evergage.cashDom('.v-navigation-drawer__content').length > 0;
					} else {
						return false;
					}
				},
				listeners: [
					Evergage.listener('click', '.sn-icon-exit', () => {
						changeSPAPage();
					})
				],
				onActionEvent: (actionEvent) => {
					const loanStatus = Evergage.cashDom('div.task-subtitle').text().trim();
					const userModal = Evergage.cashDom('#input-178');
					if (loanStatus) {
						actionEvent.user = actionEvent.user || {};
						actionEvent.user.attributes = actionEvent.user.attributes || {};
						actionEvent.user.attributes.loanStatus = loanStatus;
					}
					if (userModal.length > 0) {
						const firstName = Evergage.cashDom('#input-178').val();
						const lastName = Evergage.cashDom('#input-181').val();
						const email = Evergage.cashDom('#input-196').val();
						actionEvent.user = actionEvent.user || {};
						actionEvent.user.attributes = actionEvent.user.attributes || {};
						actionEvent.user.attributes.firstName = firstName;
						actionEvent.user.attributes.lastName = lastName;
						actionEvent.user.attributes.emailAddress = email;
					}
					return actionEvent;
				}
			},
			{
				name: 'Home Buyers Guide Page',
				action: 'Viewed Home Buyers Guide Page',
				isMatch: () => {
					return window.location.pathname.includes('/home-buyers-guide');
				},
				listeners: [
					Evergage.listener('click', 'a.button-secondary', () => {
						const pdfLink = Evergage.resolvers.fromSelectorAttribute('a.button-secondary', 'href')();
						Evergage.sendEvent({
							action: 'PDF Download',
							itemAction: Evergage.ItemAction.ViewItem,
							catalog: {
								PDF: {
									_id: 'Home Buyers Guide',
									name: 'Home Buyers Guide',
									url: pdfLink
								}
							}
						});
					})
				]
			},
			{
				name: 'Apply for Mortgage Refinance Page',
				action: 'Viewed Apply for Mortgage Refinance Page',
				isMatch: () => {
					return window.location.pathname.includes('/apply-today');
				}
			},
			{
				name: 'Refiance Guide Page',
				action: 'Viewed Refiance Guide Page',
				isMatch: () => {
					return window.location.pathname.includes('/refinance-guide');
				},
				listeners: [
					Evergage.listener('click', 'a.button-deep-see-solid', () => {
						const pdfLink = Evergage.resolvers.fromSelectorAttribute('a.button-deep-see-solid', 'href')();
						Evergage.sendEvent({
							action: 'PDF Download',
							itemAction: Evergage.ItemAction.ViewItem,
							catalog: {
								PDF: {
									_id: 'Refinance Guide',
									name: 'Refinance Guide',
									url: pdfLink
								}
							}
						});
					})
				]
			},
			{
				name: 'Refiance Guide Page',
				action: 'Viewed Refiance Guide Page',
				isMatch: () => {
					return window.location.pathname.includes('/refinance-guide');
				},
				listeners: [
					Evergage.listener('click', 'a.button-deep-see-solid', () => {
						const pdfLink = Evergage.resolvers.fromSelectorAttribute('a.button-deep-see-solid', 'href')();
						Evergage.sendEvent({
							action: 'PDF Download',
							itemAction: Evergage.ItemAction.ViewItem,
							catalog: {
								PDF: {
									_id: 'Refinance Guide',
									name: 'Refinance Guide',
									url: pdfLink
								}
							}
						});
					})
				]
			},
			{
				name: 'Borrowsmart',
				action: 'Viewed Borrow Smart',
				isMatch: () => {
					return window.location.pathname.includes('/borrowsmart');
				},
				listeners: [
					Evergage.listener('click', 'a.button-secondary-outline', () => {
						Evergage.sendEvent({
							action: 'Check Your Eligibility'
						});
					})
				]
			},
			{
				name: 'Loan Products Landing Page',
				action: 'Viewed Loan Products Landing Page',
				isMatch: () => {
					return window.location.pathname.endsWith('/loan-programs');
				}
			},
			{
				name: 'Loan Products Detail Page',
				action: 'Viewed Loan Products Detail Page',
				isMatch: () => {
					if (window.location.pathname.includes('/loan-programs/')) {
						return Evergage.util.resolveWhenTrue.bind(() => {
							return Evergage.cashDom('.programs-section').length > 0;
						});
					}
					return false;
				},
				itemAction: Evergage.ItemAction.ViewItem,
				catalog: {
					Product: {
						_id: () => {
							return Evergage.resolvers.fromMeta('og:title')().split('|')[0].trim();
						},
						name: () => {
							return Evergage.resolvers.fromMeta('og:title')().split('|')[0].trim();
						},
						description: Evergage.resolvers.fromMeta('og:description'),
						url: Evergage.resolvers.fromMeta('og:url'),
						price: 1,
						imageUrl: () => {
							return Evergage.cashDom('img[alt="CMG Partners logo"]').attr('src');
						},
						inventoryCount: 1,
						categories: () => {
							return ['Loan Products|' + Evergage.resolvers.fromSelector('.nav-item .active')()];
						}
					}
				}
			},
			{
				name: 'Video Landing Page',
				action: 'Viewed Video Landing Page',
				isMatch: () => {
					return window.location.pathname.includes('/watch-and-learn');
				},
				listeners: [
					Evergage.listener('click', 'a[data-role=play-button]', (e) => {
						const $play = Evergage.cashDom(e.currentTarget);
						const $videoCard = $play.parents('.video-card');
						const name = $videoCard.find('h6').text();
						const imageUrl = $play.find('img').attr('src');
						const url = $play.attr('href');
						const category = ['Video|' + Evergage.cashDom('li.nav-item a.active').text().trim()];
						Evergage.sendEvent({
							action: 'Video Play',
							itemAction: Evergage.ItemAction.ViewItem,
							catalog: {
								Video: {
									_id: name,
									name: name,
									imageUrl: imageUrl,
									url: url,
									categories: category
								}
							}
						});
					})
				]
			},
			{
				name: 'Blog Detail Page',
				action: 'Viewed Blog Detail Page',
				isMatch: () => {
					if (window.location.pathname.includes('/blog/')) {
						return Evergage.util.resolveWhenTrue.bind(() => {
							return Evergage.cashDom('.blogdetails').length > 0;
						});
					}
					return false;
				},
				itemAction: Evergage.ItemAction.ViewItem,
				catalog: {
					Blog: {
						_id: () => {
							return Evergage.resolvers.fromMeta('og:title')().split('|')[0].trim();
						},
						name: () => {
							return Evergage.resolvers.fromMeta('og:title')().split('|')[0].trim();
						},
						url: Evergage.resolvers.fromMeta('og:url'),
						description: Evergage.resolvers.fromMeta('og:description'),
						imageUrl: () => {
							return Evergage.resolvers.fromSelectorAttribute('.article-image', 'src')();
						},
						published: () => {
							return new Date(Evergage.resolvers.fromSelector('p.date span')());
						},
						categories: () => {
							return ['Blogs|' + Evergage.resolvers.fromSelectorMultiple('.tag-box')().join('|')];
						}
					}
				}
			},
			{
				name: 'CMG News Detail Page',
				action: 'Viewed News Article',
				isMatch: () => {
					if (window.location.pathname.includes('/news/')) {
						return Evergage.util.resolveWhenTrue.bind(() => {
							return Evergage.cashDom('#news_carousel').length > 0;
						});
					}
					return false;
				},
				itemAction: Evergage.ItemAction.ViewItem,
				catalog: {
					Blog: {
						_id: () => {
							return Evergage.resolvers.fromMeta('og:title')().split('|')[0].trim();
						},
						name: () => {
							return Evergage.resolvers.fromMeta('og:title')().split('|')[0].trim();
						},
						url: Evergage.resolvers.fromMeta('og:url'),
						description: Evergage.resolvers.fromMeta('og:description'),
						imageUrl: () => {
							return Evergage.resolvers.fromSelectorAttribute('div.blogdetails img', 'src')();
						},
						published: () => {
							return new Date(Evergage.resolvers.fromSelector('p.date span')());
						},
						categories: () => {
							return ['News|' + Evergage.resolvers.fromSelectorMultiple('.tag-box')().join('|')];
						}
					}
				}
			},
			{
				name: 'CMG Cares',
				action: 'Viewed CMG Cares',
				isMatch: () => {
					return window.location.pathname.includes('/cmg-cares');
				},
				listeners: [
					Evergage.listener('click', 'div.foundation-card', (e) => {
						const $foundation = Evergage.cashDom(e.currentTarget);
						const foundationName = $foundation.find('img').attr('alt');

						Evergage.sendEvent({
							action: `CMG Cares | ${foundationName}`
						});
					})
				]
			},
			{
				name: 'Calculator Tools',
				action: 'Viewed Calculator',
				isMatch: () => {
					return window.location.pathname.includes('/calculator');
				},
				catalog: {
					Category: {
						_id: Evergage.resolvers.fromMeta('og:title')
					}
				}
			},
			{
				name: 'Blog Landing Page',
				action: 'Viewed Blog Landing Page',
				isMatch: () => window.location.pathname.includes('/blog') && Evergage.cashDom('.blogs').length > 0
			},
			{
				name: 'Find A Loan Officer',
				action: 'Viewed Find A Loan Officer',
				isMatch: () => window.location.pathname.includes('/find-loan-officer')
			},
			{
				name: 'Get Pre-Approved Page',
				action: 'Viewed Get Pre-Approved Page',
				isMatch: () => window.location.pathname.includes('/pre-approval')
			},
			{
				name: 'First Time Home Buyers Page',
				action: 'Viewed First Time Home Buyers Page',
				isMatch: () => window.location.pathname.includes('/first-time-home-buyers')
			},
			{
				name: 'Cash Out Refinance Page',
				action: 'Viewed Cash Out Refinance Page',
				isMatch: () => window.location.pathname.includes('/cash-out-refinance')
			},
			{
				name: 'Reasons to Refinance Page',
				action: 'Viewed Reasons to Refinance Page',
				isMatch: () => window.location.pathname.includes('/reasons-to-refinance')
			},
			{
				name: 'CMG News Landing Page',
				action: 'Viewed News Landing Page',
				isMatch: () => window.location.pathname.includes('/news') && Evergage.resolvers.fromMeta('og:url')() == 'https://www.cmgfi.com/news'
			},
			{
				name: 'Blog Landing Page',
				action: 'Viewed Blog Landing Page',
				isMatch: () => window.location.pathname.includes('/blog') && Evergage.cashDom('.blogs').length > 0
			},
			{
				name: 'Find A Loan Officer',
				action: 'Viewed Find A Loan Officer',
				isMatch: () => window.location.pathname.includes('/find-loan-officer')
			},
			{
				name: 'Get Pre-Approved Page',
				action: 'Viewed Get Pre-Approved Page',
				isMatch: () => window.location.pathname.includes('/pre-approval')
			},
			{
				name: 'First Time Home Buyers Page',
				action: 'Viewed First Time Home Buyers Page',
				isMatch: () => window.location.pathname.includes('/first-time-home-buyers')
			},
			{
				name: 'Cash Out Refinance Page',
				action: 'Viewed Cash Out Refinance Page',
				isMatch: () => window.location.pathname.includes('/cash-out-refinance')
			},
			{
				name: 'Reasons to Refinance Page',
				action: 'Viewed Reasons to Refinance Page',
				isMatch: () => window.location.pathname.includes('/reasons-to-refinance')
			},
			{
				name: 'CMG News Landing Page',
				action: 'Viewed News Landing Page',
				isMatch: () => window.location.pathname.includes('/news') && Evergage.resolvers.fromMeta('og:url')() == 'https://www.cmgfi.com/news'
			},
			{
				name: 'All In One',
				action: 'Viewed All In One Loans',
				isMatch: () => window.location.pathname.includes('/all-in-one')
			},
			{
				name: 'Careers',
				action: 'Viewed Careers',
				isMatch: () => window.location.pathname.includes('/careers')
			},
			{
				name: 'Leadership',
				action: 'Viewed Leadership',
				isMatch: () => window.location.pathname.includes('/leadership')
			},
			{
				name: 'Our Story',
				action: 'Viewed Our Story',
				isMatch: () => window.location.pathname.includes('/our-story')
			},
			{
				name: 'Contact Us',
				action: 'Viewed Contact Us',
				isMatch: () => window.location.pathname.includes('/about-us/contact')
			},
			{
				name: 'Partners',
				action: 'Viewed Partners',
				isMatch: () => window.location.pathname.includes('/partners')
			},
			{
				name: 'Wholesale',
				action: 'Viewed Wholesale',
				isMatch: () => window.location.pathname.includes('/wholesale')
			},
			{
				name: 'Correspondent',
				action: 'Viewed Correspondent',
				isMatch: () => window.location.pathname.includes('/correspondent')
			},
			{
				name: 'Corporate',
				action: 'Viewed Corporate',
				isMatch: () => window.location.pathname.includes('/corporate')
			},
			{
				name: 'Corporate',
				action: 'Viewed Corporate',
				isMatch: () => window.location.pathname.includes('/corporate')
			},
			{
				name: 'Home Fund It',
				action: 'Viewed Home Fund It',
				isMatch: () => window.location.pathname.includes('/homefundit')
			},
			{
				name: 'Teams',
				action: 'Viewed Teams',
				isMatch: () => window.location.pathname.includes('/team/')
			},
			{
				name: 'Branch',
				action: 'Viewed Branch',
				isMatch: () => window.location.pathname.includes('/branch')
			},
			{
				name: 'mysite',
				action: 'Viewed MySite',
				isMatch: () => /^\/mysite\//.test(window.location.pathname)
			}
		]
	};
	Evergage.initSitemap(config);
});
