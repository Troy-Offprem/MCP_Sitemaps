const getCookieDomain = () => {
	let currentDomain = window.location.hostname;
	if (currentDomain === 'www.allinsolutions.com') {
		return 'www.allinsolutions.com';
	} else if (currentDomain === 'www.1solutiondetox.com') {
		return 'www.1solutiondetox.com';
	}
};
const currentCookieDomain = getCookieDomain();
const smsDomains = ['/concerns/travel/', '/concerns/waiting/', '/concerns/inpatient/', '/concerns/family-involvement/'];
const detoxPages = ['/alcohol-detox-west-palm-beach/', ' /drug-detox-palm-beach/', '/opiate-detox/', '/mat-treatment/'];
const addictionPages = ['/alcoholism/', '/cocaine-addiction/', '/meth-addiction/', '/opioid-addiction/', '/xanax-addiction/'];
const addictionTreatmentPages = ['/inpatient-rehab/', '/outpatient-drug-rehab/', '/west-palm-beach-rehab/'];

Evergage.init({
	cookieDomain: currentCookieDomain
}).then(() => {
	const configA = {
		global: {
			onActionEvent: (actionEvent) => {
				if (smsDomains.includes(window.location.pathname)) {
					const params = new URL(document.location).searchParams;
					const sfmcContactKey = params.get('id');
					actionEvent.user = actionEvent.user || {};
					actionEvent.user.attributes = actionEvent.user.attributes || {};
					actionEvent.user.attributes.sfmcContactKey = sfmcContactKey || {};
				}
				return actionEvent;
			},
			listeners: [
				Evergage.listener('click', 'a[href="tel:+18557623796"]', () => {
					Evergage.sendEvent({
						name: 'Contact Us',
						action: 'Contact Us'
					});
				})
			]
		},
		pageTypeDefault: {
			name: 'default'
		},
		pageTypes: [
			{
				name: 'Home - All In',
				action: 'All In Home | View',
				isMatch: () => {
					return Evergage.cashDom('body.home').length > 0;
				},
				contentZones: [{ name: 'Pop-up', selector: 'body' }]
			},
			{
				name: 'About Us - All In',
				action: 'All In About Us | View',
				isMatch: () => {
					return Evergage.resolvers.fromSelector('.yoast-breadcrumb .breadcrumb_last')() === 'About Us';
				},
				contentZones: [{ name: 'Pop-up', selector: 'body' }]
			},
			{
				name: 'Substance Abuse Treatment Landing Page - All In',
				action: 'All In Substance Abuse Landing Page | View',
				isMatch: () => {
					return Evergage.resolvers.fromSelector('.yoast-breadcrumb .breadcrumb_last')() === 'Treatment & Substance Abuse Programs';
				},
				contentZones: [{ name: 'Pop-up', selector: 'body' }]
			},
			{
				name: 'Substance Abuse Treatment Detail Page - All In',
				action: 'All In Substance Abuse Treatment Detail | View',
				isMatch: () => {
					return window.location.pathname.startsWith('/treatment-substance-abuse-programs/');
				},
				catalog: {
					Article: {
						_id: () => {
							return Evergage.resolvers.fromSelectorAttribute('article.type-page', 'id')();
						},
						name: () => {
							return Evergage.resolvers.fromSelector('.yoast-breadcrumb .breadcrumb_last')();
						},
						description: () => {
							return Evergage.resolvers.fromMeta('description')();
						},
						categories: () => {
							return ['All In Solutions|Substance Abuse Treatment'];
						}
					}
				},
				contentZones: [{ name: 'Pop-up', selector: 'body' }]
			},
			{
				name: 'Program Overview Landing Page - All In',
				action: 'All In Program Overview Landing Page | View',
				isMatch: () => {
					return Evergage.resolvers.fromSelector('.yoast-breadcrumb .breadcrumb_last')() === 'Program Overview';
				},
				contentZones: [{ name: 'Pop-up', selector: 'body' }]
			},
			{
				name: 'Program Detail Page - All In',
				action: Evergage.ItemAction.ViewItem,
				isMatch: () => {
					return Evergage.resolvers.fromSelector('li.current-menu-parent a')() === 'Program Overview';
				},
				catalog: {
					Article: {
						_id: () => {
							return Evergage.resolvers.fromSelectorAttribute('article.type-page', 'id')();
						},
						name: () => {
							return Evergage.resolvers.fromSelector('title')();
						},
						description: () => {
							return Evergage.resolvers.fromMeta('description')();
						},
						imageUrl: () => {
							return Evergage.resolvers.fromMeta('og:image')();
						},
						categories: () => {
							return ['All In Solutions|Program Treatment'];
						}
					}
				},
				listeners: [
					Evergage.listener('click', 'button[type="submit"]', (e) => {
						const $form = Evergage.cashDom(e.currentTarget).parents('form');
						const firstName = $form.find('input[placeholder="First Name"]').val();
						const lastName = $form.find('input[placeholder="Last Name"]').val();
						const email = $form.find('input[placeholder="Email Address"]').val();
						const phone = $form.find('input[placeholder="Phone Number"]').val();
						Evergage.sendEvent({
							name: 'Get Help Form',
							action: 'Get Help Form',
							user: {
								id: email,
								attributes: {
									firstName: firstName,
									lastName: lastName,
									emailAddress: email,
									phone: phone
								}
							}
						});
					})
				],
				contentZones: [{ name: 'Pop-up', selector: 'body' }]
			},
			{
				name: 'Rehab Near Me Landing Page - All In',
				action: 'All In Rehab Near Me Landing Page | View',
				isMatch: () => {
					return Evergage.resolvers.fromSelector('.yoast-breadcrumb .breadcrumb_last')() === 'Drug and Alcohol Rehab Near Me';
				},
				contentZones: [{ name: 'Pop-up', selector: 'body' }]
			},
			{
				name: 'Contact Us - All In',
				action: 'All In Contact Us | View',
				isMatch: () => {
					return window.location.pathname.endsWith('/contact-us/');
				},
				listeners: [
					Evergage.listener('click', '#wpforms-submit-7489', (e) => {
						const $form = Evergage.cashDom(e.currentTarget).parents('#wpforms-form-7489');
						const fullName = $form.find('#wpforms-7489-field_1').val();
						const phone = $form.find('#wpforms-7489-field_13').val();
						const emailAddress = $form.find('#wpforms-7489-field_4').val();
						const firstName = $form.find('#wpforms-7489-field_6').val();
						const lastName = $form.find('#wpforms-7489-field_7').val();
						Evergage.sendEvent({
							name: 'Contact Form Filled Out',
							action: 'Contact Form Filled Out',
							user: {
								id: emailAddress,
								attributes: {
									fullName: fullName,
									firstName: firstName,
									lastName: lastName,
									emailAddress: emailAddress,
									phone: phone
								}
							}
						});
					})
				],
				contentZones: [{ name: 'Pop-up', selector: 'body' }]
			},
			{
				name: 'Scholarship & Insurance Verification - All In',
				action: 'All In Scholarship & Insurance Verification | View',
				isMatch: () => {
					return Evergage.resolvers.fromSelector('.yoast-breadcrumb .breadcrumb_last')() === 'Scholarship & Insurance Verification';
				},
				listeners: [
					Evergage.listener('click', '#wpforms-submit-7610', (e) => {
						const $form = Evergage.cashDom(e.currentTarget).parents('#wpforms-form-7610');
						const phone = $form.find('#wpforms-7610-field_12').val();
						const emailAddress = $form.find('#wpforms-7610-field_4').val();
						const firstName = $form.find('#wpforms-7610-field_5').val();
						const lastName = $form.find('#wpforms-7610-field_6').val();
						const dob = $form.find('#wpforms-7610-field_14').val();
						Evergage.sendEvent({
							name: 'Insurance Form Filled Out',
							action: 'Insurance Form Filled Out',
							user: {
								id: emailAddress,
								attributes: {
									firstName: firstName,
									lastName: lastName,
									emailAddress: emailAddress,
									phone: phone,
									dob: dob
								}
							}
						});
					})
				],
				contentZones: [{ name: 'Pop-up', selector: 'body' }]
			},
			{
				name: 'Blog Landing Page',
				action: 'Blog Landing Page',
				isMatch: () => {
					return window.location.pathname.includes('/blog/');
				},
				contentZones: [{ name: 'Pop-up', selector: 'body' }]
			},
			{
				name: 'Blog Detail Page',
				action: Evergage.ItemAction.ViewItem,
				isMatch: () => {
					return Evergage.cashDom('body.single-post').length > 0;
				},
				catalog: {
					Blog: {
						_id: () => {
							return Evergage.resolvers.fromSelectorAttribute('article.post-single-page', 'id')();
						},
						name: () => {
							return Evergage.resolvers.fromSelector('.yoast-breadcrumb .breadcrumb_last')();
						},
						categories: () => {
							return Evergage.resolvers.buildCategoryId('.meta-post-categories a[rel="category tag"]', 0, null, (categoryId) => [categoryId.toUpperCase()]);
						},
						imageUrl: () => {
							return Evergage.resolvers.fromMeta('og:image')();
						},
						url: window.location.href,
						published: () => {
							return Evergage.resolvers.fromMeta('article:modified_time')();
						},
						description: () => {
							const json = JSON.parse(document.querySelectorAll('script[type="application/ld+json"]')[0].innerText);
							return json['@graph'][1].description;
						}
					}
				},
				contentZones: [{ name: 'Pop-up', selector: 'body' }]
			},
			{
				name: 'Difference Makers',
				action: 'Difference Makers | View',
				isMatch: () => {
					return window.location.pathname.includes('/difference-makers-in-addiction-treatment/');
				},
				contentZones: [{ name: 'Pop-up', selector: 'body' }]
			},
			{
				name: 'In the News Boynton Beach',
				action: 'In the News Boynton Beach',
				isMatch: () => {
					return Evergage.resolvers.fromSelector('.breadcrumb_last')() == 'In The News Boynton Beach';
				}
			},
			{
				name: 'In the News Cherry Hill',
				action: 'In the News Cherry Hill',
				isMatch: () => {
					return Evergage.resolvers.fromSelector('.breadcrumb_last')() == 'In The News Cherry Hill';
				}
			},
			{
				name: 'Florida Treatment Centers & Detox',
				action: 'Florida Treatment Centers & Detox | View',
				isMatch: () => {
					return Evergage.resolvers.fromSelector('.breadcrumb_last')() == 'Florida Treatment Centers & Detox';
				}
			},
			{
				name: 'New Jersey Treatment Centers & Detox',
				action: 'New Jersey Treatment Centers & Detox | View',
				isMatch: () => {
					return Evergage.resolvers.fromSelector('.breadcrumb_last')() == 'New Jersey Treatment Centers & Detox';
				}
			},
			{
				name: 'Florida Rehab Detail',
				action: Evergage.ItemAction.ViewItem,
				isMatch: () => {
					return window.location.pathname.includes('/locations/boynton-beach-fl/');
				},
				catalog: {
					Article: {
						_id: () => {
							return Evergage.resolvers.fromSelectorAttribute('div[data-elementor-type="wp-post"]', 'data-elementor-id')();
						},
						name: () => {
							return Evergage.resolvers.fromSelector('h1.elementor-heading-title')().replace('  ', '|');
						},
						categories: () => {
							return ['Florida Rehab'];
						}
					}
				}
			},
			{
				name: 'New Jersey Rehab Detail',
				action: Evergage.ItemAction.ViewItem,
				isMatch: () => {
					return window.location.pathname.includes('/locations/cherry-hill-nj/');
				},
				catalog: {
					Article: {
						_id: () => {
							return Evergage.resolvers.fromSelectorAttribute('div[data-elementor-type="wp-post"]', 'data-elementor-id')();
						},
						name: () => {
							return Evergage.resolvers.fromSelector('h1.elementor-heading-title')().replace('  ', '|');
						},
						categories: () => {
							return ['New Jersey Rehab'];
						}
					}
				}
			},
			{
				name: 'SMS Link from Journey',
				action: 'SMS Link from Journey | View',
				isMatch: () => {
					return smsDomains.includes(window.location.pathname);
				}
			},
			{
				name: 'Private Rehab Treatment',
				action: 'Private Rehab Treatment',
				isMatch: () => {
					return window.location.pathname.includes('/private-rehab-treatment/');
				}
			},
			{
				name: 'Private Detox Center',
				action: 'Private Detox Center',
				isMatch: () => {
					return window.location.pathname.includes('/private-detox-center/');
				}
			},
			{
				name: 'Private Addiction Center',
				action: 'Private Addiction Center',
				isMatch: () => {
					return window.location.pathname.includes('/private-addiction-center/');
				}
			},
			{
				name: 'Christian Faith Based Rehab',
				action: 'Christian Faith Based Rehab',
				isMatch: () => {
					return window.location.pathname.includes('/christian-faith-based-drug-alcohol-rehab/');
				}
			}
		]
	};

	const configB = {
		global: {
			listeners: [
				Evergage.listener('click', '#wpforms-submit-4101', (e) => {
					const $form = Evergage.cashDom(e.currentTarget).parents('#wpforms-form-4101');
					const fullName = $form.find('#wpforms-4101-field_1').val();
					const phone = $form.find('#wpforms-4101-field_2').val();
					const email = $form.find('#wpforms-4101-field_8').val();
					Evergage.sendEvent({
						name: 'Contact Us',
						action: 'Contact Us',
						user: {
							id: email,
							attributes: {
								fullName: fullName,
								emailAddress: email,
								phone: phone
							}
						}
					});
				}),
				Evergage.listener('click', 'a[href="tel:+18884101004"]', () => {
					Evergage.sendEvent({
						name: 'Contact Us Button Clicked',
						action: 'Contact Us Button Clicked'
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
				action: 'Home',
				isMatch: () => {
					return Evergage.cashDom('body.home').length > 0;
				},
				contentZones: [{ name: 'Pop-up', selector: 'body' }]
			},
			{
				name: 'About Us',
				action: 'About Us',
				isMatch: () => {
					return window.location.pathname.includes('/about-1-solution-detox/');
				},
				listeners: [
					Evergage.listener('click', '#elementor_post_281_form_side-form .elementor-button', (e) => {
						const $form = Evergage.cashDom(e.currentTarget).parents('#elementor_post_281_form_side-form');
						const fullName = $form.find('#form-field-name').val();
						const phone = $form.find('#form-field-field_28636da').val();
						const email = $form.find('#form-field-email').val();
						Evergage.sendEvent({
							name: 'Contact Us',
							action: 'Contact Us',
							user: {
								id: email,
								attributes: {
									fullName: fullName,
									emailAddress: email,
									phone: phone
								}
							}
						});
					})
				],
				contentZones: [{ name: 'Pop-up', selector: 'body' }]
			},
			{
				name: 'Accreditations',
				action: 'Accreditations',
				isMatch: () => {
					return window.location.pathname.includes('detox-accreditations/');
				},
				contentZones: [{ name: 'Pop-up', selector: 'body' }]
			},
			{
				name: 'Testimonials',
				action: 'Testimonials',
				isMatch: () => {
					return window.location.pathname.includes('testimonials/');
				},
				contentZones: [{ name: 'Pop-up', selector: 'body' }]
			},
			{
				name: 'Our Facility',
				action: 'Our Facility',
				isMatch: () => {
					return window.location.pathname.includes('south-florida-detox-facility/');
				},
				listeners: [
					Evergage.listener('click', '#wpforms-submit-4086', (e) => {
						const $form = Evergage.cashDom(e.currentTarget).parents('#wpforms-form-4086');
						const firstName = $form.find('#wpforms-4086-field_0').val();
						const lastName = $form.find('#wpforms-4086-field_0-last').val();
						const phone = $form.find('#wpforms-4086-field_10').val();
						const email = $form.find('#wpforms-4086-field_1').val();
						Evergage.sendEvent({
							name: 'Contact Us',
							action: 'Contact Us',
							user: {
								id: email,
								attributes: {
									fullName: fullName,
									emailAddress: email,
									phone: phone
								}
							}
						});
					})
				],
				contentZones: [{ name: 'Pop-up', selector: 'body' }]
			},
			{
				name: 'Photo Gallery',
				action: 'Photo Gallery',
				isMatch: () => {
					return window.location.pathname.includes('photo-gallery/');
				},
				contentZones: [{ name: 'Pop-up', selector: 'body' }]
			},
			{
				name: 'Admissions',
				action: 'Admissions',
				isMatch: () => {
					return window.location.pathname.includes('detox-admissions/');
				},
				listeners: [
					Evergage.listener('click', '#elementor_post_672_form_side-form .elementor-button', (e) => {
						const $form = Evergage.cashDom(e.currentTarget).parents('#elementor_post_672_form_side-form');
						const fullName = $form.find('#form-field-name').val();
						const phone = $form.find('#form-field-field_28636da').val();
						const email = $form.find('#form-field-email').val();
						Evergage.sendEvent({
							name: 'Contact Us',
							action: 'Contact Us',
							user: {
								id: email,
								attributes: {
									fullName: fullName,
									emailAddress: email,
									phone: phone
								}
							}
						});
					})
				],
				contentZones: [{ name: 'Pop-up', selector: 'body' }]
			},
			{
				name: 'How do I get Treatment',
				action: 'How do I get Treatment',
				isMatch: () => {
					return window.location.pathname.includes('how-do-i-get-into-treatment/');
				},
				contentZones: [{ name: 'Pop-up', selector: 'body' }]
			},
			{
				name: 'Verify Insurance',
				action: 'Verify Insurance',
				isMatch: () => {
					return window.location.pathname.includes('verify-insurance/');
				},
				listeners: [
					Evergage.listener('click', '#wpforms-submit-4093', (e) => {
						const $form = Evergage.cashDom(e.currentTarget).parents('#wpforms-form-4093');
						const fullName = $form.find('#wpforms-4093-field_4').val();
						const firstName = $form.find('#wpforms-4093-field_12').val();
						const lastName = $form.find('#wpforms-4093-field_12-last').val();
						const phone = $form.find('#wpforms-4093-field_9').val();
						const email = $form.find('#wpforms-4093-field_16').val();
						Evergage.sendEvent({
							name: 'Contact Us',
							action: 'Contact Us',
							user: {
								id: email,
								attributes: {
									fullName: fullName,
									firstName: firstName,
									lastName: lastName,
									emailAddress: email,
									phone: phone
								}
							}
						});
					})
				],
				contentZones: [{ name: 'Pop-up', selector: 'body' }]
			},
			{
				name: 'FAQ',
				action: 'FAQ',
				isMatch: () => {
					return window.location.pathname.includes('detox-faq/');
				},
				listeners: [
					Evergage.listener('click', '.elementor-button', (e) => {
						const $form = Evergage.cashDom(e.currentTarget).parents('form.elementor-form');
						const fullName = $form.find('#form-field-name').val();
						const phone = $form.find('#form-field-field_28636da').val();
						const email = $form.find('#form-field-email').val();
						Evergage.sendEvent({
							name: 'Contact Us',
							action: 'Contact Us',
							user: {
								id: email,
								attributes: {
									fullName: fullName,
									emailAddress: email,
									phone: phone
								}
							}
						});
					})
				],
				contentZones: [{ name: 'Pop-up', selector: 'body' }]
			},
			{
				name: 'What to Expect',
				action: 'What to Expect',
				isMatch: () => {
					return window.location.pathname.includes('what-to-expect/');
				},
				listeners: [
					Evergage.listener('click', '.elementor-button', (e) => {
						const $form = Evergage.cashDom(e.currentTarget).parents('form.elementor-form');
						const fullName = $form.find('#form-field-name').val();
						const phone = $form.find('#form-field-field_28636da').val();
						const email = $form.find('#form-field-email').val();
						Evergage.sendEvent({
							name: 'Contact Us',
							action: 'Contact Us',
							user: {
								id: email,
								attributes: {
									fullName: fullName,
									emailAddress: email,
									phone: phone
								}
							}
						});
					})
				],
				contentZones: [{ name: 'Pop-up', selector: 'body' }]
			},
			{
				name: 'What to Bring',
				action: 'What to Bring',
				isMatch: () => {
					return window.location.pathname.includes('what-to-bring/');
				},
				listeners: [
					Evergage.listener('click', '.elementor-button', (e) => {
						const $form = Evergage.cashDom(e.currentTarget).parents('form.elementor-form');
						const fullName = $form.find('#form-field-name').val();
						const phone = $form.find('#form-field-field_28636da').val();
						const email = $form.find('#form-field-email').val();
						Evergage.sendEvent({
							name: 'Contact Us',
							action: 'Contact Us',
							user: {
								id: email,
								attributes: {
									fullName: fullName,
									emailAddress: email,
									phone: phone
								}
							}
						});
					})
				],
				contentZones: [{ name: 'Pop-up', selector: 'body' }]
			},
			{
				name: 'Detox Programs',
				action: 'Detox Programs Landing Page',
				isMatch: () => {
					return window.location.pathname.includes('/detox-programs/');
				},
				listeners: [
					Evergage.listener('click', '.elementor-button', (e) => {
						const $form = Evergage.cashDom(e.currentTarget).parents('form.elementor-form');
						const fullName = $form.find('#form-field-name').val();
						const phone = $form.find('#form-field-field_28636da').val();
						const email = $form.find('#form-field-email').val();
						Evergage.sendEvent({
							name: 'Contact Us',
							action: 'Contact Us',
							user: {
								id: email,
								attributes: {
									fullName: fullName,
									emailAddress: email,
									phone: phone
								}
							}
						});
					})
				],
				contentZones: [{ name: 'Pop-up', selector: 'body' }]
			},
			{
				name: 'Addiction',
				action: 'Addiction Landing Page',
				isMatch: () => {
					return window.location.pathname.includes('/drug-addiction/');
				},
				contentZones: [{ name: 'Pop-up', selector: 'body' }]
			},
			{
				name: 'Addiction Treatment',
				action: 'Addiction Treatment Landing Page',
				isMatch: () => {
					return window.location.pathname.includes('/addiction-treatment/');
				},
				contentZones: [{ name: 'Pop-up', selector: 'body' }]
			},
			{
				name: 'Detox Program Detail',
				action: Evergage.ItemAction.ViewItem,
				isMatch: () => {
					return detoxPages.includes(window.location.pathname);
				},
				catalog: {
					Article: {
						_id: () => {
							return Evergage.resolvers.fromSelectorAttribute('article.page', 'id')();
						},
						name: () => {
							return Evergage.resolvers.fromMeta('og:title')();
						},
						description: () => {
							return Evergage.resolvers.fromMeta('og:description')();
						},
						url: window.location.href,
						categories: () => {
							return ['1Solution Detox|Detox Program'];
						}
					}
				}
			},
			{
				name: 'Addiction Program Detail',
				action: Evergage.ItemAction.ViewItem,
				isMatch: () => {
					return addictionPages.includes(window.location.pathname);
				},
				catalog: {
					Article: {
						_id: () => {
							return Evergage.resolvers.fromSelectorAttribute('article.page', 'id')();
						},
						name: () => {
							return Evergage.resolvers.fromMeta('og:title')();
						},
						description: () => {
							return Evergage.resolvers.fromMeta('og:description')();
						},
						url: window.location.href,
						categories: () => {
							return ['1Solution Detox|Addiction Program'];
						}
					}
				}
			},
			{
				name: 'Addiction Treatment Program Detail',
				action: Evergage.ItemAction.ViewItem,
				isMatch: () => {
					return addictionTreatmentPages.includes(window.location.pathname);
				},
				catalog: {
					Article: {
						_id: () => {
							return Evergage.resolvers.fromSelectorAttribute('article.page', 'id')();
						},
						name: () => {
							return Evergage.resolvers.fromMeta('og:title')();
						},
						description: () => {
							return Evergage.resolvers.fromMeta('og:description')();
						},
						url: window.location.href,
						categories: () => {
							return ['1Solution Detox|Addiction Treatment Program'];
						}
					}
				}
			},
			{
				name: 'Affordable Detox Rehab',
				action: 'Affordable Detox Rehab',
				isMatch: () => {
					return window.location.pathname.includes('/affordable-detox-rehab/');
				}
			},
			{
				name: 'Medication Assisted Treatment',
				action: 'Medication Assisted Treatment',
				isMatch: () => {
					return window.location.pathname.includes('/medication-assisted-treatment/');
				}
			},
			{
				name: 'Private Rehab Treatment',
				action: 'Private Rehab Treatment',
				isMatch: () => {
					return window.location.pathname.includes('/private-rehab-treatment/');
				}
			},
			{
				name: 'Inpatient Medical Detox',
				action: 'Inpatient Medical Detox',
				isMatch: () => {
					return window.location.pathname.includes('/inpatient-medical-detox/');
				}
			},
			{
				name: '1SD Recovery Center',
				action: '1SD Recovery Center',
				isMatch: () => {
					return window.location.pathname.includes('/1sd-recovery-center/');
				}
			}
		]
	};

	if (currentCookieDomain === 'www.allinsolutions.com') {
		Evergage.initSitemap(configA);
	} else if (currentCookieDomain === 'www.1solutiondetox.com') {
		Evergage.initSitemap(configB);
	}
});
