Evergage.init({
	cookieDomain: 'uschamber.com'
}).then(() => {
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
					return window.location.pathname === '/';
				}
			},
			{
				name: 'Co- Home',
				action: 'Co- Home | View',
				isMatch: () => {
					return window.location.pathname.endsWith('/co/');
				}
			},
			{
				name: 'Topics Landing Page',
				action: 'Topics Landing Page - View',
				isMatch: () => {
					return Evergage.resolvers.fromMeta('og:title')() == 'Topics' || (Evergage.cashDom('nav[data-component="uscc:listing:breadcrumb"] a').attr('href') == '/topics' && Evergage.resolvers.fromJsonLd('@type')() !== 'Article');
				},
				catalog: {
					Category: {
						_id: () => {
							const topic = Evergage.resolvers.fromJsonLd('name')();
							if (topic === 'Topics') {
								return 'Topics|All';
							} else {
								return `Topics|${topic}`;
							}
						}
					}
				}
			},
			{
				name: 'Co- Topics Landing Page',
				action: 'Co- Topics Landing Page - View',
				isMatch: () => {
					const coTopicPages = ['Start', 'Run', 'Grow', 'Good Company'];
					const coPathnames = ['/co/start', '/co/run', '/co/grow', '/co/good-company'];
					return coPathnames.includes(window.location.pathname) || coTopicPages.includes(Evergage.resolvers.fromSelector('div.title-hero__wrapper h5')());
				},
				catalog: {
					Category: {
						_id: () => {
							const pathname = window.location.pathname;
							const topics = pathname
								.replace('/co/', '')
								.replace('/', ' ')
								.replace(/(^\w|\s\w)/g, (m) => m.toUpperCase())
								.replace(' ', '|');
							return 'Co- Topics|' + topics;
						}
					}
				}
			},
			{
				name: 'Article Detail Page',
				action: 'Article Detail Page - View',
				isMatch: () => {
					if (!window.location.pathname.includes('/co/')) {
						return Evergage.resolvers.fromJsonLd('@type')() == 'Article';
					}
				},
				itemAction: Evergage.ItemAction.ViewItem,
				catalog: {
					Article: {
						_id: () => {
							return Evergage.resolvers.fromJsonLd('identifier')().value;
						},
						name: () => {
							return Evergage.resolvers.fromJsonLd('headline')();
						},
						description: () => {
							return Evergage.resolvers.fromJsonLd('description')();
						},
						published: () => {
							return Evergage.resolvers.fromJsonLd('dateModified')();
						},
						imageUrl: () => {
							return Evergage.resolvers.fromJsonLd('image')();
						},
						url: () => {
							return Evergage.resolvers.fromJsonLd('url')();
						},
						categories: () => {
							const keywords = Evergage.resolvers.fromJsonLd('keywords')();
							if (keywords.length > 0) {
								const topic = [];
								const program = [];
								const cms = [];
								const majorInt = [];
								for (let i = 0; i < keywords.length; i++) {
									let catTitle = keywords[i].split(':')[0];
									let catName = keywords[i].split(':')[1];
									if (catTitle == 'Topic') {
										topic.push(catName.trim());
									}
									if (catTitle == 'Program') {
										program.push(catName.trim());
									}
									if (catTitle == 'CMS') {
										cms.push(catName.trim());
									}
									if (catTitle == 'Major Initiative') {
										majorInt.push(catName.trim());
									}
								}
								const category = [topic.join('|'), program.join('|'), majorInt.join('|'), cms];
								return ['US Chamber|' + category.join('|')];
							}
						},
						relatedCatalogObjects: {
							Author: () => {
								const author = Evergage.resolvers.fromJsonLd('author')().name;
								if (typeof Evergage.resolvers.fromJsonLd('author')().name === 'string') {
									return [author];
								} else {
									return author;
								}
							},
							Publisher: () => {
								return [Evergage.resolvers.fromJsonLd('publisher')().name];
							}
						}
					}
				}
			},
			{
				name: 'Co- Article Detail Page',
				action: 'Co- Article Detail Page - View',
				isMatch: () => {
					if (window.location.pathname.includes('/co/')) {
						return Evergage.cashDom('.article-header').length > 0 && !window.location.pathname.includes('/dream-big-awards');
					}
				},
				itemAction: Evergage.ItemAction.ViewItem,
				catalog: {
					Article: {
						_id: () => {
							return JSON.parse(Evergage.cashDom('script[type="application/ld+json"]')[1].innerText).identifier.value;
						},
						name: () => {
							return JSON.parse(Evergage.cashDom('script[type="application/ld+json"]')[1].innerText).headline;
						},
						description: () => {
							return JSON.parse(Evergage.cashDom('script[type="application/ld+json"]')[1].innerText).description;
						},
						published: () => {
							return JSON.parse(Evergage.cashDom('script[type="application/ld+json"]')[1].innerText).datePublished;
						},
						imageUrl: () => {
							return JSON.parse(Evergage.cashDom('script[type="application/ld+json"]')[1].innerText).image;
						},
						url: () => {
							return JSON.parse(Evergage.cashDom('script[type="application/ld+json"]')[1].innerText).url;
						},
						categories: () => {
							const cat = Evergage.resolvers.buildCategoryId('div.article-header__wrapper h3 a', 0, null, (category) => category)();
							return ['Co-|' + cat];
						},
						relatedCatalogObjects: {
							Author: () => {
								return [JSON.parse(Evergage.cashDom('script[type="application/ld+json"]')[1].innerText).author.name];
							},
							Publisher: () => {
								return [JSON.parse(Evergage.cashDom('script[type="application/ld+json"]')[1].innerText).publisher.name];
							}
						}
					}
				}
			},
			{
				name: 'Events Landing Page',
				action: 'Events Landing Page - View',
				isMatch: () => {
					if (!window.location.pathname.includes('/co/')) {
						return window.location.pathname.endsWith('/events');
					}
				},
				listeners: [
					Evergage.listener('click', 'ul[data-component="uscc:listing:grid-3"] a[data-component="uscc:card:date"]', (e) => {
						const $eventCard = Evergage.cashDom(e.currentTarget);
						const id = $eventCard.attr('data-event-id');
						const category = [$eventCard.find('span span.pb-8').text()];
						const title = $eventCard.find('span strong.text-title').text();
						const date = $eventCard.find('span.mt-space-5 em').text();
						const url = $eventCard.attr('href');
						Evergage.sendEvent({
							action: `Event interest | ${title}`,
							name: `${title} | Event`,
							itemAction: Evergage.ItemAction.ViewItem,
							catalog: {
								Event: {
									_id: id,
									name: title,
									date: date,
									name: title,
									url: url,
									relatedCatalogObjects: {
										EventCategory: category
									}
								}
							}
						});
					})
				]
			},
			{
				name: 'Co- Event Landing Page',
				action: 'Co- Event Landing Page | View',
				isMatch: () => {
					return window.location.pathname.includes('/co/events') && Evergage.cashDom('.content-feed__card').length > 0;
				},
				catalog: {
					Category: {
						_id: () => {
							const tags = window.location.pathname.replace(/[-]/g, ' ').split('/').splice(2);
							if (tags.length === 1) {
								return 'Co-|Events|All';
							} else {
								const catName = tags[1].toUpperCase();
								return `Co-|Events|${catName}`;
							}
						}
					}
				}
			},
			{
				name: 'Work Landing Page',
				action: 'Work Landing Page - View',
				isMatch: () => {
					return window.location.pathname.startsWith('/work/') || window.location.pathname.startsWith('/program') || window.location.pathname.startsWith('/major-initiative');
				},
				catalog: {
					Category: {
						_id: () => {
							const topic = Evergage.resolvers.fromJsonLd('name')();
							if (topic === 'All Programs') {
								return 'Work|All';
							} else {
								return `Work|${topic}`;
							}
						}
					}
				}
			},
			{
				name: 'About Us Page',
				action: 'About Us Page - View',
				isMatch: () => {
					return window.location.pathname.endsWith('/about');
				}
			},
			{
				name: 'Dream Big Awards',
				action: 'Viewed Dream Big Awards Page',
				isMatch: () => {
					return window.location.pathname.includes('/dream-big-awards');
				},
				listeners: [
					Evergage.listener('click', '#mo-submit', () => {
						const emailAddress = Evergage.resolvers.fromSelector('input[name="EmailAddress"]').val();
						Evergage.sendEvent({
							action: 'Midnight Oil Sign Up',
							user: {
								id: emailAddress,
								attributes: {
									emailAddress: emailAddress
								}
							}
						});
					})
				]
			},
			{
				name: 'Leadership Page',
				action: 'Leadership Page - View',
				isMatch: () => {
					return window.location.pathname.endsWith('/leadership');
				}
			},
			{
				name: 'Bio Page',
				action: 'Leadership Bio Page - View',
				isMatch: () => {
					return window.location.pathname.endsWith('/bio/');
				}
			},
			{
				name: 'Governance Page',
				action: 'Governance Page - View',
				isMatch: () => {
					return window.location.pathname.endsWith('/governance');
				}
			},
			{
				name: 'Regional Offices Page',
				action: 'Regional Offices Page - View',
				isMatch: () => {
					return window.location.pathname.endsWith('/regional-offices');
				}
			},
			{
				name: 'Careers Page',
				action: 'Careers Page - View',
				isMatch: () => {
					return window.location.pathname.endsWith('/careers');
				}
			},
			{
				name: 'Join Landing Page',
				action: 'Join Landing Page - View',
				isMatch: () => {
					return window.location.pathname.endsWith('/join');
				}
			},
			{
				name: 'Small Business Membership',
				action: 'Small Business Membership Sign-up | View',
				isMatch: () => {
					return window.location.pathname.includes('/join/small-business-membership');
				},
				listeners: [
					Evergage.listener('click', '#submit_button', () => {
						const firstName = Evergage.cashDom('input[title="First Name"]').val();
						const lastName = Evergage.cashDom('input[title="Last Name"]').val();
						const companyName = Evergage.cashDom('input[title="Company Name"]').val();
						const phone = Evergage.cashDom('input[title="Phone Number"]').val();
						const emailAddress = Evergage.cashDom('input[title="email"]').val();
						const city = Evergage.cashDom('input[title="City"]').val();
						const state = Evergage.cashDom('input[title="State"]').val();
						const jobTitle = Evergage.cashDom('input[title="Job Title"]').val();
						Evergage.sendEvent({
							action: 'Small Business Membership Sign-up',
							name: 'Small Business Membership Sign-up',
							user: {
								attributes: {
									firstName: firstName,
									lastName: lastName,
									companyName: companyName,
									phone: phone,
									emailAddress: emailAddress,
									city: city,
									state: state,
									jobTitle: jobTitle
								}
							}
						});
					})
				]
			},
			{
				name: 'Corporate Membership',
				action: 'Corporate Membership Sign-up | View',
				isMatch: () => {
					return window.location.pathname.includes('/join/corporate-membership');
				}
			},
			{
				name: 'Chamber of Commerce Membership',
				action: 'Chamber of Commerce Membership Sign-up | View',
				isMatch: () => {
					return window.location.pathname.includes('/join/chamber-of-commerce-membership');
				},
				listeners: [
					Evergage.listener('click', 'p[data-component="uscc:block:paragraph-lead"] a', (e) => {
						const title = Evergage.cashDom(e.currentTarget).text();
						Evergage.sendEvent({
							action: `${title} PDF Application Download`,
							name: `${title} PDF Application Download`
						});
					}),
					Evergage.listener('click', 'ul[data-component="uscc:block:list"] a', (e) => {
						const title = Evergage.cashDom(e.currentTarget).text();
						Evergage.sendEvent({
							action: `${title} PDF Download`,
							name: `${title} PDF Download`
						});
					})
				]
			},
			{
				name: 'Association Membership',
				action: 'Association Membership Sign-up | View',
				isMatch: () => {
					return window.location.pathname.includes('/join/association-membership');
				},
				listeners: [
					Evergage.listener('click', 'p[data-component="uscc:block:paragraph-lead"] a', (e) => {
						const title = Evergage.cashDom(e.currentTarget).text();
						Evergage.sendEvent({
							action: `${title} PDF Application Download`,
							name: `${title} PDF Application Download`
						});
					}),
					Evergage.listener('click', 'ul[data-component="uscc:block:list"] a', (e) => {
						const title = Evergage.cashDom(e.currentTarget).text();
						Evergage.sendEvent({
							action: `${title} PDF Download`,
							name: `${title} PDF Download`
						});
					})
				]
			},
			{
				name: 'Midnight Oil Sign-up Page',
				action: 'Midnight Oil Sign-up Page - View',
				isMatch: () => {
					return window.location.pathname.endsWith('/newsletter');
				},
				listeners: [
					Evergage.listener('click', '#mo-submit', () => {
						const email = Evergage.cashDom('input[name="EmailAddress"]').val();
						Evergage.sendEvent({
							action: 'Midnight Oil Sign-Up',
							name: 'Midnight Oil Sign-Up',
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
				name: 'Chamber of Commerce Directory Page',
				action: 'Chamber of Commerce Directory - View',
				isMatch: () => {
					return Evergage.DisplayUtils.pageElementLoaded('#chamber-finder-js', 'html').then((ele) => {
						return window.location.pathname.includes('/co/chambers');
					});
				},
				catalog: {
					Category: {
						_id: () => {
							const name = Evergage.resolvers.fromJsonLd('name')();
							if (name === 'National Chamber of Commerce Directory') {
								return 'Chamber Directory';
							} else {
								const state = Evergage.resolvers.fromSelector('#chfinder_current_state')();
								const city = Evergage.resolvers.fromSelector('#chfinder_current_city')();
								const tags = [state, city];
								return `Chamber Directory|${tags.join('|')}`;
							}
						}
					}
				}
			},
			{
				name: 'On-Demand Videos Landing Page',
				action: 'On-Demand Landing Page | View',
				isMatch: () => {
					return window.location.pathname.includes('/on-demand') && Evergage.cashDom('iframe[data-component="youtube-player"]').length === 0;
				},
				catalog: {
					Category: {
						_id: () => {
							const topic = Evergage.resolvers.fromJsonLd('name')();
							if (topic === 'U.S. Chamber OnDemand') {
								return 'Video Topic|All';
							} else {
								return `Video Topic|${topic}`;
							}
						}
					}
				}
			},
			{
				name: 'On-Demand Video Detail Page',
				action: 'On-Demand Detail Page | View',
				isMatch: () => {
					return Evergage.cashDom('iframe[data-component="youtube-player"]').length > 0;
				},
				itemAction: Evergage.ItemAction.ViewItem,
				catalog: {
					Video: {
						_id: () => {
							return JSON.parse(Evergage.cashDom('script[type="application/ld+json"]')[1].innerText).identifier.value;
						},
						name: () => {
							return JSON.parse(Evergage.cashDom('script[type="application/ld+json"]')[1].innerText).headline;
						},
						description: () => {
							return JSON.parse(Evergage.cashDom('script[type="application/ld+json"]')[1].innerText).description;
						},
						published: () => {
							return JSON.parse(Evergage.cashDom('script[type="application/ld+json"]')[1].innerText).dateModified;
						},
						imageUrl: () => {
							return JSON.parse(Evergage.cashDom('script[type="application/ld+json"]')[1].innerText).thumbnailUrl;
						},
						url: () => {
							return JSON.parse(Evergage.cashDom('script[type="application/ld+json"]')[1].innerText).url;
						},
						videoUrl: () => {
							return JSON.parse(Evergage.cashDom('script[type="application/ld+json"]')[1].innerText).mainEntity.embedUrl;
						},
						relatedCatalogObjects: {
							VideoCategory: () => {
								const keywords = JSON.parse(Evergage.cashDom('script[type="application/ld+json"]')[1].innerText).keywords;
								keywords.shift();
								return [keywords.join('|')];
							},
							Publisher: () => {
								return [JSON.parse(Evergage.cashDom('script[type="application/ld+json"]')[1].innerText).publisher.name];
							}
						}
					}
				}
			},
			{
				name: 'Co- About Us',
				action: 'Co- About Us Page | View',
				isMatch: () => {
					return window.location.pathname.includes('/co/about-us');
				}
			}
		]
	};

	Evergage.initSitemap(config);
});
