SalesforceInteractions.init({
	cookieDomain: ''
}).then(() => {
	const config = {
		global: {
			onActionEvent: (actionEvent) => {
				const email = SalesforceInteractions.mcis.getValueFromNestedObject('');
				if (email) {
					actionEvent.user = actionEvent.user || {};
					actionEvent.user.identities = actionEvent.user.identities || {};
					actionEvent.user.identities.emailAddress = email;
				}
				return actionEvent;
			},
			contentZones: [],
			listeners: [
				SalesforceInteractions.listener('submit', '.email-signup', () => {
					const email = SalesforceInteractions.cashDom('#dwfrm_mcsubscribe_email').val();
					if (email) {
						SalesforceInteractions.sendEvent({ interaction: { name: 'Email Sign Up - Footer Test' }, user: { identities: { emailAddress: email } } });
					}
				})
			]
		},
		pageTypeDefault: {
			name: 'default',
			interaction: {
				name: 'Default Page'
			}
		},
		pageTypes: [
			{
				name: 'home',
				isMatch: () => /\/homepage/.test(window.location.href),
				interaction: {
					name: 'Homepage'
				},
				contentZones: [{ name: 'home_hero', selector: '.experience-carousel-bannerCarousel' }, { name: 'home_sub_hero', selector: '.experience-carousel-bannerCarousel + .experience-component' }, { name: 'home_popup' }]
			},
			{
				name: 'cart',
				isMatch: () => /\/cart/.test(window.location.href),
				interaction: {
					name: SalesforceInteractions.CartInteractionName.ReplaceCart,
					lineItems: SalesforceInteractions.DisplayUtils.pageElementLoaded('.cart-empty, .checkout-btn', 'html').then(() => {
						let cartLineItems = [];
						SalesforceInteractions.cashDom('').each((index, ele) => {
							let itemQuantity = parseInt(SalesforceInteractions.cashDom(ele).find('').text().trim());
							if (itemQuantity && itemQuantity > 0) {
								let lineItem = {
									catalogObjectType: 'Product',
									catalogObjectId: SalesforceInteractions.cashDom(ele).find('').attr('data-pid').trim(),
									price:
										SalesforceInteractions.cashDom(ele)
											.find('.pricing')
											.text()
											.trim()
											.replace(/[^0-9\.]+/g, '') / itemQuantity,
									quantity: itemQuantity
								};
								cartLineItems.push(lineItem);
							}
						});
						return cartLineItems;
					})
				}
			}
		]
	};
	SalesforceInteractions.initSitemap(config);
});
