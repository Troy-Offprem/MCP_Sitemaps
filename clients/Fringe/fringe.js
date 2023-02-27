SalesforceInteractions.init({}).then(() => {
	const config = {
		global: {},
		pageTypes: [
			{
				name: 'Login',
				isMatch: () => {
					return window.location.pathname.includes('/login');
				},
				interaction: {
					name: 'Login'
				},
				listeners: [
					SalesforceInteractions.listener('click', 'form button[type="submit"]', () => {
						const email = SalesforceInteractions.cashDom('#email-field').val();
						console.log(email);
						SalesforceInteractions.sendEvent({
							interaction: {
								name: 'Login'
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
			{
				name: 'Home',
				isMatch: () => {
					return window.location.pathname === '/';
				},
				interaction: {
					name: 'Home'
				},
				onActionEvent: (actionEvent) => {
					const points = SalesforceInteractions.cashDom('#profile-menu-portal div[class*="StyledPointsSegment"]').text().match(/\d/g).join('');
					if (points) {
						actionEvent.user = actionEvent.user || {};
						actionEvent.user.attributes = actionEvent.user.attributes || {};
						actionEvent.user.attributes.points = points;
					}
					return actionEvent;
				}
			},
			{
				name: 'Product Detail',
				isMatch: () => {
					return SalesforceInteractions.cashDom('.ReactModal__Overlay--after-open').length > 0;
				},
				interaction: {
					name: SalesforceInteractions.CatalogObjectInteractionName.ViewCatalogObject,
					catalogObject: {
						type: 'Product',
						id: () => {
							const params = new URL(document.location).searchParams;
							const vendorId = params.get('vendorId');
							return vendorId;
						},
						attributes: {
							url: window.location.href,
							name: () => {
								return SalesforceInteractions.resolvers.fromSelector('.ReactModalPortal h1[data-cy="card-header-vendor-name"]')();
							},
							imageUrl: () => {
								return SalesforceInteractions.resolvers.fromSelectorAttribute('picture.is-selected img', 'src')();
							},
							website: () => {
								return SalesforceInteractions.resolvers.fromSelectorAttribute('a[data-cy="card-header-website-link"]', 'href')();
							}
						},
						relatedCatalogObjects: {
							Category: () => {
								const params = new URL(document.location).searchParams;
								const catId = params.get('categoryId');
								return catId;
							}
						}
					}
				}
			},
			{
				name: 'Account Dashboard',
				isMatch: () => {
					return SalesforceInteractions.cashDom('#settings-panel').length > 0;
				},
				interaction: {
					name: 'Account Dashboard'
				},
				onActionEvent: (actionEvent) => {
					const emailAddress = SalesforceInteractions.cashDom('#email-field').val();
					const firstName = SalesforceInteractions.cashDom('#firstName-field').val();
					const lastName = SalesforceInteractions.cashDom('#lastName-field').val();
					const phone = SalesforceInteractions.cashDom('input[name="phone"]').val();
					const country = SalesforceInteractions.cashDom('#address_country-field').val();
					const state = SalesforceInteractions.cashDom('#address_state-field').val();
					if (emailAddress) {
						actionEvent.user = actionEvent.user || {};
						actionEvent.user.attributes = actionEvent.user.attributes || {};
						actionEvent.user.attributes.emailAddress = emailAddress;
						actionEvent.user.attributes.firstName = firstName;
						actionEvent.user.attributes.lastName = lastName;
						actionEvent.user.attributes.phone = phone;
						actionEvent.user.attributes.country = country;
						actionEvent.user.attributes.state = state;
					}
					return actionEvent;
				}
			}
		]
	};

	const handleSPAPageChange = () => {
		const url = window.location.href;
		const urlChangeInterval = setInterval(() => {
			if (url !== window.location.href) {
				url = window.location.href;

				SalesforceInteractions.reinit();
			}
		}, 1000);
	};

	handleSPAPageChange();
	SalesforceInteractions.initSitemap(config);
});
