SalesforceInteractions.init({
	cookieDomain: 'byebyehouse.com'
}).then(() => {
	const config = {
		global: {
			contentZones: [],
			listeners: [
				SalesforceInteractions.listener('submit', 'form[name="New Form"] button[type="submit"]', () => {
					const email = SalesforceInteractions.cashDom('#form-field-email').val();
					SalesforceInteractions.sendEvent({
						interaction: { name: 'Email Sign Up - Footer Test' },
						user: {
							identities: {
								emailAddress: email
							}
						}
					});
				})
			]
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
					name: 'Home'
				}
			},
			{
				name: 'Cash Offer',
				isMatch: () => {
					return window.location.pathname.includes('/cash-offer/');
				},
				interaction: {
					name: 'Cash Offer'
				},
				listeners: [
					SalesforceInteractions.listener('click', '#gform_submit_button_1', () => {
						SalesforceInteractions.sendEvent({
							interaction: { name: 'Get a Cash Offer' }
						});
					})
				],
				contentZones: [{ name: 'Pop-Up' }]
			},
			{
				name: 'Sell and Stay',
				isMatch: () => {
					return window.location.pathname.includes('/sellstay/');
				},
				interaction: {
					name: 'Sell and Stay'
				},
				listeners: [
					SalesforceInteractions.listener('click', '#gform_submit_button_1', () => {
						SalesforceInteractions.sendEvent({
							interaction: { name: 'Sell and Stay Offer' }
						});
					})
				],
				contentZones: [{ name: 'Pop-Up' }]
			},
			{
				name: 'Application Page 1',
				isMatch: () => {
					function pageMatch() {
						return new Promise((resolve, reject) => {
							setTimeout(() => {
								resolve(SalesforceInteractions.cashDom('#gform_page_2_1:not([style="display:none;"])').length > 0);
							}, 500);
						});
					}

					return pageMatch().then((resolve) => {
						return resolve;
					});
				},
				interaction: {
					name: 'Application Page 1'
				},
				contentZones: [{ name: 'Pop-Up' }],
				listeners: [
					SalesforceInteractions.listener('click', '.gform_next_button', (e) => {
						SalesforceInteractions.sendEvent({
							name: 'Completed Page 1',
							interaction: {
								name: 'Completed Page 1'
							}
						});
						setTimeout(() => {
							SalesforceInteractions.reinit();
						}, 1500);
					})
				]
			},
			{
				name: 'Application Page 2',
				isMatch: () => {
					function pageMatch() {
						return new Promise((resolve, reject) => {
							setTimeout(() => {
								resolve(SalesforceInteractions.cashDom('#gform_page_2_2:not([style="display:none;"])').length > 0);
							}, 500);
						});
					}

					return pageMatch().then((resolve) => {
						return resolve;
					});
				},
				interaction: {
					name: 'Application Page 2'
				},
				contentZones: [{ name: 'Pop-Up' }],
				listeners: [
					SalesforceInteractions.listener('click', '.gform_next_button', (e) => {
						SalesforceInteractions.sendEvent({
							name: 'Completed Page 2',
							interaction: {
								name: 'Completed Page 2'
							}
						});
						setTimeout(() => {
							SalesforceInteractions.reinit();
						}, 1500);
					})
				]
			},
			{
				name: 'Application Page 3',
				isMatch: () => {
					function pageMatch() {
						return new Promise((resolve, reject) => {
							setTimeout(() => {
								resolve(SalesforceInteractions.cashDom('#gform_page_2_3:not([style="display:none;"])').length > 0);
							}, 500);
						});
					}

					return pageMatch().then((resolve) => {
						return resolve;
					});
				},
				interaction: {
					name: 'Application Page 3'
				},
				contentZones: [{ name: 'Pop-Up' }],
				listeners: [
					SalesforceInteractions.listener('click', '.gform_next_button', (e) => {
						SalesforceInteractions.sendEvent({
							name: 'Completed Page 3',
							interaction: {
								name: 'Completed Page 3'
							}
						});
						setTimeout(() => {
							SalesforceInteractions.reinit();
						}, 1500);
					})
				]
			},
			{
				name: 'Application Page 4',
				isMatch: () => {
					function pageMatch() {
						return new Promise((resolve, reject) => {
							setTimeout(() => {
								resolve(SalesforceInteractions.cashDom('#gform_page_2_4:not([style="display:none;"])').length > 0);
							}, 500);
						});
					}

					return pageMatch().then((resolve) => {
						return resolve;
					});
				},
				interaction: {
					name: 'Application Page 4'
				},
				contentZones: [{ name: 'Pop-Up' }],
				listeners: [
					SalesforceInteractions.listener('click', '.gform_next_button', (e) => {
						SalesforceInteractions.sendEvent({
							name: 'Completed Page 4',
							interaction: {
								name: 'Completed Page 4'
							}
						});
						setTimeout(() => {
							SalesforceInteractions.reinit();
						}, 1500);
					})
				]
			},
			{
				name: 'Application Page 5',
				isMatch: () => {
					function pageMatch() {
						return new Promise((resolve, reject) => {
							setTimeout(() => {
								resolve(SalesforceInteractions.cashDom('#gform_page_2_5:not([style="display:none;"])').length > 0);
							}, 500);
						});
					}

					return pageMatch().then((resolve) => {
						return resolve;
					});
				},
				interaction: {
					name: 'Application Page 5'
				},
				contentZones: [{ name: 'Pop-Up' }],
				listeners: [
					SalesforceInteractions.listener('click', '.gform_next_button', (e) => {
						SalesforceInteractions.sendEvent({
							name: 'Completed Page 5',
							interaction: {
								name: 'Completed Page 5'
							}
						});
						setTimeout(() => {
							SalesforceInteractions.reinit();
						}, 1500);
					})
				]
			},
			{
				name: 'Application Page 6',
				isMatch: () => {
					function pageMatch() {
						return new Promise((resolve, reject) => {
							setTimeout(() => {
								resolve(SalesforceInteractions.cashDom('#gform_page_2_6:not([style="display:none;"])').length > 0);
							}, 500);
						});
					}

					return pageMatch().then((resolve) => {
						return resolve;
					});
				},
				interaction: {
					name: 'Application Page 6'
				},
				contentZones: [{ name: 'Pop-Up' }],
				listeners: [
					SalesforceInteractions.listener('click', '.gform_next_button', (e) => {
						SalesforceInteractions.sendEvent({
							name: 'Completed Page 6',
							interaction: {
								name: 'Completed Page 6'
							}
						});
						setTimeout(() => {
							SalesforceInteractions.reinit();
						}, 1500);
					})
				]
			},
			{
				name: 'Application Page 7',
				isMatch: () => {
					function pageMatch() {
						return new Promise((resolve, reject) => {
							setTimeout(() => {
								resolve(SalesforceInteractions.cashDom('#gform_page_2_7:not([style="display:none;"])').length > 0);
							}, 500);
						});
					}

					return pageMatch().then((resolve) => {
						return resolve;
					});
				},
				interaction: {
					name: 'Application Page 7'
				},
				contentZones: [{ name: 'Pop-Up' }],
				listeners: [
					SalesforceInteractions.listener('click', '.gform_next_button', (e) => {
						SalesforceInteractions.sendEvent({
							name: 'Completed Page 7',
							interaction: {
								name: 'Completed Page 7'
							}
						});
						setTimeout(() => {
							SalesforceInteractions.reinit();
						}, 1500);
					})
				]
			},
			{
				name: 'Application Page 8',
				isMatch: () => {
					function pageMatch() {
						return new Promise((resolve, reject) => {
							setTimeout(() => {
								resolve(SalesforceInteractions.cashDom('#gform_page_2_8:not([style="display:none;"])').length > 0);
							}, 500);
						});
					}

					return pageMatch().then((resolve) => {
						return resolve;
					});
				},
				interaction: {
					name: 'Application Page 8'
				},
				contentZones: [{ name: 'Pop-Up' }],
				listeners: [
					SalesforceInteractions.listener('click', '#gform_submit_button_2', () => {
						const firstName = SalesforceInteractions.cashDom('#input_2_32_3').val();
						const lastName = SalesforceInteractions.cashDom('#input_2_32_6').val();
						const email = SalesforceInteractions.cashDom('#input_2_31').val();
						const phone = SalesforceInteractions.cashDom('#input_2_33').val();
						SalesforceInteractions.sendEvent({
							interaction: { name: 'Application Information Form Submit' },
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
				name: 'Property Value',
				isMatch: () => {
					return SalesforceInteractions.resolvers.fromMeta('og:title')() === 'Property Valuation - Bye Bye House';
				},
				interaction: {
					name: 'Property Valuation - Bye Bye House'
				}
			},
			{
				name: 'About Us',
				isMatch: () => {
					return window.location.pathname.includes('/about/');
				},
				interaction: {
					name: 'About Us'
				}
			},
			{
				name: 'Contact Us',
				isMatch: () => {
					return window.location.pathname.includes('/contact-us/');
				},
				interaction: {
					name: 'Contact Us'
				},
				listeners: [
					SalesforceInteractions.listener('click', 'form[name="Get In Touch"] button[type="submit"]', () => {
						const name = SalesforceInteractions.cashDom('#form-field-name').val();
						const email = SalesforceInteractions.cashDom('#form-field-email').val();
						const phone = SalesforceInteractions.cashDom('#form-field-field_380561c').val();
						SalesforceInteractions.sendEvent({
							interaction: { name: 'Contact Us Form Submit' },
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
				name: 'Terms and Conditions',
				isMatch: () => {
					return window.location.pathname.includes('terms-conditions');
				},
				interaction: {
					name: 'Terms and Conditions'
				}
			},
			{
				name: 'Privacy Policy',
				isMatch: () => {
					return window.location.pathname.includes('privacy-policy');
				},
				interaction: {
					name: 'Privacy Policy'
				}
			}
		]
	};
	SalesforceInteractions.initSitemap(config);
});
