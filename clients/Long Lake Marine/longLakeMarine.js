SalesforceInteractions.init({
	cookieDomain: 'longlakemarine.com'
}).then(() => {
	const getBoatSpecs = (value) => {
		const table = SalesforceInteractions.cashDom('#collapseOne table tr');
		if (table) {
			for (let i = 0; i < table.length; i++) {
				if (table[i].innerText.toUpperCase().includes(value)) {
					return table[i].childNodes[3].innerText;
				}
			}
		}
	};

	const config = {
		global: {},
		pageTypeDefault: {
			name: 'default',
			interaction: {
				name: 'Default Page'
			}
		},
		pageTypes: [
			{
				name: 'Homepage',
				isMatch: () => {
					return SalesforceInteractions.cashDom('section.home_about_us_sec').length > 0;
				},
				interaction: {
					name: 'Homepage'
				},
				listeners: [
					SalesforceInteractions.listener('click', 'section.contact_us_sec button[type="submit"]', (e) => {
						const $form = SalesforceInteractions.cashDom(e.currentTarget).parents('section.contact_us_sec');
						const firstName = $form.find('#firstname').val();
						const lastName = $form.find('#lastname').val();
						const email = $form.find('#email').val();
						const phone = $form.find('#phone').val();
						SalesforceInteractions.sendEvent({
							interaction: {
								name: 'Contact Us'
							},
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
				]
			},
			{
				name: 'Brand',
				isMatch: () => {
					return SalesforceInteractions.resolvers.fromMeta('og:title')() == 'Brand';
				},
				interaction: {
					name: SalesforceInteractions.CatalogObjectInteractionName.ViewCatalogObject,
					catalogObject: {
						type: 'Category',
						id: () => {
							const pathname = window.location.pathname.split('/')[2];
							return pathname;
						}
					}
				}
			},
			{
				name: 'Product Detail Page',
				isMatch: () => {
					return window.location.pathname.includes('/boat/');
				},
				interaction: {
					name: SalesforceInteractions.CatalogObjectInteractionName.ViewCatalogObject,
					catalogObject: {
						type: 'Product',
						id: () => {
							return window.location.pathname.split('_').splice(-1).toString();
						},
						attributes: {
							name: () => {
								return SalesforceInteractions.resolvers.fromMeta('og:title')();
							},
							url: window.location.href,
							imageUrl: () => {
								return SalesforceInteractions.resolvers.fromSelectorAttribute('.owl-item.active h1 img.banner-img', 'src')();
							},
							modelStatus: () => {
								return getBoatSpecs('MODEL STATUS:');
							},
							modelYear: () => {
								return getBoatSpecs('MODEL YEAR:');
							},
							model: () => {
								return getBoatSpecs('MODEL:');
							},
							hours: () => {
								return getBoatSpecs('HOURS:');
							},
							sku: {
								id: () => {
									return getBoatSpecs('BOAT HULL ID:');
								}
							},
							price: () => {
								return [getBoatSpecs('PRICE:')];
							},
							inventoryCount: 1
						},
						relatedCatalogObjects: {
							KeyFeatures: () => {
								return SalesforceInteractions.resolvers.fromSelectorMultiple('#collapse_key_features table td li')();
							},
							Manufacturer: () => {
								return [getBoatSpecs('MANUFACTURER:')];
							},
							Price: () => {
								return [getBoatSpecs('PRICE:')];
							},
							EngineModel: () => {
								return [getBoatSpecs('ENGINE MODEL:')];
							},
							BoatType: () => {
								return [getBoatSpecs('TYPE:')];
							},
							EngineHP: () => {
								return [getBoatSpecs('ENGINE HP:')];
							}
						}
					}
				},
				listeners: [
					SalesforceInteractions.listener('click', '#contact_for_boat', (e) => {
						const $form = SalesforceInteractions.cashDom(e.currentTarget).parents('.sidebar_form');
						const firstName = $form.find('#fname').val();
						const lastName = $form.find('#lname').val();
						const email = $form.find('#email').val();
						const phone = $form.find('#phone').val();
						SalesforceInteractions.sendEvent({
							interaction: {
								name: `Inquired about Boat`
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
				]
			},
			{
				name: 'Service',
				isMatch: () => {
					return window.location.pathname == '/service';
				},
				interaction: {
					name: 'Service'
				},
				listeners: [
					SalesforceInteractions.listener('click', 'section.parts_form_sec input[value="Submit"]', (e) => {
						const $form = SalesforceInteractions.cashDom(e.currentTarget).parents('div.row');
						const firstName = $form.find('#first-name').val();
						const lastName = $form.find('#last-name').val();
						const email = $form.find('#email').val();
						const phone = $form.find('#phone').val();
						const zip = $form.find('#zip').val();
						SalesforceInteractions.sendEvent({
							interaction: {
								name: 'Service Request Form'
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
				name: 'Winterization',
				isMatch: () => {
					return window.location.pathname == '/winterization';
				},
				interaction: {
					name: 'Winterization | View'
				}
			},
			{
				name: 'Sell/Trade Your Boat',
				isMatch: () => {
					return window.location.pathname == '/digital_power_solution';
				},
				interaction: {
					name: 'Sell/Trade Your Boat | View'
				}
			},
			{
				name: 'LLM Customs',
				isMatch: () => {
					return window.location.pathname == '/customs';
				},
				interaction: {
					name: 'LLM Customs | View'
				}
			},
			{
				name: 'Sell/Trade Your Boat',
				isMatch: () => {
					return window.location.pathname == '/digital_power_solution';
				},
				interaction: {
					name: 'Sell/Trade Your Boat | View'
				}
			},
			{
				name: 'Consignment Sales',
				isMatch: () => {
					return window.location.pathname == '/consignment_sales';
				},
				interaction: {
					name: 'Consignment Sales | View'
				},
				listeners: [
					SalesforceInteractions.listener('click', 'section.parts_form_sec input.primary_btn', () => {
						const firstName = SalesforceInteractions.cashDom('#first-name').val();
						const lastName = SalesforceInteractions.cashDom('#last-name').val();
						const email = SalesforceInteractions.cashDom('#email').val();
						const phone = SalesforceInteractions.cashDom('#phone').val();
						const zip = SalesforceInteractions.cashDom('#zip').val();
						SalesforceInteractions.sendEvent({
							interaction: {
								name: 'Consignment Sales Form'
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
				name: 'Boat Detailing',
				isMatch: () => {
					return window.location.pathname == '/boat_detailing';
				},
				interaction: {
					name: 'Boat Detailing | View'
				}
			},
			{
				name: 'About Us',
				isMatch: () => {
					return SalesforceInteractions.resolvers.fromMeta('og:title')() == 'About';
				},
				interaction: {
					name: 'About Us | View'
				}
			},
			{
				name: 'Meet The Staff',
				isMatch: () => {
					return window.location.pathname == '/meet_the_staff';
				},
				interaction: {
					name: 'Meet The Staff | View'
				},
				listeners: [
					SalesforceInteractions.listener('click', 'section.contact_us_sec button[type="submit"]', (e) => {
						const $form = SalesforceInteractions.cashDom(e.currentTarget).parents('section.contact_us_sec');
						const firstName = $form.find('#firstname').val();
						const lastName = $form.find('#lastname').val();
						const email = $form.find('#email').val();
						const phone = $form.find('#phone').val();
						SalesforceInteractions.sendEvent({
							interaction: {
								name: 'Contact Us'
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
				]
			},
			{
				name: 'Contact Us',
				isMatch: () => {
					return SalesforceInteractions.resolvers.fromMeta('og:title')() == 'Contact';
				},
				interaction: {
					name: 'Contact Us | View'
				},
				listeners: [
					SalesforceInteractions.listener('click', 'section.contact_us_sec button[type="submit"]', (e) => {
						const $form = SalesforceInteractions.cashDom(e.currentTarget).parents('section.contact_us_sec');
						const name = $form.find('#name').val();
						const email = $form.find('#email').val();
						const phone = $form.find('#phone').val();
						SalesforceInteractions.sendEvent({
							interaction: {
								name: 'Contact Us'
							},
							user: {
								identities: {
									emailAddress: email
								},
								attributes: {
									firstName: name,
									phone: phone
								}
							}
						});
					})
				]
			},
			{
				name: 'Seasonal Recreation',
				isMatch: () => {
					return window.location.pathname == '/seasonal_recration';
				},
				interaction: {
					name: 'Seasonal Recreation | View'
				},
				listeners: [
					SalesforceInteractions.listener('click', 'section[class^="seasonal"] a.primary_btn', (e) => {
						const link = SalesforceInteractions.cashDom(e.currentTarget).attr('href');
						SalesforceInteractions.sendEvent({
							interaction: {
								name: `Seasonal Recreation | ${link}`
							}
						});
					})
				]
			},
			{
				name: 'Thank You',
				isMatch: () => {
					return window.location.pathname.includes('/thankyou/');
				},
				interaction: {
					name: 'Thank You | View'
				}
			},
			{
				name: 'Parts',
				isMatch: () => {
					return window.location.pathname == '/parts';
				},
				interaction: {
					name: 'Parts'
				},
				listeners: [
					SalesforceInteractions.listener('click', 'section.parts_form_sec input[value="Add Parts"]', (e) => {
						const $form = SalesforceInteractions.cashDom(e.currentTarget).parents('div.row');
						const firstName = $form.find('#first-name').val();
						const lastName = $form.find('#last-name').val();
						const email = $form.find('#email').val();
						const phone = $form.find('#phone').val();
						const zip = $form.find('#zip').val();
						SalesforceInteractions.sendEvent({
							interaction: {
								name: 'Service Request Form'
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
				name: 'Careers',
				isMatch: () => {
					return window.location.pathname == '/careers';
				},
				interaction: {
					name: 'Careers | View'
				},
				listeners: [
					SalesforceInteractions.listener('click', '.carer_btn', () => {
						const name = SalesforceInteractions.cashDom('#name').val();
						const phone = SalesforceInteractions.cashDom('#phone').val();
						const email = SalesforceInteractions.cashDom('#email').val();
						SalesforceInteractions.sendEvent({
							interaction: {
								name: 'Career Form Filled Out'
							},
							user: {
								identities: {
									emailAddress: email
								},
								attributes: {
									name: name,
									phone: phone
								}
							}
						});
					})
				]
			},
			{
				name: 'Boat Rentals',
				isMatch: () => {
					return SalesforceInteractions.cashDom('.rental_banner').length > 0;
				},
				interaction: {
					name: 'Boat Rental | View'
				}
			},
			{
				name: 'Boater Map',
				isMatch: () => {
					return window.location.pathname == '/rental_map';
				},
				interaction: {
					name: 'Boater Map | View'
				}
			}
		]
	};
	SalesforceInteractions.initSitemap(config);
});
