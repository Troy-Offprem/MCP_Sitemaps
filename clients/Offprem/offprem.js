SalesforceInteractions.init({
	cookieDomain: 'offprem.tech'
}).then(() => {
	const config = {
		global: {
			contentZones: [{ name: 'global-pop_up' }, { name: 'NavBar', selector: 'header.scroll_header_top_area' }]
		},
		pageTypes: [
			{
				name: 'Home',
				isMatch: () => {
					return SalesforceInteractions.DisplayUtils.pageElementLoaded('body', 'html').then((ele) => {
						return SalesforceInteractions.cashDom('body.home').length > 0;
					});
				},
				interaction: {
					name: 'Homepage'
				},
				contentZones: [{ name: 'Home Hero', selector: '#rev_slider_1_1_forcefullwidth' }]
			},
			{
				name: 'Why Offprem',
				isMatch: () => {
					return SalesforceInteractions.DisplayUtils.pageElementLoaded('#menu-main-menu', 'html').then((ele) => {
						return SalesforceInteractions.cashDom('#nav-menu-item-265 a.current').length > 0;
					});
				},
				interaction: {
					name: 'Why Offprem'
				}
			},
			{
				name: 'Expertise',
				isMatch: () => {
					return SalesforceInteractions.DisplayUtils.pageElementLoaded('#menu-main-menu', 'html').then((ele) => {
						return SalesforceInteractions.cashDom('#nav-menu-item-263 a.current').length > 0;
					});
				},
				interaction: {
					name: SalesforceInteractions.CatalogObjectInteractionName.ViewCatalogObject,
					catalogObject: {
						type: 'Cloud',
						id: () => {
							return SalesforceInteractions.resolvers.fromSelector('div.title_subtitle_holder_inner h1 span')();
						},
						attributes: {
							name: () => {
								return SalesforceInteractions.resolvers.fromSelector('div.title_subtitle_holder_inner h1 span')();
							},
							url: window.location.href,
							imageUrl: () => {
								const img = SalesforceInteractions.resolvers.fromSelectorAttribute('div.title_outer div.title', 'style')();
								const imageUrl = img
									.replace(/^background-size:1920px auto;background-image:url\(["']?/, '')
									.replace(/["']?\)$/, '')
									.replace(/\);/, '');
								return imageUrl;
							}
						}
					}
				}
			},
			{
				name: 'Process',
				isMatch: () => {
					return SalesforceInteractions.DisplayUtils.pageElementLoaded('#menu-main-menu', 'html').then((ele) => {
						return SalesforceInteractions.cashDom('#nav-menu-item-264 a.current').length > 0;
					});
				},
				interaction: {
					name: 'Process'
				}
			},
			{
				name: 'About',
				isMatch: () => {
					return SalesforceInteractions.DisplayUtils.pageElementLoaded('#menu-main-menu', 'html').then((ele) => {
						return SalesforceInteractions.cashDom('#nav-menu-item-262 a.current').length > 0;
					});
				},
				interaction: {
					name: 'About'
				}
			},
			{
				name: 'Blog Landing Page',
				isMatch: () => {
					return SalesforceInteractions.DisplayUtils.pageElementLoaded('#menu-main-menu', 'html').then((ele) => {
						return SalesforceInteractions.cashDom('#nav-menu-item-456 a.current').length > 0;
					});
				},
				interaction: {
					name: 'Blog Landing Page'
				}
			},
			{
				name: 'Blog Detail Page',
				isMatch: () => {
					return SalesforceInteractions.DisplayUtils.pageElementLoaded('body', 'html').then((ele) => {
						return SalesforceInteractions.cashDom('body.single-post article.post').length > 0;
					});
				},
				interaction: {
					name: SalesforceInteractions.CatalogObjectInteractionName.ViewCatalogObject,
					catalogObject: {
						type: 'Blog',
						id: () => {
							return SalesforceInteractions.DisplayUtils.pageElementLoaded('article.post', 'div.post_content_holder').then((ele) => {
								return SalesforceInteractions.resolvers.fromSelectorAttribute('article.post', 'id')();
							});
						},
						attributes: {
							name: SalesforceInteractions.resolvers.fromSelector('div.title_subtitle_holder h1 span')(),
							url: SalesforceInteractions.resolvers.fromHref(),
							imageUrl: () => {
								const img = SalesforceInteractions.resolvers.fromSelectorAttribute('.wp-post-image', 'src')();
								if (!img) {
									return SalesforceInteractions.resolvers.fromSelectorAttribute('div.wp-block-image img', 'src')();
								} else {
									return img;
								}
							}
						},
						relatedCatalogObjects: {
							Category: () => {
								return [SalesforceInteractions.resolvers.buildCategoryId('div.tags_text a', 0, null, (categoryId) => categoryId.toUpperCase())() + SalesforceInteractions.resolvers.fromSelector('a[rel="category tag"]')().toUpperCase()];
							}
						}
					}
				},
				contentZones: [{ name: 'recent-posts', selector: 'div.column2' }]
			},
			{
				name: 'Contact Us',
				isMatch: () => {
					return SalesforceInteractions.DisplayUtils.pageElementLoaded('body', 'html').then((ele) => {
						return SalesforceInteractions.cashDom('#nav-menu-item-261 a.current').length > 0;
					});
				},
				interaction: {
					name: 'Contact Us'
				},
				listeners: [
					SalesforceInteractions.listener('click', 'input[value="SEND MESSAGE"]', () => {
						const $form = SalesforceInteractions.cashDom('div.wpb_wrapper form');
						const user = {
							email: $form.find('[name=email]').val(),
							firstName: $form.find('[name=first_name]').val(),
							lastName: $form.find('[name=last_name]').val(),
							phoneNumber: $form.find('[name=phone]').val(),
							company: $form.find('[name=company]').val()
						};
						SalesforceInteractions.sendEvent({
							interaction: { name: 'Contact Us Form Submitted' },
							user: {
								attributes: {
									emailAddress: user.email,
									firstName: user.firstName,
									lastName: user.lastName,
									phoneNumber: user.phoneNumber,
									company: user.company
								}
							}
						});
					})
				]
			},
			{
				name: 'Contact Us Form Submitted',
				isMatch: () => {
					return /thank-you/.test(window.location.href);
				},
				interaction: {
					name: 'Contact Us Form Submitted'
				}
			},
			{
				name: 'Careers',
				isMatch: () => {
					return /careers/.test(window.location.href);
				},
				interaction: {
					name: 'Careers'
				},
				listeners: [
					SalesforceInteractions.listener('click', '#gform_1 input[type="submit"]', (e) => {
						let $form = SalesforceInteractions.cashDom(e.currentTarget).parents('#gform_1');
						let firstName = $form.find('span.name_first input').val();
						let lastName = $form.find('span.name_last input').val();
						let email = $form.find('div.ginput_container_email input').val();
						SalesforceInteractions.sendEvent({
							interaction: { name: 'Seeking Career Form' },
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
				name: '1% Pledge',
				isMatch: () => {
					return /1-percent-pledge/.test(window.location.href);
				},
				interaction: {
					name: '1% Pledge'
				}
			}
		]
	};
	SalesforceInteractions.initSitemap(config);
});

Evergage.init({
	cookieDomain: 'offprem.tech'
}).then(() => {
	const config = {
		global: {
			contentZones: [{ name: 'global-pop_up' }]
		},
		pageTypeDefault: {
			name: 'default'
		},
		pageTypes: [
			{
				name: 'home',
				action: 'Homepage',
				isMatch: () => {
					return Evergage.cashDom('body.home').length > 0;
				},
				contentZones: [{ name: 'home_hero', selector: 'div.hero_touch_blocks' }]
			},
			{
				name: 'brand',
				action: 'Why Offprem?',
				isMatch: () => {
					return Evergage.cashDom('#nav-menu-item-265 a.current').length > 0;
				}
			},
			{
				name: 'solution',
				action: 'Expertise',
				isMatch: () => {
					return Evergage.cashDom('#nav-menu-item-263 a.current').length > 0;
				},
				catalog: {
					Cloud: {
						_id: Evergage.resolvers.fromSelector('div.title_subtitle_holder_inner h1 span'),
						name: Evergage.resolvers.fromSelector('div.title_subtitle_holder_inner h1 span'),
						url: Evergage.resolvers.fromHref()
					}
				}
			},
			{
				name: 'article',
				action: 'Process',
				isMatch: () => {
					return Evergage.cashDom('#nav-menu-item-264 a.current').length > 0;
				}
			},
			{
				name: 'about',
				action: 'About',
				isMatch: () => {
					return Evergage.cashDom('#nav-menu-item-262 a.current').length > 0;
				}
			},
			{
				name: 'blog',
				action: 'Viewed blog homepage',
				isMatch: () => {
					return Evergage.cashDom('#nav-menu-item-456 a.current').length > 0;
				}
			},
			{
				name: 'blog_detail',
				action: 'Viewed blog post',
				isMatch: () => {
					return Evergage.cashDom('body.single-post article.post').length > 0;
				},
				itemAction: Evergage.ItemAction.ViewItem,
				catalog: {
					Blog: {
						_id: () => {
							return Evergage.DisplayUtils.pageElementLoaded('article.post', 'div.post_content_holder').then((ele) => {
								console.log('_id');
								return Evergage.resolvers.fromSelectorAttribute('article.post', 'id')();
							});
						},
						name: Evergage.resolvers.fromSelector('div.title_subtitle_holder h1 span')(),
						url: Evergage.resolvers.fromHref(),
						imageUrl: () => {
							const img = Evergage.resolvers.fromSelectorAttribute('.wp-post-image', 'src')();

							if (!img) {
								return Evergage.resolvers.fromSelectorAttribute('div.wp-block-image img', 'src')();
							} else {
								return img;
							}
						},
						categories: () => {
							return Evergage.resolvers.buildCategoryId('div.tags_text a', 0, null, (categoryId) => [categoryId.toUpperCase()])();
						}
					}
				},
				contentZones: [{ name: 'recent-posts', selector: 'div.column2' }]
			},
			{
				name: 'contact',
				action: 'Contact Us',
				isMatch: () => {
					return Evergage.cashDom('#nav-menu-item-261 a.current').length > 0;
				},
				listeners: [
					Evergage.listener('click', 'div.full input[name=submit]', () => {
						const $form = Evergage.cashDom('div.wpb_wrapper form');
						const user = {
							email: $form.find('[name=email]').val(),
							firstName: $form.find('[name=first_name]').val(),
							lastName: $form.find('[name=last_name]').val(),
							phoneNumber: $form.find('[name=phone]').val(),
							company: $form.find('[name=company]').val()
						};
						Evergage.sendEvent({
							action: 'Contact Form Submitted',
							user: {
								attributes: {
									emailAddress: user.email,
									firstName: user.firstName,
									lastName: user.lastName,
									phoneNumber: user.phoneNumber,
									company: user.company
								}
							}
						});
					})
				]
			},
			{
				name: 'thank_you',
				action: 'Contact Form Submitted',
				isMatch: () => {
					return /thank-you/.test(window.location.href);
				}
			},
			{
				name: 'careers',
				action: 'Viewed Careers Page',
				isMatch: () => {
					return /careers/.test(window.location.href);
				}
			},
			{
				name: '1% pledge',
				action: 'Viewed 1% Pledge',
				isMatch: () => {
					return /1-percent-pledge/.test(window.location.href);
				},
				listeners: [
					Evergage.listener('click', '.qbutton', () => {
						Evergage.sendEvent({
							action: 'linked to SF 1% pledge page'
						});
					})
				]
			}
		]
	};
	Evergage.cashDom(() => {
		Evergage.initSitemap(config);
	});
});
