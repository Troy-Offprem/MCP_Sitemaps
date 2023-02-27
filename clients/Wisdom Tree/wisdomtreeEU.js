Evergage.init({
	cookieDomain: 'wisdomtree.eu'
}).then(() => {
	const removeLocalUrl = (oldURL) => {
		const url = oldURL.substr(6);
		return url;
	};

	const config = {
		global: {
			contentZones: [],
			listeners: [
				Evergage.listener('click', 'button.sign-in', () => {
					const email = Evergage.cashDom('input[name=LoginEmail]').val();
					if (email) {
						Evergage.sendEvent({
							action: 'Sign In',
							user: {
								id: email,
								attributes: {
									emailAddress: email
								}
							}
						});
					}
				}),
				Evergage.listener('click', 'a.pdf-link', (e) => {
					const $pdfLink = Evergage.cashDom(e.currentTarget);
					const title = $pdfLink.text().trim();
					const url = $pdfLink.attr('href');
					Evergage.sendEvent({
						action: `View PDF | ${title}`,
						itemAction: Evergage.ItemAction.ViewItem,
						catalog: {
							PDF: {
								_id: title,
								name: title,
								url: url
							}
						}
					});
				}),
				Evergage.listener('click', 'a.stretched-link', (e) => {
					const $cardLink = Evergage.cashDom(e.currentTarget);
					const title = $cardLink.text().trim();
					const url = $cardLink.attr('href');
					const $cardInfo = $cardLink.parents('.card-dashboard');
					const img = $cardInfo.find('div.image').attr('style');
					const $imgUrl = img
						.replace(/^background-image: url\(["']?/, '')
						.replace(/["']?\)$/, '')
						.replace(/\)/, '');
					Evergage.sendEvent({
						action: `View PDF | ${title}`,
						itemAction: Evergage.ItemAction.ViewItem,
						catalog: {
							PDF: {
								_id: title,
								url: url,
								imageUrl: $imgUrl
							}
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
				name: 'Home',
				action: 'Home | View',
				isMatch: () => Evergage.cashDom('body[data-page-name="wisdomtree.eu|Home"]').length > 0,
				listeners: [
					Evergage.listener('click', 'div.item a.button', (e) => {
						const $button = Evergage.cashDom(e.currentTarget);
						const $slideContent = $button.parents('.item');
						const title = $slideContent.find('div.title').text().trim();
						const buttonHref = $button.attr('href');
						const buttonText = $button.text().trim();
						if (buttonHref.includes('/products/')) {
							if (!buttonHref.includes('/etfs/')) {
								Evergage.sendEvent({
									action: `Home Hero | ${buttonText} about ${title}`
								});
							} else {
								Evergage.sendEvent({
									action: `Home Hero | ${buttonText}`
								});
							}
						}
					})
				]
			},
			{
				name: 'User Profile',
				action: 'User Profile | View',
				isMatch: () => {
					return Evergage.cashDom('div.my-wisdomtree-profile').length > 0;
				},
				onActionEvent: (actionEvent) => {
					const $form = Evergage.cashDom('div.my-wisdomtree-profile form');
					const user = {
						email: $form.find('#email-changed').html(),
						firstName: $form.find('input[name=RegisterFirstName').val(),
						lastName: $form.find('input[name=RegisterLastName').val(),
						investorType: $form.find('div.account-type input[checked=checked]').val(),
						country: $form.find('select[name=RegisterCountry] option[selected=selected]').val(),
						company: $form.find('#RegisterCompanyName').val(),
						jobTitle: $form.find('#JobTitle').val()
					};
					if (user) {
						actionEvent.user = actionEvent.user || {};
						actionEvent.user.attributes = actionEvent.user.attributes || {};
						actionEvent.user.id = user.email;
						actionEvent.user.attributes.emailAddress = user.email;
						actionEvent.user.attributes.firstName = user.firstName;
						actionEvent.user.attributes.lastName = user.lastName;
						actionEvent.user.attributes.investorType = user.investorType;
						actionEvent.user.attributes.country = user.country;
						actionEvent.user.attributes.companyName = user.company;
						actionEvent.user.attributes.jobTitle = user.jobTitle;
					}
					return actionEvent;
				}
			},
			{
				name: 'Product Detail',
				action: 'Product Detail | View',
				isMatch: () => Evergage.cashDom('div.fund-details-header').length > 0,
				catalog: {
					Product: {
						_id: () => {
							return Evergage.cashDom('h2.ticker-code').text().trim();
						},
						name: () => {
							return Evergage.cashDom('h1.fund-name').text().trim();
						},
						price: 1,
						inventoryCount: 1,
						imageUrl: () => {
							return Evergage.resolvers.fromSelectorAttribute('a.logo img', 'src')();
						},
						url: removeLocalUrl(window.location.pathname),
						description: () => {
							return Evergage.resolvers.fromMeta('description')();
						},
						categories: () => {
							const tags = Evergage.resolvers.fromMeta('custom')();
							const baseTag = 'Products,';
							return [
								baseTag
									.concat(tags)
									.split(',')
									.map((i) => i.trim())
									.join('|')
							];
						}
					}
				},
				listeners: [
					Evergage.listener('click', '.simple-html-rendering .button', (e) => {
						const $button = Evergage.cashDom(e.currentTarget);
						const $content = $button.parents('.section-content');
						const title = $content.find('.ticker-code').text();
						Evergage.sendEvent({
							action: `How to Invest in ${title}`
						});
					}),
					Evergage.listener('click', 'a.add-to-watchlist', () => {
						const ticker = Evergage.cashDom('h2.ticker-code').text();
						Evergage.sendEvent({
							action: `${ticker} added to favorites`,
							itemAction: Evergage.ItemAction.Favorite,
							catalog: {
								Product: {
									_id: ticker
								}
							}
						});
					}),
					Evergage.listener('click', 'a.remove-from-watchlist', () => {
						const ticker = Evergage.cashDom('h2.ticker-code').text();
						Evergage.sendEvent({
							action: `${ticker} removed from favorites`,
							catalog: {
								Product: {
									_id: ticker
								}
							}
						});
					})
				]
			},
			{
				name: 'Product Landing Page',
				action: 'Product Landing Page | View',
				isMatch: () => window.location.pathname.includes('/etfs') || window.location.pathname.includes('/products')
			},
			{
				name: 'Strategy',
				action: 'Strategy | View',
				isMatch: () => window.location.pathname.includes('/strategies/'),
				catalog: {
					Strategy: {
						_id: () => {
							return Evergage.cashDom('title').text().split('|')[0].trim();
						},
						name: () => {
							return Evergage.cashDom('title').text().split('|')[0].trim();
						},
						url: removeLocalUrl(window.location.pathname),
						imageUrl: () => {
							return Evergage.cashDom('div.advisor-hero link').attr('href');
						},
						relatedCatalogObjects: {
							StrategyCategory: () => {
								const tag = Evergage.resolvers.fromMeta('custom')();
								if (tag !== undefined) {
									return [
										Evergage.resolvers
											.fromMeta('custom')()
											.split(',')
											.map((i) => i.trim())
											.join('|')
									];
								}
							}
						}
					}
				}
			},
			{
				name: 'Resources',
				action: `Resources | View ${Evergage.util
					.getLastPathComponent(window.location.pathname)
					.split('-')
					.join(' ')
					.replace(/(^\w|\s\w)/g, (m) => m.toUpperCase())}`,
				isMatch: () => {
					return Evergage.resolvers.fromSelectorAttribute('body', 'data-page-url')().includes('/resource-library') || Evergage.cashDom('body[data-page-name="wisdomtree.eu|WisdomTree Corporate Responsibility"]').length > 0 || Evergage.cashDom('body[data-page-name="wisdomtree.eu|WisdomTree Investment Governance"]').length > 0 || Evergage.cashDom('body[data-page-name="wisdomtree.eu|Important Notices"]').length > 0;
				}
			},
			{
				name: 'Investor Solutions',
				action: `Investor Solutions | View ${Evergage.cashDom('title').text().split('|')[0]}`,
				isMatch: () => window.location.pathname.includes('/investor-solutions')
			},
			{
				name: 'Article Landing Page',
				action: `Article Landing Page | View ${Evergage.resolvers.fromSelector('ul.category-dropdown li.-active')()}`,
				isMatch: () => {
					return Evergage.cashDom("body[data-page-name='wisdomtree.eu|blog']").length > 0;
				}
			},
			{
				name: 'Article Detail Page',
				action: 'Article Detail Page | View',
				isMatch: () => {
					return Evergage.cashDom('meta[content=article]').length > 0 && Evergage.cashDom('div.blog-post-header').length > 0;
				},
				catalog: {
					Article: {
						_id: () => {
							return Evergage.resolvers.fromMeta('og:title')();
						},
						name: () => {
							return Evergage.resolvers.fromMeta('og:title')();
						},
						description: () => {
							return Evergage.resolvers.fromMeta('description')();
						},
						url: removeLocalUrl(window.location.pathname),
						imageUrl: () => {
							return Evergage.resolvers.fromSelectorAttribute('div.blog-post-header img', 'src')();
						},
						categories: () => {
							const tags = Evergage.resolvers.fromSelectorMultiple('div.tags a.tag')();
							const baseTag = 'Article,';
							return [
								baseTag
									.concat(tags)
									.split(',')
									.map((i) => i.trim())
									.join('|')
							];
						},
						relatedCatalogObjects: {
							Author: () => {
								return Evergage.resolvers.buildCategoryId('div.post-contributors div.author-name a', 0, null, (categoryId) => [categoryId])();
							}
						}
					}
				}
			},
			{
				name: 'Reseach Landing Page',
				action: 'Research Landing Page | View',
				isMatch: () => {
					return Evergage.cashDom("body[data-page-name='wisdomtree.eu|podcasts']").length > 0 && window.location.pathname.includes('/research-materials');
				},
				listeners: [
					Evergage.listener('click', 'a.stretched-link', (e) => {
						const $content = Evergage.cashDom(e.currentTarget);
						const $contentCard = $content.parents('.card-blog');
						const title = $contentCard.find('div.title').text().trim();
						const description = $contentCard.find('div.description').text().trim();
						if ($contentCard) {
							Evergage.sendEvent({
								action: `View PDF | ${title}`,
								itemAction: Evergage.ItemAction.ViewItem,
								catalog: {
									PDF: {
										_id: title,
										name: title,
										description: description
									}
								}
							});
						}
					})
				]
			},
			{
				name: 'Education Landing Page',
				action: 'Education Landing Page | View',
				isMatch: () => {
					return Evergage.cashDom("body[data-page-name='wisdomtree.eu|podcasts']").length > 0 && window.location.pathname.includes('/education');
				},
				listeners: [
					Evergage.listener('click', 'div.thought-leader-card-container a', (e) => {
						const $content = Evergage.cashDom(e.currentTarget);
						const $contentCard = $content.parents('.thought-leader-card-container');
						const title = $contentCard.find('div.thought-leader-card-title').text().trim();
						if ($contentCard) {
							Evergage.sendEvent({
								action: `Clicked Education Card about ${title}`
							});
						}
					})
				]
			},
			{
				name: 'Video Landing Page',
				action: 'Video Landing Page | View',
				isMatch: () => {
					return Evergage.cashDom("body[data-page-name='wisdomtree.eu|videos']").length > 0;
				}
			},
			{
				name: 'Video Detail Page',
				action: 'Video Detail Page | View',
				isMatch: () => {
					return window.location.pathname.includes('/multimedia/videos/');
				},
				catalog: {
					Video: {
						_id: () => {
							return Evergage.cashDom('title').text().trim();
						},
						name: () => {
							return Evergage.cashDom('title').text().trim();
						},
						description: () => {
							return Evergage.cashDom('div.multimedia-description span').text().trim();
						},
						url: removeLocalUrl(window.location.pathname)
					}
				},
				listeners: [
					Evergage.listener('click', 'div.play-video-icon img', () => {
						const id = Evergage.cashDom('title').text().split('|')[0].trim();
						Evergage.sendEvent({
							action: `Played Video | ${id}`,
							itemAction: Evergage.ItemAction.ViewItem,
							catalog: {
								Video: {
									_id: id,
									name: id
								}
							}
						});
					})
				]
			},
			{
				name: 'Podcast Landing Page',
				action: 'Podcast Landing Page | View',
				isMatch: () => {
					return Evergage.cashDom("body[data-page-name='wisdomtree.eu|podcasts']").length > 0;
				}
			},
			{
				name: 'Podcast Detail Page',
				action: 'Podcast Detail Page | View',
				isMatch: () => {
					return window.location.pathname.includes('/multimedia/podcasts/');
				},
				catalog: {
					Podcasts: {
						_id: () => {
							return Evergage.cashDom('title').text().trim();
						},
						name: () => {
							return Evergage.cashDom('title').text().trim();
						},
						description: () => {
							return Evergage.cashDom('div.multimedia-description span').text().trim();
						},
						url: removeLocalUrl(window.location.pathname)
					}
				}
			},
			{
				name: 'Webinar Landing Page',
				action: 'Webinar Landing Page | View',
				isMatch: () => {
					return Evergage.cashDom("body[data-page-name='wisdomtree.eu|Webinar library']").length > 0;
				}
			},
			{
				name: 'How To Invest',
				action: 'How To Invest | View',
				isMatch: () => window.location.pathname.endsWith('/how-to-invest'),
				listeners: [
					Evergage.listener('click', 'div.card a', (e) => {
						const $card = Evergage.cashDom(e.currentTarget);
						const title = $card.find('span').text().trim();
						const url = $card.attr('data-ref');
						Evergage.sendEvent({
							action: `How to invest with ${title}`,
							itemAction: Evergage.ItemAction.ViewItem,
							catalog: {
								InvestmentFirm: {
									_id: title,
									name: title,
									url: url
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
