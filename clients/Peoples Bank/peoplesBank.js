SalesforceInteractions.init({
	cookieDomain: 'peoplesbanknet.com'
}).then(() => {
	const config = {
		global: {
			listeners: [
				SalesforceInteractions.listener('click', '#_form_1_submit', () => {
					const email = SalesforceInteractions.cashDom('input[name="email"]').val();
					SalesforceInteractions.sendEvent({
						interaction: {
							name: 'Footer Email Sign Up'
						},
						user: {
							attributes: {
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
					return SalesforceInteractions.cashDom('body.home').length > 0;
				},
				interaction: {
					name: 'Homepage'
				},
				contentZones: [
					{ name: 'home_hero', selector: '.slick-track' },
					{ name: 'home_sub_hero', selector: '.offer-section' }
				]
			},
			{
				name: 'Category Page',
				isMatch: () => {
					return SalesforceInteractions.resolvers.fromSelector('.breadcrumbs .breadcrumb_last')() == ('Your Life' || 'Your Business');
				},
				interaction: {
					name: 'Category Page | View'
				}
			},
			{
				name: 'Product Detail Page',
				isMatch: () => {
					const breadcrumbs = SalesforceInteractions.resolvers.fromSelectorMultiple('.breadcrumbs a')();
					if (breadcrumbs.includes('Your Life' || 'Your Business') && breadcrumbs.length > 2) {
						return true;
					} else {
						return false;
					}
				},
				interaction: {
					name: 'Product Detail Page'
				}
			},
			{
				name: 'Open An Account',
				isMatch: () => {
					return SalesforceInteractions.resolvers.fromSelector('.breadcrumbs .breadcrumb_last')() == 'Open an Account';
				},
				interaction: {
					name: 'Open An Account | View'
				},
				contentZones: [{ name: 'Main Content', selector: 'section.main-content .left-content' }]
			}
		]
	};
	SalesforceInteractions.initSitemap(config);
});
