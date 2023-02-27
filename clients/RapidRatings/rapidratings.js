Evergage.init({
	cookieDomain: 'rapidratings.com'
}).then(() => {
	const getUserInfoFromDataLayer = () => {
		if (window.dataLayer) {
			for (let i = 0; i < window.dataLayer.length; i++) {
				if (window.dataLayer[i].company_name) {
					const userAttr = {
						companyName: window.dataLayer[i].company_name,
						companySize: window.dataLayer[i].employee_range,
						industry: window.dataLayer[i].industry
					};
					return userAttr;
				}
			}
		}
	};
	const changeSPAPage = () => {
		Evergage.reinit();
	};
	const scrollCheck = () => {
		Evergage.DisplayUtils.pageScroll(0.5).then(function (event) {
			if (Evergage.cashDom('.leadin-button-secondary').length > 0) {
				changeSPAPage();
			}
		});
	};

	scrollCheck();

	const config = {
		global: {
			contentZones: [],
			listeners: [
				Evergage.listener('click', '.leadin-content-body .leadin-button-secondary', () => {
					changeSPAPage();
				}),
				Evergage.listener('click', '.leadin-button-primary', (e) => {
					const $form = Evergage.cashDom(e.currentTarget).parents('form');
					const firstName = $form.find('input[name="firstname"]').val();
					const lastName = $form.find('input[name="lastname"]').val();
					const email = $form.find('input[name="email"]').val();
					const jobTitle = $form.find('input[name="jobtitle"]').val();
					const title = Evergage.resolvers.fromSelector('#leadin-content-form-wrapper h4')();
					Evergage.sendEvent({
						action: title,
						name: title,
						user: {
							attributes: {
								firstName: firstName,
								lastName: lastName,
								emailAddress: email,
								jobTitle: jobTitle
							}
						}
					});
				})
			],
			onActionEvent: (actionEvent) => {
				const userAttr = getUserInfoFromDataLayer();
				if (userAttr) {
					actionEvent.user = actionEvent.user || {};
					actionEvent.user.attributes = actionEvent.user.attributes || {};
					actionEvent.user.attributes.companyName = userAttr.companyName;
					actionEvent.user.attributes.companySize = userAttr.companySize;
					actionEvent.user.attributes.industry = userAttr.industry;
				}
				return actionEvent;
			}
		},
		pageTypeDefault: {
			name: 'default'
		},
		pageTypes: [
			{
				name: 'Home',
				action: 'Homepage',
				isMatch: () => {
					return Evergage.cashDom('.front-page-masthead').length > 0;
				}
			},
			{
				name: 'Enterprise Solutions Landing Page',
				action: 'Enterprise Solutions Landing Page | View',
				isMatch: () => {
					return Evergage.cashDom('.breadcrumbs .breadcrumb_last').text() == 'Enterprise Solutions';
				}
			},
			{
				name: 'Product Landing Page',
				action: 'Product Landing Page | View',
				isMatch: () => {
					return window.location.pathname.includes('/products/') && Evergage.resolvers.fromMeta('og:title')() == 'Products';
				}
			},
			{
				name: 'Product Detail',
				action: 'Product Detail | View',
				isMatch: () => {
					return window.location.pathname.includes('/products/') && Evergage.cashDom('.breadcrumbs .breadcrumb_last').text() !== 'Products';
				},
				catalog: {
					Product: {
						_id: () => {
							return Evergage.resolvers.fromMeta('og:title')();
						},
						name: () => {
							return Evergage.resolvers.fromMeta('og:title')();
						},
						description: () => {
							return Evergage.resolvers.fromMeta('og:description')();
						},
						categories: () => {
							return Evergage.resolvers.buildCategoryId('.breadcrumbs span a', 1, null, (category) => [category + '|' + Evergage.cashDom('.breadcrumb_last').text()])();
						},
						imageUrl: () => {
							const img = Evergage.resolvers.fromSelectorAttribute('section.masthead', 'style')();
							return img
								.replace(/^background-image:url\(["']?/, '')
								.replace(/["']?\)$/, '')
								.replace(/\);/, '');
						},
						url: () => {
							return Evergage.resolvers.fromMeta('og:url')();
						},
						price: 1,
						inventoryCount: 1
					}
				}
			},
			{
				name: 'Solutions Landing Page',
				action: 'Solutions Landing Page | View',
				isMatch: () => {
					return window.location.pathname.includes('/solutions/') && Evergage.resolvers.fromMeta('og:title')() == 'Risk Management Solutions';
				}
			},
			{
				name: 'Solutions Detail',
				action: 'Solution Detail | View',
				isMatch: () => {
					return window.location.pathname.includes('/solutions/') && Evergage.cashDom('.breadcrumbs .breadcrumb_last').text() !== 'Risk Management Solutions';
				},
				listeners: [
					Evergage.listener('click', 'div.callout a', (e) => {
						const $event = Evergage.cashDom(e.currentTarget).text();
						Evergage.sendEvent({
							name: $event,
							action: $event
						});
					})
				],
				catalog: {
					Product: {
						_id: () => {
							return Evergage.resolvers.fromMeta('og:title')();
						},
						name: () => {
							return Evergage.resolvers.fromMeta('og:title')();
						},
						description: () => {
							return Evergage.resolvers.fromMeta('og:description')();
						},
						categories: () => {
							return Evergage.resolvers.buildCategoryId('.breadcrumbs span a', 1, null, (category) => [category + '|' + Evergage.cashDom('.breadcrumb_last').text()])();
						},
						imageUrl: () => {
							const img = Evergage.resolvers.fromSelectorAttribute('section.masthead', 'style')();
							return img
								.replace(/^background-image:url\(["']?/, '')
								.replace(/["']?\)$/, '')
								.replace(/\);/, '');
						},
						url: () => {
							return Evergage.resolvers.fromMeta('og:url')();
						},
						price: 1,
						inventoryCount: 1
					}
				}
			},
			{
				name: 'Support and Services Landing Page',
				action: 'Support and Services Landing Page | View',
				isMatch: () => {
					return window.location.pathname.includes('/support-services/') && Evergage.resolvers.fromMeta('og:title')() == 'Support & Services';
				}
			},
			{
				name: 'Support and Services Detail',
				action: 'Support and Services Detail | View',
				isMatch: () => {
					return window.location.pathname.includes('/support-services/') && Evergage.cashDom('.breadcrumbs .breadcrumb_last').text() !== 'Support & Services';
				},
				listeners: [
					Evergage.listener('click', 'div.callout a', (e) => {
						const $event = Evergage.cashDom(e.currentTarget).text();
						Evergage.sendEvent({
							name: $event,
							action: $event
						});
					})
				],
				catalog: {
					Product: {
						_id: () => {
							return Evergage.resolvers.fromMeta('og:title')();
						},
						name: () => {
							return Evergage.resolvers.fromMeta('og:title')();
						},
						description: () => {
							return Evergage.resolvers.fromMeta('og:description')();
						},
						categories: () => {
							return Evergage.resolvers.buildCategoryId('.breadcrumbs span a', 1, null, (category) => [category + '|' + Evergage.cashDom('.breadcrumb_last').text()])();
						},
						imageUrl: () => {
							const img = Evergage.resolvers.fromSelectorAttribute('section.masthead', 'style')();
							return img
								.replace(/^background-image:url\(["']?/, '')
								.replace(/["']?\)$/, '')
								.replace(/\);/, '');
						},
						url: () => {
							return Evergage.resolvers.fromMeta('og:url')();
						},
						price: 1,
						inventoryCount: 1
					}
				}
			},
			{
				name: 'FHR Exchange',
				action: 'FHR Exchange | View',
				isMatch: () => {
					return Evergage.resolvers.fromSelector('.breadcrumbs')().includes('The FHR Exchange') && !Evergage.resolvers.fromSelector('.breadcrumbs')().includes('About Us');
				},
				catalog: {
					Category: {
						_id: () => {
							if (Evergage.cashDom('.breadcrumbs .breadcrumb_last').text() == 'The FHR Exchange™') {
								return Evergage.cashDom('.breadcrumbs .breadcrumb_last').text().trim();
							} else {
								return Evergage.resolvers.buildCategoryId('.breadcrumbs span a', 1, null, (category) => category + '|' + Evergage.cashDom('.breadcrumb_last').text())();
							}
						}
					}
				}
			},
			{
				name: 'Resources Landing Page',
				action: 'Resources Landing Page | View',
				isMatch: () => {
					return Evergage.cashDom('.breadcrumbs .breadcrumb_last').text() == 'Resources';
				}
			},
			{
				name: 'Blog Landing Page',
				action: 'Blog Landing Page | View',
				isMatch: () => {
					return Evergage.cashDom('div.inner h1').text() == 'RapidRatings Blog';
				}
			},
			{
				name: 'Blog Detail View',
				action: 'Blog Detail View | View',
				isMatch: () => {
					return Evergage.cashDom('body.single-post').length > 0;
				},
				catalog: {
					Blog: {
						_id: () => {
							return Evergage.resolvers.fromMeta('og:title')();
						},
						name: () => {
							return Evergage.resolvers.fromMeta('og:title')();
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
						published: () => {
							return new Date(Evergage.resolvers.fromMeta('article:modified_time')());
						}
					}
				},
				contentZones: [
					{ name: 'Blog', selector: 'article.main__content' },
					{ name: 'Header', selector: 'section.masthead' },
                    { name: 'Main', selector: 'main.main' }
				]
			},
			{
				name: 'Video Landing Page',
				action: 'Video Landing Page | View',
				isMatch: () => {
					return window.location.pathname.includes('/videos/');
				}
			},
			{
				name: 'Webinar Landing Page',
				action: 'Webinar Landing Page | View',
				isMatch: () => {
					return Evergage.cashDom('.breadcrumbs .breadcrumb_last').text() == 'Webinars';
				},
				listeners: [
					Evergage.listener('click', '.listing-content .more-link', (e) => {
						const $card = Evergage.cashDom(e.currentTarget).parents('.listing');
						const title = $card.find('h3').text();
						const date = new Date($card.find('.show-for-small').text());
						const url = $card.find('.more-link').attr('href');
						const description = Evergage.cashDom(e.currentTarget).parent('p').text();
						Evergage.sendEvent({
							name: 'Webinar View',
							action: 'Webinar View',
							itemAction: Evergage.ItemAction.ViewItem,
							catalog: {
								Webinar: {
									_id: title,
									name: title,
									published: date,
									url: url,
									description: description
								}
							}
						});
					})
				]
			},
			{
				name: 'Whitepaper Landing Page',
				action: 'Whitepaper Landing Page | View',
				isMatch: () => {
					return Evergage.cashDom('.breadcrumbs .breadcrumb_last').text() === 'Whitepapers';
				},
				listeners: [
					Evergage.listener('click', '.general-content .more-link', (e) => {
						const $whitepaper = Evergage.cashDom(e.currentTarget).parents('.report-block');
						const title = $whitepaper.find('h4').text();
						const desc = $whitepaper.find('.general-content').text();
						const url = $whitepaper.find('a').attr('href');
						const imageUrl = $whitepaper
							.find('.report-block-img')
							.attr('style')
							.replace(/^background-image:url\(["']?/, '')
							.replace(/["']?\)$/, '')
							.replace(/\)/, '');
						Evergage.sendEvent({
							name: 'Whitepaper Download',
							action: 'Whitepaper Download',
							itemAction: Evergage.ItemAction.ViewItem,
							catalog: {
								WhitePaper: {
									_id: title,
									name: title,
									description: desc,
									url: url,
									imageUrl: imageUrl
								}
							}
						});
					}),
					Evergage.listener('click', '.report-block-info .btn--secondary', (e) => {
						const $whitepaper = Evergage.cashDom(e.currentTarget).parents('.report-block');
						const title = $whitepaper.find('h4').text();
						const desc = $whitepaper.find('.general-content').text();
						const url = $whitepaper.find('a').attr('href');
						const imageUrl = $whitepaper
							.find('.report-block-img')
							.attr('style')
							.replace(/^background-image:url\(["']?/, '')
							.replace(/["']?\)$/, '')
							.replace(/\)/, '');
						Evergage.sendEvent({
							name: 'Whitepaper Download',
							action: 'Whitepaper Download',
							itemAction: Evergage.ItemAction.ViewItem,
							catalog: {
								WhitePaper: {
									_id: title,
									name: title,
									description: desc,
									url: url,
									imageUrl: imageUrl
								}
							}
						});
					})
				]
			},
			{
				name: 'Whitepaper Detail Page',
				action: 'Whitepaper Detail Page | View',
				isMatch: () => {
					return window.location.pathname.includes('/whitepapers/') && Evergage.cashDom('.breadcrumbs .breadcrumb_last').text() !== 'Whitepapers';
				},
				catalog: {
					WhitePaper: {
						_id: () => {
							return Evergage.cashDom('.breadcrumbs .breadcrumb_last').text();
						},
						name: () => {
							return Evergage.cashDom('.breadcrumbs .breadcrumb_last').text();
						},
						description: () => {
							return Evergage.resolvers.fromMeta('description')();
						},
						url: window.location.href
					}
				}
			},
			{
				name: 'News Landing Page',
				action: 'News Landing Page | View',
				isMatch: () => {
					return Evergage.DisplayUtils.pageElementLoaded('div.grid__item a', 'html').then(() => {
						return Evergage.cashDom('.breadcrumbs .breadcrumb_last').text() == 'News';
					});
				},
				listeners: [
					Evergage.listener('click', 'div.more__posts', () => {
						setTimeout(() => {
							changeSPAPage();
						}, 2500);
					}),
					Evergage.listener('click', '.grid__item a', (e) => {
						const $newsCard = Evergage.cashDom(e.currentTarget);
						const topic = [$newsCard.find('.media--term').text()];
						const title = $newsCard.find('.title').text();
						const imageUrl = $newsCard.find('.media--hero img').attr('src');
						const date = new Date($newsCard.find('.date').text());
						Evergage.sendEvent({
							name: 'News View',
							action: 'News Article View',
							itemAction: Evergage.ItemAction.ViewItem,
							catalog: {
								News: {
									_id: title,
									name: title,
									published: date,
									imageUrl: imageUrl,
									relatedCatalogObjects: {
										NewsCategory: topic
									}
								}
							}
						});
					})
				]
			},
			{
				name: 'About Us',
				action: 'About Us | View',
				isMatch: () => {
					return (window.location.pathname.includes('/about-us/') || Evergage.cashDom('.breadcrumbs .breadcrumb_last').text() == 'Awards & Certifications') && !window.location.pathname.includes('/partners/') && !window.location.pathname.includes('/contact-us/') && !window.location.pathname.includes('/contact-us-exchange/') && !window.location.pathname.includes('/events/');
				},
				catalog: {
					Category: {
						_id: () => {
							if (Evergage.cashDom('.breadcrumbs .breadcrumb_last').text() == 'About Us') {
								return Evergage.cashDom('.breadcrumbs .breadcrumb_last').text();
							} else {
								return 'About Us|' + Evergage.cashDom('.breadcrumbs .breadcrumb_last').text();
							}
						}
					}
				}
			},
			{
				name: 'Partners Page',
				action: 'Partners Page | View',
				isMatch: () => {
					return Evergage.cashDom('.breadcrumbs .breadcrumb_last').text() == 'Partners';
				},
				listeners: [
					Evergage.listener('click', 'a.more-link', (e) => {
						const link = Evergage.cashDom(e.currentTarget);
						const $partnerBlock = link.parents('div.report-block');
						const title = $partnerBlock.find('h4').text();
						const description = $partnerBlock.find('.general-content').text();
						const url = $partnerBlock.find('a.more-link').attr('href');
						Evergage.sendEvent({
							name: 'Partner View',
							action: 'Partner Info',
							itemAction: Evergage.ItemAction.ViewItem,
							catalog: {
								Partner: {
									_id: title,
									name: title,
									description: description,
									url: url
								}
							}
						});
					})
				]
			},
			{
				name: 'Events and Conferences Page',
				action: 'Events and Conferences Page | View',
				isMatch: () => {
					return Evergage.cashDom('.breadcrumbs .breadcrumb_last').text() == 'Events';
				},
				listeners: [
					Evergage.listener('click', 'a.more-link', (e) => {
						const link = Evergage.cashDom(e.currentTarget);
						const $partnerBlock = link.parents('div.report-block');
						const title = $partnerBlock.find('h4').text();
						const description = $partnerBlock.find('.general-content').text();
						const url = $partnerBlock.find('a.more-link').attr('href');
						const img = $partnerBlock.find('.video-thumb').attr('style');
						const imageUrl = img
							.replace(/^background-image:url\(["']?/, '')
							.replace(/["']?\)$/, '')
							.replace(/\);/, '');
						Evergage.sendEvent({
							name: 'Event View',
							action: 'Event Info',
							itemAction: Evergage.ItemAction.ViewItem,
							catalog: {
								Events: {
									_id: title,
									name: title,
									description: description,
									url: url,
									imageUrl: imageUrl
								}
							}
						});
					})
				]
			},
			{
				name: 'Request A Demo Form',
				action: 'Form Page | Request a Demo',
				isMatch: () => {
					return Evergage.cashDom('.breadcrumbs .breadcrumb_last').text() == 'Get a Demo';
				},
				listeners: [
					Evergage.listener('click', '#btnsubmit', () => {
						const firstName = Evergage.cashDom('input[name="Lead.FirstName"]').val();
						const lastName = Evergage.cashDom('input[name="Lead.LastName"]').val();
						const email = Evergage.cashDom('input[name="Lead.Email"]').val();
						const company = Evergage.cashDom('input[name="Lead.Company"]').val();
						const jobTitle = Evergage.cashDom('input[name="Lead.Title"]').val();
						const phone = Evergage.cashDom('input[name="Lead.Phone"]').val();
						const areaOfResponsibility = Evergage.cashDom('input[name="Lead.primary_Area_of_Responsibility__C"]').val();
						const interest = Evergage.cashDom('input[name="Lead.Interest__c"]').val();
						Evergage.sendEvent({
							name: 'Request a Demo',
							action: 'Request a Demo',
							user: {
								id: email,
								attributes: {
									firstName: firstName,
									lastName: lastName,
									emailAddress: email,
									phone: phone,
									companyName: company,
									jobTitle: jobTitle,
									areaOfResponsibility: areaOfResponsibility,
									interest: interest
								}
							}
						});
					})
				]
			},
			{
				name: 'Subscribe to Thought Leadership Form',
				action: 'Form Page | Subscribe to Thought Leadership',
				isMatch: () => {
					return Evergage.cashDom('.breadcrumbs .breadcrumb_last').text() == 'Subscribe to Thought Leadership';
				},
				listeners: [
					Evergage.listener('click', '#btnsubmit', () => {
						const firstName = Evergage.cashDom('input[name="Lead.Company"]').val();
						const lastName = Evergage.cashDom('input[name="Lead.LastName"]').val();
						const email = Evergage.cashDom('input[name="Lead.Email"]').val();
						const jobTitle = Evergage.cashDom('input[name="Lead.Title"]').val();
						const areaOfResponsibility = Evergage.cashDom('input[name="Lead.primary_Area_of_Responsibility__C"]').val();
						Evergage.sendEvent({
							name: 'Subscribe to Thought Leadership',
							action: 'Subscribe to Thought Leadership',
							user: {
								id: email,
								attributes: {
									firstName: firstName,
									lastName: lastName,
									emailAddress: email,
									jobTitle: jobTitle,
									areaOfResponsibility: areaOfResponsibility
								}
							}
						});
					})
				]
			},
			{
				name: 'Contact Us Form',
				action: 'Form Page | Contact Us',
				isMatch: () => {
					return Evergage.cashDom('.breadcrumbs .breadcrumb_last').text() == 'Contact Us';
				},
				listeners: [
					Evergage.listener('click', '#btnsubmit', () => {
						const firstName = Evergage.cashDom('input[name="Lead.FirstName"]').val();
						const lastName = Evergage.cashDom('input[name="Lead.LastName"]').val();
						const email = Evergage.cashDom('input[name="Lead.Email"]').val();
						const company = Evergage.cashDom('input[name="Lead.Company"]').val();
						const jobTitle = Evergage.cashDom('input[name="Lead.Title"]').val();
						const phone = Evergage.cashDom('input[name="Lead.Phone"]').val();
						Evergage.sendEvent({
							name: 'Contact Us Form Submission',
							action: 'Contact Us Form Submission',
							user: {
								id: email,
								attributes: {
									firstName: firstName,
									lastName: lastName,
									emailAddress: email,
									companyName: company,
									jobTitle: jobTitle,
									phone: phone
								}
							}
						});
					})
				]
			},
			{
				name: 'Contact Us - The FHR Exchange Form',
				action: 'Form Page | Contact Us - The FHR Exchange',
				isMatch: () => {
					return window.location.pathname.includes('contact-us-exchange');
				},
				listeners: [
					Evergage.listener('click', '#btnsubmit', () => {
						const firstName = Evergage.cashDom('input[name="Lead.FirstName"]').val();
						const lastName = Evergage.cashDom('input[name="Lead.LastName"]').val();
						const email = Evergage.cashDom('input[name="Lead.Email"]').val();
						const company = Evergage.cashDom('input[name="Lead.Company"]').val();
						const jobTitle = Evergage.cashDom('input[name="Lead.Title"]').val();
						Evergage.sendEvent({
							name: 'Contact Us Form Submission',
							action: 'Contact Us Form Submission',
							user: {
								id: email,
								attributes: {
									firstName: firstName,
									lastName: lastName,
									emailAddress: email,
									companyName: company,
									jobTitle: jobTitle
								}
							}
						});
					})
				]
			},
			{
				name: 'Request an FHR Report Form',
				action: 'Form Page | Request an FHR Report',
				isMatch: () => {
					return Evergage.cashDom('.breadcrumbs .breadcrumb_last').text() == 'Request an FHR® Report';
				},
				listeners: [
					Evergage.listener('click', '#btnsubmit', () => {
						const firstName = Evergage.cashDom('input[name="Lead.FirstName"]').val();
						const lastName = Evergage.cashDom('input[name="Lead.LastName"]').val();
						const email = Evergage.cashDom('input[name="Lead.Email"]').val();
						const company = Evergage.cashDom('input[name="Lead.Company"]').val();
						const jobTitle = Evergage.cashDom('input[name="Lead.Title"]').val();
						const areaOfResponsibility = Evergage.cashDom('input[name="Lead.primary_Area_of_Responsibility__C"]').val();
						Evergage.sendEvent({
							name: 'Request an FHR Report',
							action: 'Request an FHR Report',
							user: {
								id: email,
								attributes: {
									firstName: firstName,
									lastName: lastName,
									emailAddress: email,
									companyName: company,
									jobTitle: jobTitle,
									areaOfResponsibility: areaOfResponsibility
								}
							}
						});
					})
				]
			},
			{
				name: 'Download Registration Form',
				action: 'Form Page | Download Registration',
				isMatch: () => {
					return Evergage.cashDom('.breadcrumbs .breadcrumb_last').text() == 'Download Registration';
				},
				listeners: [
					Evergage.listener('click', '#gform_submit_button_12', () => {
						const firstName = Evergage.cashDom('input[name="input_1.3"]').val();
						const lastName = Evergage.cashDom('input[name="input_1.6"]').val();
						const email = Evergage.cashDom('input[name="input_12_4"]').val();
						Evergage.sendEvent({
							name: 'Download Registration',
							action: 'Download Registration',
							user: {
								id: email,
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
				name: 'FHR Whitepaper Download',
				action: 'FHR Whitepaper Download | View',
				isMatch: () => {
					return window.location.host == 'fhr.rapidratings.com' && Evergage.resolvers.fromSelectorAttribute('.actions input[type="submit"]', 'value')() === 'Download Now';
				},
				catalog: {
					WhitePaper: {
						_id: () => {
							return Evergage.resolvers.fromMeta('og:title')();
						},
						name: () => {
							return Evergage.resolvers.fromMeta('og:title')();
						},
						description: () => {
							return Evergage.resolvers.fromMeta('description')();
						},
						url: () => {
							return Evergage.resolvers.fromMeta('og:url')();
						}
					}
				},
				listeners: [
					Evergage.listener('click', '#btnsubmit', () => {
						const firstName = Evergage.cashDom('input[name="Lead.FirstName"]').val();
						const lastName = Evergage.cashDom('input[name="Lead.LastName"]').val();
						const email = Evergage.cashDom('input[name="Lead.Email"]').val();
						const ebook = Evergage.resolvers.fromSelector('.title-text strong')();
						Evergage.sendEvent({
							name: 'Download Ebook',
							action: 'Download Ebook',
							user: {
								attributes: {
									firstName: firstName,
									lastName: lastName,
									emailAddress: email
								}
							},
							catalog: {
								WhitePaper: {
									_id: ebook
								}
							}
						});
					})
				]
			},
			{
				name: 'FHR Webinar Download',
				action: 'FHR Webinar Download | View',
				isMatch: () => {
					return window.location.host == 'fhr.rapidratings.com' && Evergage.resolvers.fromSelectorAttribute('.actions input[type="submit"]', 'value')() !== 'Download Now';
				},
				catalog: {
					Webinar: {
						_id: () => {
							return Evergage.resolvers.fromMeta('og:title')();
						},
						name: () => {
							return Evergage.resolvers.fromMeta('og:title')();
						},
						description: () => {
							return Evergage.resolvers.fromMeta('description')();
						},
						url: () => {
							return Evergage.resolvers.fromMeta('og:url')();
						}
					}
				},
				listeners: [
					Evergage.listener('click', 'input[type="submit"]', () => {
						const email = Evergage.resolvers.fromSelectorAttribute('input[name="email"]', 'value')();
						const webinar = () => {
							if (Evergage.cashDom('.bodytext h2').length > 0) {
								return Evergage.resolvers.fromSelector('.title-text strong')();
							} else {
								return Evergage.resolvers.fromSelector('div.widget-type-rich_text span.hs_cos_wrapper')();
							}
						};
						Evergage.sendEvent({
							name: 'View Webinar',
							action: 'View Webinar',
							user: {
								attributes: {
									emailAddress: email
								}
							},
							catalog: {
								Webinar: {
									_id: webinar
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