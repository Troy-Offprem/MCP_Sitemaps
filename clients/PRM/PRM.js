SalesforceInteractions.init({
	cookieDomain: 'prm.jnbdev.com'
}).then(() => {
	const config = {
		global: {
			contentZones: [],
			listeners: [
				SalesforceInteractions.listener('click', '#gform_submit_button_3', (e) => {
					const $form = SalesforceInteractions.cashDom(e.currentTarget).parents('#gform_3');
					const name = $form.find('#input_3_1').val();
					const email = $form.find('#input_3_3').val();
					SalesforceInteractions.sendEvent({
						interaction: {
							name: 'Footer Sign Up'
						},
						user: {
							identities: {
								emailAddress: email
							},
							attributes: {
								name: name
							}
						}
					});
				})
			]
		},
		pageTypeDefault: {
			name: 'Default',
			interaction: {
				name: 'Default Page'
			}
		},
		pageTypes: [
			{
				name: 'Home',
				isMatch: () => {
					return SalesforceInteractions.cashDom('body.home').length > 0;
				},
				interaction: {
					name: 'Homepage'
				},
				listeners: [
					SalesforceInteractions.listener('click', '#gform_submit_button_6', (e) => {
						const $form = SalesforceInteractions.cashDom(e.currentTarget).parents('#gform_6');
						const firstName = $form.find('#input_6_1').val();
						const lastName = $form.find('#input_6_3').val();
						const phone = $form.find('#input_6_4').val();
						const email = $form.find('#input_6_5').val();
						const zip = $form.find('#input_6_11').val();
						SalesforceInteractions.sendEvent({
							interaction: {
								name: 'Home Page Sign Up'
							},
							user: {
								identities: {
									emailAddress: email
								},
								attributes: {
									firstName: firstName,
									lastName: lastName,
									phone: phone,
									zip: zip
								}
							}
						});
					})
				]
			},
			{
				name: 'Service Category Page',
				isMatch: () => {
					const pathname = window.location.pathname;
					const link = pathname.slice(1, -1).split('/');
					return link.length === 1 && link.includes('services');
				},
				interaction: {
					name: 'Services Category Page'
				}
			},
			{
				name: 'Service Detail Page',
				isMatch: () => {
					const pathname = window.location.pathname;
					const link = pathname.slice(1, -1).split('/');
					return link.length >= 2 && link.includes('services');
				},
				interaction: {
					name: SalesforceInteractions.CatalogObjectInteractionName.ViewCatalogObject,
					catalogObject: {
						type: 'Article',
						id: () => {
							const title = SalesforceInteractions.resolvers.fromMeta('og:title')().split(' - ')[0];
							return title;
						},
						attributes: {
							name: () => {
								const title = SalesforceInteractions.resolvers.fromMeta('og:title')().split(' - ')[0];
								return title;
							},
							description: () => {
								return SalesforceInteractions.resolvers.fromMeta('description')();
							},
							url: () => {
								return SalesforceInteractions.resolvers.fromMeta('og:url')();
							}
						},
						relatedCatalogObjects: {
							Category: SalesforceInteractions.resolvers.buildCategoryId('.fusion-breadcrumbs .fusion-breadcrumb-item', 1, null, (categoryId) => categoryId.toUpperCase())()
						}
					}
				},
				listeners: [
					SalesforceInteractions.listener('click', '#gform_submit_button_6', (e) => {
						const $form = SalesforceInteractions.cashDom(e.currentTarget).parents('#gform_6');
						const firstName = $form.find('#input_6_1').val();
						const lastName = $form.find('#input_6_3').val();
						const phone = $form.find('#input_6_4').val();
						const email = $form.find('#input_6_5').val();
						const zip = $form.find('#input_6_11').val();
						SalesforceInteractions.sendEvent({
							interaction: {
								name: `${SalesforceInteractions.resolvers.fromMeta('og:title')().split(' - ')[0]} Page Sign Up`
							},
							user: {
								identities: {
									emailAddress: email
								},
								attributes: {
									firstName: firstName,
									lastName: lastName,
									phone: phone,
									zip: zip
								}
							}
						});
					})
				]
			},
			{
				name: 'Products Category Page',
				isMatch: () => {
					const pathname = window.location.pathname;
					const link = pathname.slice(1, -1).split('/');
					return link.length === 1 && link.includes('products');
				},
				interaction: {
					name: 'Products Category Page'
				}
			},
			{
				name: 'Products Detail Page',
				isMatch: () => {
					const pathname = window.location.pathname;
					const link = pathname.slice(1, -1).split('/');
					return link.length >= 2 && link.includes('products');
				},
				interaction: {
					name: SalesforceInteractions.CatalogObjectInteractionName.ViewCatalogObject,
					catalogObject: {
						type: 'Article',
						id: () => {
							const title = SalesforceInteractions.resolvers.fromMeta('og:title')().split(' - ')[0];
							return title;
						},
						attributes: {
							name: () => {
								const title = SalesforceInteractions.resolvers.fromMeta('og:title')().split(' - ')[0];
								return title;
							},
							description: () => {
								return SalesforceInteractions.resolvers.fromMeta('description')();
							},
							url: () => {
								return SalesforceInteractions.resolvers.fromMeta('og:url')();
							}
						},
						relatedCatalogObjects: {
							Category: () => {
								return SalesforceInteractions.resolvers.buildCategoryId('.fusion-breadcrumbs .fusion-breadcrumb-item', 1, null, (categoryId) => categoryId.toUpperCase())();
							}
						}
					},
					listeners: [
						SalesforceInteractions.listener('click', '#gform_submit_button_6', (e) => {
							const $form = SalesforceInteractions.cashDom(e.currentTarget).parents('#gform_6');
							const firstName = $form.find('#input_6_1').val();
							const lastName = $form.find('#input_6_3').val();
							const phone = $form.find('#input_6_4').val();
							const email = $form.find('#input_6_5').val();
							const zip = $form.find('#input_6_11').val();
							SalesforceInteractions.sendEvent({
								interaction: {
									name: `${SalesforceInteractions.resolvers.fromMeta('og:title')().split(' - ')[0]} Page Sign Up`
								},
								user: {
									identities: {
										emailAddress: email
									},
									attributes: {
										firstName: firstName,
										lastName: lastName,
										phone: phone,
										zip: zip
									}
								}
							});
						})
					]
				}
			},
			{
				name: 'News Landing Page',
				isMatch: () => {
					const pathname = window.location.pathname;
					const link = pathname.slice(1, -1).split('/');
					return link.length === 1 && link.includes('news');
				},
				interaction: {
					name: 'News Landing Page'
				}
			},
			{
				name: 'Resources Page',
				isMatch: () => {
					const pathname = window.location.pathname;
					return pathname.includes('resources');
				},
				interaction: {
					name: `${SalesforceInteractions.resolvers.fromMeta('og:title')().split(' - ')[0]} Page View`
				},
				listeners: [
					SalesforceInteractions.listener('click', '#gform_submit_button_6', (e) => {
						const $form = SalesforceInteractions.cashDom(e.currentTarget).parents('#gform_6');
						const firstName = $form.find('#input_6_1').val();
						const lastName = $form.find('#input_6_3').val();
						const phone = $form.find('#input_6_4').val();
						const email = $form.find('#input_6_5').val();
						const zip = $form.find('#input_6_11').val();
						SalesforceInteractions.sendEvent({
							interaction: {
								name: `${SalesforceInteractions.resolvers.fromMeta('og:title')().split(' - ')[0]} Page Sign Up`
							},
							user: {
								identities: {
									emailAddress: email
								},
								attributes: {
									firstName: firstName,
									lastName: lastName,
									phone: phone,
									zip: zip
								}
							}
						});
					})
				]
			},
			{
				name: 'Meet PRM',
				isMatch: () => {
					const pathname = window.location.pathname;
					return pathname.includes('meet-prm');
				},
				interaction: {
					name: `${SalesforceInteractions.resolvers.fromMeta('og:title')().split(' - ')[0]} Page View`
				},
				listeners: [
					SalesforceInteractions.listener('click', '#gform_submit_button_6', (e) => {
						const $form = SalesforceInteractions.cashDom(e.currentTarget).parents('#gform_6');
						const firstName = $form.find('#input_6_1').val();
						const lastName = $form.find('#input_6_3').val();
						const phone = $form.find('#input_6_4').val();
						const email = $form.find('#input_6_5').val();
						const zip = $form.find('#input_6_11').val();
						SalesforceInteractions.sendEvent({
							interaction: {
								name: `${SalesforceInteractions.resolvers.fromMeta('og:title')().split(' - ')[0]} Page Sign Up`
							},
							user: {
								identities: {
									emailAddress: email
								},
								attributes: {
									firstName: firstName,
									lastName: lastName,
									phone: phone,
									zip: zip
								}
							}
						});
					})
				]
			},
			{
				name: 'Report a Loss',
				isMatch: () => {
					const title = SalesforceInteractions.resolvers.fromMeta('og:title')().split(' - ')[0];
					return title === 'Report a loss';
				},
				interaction: {
					name: 'Report a Loss'
				},
				listeners: [
					SalesforceInteractions.listener('click', '#gform_submit_button_8', (e) => {
						const $form = SalesforceInteractions.cashDom(e.currentTarget).parents('#gform_8');
						const firstName = $form.find('#input_8_1_3').val();
						const lastName = $form.find('#input_8_1_6').val();
						const email = $form.find('#input_8_3').val();
						const phone = $form.find('#input_8_4').val();
						SalesforceInteractions.sendEvent({
							interaction: {
								name: 'Alternate Loss Reporting Form'
							},
							user: {
								identities: {
									emailAddress: email
								},
								attributes: {
									firstName: firstName,
									lastName: lastName,
									phone: phone
								}
							}
						});
					})
					//Add grower portal button once its completed on dev site
				]
			},
			{
				name: 'Customer Portal',
				isMatch: () => {
					const title = SalesforceInteractions.resolvers.fromMeta('og:title')().split(' - ')[0];
					return title === 'Customer Portal';
				},
				interaction: {
					name: 'Customer Portal'
				}
			}
		]
	};
	SalesforceInteractions.initSitemap(config);
});
