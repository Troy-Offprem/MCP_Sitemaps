Evergage.init({
	cookieDomain: 'wisdomtree.com'
}).then(() => {
	const handleSPAPageChange = () => {
		let url = window.location.href;
		if (Evergage.cashDom("body[data-page-name='Tools Center | WisdomTree']").length > 0) {
			const urlChangeInterval = setInterval(() => {
				if (url !== window.location.href) {
					url = window.location.href;
					Evergage.reinit();
				}
			}, 2000);
		}
	};
	handleSPAPageChange();

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
					const imgUrl = img
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
								imageUrl: imgUrl
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
				action: 'Homepage | View',
				isMatch: () => {
					return /^\/$/.test(window.location.pathname);
				},
				listeners: [
					Evergage.listener('click', 'div.carousel-item-wrapper .button', (e) => {
						const $button = Evergage.cashDom(e.currentTarget);
						const $slideContent = $button.parents('.carousel-item-wrapper');
						const title = $slideContent.find('div.title').text().trim();
						const buttonURL = $button.attr('href');
						const pathName = Evergage.util.getLastPathComponent(buttonURL).split('-')[0].toUpperCase();
						const buttonText = $button.text().trim();
						if (buttonText.includes('Learn More')) {
							Evergage.sendEvent({
								action: `Home Carousel | ${buttonText} about ${pathName}`
							});
						} else {
							Evergage.sendEvent({
								action: `${buttonText} ${title}`
							});
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
						email: $form.find('label[for=RegisterEmail]').siblings('span').text().trim(),
						firstName: $form.find('input[name=RegisterFirstName').val(),
						lastName: $form.find('input[name=RegisterLastName').val(),
						investorType: $form.find('span').text().trim(),
						state: $form.find('#RegisterState option[selected=selected]').val()
					};
					if ($form) {
						actionEvent.user = actionEvent.user || {};
						actionEvent.user.attributes = actionEvent.user.attributes || {};
						actionEvent.user.id = user.email;
						actionEvent.user.attributes.emailAddress = user.email;
						actionEvent.user.attributes.firstName = user.firstName;
						actionEvent.user.attributes.lastName = user.lastName;
						actionEvent.user.attributes.investorType = user.investorType;
						actionEvent.user.attributes.state = user.state;
					}
					return actionEvent;
				}
			},
			{
				name: 'ETF',
				action: 'ETF | View',
				isMatch: () => {
					return window.location.pathname.includes('/etfs/');
				},
				itemAction: Evergage.ItemAction.ViewItem,
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
						description: () => {
							return Evergage.resolvers.fromMeta('description')();
						},
						imageUrl: () => {
							return Evergage.resolvers.fromSelectorAttribute('a.logo img', 'src')();
						},
						categories: () => {
							const tags = Evergage.resolvers.fromMeta('custom')().split(', ');
							if (tags.length > 3) {
								tags.length = 3;
								const updateTags = tags.join('|');
								return [`ETF|${updateTags}`];
							} else {
								const updateTags = tags.join('|');
								return [`ETF|${updateTags}`];
							}
						},
						relatedCatalogObjects: {
							StrategyCategory: () => {
								const tag = Evergage.resolvers.fromMeta('custom')().split(', ');
								if (tag.length == 4) {
									const stratTag = tag.pop();
									return [stratTag];
								} else {
									return '';
								}
							}
						}
					}
				},
				listeners: [
					Evergage.listener('click', '.trade-fund button', (e) => {
						$button = Evergage.cashDom(e.currentTarget);
						buttonName = $button.text().trim();
						if ($button.attr('data-for') == 'compare-tool-tip') {
							Evergage.sendEvent({
								action: 'Compare Funds CTA'
							});
						} else {
							Evergage.sendEvent({
								action: 'Buy Funds CTA'
							});
							setTimeout(() => {
								Evergage.reinit();
							}, 250);
						}
						Evergage.sendEvent({
							action: `Viewed ${buttonName}`,
							catalog: {
								Product: {
									_id: () => {
										return Evergage.cashDom('h2.ticker-code').text().trim();
									}
								}
							}
						});
					}),
					Evergage.listener('click', '.broker-icon', (e) => {
						const $broker = Evergage.cashDom(e.currentTarget);
						const brokerName = $broker.find('img').attr('alt');
						const title = Evergage.util.getLastPathComponent(window.location.pathname).toUpperCase();
						Evergage.sendEvent({
							action: `Clicked ${brokerName} from ${title}`
						});
						Evergage.sendEvent({
							action: `Clicked broker link`
						});
					})
				]
			},
			{
				name: 'Index',
				action: 'Index | View',
				isMatch: () => {
					return window.location.pathname.includes('/index/');
				},
				itemAction: Evergage.ItemAction.ViewItem,
				catalog: {
					Index: {
						_id: () => {
							return Evergage.cashDom('h1.fund-name').text().trim();
						},
						name: () => {
							return Evergage.cashDom('h1.fund-name').text().trim();
						},
						imageUrl: () => {
							return Evergage.resolvers.fromSelectorAttribute('a.logo img', 'src')();
						},
						url: window.location.pathname,
						description: () => {
							return Evergage.resolvers.fromMeta('description')();
						}
					}
				}
			},
			{
				name: 'Product Landing Page',
				action: 'Product Landing Page | View',
				isMatch: () => {
					return window.location.pathname.includes('/etfs') || window.location.pathname.includes('/index');
				}
			},
			{
				name: 'Strategy',
				action: 'Strategy | View',
				isMatch: () => {
					return window.location.pathname.includes('/strategies/') || window.location.pathname.includes('/modern-alpha');
				},
				itemAction: Evergage.ItemAction.ViewItem,
				catalog: {
					Strategy: {
						_id: () => {
							return Evergage.resolvers.fromMeta('custom')();
						},
						name: () => {
							return Evergage.cashDom('title').text().split('|')[0];
						},
						url: window.location.pathname,
						description: () => {
							return Evergage.resolvers.fromMeta('description')();
						},
						imageUrl: () => {
							return Evergage.cashDom('div.advisor-hero link').attr('href');
						},
						relatedCatalogObjects: {
							StrategyCategory: () => {
								return [Evergage.resolvers.fromMeta('custom')()];
							}
						}
					}
				},
				listeners: [
					Evergage.listener('click', '.card .poster', (e) => {
						const $video = Evergage.cashDom(e.currentTarget);
						const $videoCard = $video.parents('.highlight-card');
						const title = $videoCard.find('.title').text().trim();
						Evergage.sendEvent({
							action: `Modern Alpha Video | ${title}`,
							itemAction: Evergage.ItemAction.ViewItem,
							catalog: {
								Video: {
									_id: title,
									name: title
								}
							}
						});
					})
				]
			},
			{
				name: 'Market Insights',
				action: 'Market Insights | View',
				isMatch: () => {
					return window.location.pathname.includes('/market-insights');
				},
				listeners: [
					Evergage.listener('click', 'a.article-link', (e) => {
						const $link = Evergage.cashDom(e.currentTarget);
						const $articleCard = $link.parents('.article-item');
						const url = $link.attr('href');
						const title = $link.text().trim();
						const author = [$articleCard.find('.article-author').text().split(',')[0].trim()];
						Evergage.sendEvent({
							action: 'Market Insight PDF View',
							itemAction: Evergage.ItemAction.ViewItem,
							catalog: {
								PDF: {
									_id: title,
									name: title,
									url: url,
									relatedCatalogObjects: {
										Author: author
									}
								}
							}
						});
					})
				]
			},
			{
				name: 'Resources',
				action: `Resources | Viewed ${Evergage.cashDom('title').text().split('|')[0]}`,
				isMatch: () => {
					return window.location.pathname.includes('/resource-library') || window.location.pathname.includes('/etf-education');
				}
			},
			{
				name: 'Tools',
				action: `Tools | View`,
				isMatch: () => {
					return Evergage.cashDom("body[data-page-name='Tools Center | WisdomTree']").length > 0;
				},
				itemAction: Evergage.ItemAction.ViewCategory,
				catalog: {
					Category: {
						_id: () => {
							const title = Evergage.resolvers.fromSelector('.titleStyleOn')();
							if (title) {
								return 'Tools|' + title;
							} else {
								return 'Tools';
							}
						}
					}
				},
				listeners: [
					Evergage.listener('click', 'div[data-tip="true"] div', () => {
						const toolName = Evergage.resolvers.fromSelector('.titleStyleOn')();
						Evergage.sendEvent({
							action: `${toolName} Tool Used`
						});
					}),
					Evergage.listener('click', 'div.aniStyle div.primaryBarStyle', () => {
						const mainName = Evergage.resolvers.fromSelector('.titleStyleOn')();
						Evergage.sendEvent({
							action: `${mainName} Tool Used`
						});
					})
				]
			},
			{
				name: 'Investor Solutions',
				action: 'Investor Solutions | View',
				isMatch: () => {
					return Evergage.cashDom("body[data-page-url='http://www.wisdomtree.com/investor-solutions']").length > 0;
				},
				listeners: [
					Evergage.listener('click', '.-standalone', (e) => {
						const $submit = Evergage.cashDom(e.currentTarget);
						const $form = $submit.parents('#contact-us-form');
						const name = $form.find('#Name').val();
						const email = $form.find('#Email').val(); 
						Evergage.sendEvent({
							action: 'Contact Us form submitted',
							user: {
								id: email,
								attributes: {
									fullName: name,
									emailAddress: email
								}
							}
						});
					})
				]
			},
			{
				name: 'Blog Landing Page',
				action: `Blog Landing Page | View ${Evergage.resolvers.fromSelector('ul.category-dropdown li.-active')()}`,
				isMatch: () => {
					return Evergage.cashDom("body[data-page-name='wisdomtree.com|blog']").length > 0;
				}
			},
			{
				name: 'Blog Detail Page',
				action: 'Blog Detail Page | View',
				isMatch: () => {
					return Evergage.cashDom("body[data-page-type='us|blog']").length > 0 && Evergage.cashDom('div.blog-detail-template').length > 0;
				},
				itemAction: Evergage.ItemAction.ViewItem,
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
							return Evergage.resolvers.fromSelectorAttribute('img.blog-image', 'src')();
						},
						url: window.location.pathname,
						published: () => {
							return new Date(Evergage.resolvers.fromSelector('div.contributor-date')());
						},
						categories: () => {
							return Evergage.DisplayUtils.pageElementLoaded('.tags .tag', 'html').then(() => {
								const tags = Evergage.resolvers.fromSelectorMultiple('div.tags a.tag')();
								const baseTag = 'Blog,';
								return [
									baseTag
										.concat(tags)
										.split(',')
										.map((i) => i.trim())
										.join('|')
								];
							});
						},
						relatedCatalogObjects: {
							Author: () => {
								return [
									Evergage.resolvers
										.fromSelectorMultiple('div.contributor-content div.contributor-name a')()
										.map((i) => i.trim())
										.join('|')
								];
							}
						}
					}
				}
			},
			{
				name: 'Video Landing Page',
				action: `Video Landing Page | View ${Evergage.resolvers.fromSelector('ul.category-dropdown li.-active')()}`,
				isMatch: () => {
					return Evergage.cashDom("body[data-page-name='wisdomtree.com|videos']").length > 0;
				}
			},
			{
				name: 'Video Detail Page',
				action: 'Video Detail Page | View',
				isMatch: () => {
					return window.location.pathname.includes('/multimedia/videos/');
				},
				itemAction: Evergage.ItemAction.ViewItem,
				catalog: {
					Video: {
						_id: () => {
							return Evergage.cashDom('title').text().split('|')[0].trim();
						},
						name: () => {
							return Evergage.cashDom('title').text().split('|')[0].trim();
						},
						description: () => {
							return Evergage.cashDom('div.multimedia-description p').text();
						},
						url: window.location.pathname
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
				action: `Podcast Landing Page | View ${Evergage.resolvers.fromSelector('ul.category-dropdown li.-active')()}`,
				isMatch: () => {
					return Evergage.cashDom("body[data-page-name='wisdomtree.com|podcasts']").length > 0;
				}
			},
			{
				name: 'Podcast Detail Page',
				action: 'Podcast Detail Page | View',
				isMatch: () => {
					return window.location.pathname.includes('/multimedia/podcasts/');
				},
				itemAction: Evergage.ItemAction.ViewItem,
				catalog: {
					Podcast: {
						_id: () => {
							return Evergage.cashDom('title').text().split('|')[0];
						},
						name: () => {
							return Evergage.cashDom('title').text().split('|')[0];
						},
						description: () => {
							return Evergage.cashDom('div.multimedia-description').text();
						},
						url: window.location.pathname
					}
				}
			}
		]
	};

	Evergage.initSitemap(config);
});
