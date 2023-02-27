Evergage.init({
	cookieDomain: 'creditfresh.com'
}).then(() => {
	const changeSPAPage = () => {
		setTimeout(() => {
			Evergage.reinit();
		}, 500);
	};
	const config = {
		global: {
			contentZones: [{ name: 'global_popup', selector: 'body' }],
			listeners: [
				Evergage.listener('click', 'a.mainbtn', () => {
					Evergage.sendEvent({
						action: 'Get Started'
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
				action: 'Home | View',
				isMatch: () => {
					return /^\/$/.test(window.location.pathname) && !window.location.host.includes('get');
				}
			},
			{
				name: 'States',
				action: 'States | View',
				isMatch: () => {
					return window.location.pathname.includes('/states/');
				},
				catalog: {
					Category: {
						_id: () => {
							const pathName = window.location.pathname;
							const state = pathName.split('/')[2].toUpperCase();
							return 'State|' + state;
						}
					}
				}
			},
			{
				name: 'Blog Detail',
				action: 'Blog Detail | View',
				isMatch: () => {
					return window.location.pathname.includes('/blog/') && Evergage.cashDom('article').length == 1;
				},
				itemAction: Evergage.ItemAction.ViewItem,
				catalog: {
					Blog: {
						_id: () => {
							return Evergage.resolvers.fromMeta('og:title')().split(' - ')[0];
						},
						name: () => {
							return Evergage.resolvers.fromMeta('og:title')().split(' - ')[0];
						},
						description: Evergage.resolvers.fromMeta('og:description'),
						imageUrl: Evergage.resolvers.fromMeta('og:image'),
						url: Evergage.resolvers.fromMeta('og:url'),
						published: () => {
							return new Date(Evergage.resolvers.fromMeta('article:published_time')());
						}
					}
				}
			},
			{
				name: 'Blog Landing Page',
				action: 'Blog Landing Page | View',
				isMatch: () => {
					return window.location.pathname.includes('/blog/') && Evergage.cashDom('article').length > 1;
				},
				catalog: {
					Category: {
						_id: () => {
							if (Evergage.cashDom('#breadcrumbs').length > 0) {
								return 'Blog|' + Evergage.cashDom('.bread-cat').text().trim();
							} else {
								return 'Blog|All';
							}
						}
					}
				}
			},
			{
				name: 'State Login',
				action: 'State Login | View',
				isMatch: () => {
					return window.location.pathname.includes('/statelogin');
				},
				listeners: [
					Evergage.listener('click', '#startapp', (e) => {
						const $button = Evergage.cashDom(e.currentTarget);
						const $form = $button.parents('form');
						const state = $form.find('input').val();
						changeSPAPage();
						Evergage.sendEvent({
							user: {
								attributes: {
									state: state
								}
							}
						});
					})
				]
			},
			{
				name: 'Login',
				action: 'Login | View',
				isMatch: () => {
					return window.location.pathname.includes('/login');
				},
				listeners: [
					Evergage.listener('click', '#submit-login', () => {
						const emailAddress = Evergage.cashDom('form input').val();
						changeSPAPage();
						Evergage.sendEvent({
							action: 'Login',
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
				name: 'User Dashboard',
				action: 'User Dashboard | View',
				isMatch: () => {
					return window.location.pathname.includes('/myaccount');
				},
				contentZones: [
					{ name: 'application pop-up', selector: 'body' },
					{ name: 'dashboard', selector: 'main.x-layout__main' }
				],
				onActionEvent: (actionEvent) => {
					const lineOfCredit = Evergage.cashDom('#loan-summary');
					const loanStatusBar = Evergage.cashDom('#dash-status-bar');
					if (lineOfCredit.length > 0) {
						const creditLimit = Evergage.cashDom('#summary-one').text();
						const currentBalance = Evergage.cashDom('#summary-two').text();
						const availableCredit = Evergage.cashDom('#summary-three').text();
						actionEvent.user = actionEvent.user || {};
						actionEvent.user.attributes = actionEvent.user.attributes || {};
						actionEvent.user.attributes.creditLimit = creditLimit;
						actionEvent.user.attributes.currentBalance = currentBalance;
						actionEvent.user.attributes.availableCredit = availableCredit;
					}
					if (loanStatusBar.length > 0) {
						const loanStatus = Evergage.cashDom('#dash-status-bar span').text();
						actionEvent.user = actionEvent.user || {};
						actionEvent.user.attributes = actionEvent.user.attributes || {};
						actionEvent.user.attributes.loanStatus = loanStatus;
					}
					return actionEvent;
				},
				listeners: [
					Evergage.listener('click', '#online-payment-btn', () => {
						Evergage.sendEvent({
							action: 'Make a Payment'
						});
					}),
					Evergage.listener('click', '#request-draw-btn-originated', () => {
						Evergage.sendEvent({
							action: 'Request a Draw'
						});
					}),
					Evergage.listener('click', '.x-header__links a', () => {
						changeSPAPage();
					})
				]
			},
			{
				name: 'User Profile',
				action: 'User Profile | View',
				isMatch: () => {
					return window.location.pathname.includes('/viewprofile');
				},
				onActionEvent: (actionEvent) => {
					const user = {
						name: Evergage.cashDom('#dd-name').text(),
						emailAddress: Evergage.cashDom('#dd-email').text(),
						phone: Evergage.cashDom('#dd-phone-mobile span').text(),
						address: Evergage.cashDom('#dd-address-line-1').text(),
						city: Evergage.cashDom('#dd-city').text(),
						state: Evergage.cashDom('#dd-state').text(),
						zip: Evergage.cashDom('#dd-zipcode').text()
					};
					if (user) {
						actionEvent.user = actionEvent.user || {};
						actionEvent.user.attributes = actionEvent.user.attributes || {};
						actionEvent.user.attributes.name = user.name;
						actionEvent.user.attributes.emailAddress = user.emailAddress;
						actionEvent.user.attributes.phone = user.phone;
						actionEvent.user.attributes.address = user.address;
						actionEvent.user.attributes.city = user.city;
						actionEvent.user.attributes.state = user.state;
						actionEvent.user.attributes.zip = user.zip;
					}
					return actionEvent;
				}
			},
			{
				name: 'Application - State Selection',
				action: 'Application | State Selection',
				isMatch: () => {
					return window.location.pathname.includes('/stateselection');
				},
				listeners: [
					Evergage.listener('click', '#startapp', (e) => {
						const $button = Evergage.cashDom(e.currentTarget);
						const $form = $button.parents('form');
						const state = $form.find('input').val();
						Evergage.sendEvent({
							action: 'Submitted State on Application',
							user: {
								attributes: {
									state: state
								}
							}
						});
						changeSPAPage();
					})
				]
			},
			{
				name: 'Application - Email Address',
				action: 'Application | Email Address',
				isMatch: () => {
					return window.location.pathname.includes('/stateinfo');
				},
				listeners: [
					Evergage.listener('click', '#startapp', (e) => {
						const $button = Evergage.cashDom(e.currentTarget);
						const $form = $button.parents('form');
						const emailAddress = $form.find('input').val();
						const creditRequested = $form.find('div.rangeslider__handle-label').text();
						changeSPAPage();
						Evergage.sendEvent({
							action: 'Submitted Email on Application',
							user: {
								attributes: {
									emailAddress: emailAddress,
									creditRequested: creditRequested
								}
							}
						});
					})
				]
			},
			{
				name: 'Application - Personal Information',
				action: 'Application | Personal Information',
				isMatch: () => {
					return window.location.pathname.includes('/personalinfo');
				},
				listeners: [
					Evergage.listener('click', 'input', () => {
						changeSPAPage();
					}),
					Evergage.listener('click', 'button', () => {
						changeSPAPage();
					}),
					Evergage.listener('click', '#personalinfo', (e) => {
						const $button = Evergage.cashDom(e.currentTarget);
						const $form = $button.parents('form');
						const firstName = $form.find('input[placeholder="First Name"]').val();
						const lastName = $form.find('input[placeholder="Last Name"]').val();
						const phone = $form.find('input[placeholder="10 digit phone number"]').val();
						changeSPAPage();
						Evergage.sendEvent({
							action: 'Personal Info Submitted',
							user: {
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
				name: 'Application - Address',
				action: 'Application | Address',
				isMatch: () => {
					return window.location.pathname.includes('/addressinfo');
				},
				listeners: [
					Evergage.listener('click', '.react-autosuggest__suggestions-list', () => {
						changeSPAPage();
					}),
					Evergage.listener('click', '#submit-saveaddressinfo', (e) => {
						const $button = Evergage.cashDom(e.currentTarget);
						const $form = $button.parents('form');
						const address = $form.find('#x312').val();
						const city = $form.find('#x314').val();
						const state = $form.find('#x315').val();
						const zip = $form.find('#x316').val();
						changeSPAPage();
						Evergage.sendEvent({
							action: 'Address Info Submitted',
							user: {
								attributes: {
									address: address,
									city: city,
									state: state,
									zip: zip
								}
							}
						});
					})
				]
			},
			{
				name: 'Application | Approval',
				action: 'Application Approved',
				isMatch: () => {
					return window.location.pathname.includes('/preapproved');
				},
				onActionEvent: (actionEvent) => {
					const loanStatus = 'Approved';
					if (loanStatus) {
						actionEvent.user = actionEvent.user || {};
						actionEvent.user.attributes = actionEvent.user.attributes || {};
						actionEvent.user.attributes.loanStatus = loanStatus;
					}
					return actionEvent;
				}
			},
			{
				name: 'Application | Rejected',
				action: 'Application Rejected',
				isMatch: () => {
					return window.location.pathname.includes('/reject');
				},
				onActionEvent: (actionEvent) => {
					const loanStatus = 'Rejected';
					if (loanStatus) {
						actionEvent.user = actionEvent.user || {};
						actionEvent.user.attributes = actionEvent.user.attributes || {};
						actionEvent.user.attributes.loanStatus = loanStatus;
					}
					return actionEvent;
				}
			},
			{
				name: 'Application | Info Page',
				action: 'Application Info Page',
				isMatch: () => {
					return window.location.pathname.includes('/apply/') && !(window.location.pathname.includes('/addressinfo') || window.location.pathname.includes('/personalinfo') || window.location.pathname.includes('/stateinfo') || window.location.pathname.includes('/stateselection'));
				},
				listeners: [
					Evergage.listener('click', 'button[type="submit"]', () => {
						changeSPAPage();
					}),
					Evergage.listener('click', 'button[type="submit"] span', () => {
						changeSPAPage();
					})
				]
			},
			{
				name: 'User Dashboard | Documents Page',
				action: 'User Dashboard Documents Page',
				isMatch: () => {
					return window.location.pathname.includes('/dashboard/documents');
				}
			},
			{
				name: 'User Dashboard | Draw Results Page',
				action: 'User Dashboard Draw Results Page',
				isMatch: () => {
					return window.location.pathname.includes('/dashboard/drawresult');
				}
			},
			{
				name: 'User Dashboard | Draw Request Page',
				action: 'User Dashboard Draw Request Page',
				isMatch: () => {
					return window.location.pathname.includes('/dashboard/drawrequest');
				}
			},
			{
				name: 'How It Works',
				action: 'How It Works | View',
				isMatch: () => {
					return window.location.pathname.includes('/how-it-works/');
				}
			},
			{
				name: 'Cost of Credit',
				action: 'Cost of Credit | View',
				isMatch: () => {
					return window.location.pathname.includes('/cost-of-credit/');
				}
			},
			{
				name: 'Lenders',
				action: 'Lenders | View',
				isMatch: () => {
					return window.location.pathname.includes('/lenders/');
				}
			},
			{
				name: 'Contact Us',
				action: 'Contact Us | View',
				isMatch: () => {
					return window.location.pathname.includes('/contact-us/');
				}
			},
			{
				name: 'Resources Center',
				action: 'Resources Center | View',
				isMatch: () => {
					return window.location.pathname.includes('/resources/') && Evergage.resolvers.fromMeta('og:url')() == 'www.creditfresh.com/resources/';
				}
			},
			{
				name: "FAQ's",
				action: "FAQ's | View",
				isMatch: () => {
					return window.location.pathname.includes('/faqs/');
				}
			},
			{
				name: 'Finacial Assistance',
				action: 'Finacial Assistance| View',
				isMatch: () => {
					return window.location.pathname.includes('/financial-assistance/');
				}
			},
			{
				name: 'Glossary',
				action: 'Glossary | View',
				isMatch: () => {
					return window.location.pathname.includes('/glossary/');
				}
			},
			{
				name: 'More Resources',
				action: 'More Resources | View',
				isMatch: () => {
					return window.location.pathname.includes('/financial-literacy/');
				}
			},
			{
				name: 'Legit Online Loans',
				action: 'Legit Online Loans | View',
				isMatch: () => {
					return window.location.pathname.includes('/legit-online-loans/');
				}
			},
			{
				name: 'Short Term Loans',
				action: 'Short Term Loans | View',
				isMatch: () => {
					return window.location.pathname.includes('/short-term-loans-online/');
				}
			},
			{
				name: 'Same Business Day Loans',
				action: 'Same Business Day Loans | View',
				isMatch: () => {
					return window.location.pathname.includes('/same-business-day-online-loans/');
				}
			},
			{
				name: 'Loans by Phone',
				action: 'Loans by Phone | View',
				isMatch: () => {
					return window.location.pathname.includes('/loans-by-phone/');
				}
			},
			{
				name: 'Loans Near Me',
				action: 'Loans Near Me | View',
				isMatch: () => {
					return window.location.pathname.includes('/loans-near-me/');
				}
			},
			{
				name: 'Quick Cash Loans',
				action: 'Quick Cash Loans | View',
				isMatch: () => {
					return window.location.pathname.includes('/cash-loans-online/');
				}
			},
			{
				name: 'Emergency Loans',
				action: 'Emergency Loans | View',
				isMatch: () => {
					return window.location.pathname.includes('/emergency-loans/');
				}
			},
			{
				name: 'Get a Loan Online',
				action: 'Get a Loan Online | View',
				isMatch: () => {
					return window.location.pathname.includes('/get-loan-online/');
				}
			},
			{
				name: 'Small Personal Loans',
				action: 'Small Personal Loans | View',
				isMatch: () => {
					return window.location.pathname.includes('/small-personal-loans-online/');
				}
			},
			{
				name: 'Fast Loans Online',
				action: 'Fast Loans Online | View',
				isMatch: () => {
					return window.location.pathname.includes('/fast-loans-online/');
				}
			},
			{
				name: 'Direct Deposit Loans',
				action: 'Direct Deposit Loans | View',
				isMatch: () => {
					return window.location.pathname.includes('/direct-deposit-loans/');
				}
			},
			{
				name: 'Need Money Now',
				action: 'Need Money Now | View',
				isMatch: () => {
					return window.location.pathname.includes('/need-money-now/');
				}
			},
			{
				name: 'Personal Line of Credit',
				action: 'Personal Line of Credit | View',
				isMatch: () => {
					return window.location.pathname.includes('/line-of-credit/') && !window.location.pathname.includes('/blog/');
				}
			},
			{
				name: 'All About Online Loans',
				action: 'All About Online Loans | View',
				isMatch: () => {
					return window.location.pathname.includes('/online-loans/') && !window.location.pathname.includes('/blog/');
				}
			},
			{
				name: 'What You Need to Know About Personal Loans',
				action: 'What You Need to Know About Personal Loans | View',
				isMatch: () => {
					return window.location.pathname.includes('/online-personal-loan/');
				}
			},
			{
				name: 'Get CreditFresh',
				action: 'Get Credit Fresh | View Landing Page',
				isMatch: () => {
					return window.location.host.includes('get.creditfresh.com');
				},
				contentZones: [{ name: 'header', selector: 'div.new-header' }]
			}
		]
	};
	Evergage.initSitemap(config);
});
