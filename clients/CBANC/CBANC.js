const getCookieDomain = () => {
	let currentDomain = window.location.hostname;
	if (currentDomain === 'www.cbancnetwork.com') {
		return 'www.cbancnetwork.com';
	} else if (currentDomain === 'www.marketplace.cbancnetwork.com') {
		return 'www.marketplace.cbancnetwork.com';
	} else if (currentDomain === 'edge-community.cbancnetwork.com') {
		return 'edge-community.cbancnetwork.com';
	}
};
const currentCookieDomain = getCookieDomain();
if (
	typeof (Evergage.FlickerDefender || {}).setPageMatchTimeout === 'function'
) {
	Evergage.FlickerDefender.setPageMatchTimeout(2500);
}

if (
	typeof (Evergage.FlickerDefender || {}).setRedisplayTimeout === 'function'
) {
	Evergage.FlickerDefender.setRedisplayTimeout(5000);
}
const findInLayer = (targetAttribute) => {
	if (!window.dataLayer) {
		return;
	}
	for (let i = 0; i < window.dataLayer.length; i++) {
		const result = Evergage.util.getValueFromNestedObject(
			'window.dataLayer[' + i + ']'
		);
		if (result && result[targetAttribute]) {
			return result;
		}
	}
	return;
};

Evergage.init({
	cookieDomain: currentCookieDomain,
}).then(() => {
	let siteAConfig = {
		global: {
			onActionEvent: (actionEvent) => {
				if (/marketplace\.cbancnetwork\.com/.test(window.location.href)) {
					if (findInLayer('current_user_email_sha1') !== undefined) {
						const sha1hash = Object.values(
							findInLayer('current_user_email_sha1')
						).toString();
						if (sha1hash !== undefined || null) {
							actionEvent.user = actionEvent.user || {};
							actionEvent.user.attributes = actionEvent.user.attributes || {};
							actionEvent.user.attributes.sha1 = sha1hash;
						}
						return actionEvent;
					}
					return actionEvent;
				}
			},
		},
		pageTypeDefault: {
			name: 'default',
		},
        
		pageTypes: [
			{
				name: 'markplace-home',
				action: 'Marketplace-Homepage',
				isMatch: () =>
					/marketplace\.cbancnetwork\.com\/$/.test(window.location.href),

				listeners: [
					//Home Page Event listener for when a product tile title is clicked. Distinguishes what section the product was in.//
                        Evergage.listener('click', '.AdvertTile-title', (a) => {
                        const pid = Evergage.cashDom(a.target).closest(".AdvertTile-title").attr("href").split('/').pop();
                        if(a.target.closest(".HomePage-section").children[0].innerText == "Hot products"){
                            Evergage.sendEvent({
                                action: 'Home Hot Product Clicked',
                                    itemAction: Evergage.ItemAction.ViewItem,
                                    catalog: {
                                        VendorProducts: {
                                            _id: pid
                                        }
                                    }
                            });
                        }else if(a.target.closest(".HomePage-section").children[0].innerText == "Recently added"){
                            Evergage.sendEvent({
                                action: 'Home Recently Added Product Clicked',
                                itemAction: Evergage.ItemAction.ViewItem,
                                    catalog: {
                                        VendorProducts: {
                                            _id: pid
                                        }
                                    }
                            });
                        }else if(a.target.closest(".HomePage-section").children[0].innerText == "Featured products"){
                            Evergage.sendEvent({
                                action: 'Home Featured Product Clicked',
                                itemAction: Evergage.ItemAction.ViewItem,
                                    catalog: {
                                        VendorProducts: {
                                            _id: pid
                                        }
                                    }
                            });
                        }
                        else{
                            Evergage.sendEvent({
                                action: 'Home Other Product Clicked',
                                itemAction: Evergage.ItemAction.ViewItem,
                                    catalog: {
                                        VendorProducts: {
                                            _id: pid
                                        }
                                    }
                            });
                        }
                        }),
                        
                        
                        //Home Page Event listener for when a product tile vendor link is clicked. Distinguishes what section the product was in.//
                        Evergage.listener('click', 'div.AdvertTile-seller > a', (v) => {
                        const pid = Evergage.cashDom(v.target).closest("div.AdvertTile-seller > a").attr("href").split('/').pop();
                        if(v.target.closest(".HomePage-section").children[0].innerText == "Hot products"){
                            Evergage.sendEvent({
                                action: 'Home Hot Product Vendor Clicked',
                                    itemAction: Evergage.ItemAction.ViewItem,
                                    catalog: {
                                        Vendors: {
                                            _id: pid
                                        }
                                    }
                            });
                        }else if(v.target.closest(".HomePage-section").children[0].innerText == "Recently added"){
                            Evergage.sendEvent({
                                action: 'Home Recently Added Product Vendor Clicked',
                                itemAction: Evergage.ItemAction.ViewItem,
                                    catalog: {
                                        Vendors: {
                                            _id: pid
                                        }
                                    }
                            });
                        }else if(v.target.closest(".HomePage-section").children[0].innerText == "Featured products"){
                            Evergage.sendEvent({
                                action: 'Home Featured Product Vendor Clicked',
                                itemAction: Evergage.ItemAction.ViewItem,
                                    catalog: {
                                        Vendors: {
                                            _id: pid
                                        }
                                    }
                            });
                        }
                        else{
                            Evergage.sendEvent({
                                action: 'Home Other Product Vendor Clicked',
                                itemAction: Evergage.ItemAction.ViewItem,
                                    catalog: {
                                        Vendors: {
                                            _id: pid
                                        }
                                    }
                            });
                        }
                        }),
                        
                        
                        //homepage Event Listener for when a product tile view details button is clicked. Distinguishes what section the product was in.//
                        Evergage.listener('click', '.AdvertTile-button a', (c) => {
                        const pid = Evergage.cashDom(c.target).closest(".AdvertTile-button a").attr("href").split('/').pop();
                        if(c.target.closest(".HomePage-section").children[0].innerText == "Hot products"){
                            Evergage.sendEvent({
                                action: 'Home Hot Product Clicked',
                                    itemAction: Evergage.ItemAction.ViewItem,
                                    catalog: {
                                        VendorProducts: {
                                            _id: pid
                                        }
                                    }
                            });
                        }else if(c.target.closest(".HomePage-section").children[0].innerText == "Recently added"){
                            Evergage.sendEvent({
                                action: 'Home Recently Added Product Clicked',
                                itemAction: Evergage.ItemAction.ViewItem,
                                    catalog: {
                                        VendorProducts: {
                                            _id: pid
                                        }
                                    }
                            });
                        }else if(c.target.closest(".HomePage-section").children[0].innerText == "Featured products"){
                            Evergage.sendEvent({
                                action: 'Home Featured Product Clicked',
                                itemAction: Evergage.ItemAction.ViewItem,
                                    catalog: {
                                        VendorProducts: {
                                            _id: pid
                                        }
                                    }
                            });
                        }
                        else{
                            Evergage.sendEvent({
                                action: 'Home Other Product Clicked',
                                itemAction: Evergage.ItemAction.ViewItem,
                                    catalog: {
                                        VendorProducts: {
                                            _id: pid
                                        }
                                    }
                            });
                        }
                        }),
                        
                        
                        //homepage Event Listener for when a product tile image is clicked. Distinguishes what section the product was in.//
                        Evergage.listener('click', '.AdvertTile-imageBoxContainer', (d) => {
                        const pid = Evergage.cashDom(d.target).closest(".AdvertTile-imageBoxContainer").attr("href").split('/').pop();
                        if(d.target.closest(".HomePage-section").children[0].innerText == "Hot products"){
                            Evergage.sendEvent({
                                action: 'Home Hot Product Clicked',
                                    itemAction: Evergage.ItemAction.ViewItem,
                                    catalog: {
                                        VendorProducts: {
                                            _id: pid
                                        }
                                    }
                            });
                        }else if(d.target.closest(".HomePage-section").children[0].innerText == "Recently added"){
                            Evergage.sendEvent({
                                action: 'Home Recently Added Product Clicked',
                                itemAction: Evergage.ItemAction.ViewItem,
                                    catalog: {
                                        VendorProducts: {
                                            _id: pid
                                        }
                                    }
                            });
                        }else if(d.target.closest(".HomePage-section").children[0].innerText == "Featured products"){
                            Evergage.sendEvent({
                                action: 'Home Featured Product Clicked',
                                itemAction: Evergage.ItemAction.ViewItem,
                                    catalog: {
                                        VendorProducts: {
                                            _id: pid
                                        }
                                    }
                            });
                        }
                        else{
                            Evergage.sendEvent({
                                action: 'Home Other Product Clicked',
                                itemAction: Evergage.ItemAction.ViewItem,
                                    catalog: {
                                        VendorProducts: {
                                            _id: pid
                                        }
                                    }
                            });
                        }
                        }),
                        
                        Evergage.listener('click', '.AddToWishList', (p) => {
                            const pid = Evergage.cashDom(a.target).closest(".AdvertTile-title").attr("href").split('/').pop();
                            if(p.target.closest(".AddToWishList").classList.contains('AddToWishList--inWishList')){
                            Evergage.sendEvent({
                                action: 'Product Bookmark Removed',
                            });
                            }else{
                                Evergage.sendEvent({
                                action: 'Product Bookmark Added',
                                itemAction: Evergage.ItemAction.Favorite,
                                    catalog: {
                                        VendorProducts: {
                                            _id: pid
                                        }
                                    }
                            });
                            }
                    }),
                
                    
				],
				contentZones: [
					{ name: 'VendorFeature', selector: '.HeroSliderContainer' },
					{ name: 'HeroFeature', selector: '.ContentBlock--ImageBlock' },
				],
			},
			{
				name: 'markplace-subcategory-view',
				action: 'Marketplace-subcategory-view',
				isMatch: () =>
					/marketplace\.cbancnetwork\.com\/s\/(analytics-software|core-banking-software|digital-banking-software|financial-crm-software|mobile-banking-software|payment-processing-software|reporting-software|other-banking-operations-software|banking-operations-consultants|bsa-software|compliance-management|financial-fraud-detection-software|risk-management-software|vendor-management-software|other-compliance-legal-audit-software|compliance-legal-and-audit-consultants|debt-collection-software|loan-origination-software|loan-servicing-software|mortgage-and-loans-software|other-lending-credit-software|lending-credit-consultants|contact-data-software|crm-software|direct-mail-software|email-marketing-software|email-service-providers|marketing-automation-software|other-marketing-communications-software|marketing-and-communication-consultants|applicant-tracking-software|benefits-administration-software|continuing-education-platforms|core-hr-software|time-tracking-software|other-hr-training-software|financial-management-software|hedge-fund-software|investment-portfolio-management-software|other-wealth-management-software)/.test(
						window.location.href
					),
			},
			{
				name: 'markplace-Admin-view',
				action: 'Marketplace-Admin-view',
				isMatch: () =>
					/marketplace\.cbancnetwork\.com\/admin/.test(window.location.href),
			},
			{
				name: 'markplace-Seller-view',
				action: 'Marketplace-Seller-view',
				isMatch: () =>
					/marketplace\.cbancnetwork\.com\/client/.test(window.location.href),
			},
			{
				name: 'markplace-search-view',
				action: 'Marketplace-search-view',
				isMatch: () =>
					/marketplace\.cbancnetwork\.com\/s\?[^/]/.test(window.location.href),
			},
			{
				name: 'markplace-vendor-view',
				action: 'Marketplace-vendor-view',
				isMatch: () =>
					/marketplace\.cbancnetwork\.com\/shop\/./.test(window.location.href),
				catalog: {
					Vendors: {
						_id: Evergage.resolvers.fromHref((url) => url.split('/').pop()),
						name: Evergage.resolvers.fromSelector('h1'),
						url: Evergage.resolvers.fromHref(),
						imageUrl: Evergage.resolvers.fromSelectorAttribute(
							'.chakra-image',
							'src'
						),
						description: Evergage.resolvers.fromSelector('.P-sc-1mfm5g5-6 p'),
					},
				},
			},
			{
				name: 'markplace-all-products-view',
				action: 'Marketplace-all-products-view',
				isMatch: () =>
					/marketplace\.cbancnetwork\.com\/s$/.test(window.location.href),
			},
			{
				name: 'markplace-product-view',
				action: 'Marketplace-product-view',
				itemAction: Evergage.ItemAction.ViewItem,
				isMatch: () =>
					/marketplace\.cbancnetwork\.com\/a\//.test(window.location.href),

				catalog: {
					VendorProducts: {
						_id: () => {
							const id = Evergage.resolvers.fromHref((url) =>
								url.split('/').pop()
							);
							return id ? id : null;
						},
						name: Evergage.resolvers.fromSelector('h1'),
						url: Evergage.resolvers.fromHref(),
                        averageRating: Evergage.resolvers.fromSelector('.avg-score'),
						//imageUrl: () =>{
						//       const img = window.getComputedStyle(document.querySelector('.ImageSlider-slideImage')).getPropertyValue('background-image').split(window.location.href)[0];
						//           return img ? img : null;
						//           },
						description: Evergage.resolvers.fromSelector(
							'.MAccordionContent-inner p'
						),

						Support: () => {
							if (
								Evergage.cashDom('.PageProduct-details > div > p')
									.text()
									.includes('Deployment:')
							) {
								const sup = Evergage.cashDom('.PageProduct-details > div > p')
									.text()
									.split('Support:')[1]
									.split('Training: ')[0];
								return sup ? sup : null;
							} else {
								return null;
							}
						},
						Deployment: () => {
							if (
								Evergage.cashDom('.PageProduct-details > div > p')
									.text()
									.includes('Deployment:')
							) {
								const dep = Evergage.cashDom('.PageProduct-details > div > p')
									.last()
									.text()
									.split('Deployment:')[1]
									.split('Support: ')[0];
								return dep ? dep : null;
							} else {
								return null;
							}
						},
						Training: () => {
							if (
								Evergage.cashDom('.PageProduct-details > div > p')
									.text()
									.includes('Deployment:') &&
								Evergage.cashDom('.PageProduct-details > div > p')
									.text()
									.includes('Vendor Website:')
							) {
								let tra = Evergage.cashDom('.PageProduct-details > div > p')
									.last()
									.text()
									.split('Training:')[1]
									.split('Vendor Website: ')[0];
								return tra ? tra : null;
							} else if (
								Evergage.cashDom('.PageProduct-details > div > p')
									.text()
									.includes('Deployment:') &&
								!Evergage.cashDom('.PageProduct-details > div > p')
									.text()
									.includes('Vendor Website:') &&
								Evergage.cashDom('.PageProduct-details > div > p')
									.text()
									.includes('Product URL:')
							) {
								let tra = Evergage.cashDom('.PageProduct-details > div > p')
									.last()
									.text()
									.split('Training:')[1]
									.split('Product URL:')[0];
								return tra ? tra : null;
							} else {
								return null;
							}
						},

						VendorWebsite: () => {
							if (
								Evergage.cashDom('.PageProduct-details > div > p')
									.text()
									.includes('Product URL:') &&
								Evergage.cashDom('.PageProduct-details > div > p')
									.text()
									.includes('Vendor Website:')
							) {
								let vweb = Evergage.cashDom('.PageProduct-details > div > p')
									.last()
									.text()
									.split('Vendor Website:')[1]
									.split('Product URL:')[0];
								return vweb ? vweb : null;
							} else if (
								!Evergage.cashDom('.PageProduct-details > div > p')
									.text()
									.includes('Product URL:') &&
								Evergage.cashDom('.PageProduct-details > div > p')
									.text()
									.includes('Vendor Website:')
							) {
								let vweb = Evergage.cashDom('.PageProduct-details > div > p')
									.last()
									.text()
									.split('Vendor Website:')[1]
									.split('Availability:')[0];
								return vweb ? vweb : null;
							} else {
								return null;
							}
						},
						ProductUrl: () => {
							if (
								Evergage.cashDom('.PageProduct-details > div > p')
									.text()
									.includes('Product URL:')
							) {
								const purl = Evergage.cashDom('.PageProduct-details > div > p')
									.last()
									.text()
									.split('Product URL:')[1]
									.split('Availability:')[0];
								return purl ? purl : null;
							}
							return null;
						},
						numberOfRatings: () => {
							const nor = Evergage.cashDom('.reviews-qa-label')
								.text()
								.split(' Review')[0];
							return nor ? nor : null;
						},
						relatedCatalogObjects: {
							Vendors: () => {
								const vid = document
									.querySelector('.t-sellerSummaryLink')
									.href.split('/')
									.pop();
								return vid ? [vid] : null;
							},
							MPSubCategory: () => {
								const mpsc = document
									.querySelector('.PageProduct-details > div > p > a')
									.href.split('/')
									.pop();
								return mpsc ? [mpsc] : null;
							},
						},
					},
				},
				listeners: [
					Evergage.listener('submit', '.EmailSellerForm form', () => {
						const pid = Evergage.cashDom('.PageProduct-details > div > p')
							.text()
							.split('ID:')[1]
							.toString();
						Evergage.sendEvent({
							action: 'Product Inquiry',
							catalog: {
								VendorProducts: {
									_id: pid,
								},
							},
						});
					}),
                 
					Evergage.listener('click', '.MRevealText-link', () => {
						const pid = Evergage.cashDom('.PageProduct-details > div > p')
							.text()
							.split('ID:')[1]
							.toString();
						Evergage.sendEvent({
							action: 'Product Show More Description',
							itemAction: Evergage.ItemAction.ViewItemDetail,
							catalog: {
								VendorProducts: {
									_id: pid,
								},
							},
						});
					}),
					Evergage.listener('click', '.PageProduct-details li a', () => {
						const pid = Evergage.cashDom('.PageProduct-details > div > p')
							.text()
							.split('ID:')[1]
							.toString();
						Evergage.sendEvent({
							action: 'Product Document Download',
							catalog: {
								VendorProducts: {
									_id: pid,
								},
							},
						});
					}),
					Evergage.listener('click', '.ImageSlider-slideImage', () => {
						const pid = Evergage.cashDom('.PageProduct-details > div > p')
							.text()
							.split('ID:')[1]
							.toString();
						Evergage.sendEvent({
							action: 'Product Main Image Clicked',
							itemAction: Evergage.ItemAction.ViewItemDetail,
							catalog: {
								VendorProducts: {
									_id: pid,
								},
							},
						});
					}),
					Evergage.listener('click', '.ImageSlider-thumbnail-text', () => {
						const pid = Evergage.cashDom('.PageProduct-details > div > p')
							.text()
							.split('ID:')[1]
							.toString();
						Evergage.sendEvent({
							action: 'Product Thumbnail Image Clicked',
							itemAction: Evergage.ItemAction.ViewItemDetail,
							catalog: {
								VendorProducts: {
									_id: pid,
								},
							},
						});
					}),
					Evergage.listener('click', '.ShareOnButton-email', () => {
						const pid = Evergage.cashDom('.PageProduct-details > div > p')
							.text()
							.split('ID:')[1]
							.toString();
						Evergage.sendEvent({
							action: 'Product Shared Email',
							itemAction: Evergage.ItemAction.Share,
							catalog: {
								VendorProducts: {
									_id: pid,
								},
							},
						});
					}),
					Evergage.listener('click', '.MSellerSummary-retailerName', () => {
						const pid = Evergage.cashDom('.PageProduct-details > div > p')
							.text()
							.split('ID:')[1]
							.toString();
						Evergage.sendEvent({
							action: 'Product Click Vendor',
							catalog: {
								VendorProducts: {
									_id: pid,
								},
							},
						});
					}),
                    Evergage.listener('click', '.PageProduct-wishList', (p) => {
						if(p.target.closest(".IconButton").classList.contains('is-active')){
                        Evergage.sendEvent({
							action: 'Product Bookmark Removed',
						});
                        }else{
                            Evergage.sendEvent({
							action: 'Product Bookmark Added',
						});
                        }
                    }),
                
				],
			},
			{
				name: 'markplace-category-view',
				action: 'Marketplace-category-view',
				isMatch: () =>
					/marketplace\.cbancnetwork\.com\/promo\/(compliance-legal-and-audit|banking-operations|lending-and-credit|hr-and-training|wealth-management|marketing-and-communications)/.test(
						window.location.href
					),
                    listeners: [
					//Category Page Event listener for when a product tile title is clicked. Distinguishes what section the product was in.//
                        Evergage.listener('click', '.AdvertTile-title', (a) => {
                        const pid = Evergage.cashDom(a.target).closest(".AdvertTile-title").attr("href").split('/').pop();
                        if(a.target.closest(".HomePage-section").children[0].innerText == "Popular products"){
                            Evergage.sendEvent({
                                action: 'Category Popular Product Clicked',
                                    itemAction: Evergage.ItemAction.ViewItem,
                                    catalog: {
                                        VendorProducts: {
                                            _id: pid
                                        }
                                    }
                            });
                        }else if(a.target.closest(".HomePage-section").children[0].innerText == "Recently added"){
                            Evergage.sendEvent({
                                action: 'Category Recently Added Product Clicked',
                                itemAction: Evergage.ItemAction.ViewItem,
                                    catalog: {
                                        VendorProducts: {
                                            _id: pid
                                        }
                                    }
                            });
                        }else if(a.target.closest(".HomePage-section").children[0].innerText == "Featured products"){
                            Evergage.sendEvent({
                                action: 'Category Featured Product Clicked',
                                itemAction: Evergage.ItemAction.ViewItem,
                                    catalog: {
                                        VendorProducts: {
                                            _id: pid
                                        }
                                    }
                            });
                        }
                        else{
                            Evergage.sendEvent({
                                action: 'Category Other Product Clicked',
                                itemAction: Evergage.ItemAction.ViewItem,
                                    catalog: {
                                        VendorProducts: {
                                            _id: pid
                                        }
                                    }
                            });
                        }
                        }),
                        
                        
                        //Category Page Event listener for when a product tile vendor link is clicked. Distinguishes what section the product was in.//
                        Evergage.listener('click', 'div.AdvertTile-seller > a', (v) => {
                        const pid = Evergage.cashDom(v.target).closest("div.AdvertTile-seller > a").attr("href").split('/').pop();
                        if(v.target.closest(".HomePage-section").children[0].innerText == "Popular products"){
                            Evergage.sendEvent({
                                action: 'Category Popular Product Vendor Clicked',
                                    itemAction: Evergage.ItemAction.ViewItem,
                                    catalog: {
                                        Vendors: {
                                            _id: pid
                                        }
                                    }
                            });
                        }else if(v.target.closest(".HomePage-section").children[0].innerText == "Recently added"){
                            Evergage.sendEvent({
                                action: 'Category Recently Added Product Vendor Clicked',
                                itemAction: Evergage.ItemAction.ViewItem,
                                    catalog: {
                                        Vendors: {
                                            _id: pid
                                        }
                                    }
                            });
                        }else if(v.target.closest(".HomePage-section").children[0].innerText == "Featured products"){
                            Evergage.sendEvent({
                                action: 'Category Featured Product Vendor Clicked',
                                itemAction: Evergage.ItemAction.ViewItem,
                                    catalog: {
                                        Vendors: {
                                            _id: pid
                                        }
                                    }
                            });
                        }
                        else{
                            Evergage.sendEvent({
                                action: 'Category Other Product Vendor Clicked',
                                itemAction: Evergage.ItemAction.ViewItem,
                                    catalog: {
                                        Vendors: {
                                            _id: pid
                                        }
                                    }
                            });
                        }
                        }),
                        
                        
                        //Category Page Event Listener for when a product tile view details button is clicked. Distinguishes what section the product was in.//
                        Evergage.listener('click', '.AdvertTile-button a', (c) => {
                        const pid = Evergage.cashDom(c.target).closest(".AdvertTile-button a").attr("href").split('/').pop();
                        if(c.target.closest(".HomePage-section").children[0].innerText == "Popular products"){
                            Evergage.sendEvent({
                                action: 'Category Popular Product Clicked',
                                    itemAction: Evergage.ItemAction.ViewItem,
                                    catalog: {
                                        VendorProducts: {
                                            _id: pid
                                        }
                                    }
                            });
                        }else if(c.target.closest(".HomePage-section").children[0].innerText == "Recently added"){
                            Evergage.sendEvent({
                                action: 'Category Recently Added Product Clicked',
                                itemAction: Evergage.ItemAction.ViewItem,
                                    catalog: {
                                        VendorProducts: {
                                            _id: pid
                                        }
                                    }
                            });
                        }else if(c.target.closest(".HomePage-section").children[0].innerText == "Featured products"){
                            Evergage.sendEvent({
                                action: 'Category Featured Product Clicked',
                                itemAction: Evergage.ItemAction.ViewItem,
                                    catalog: {
                                        VendorProducts: {
                                            _id: pid
                                        }
                                    }
                            });
                        }
                        else{
                            Evergage.sendEvent({
                                action: 'Category Other Product Clicked',
                                itemAction: Evergage.ItemAction.ViewItem,
                                    catalog: {
                                        VendorProducts: {
                                            _id: pid
                                        }
                                    }
                            });
                        }
                        }),
                        
                        
                        //Category Page Event Listener for when a product tile image is clicked. Distinguishes what section the product was in.//
                        Evergage.listener('click', '.AdvertTile-imageBoxContainer', (d) => {
                        const pid = Evergage.cashDom(d.target).closest(".AdvertTile-imageBoxContainer").attr("href").split('/').pop();
                        if(d.target.closest(".HomePage-section").children[0].innerText == "Popular products"){
                            Evergage.sendEvent({
                                action: 'Category Popular Product Clicked',
                                    itemAction: Evergage.ItemAction.ViewItem,
                                    catalog: {
                                        VendorProducts: {
                                            _id: pid
                                        }
                                    }
                            });
                        }else if(d.target.closest(".HomePage-section").children[0].innerText == "Recently added"){
                            Evergage.sendEvent({
                                action: 'Category Recently Added Product Clicked',
                                itemAction: Evergage.ItemAction.ViewItem,
                                    catalog: {
                                        VendorProducts: {
                                            _id: pid
                                        }
                                    }
                            });
                        }else if(d.target.closest(".HomePage-section").children[0].innerText == "Featured products"){
                            Evergage.sendEvent({
                                action: 'Category Featured Product Clicked',
                                itemAction: Evergage.ItemAction.ViewItem,
                                    catalog: {
                                        VendorProducts: {
                                            _id: pid
                                        }
                                    }
                            });
                        }
                        else{
                            Evergage.sendEvent({
                                action: 'Category Other Product Clicked',
                                itemAction: Evergage.ItemAction.ViewItem,
                                    catalog: {
                                        VendorProducts: {
                                            _id: pid
                                        }
                                    }
                            });
                        }
                        }),
                    Evergage.listener('click', '.AddToWishList', (p) => {
                            const pid = Evergage.cashDom(a.target).closest(".AdvertTile-title").attr("href").split('/').pop();
                            if(p.target.closest(".AddToWishList").classList.contains('AddToWishList--inWishList')){
                            Evergage.sendEvent({
                                action: 'Product Bookmark Removed',
                            });
                            }else{
                                Evergage.sendEvent({
                                action: 'Product Bookmark Added',
                                itemAction: Evergage.ItemAction.Favorite,
                                    catalog: {
                                        VendorProducts: {
                                            _id: pid
                                        }
                                    }
                            });
                            }
                    }),
                
                    
				],
				contentZones: [
					{ name: 'category_featured_company', selector: '.HeroSlide-image' },
				],
			},
			{
				name: 'markplace-scategory-view',
				action: 'Marketplace-scategory-view',
				isMatch: () =>
					/marketplace\.cbancnetwork\.com\/s\/(compliance-legal-and-audit|banking-operations|lending-credit|hr-training|wealth-management|marketing-communications)/.test(
						window.location.href
					),
			},
			{
				name: 'markplace-bookmarked-view',
				action: 'Marketplace-bookmarked-view',
				isMatch: () =>
					/marketplace\.cbancnetwork\.com\/adverts\/favourites/.test(
						window.location.href
					),
				listeners: [
					Evergage.listener('click', '.WishList-item-container', () => {
						Evergage.sendEvent({
							action: 'Bookedmarked Product Clcked',
							catalog: {
								Product: {
									url: Evergage.resolvers.fromHref(),
								},
							},
						});
					}),
					Evergage.listener('click', '.AddToWishList-icon', () => {
						Evergage.sendEvent({
							action: 'Product Bookmark Removed',
							catalog: {
								Product: {
									url: Evergage.resolvers.fromHref(),
								},
							},
						});
					}),
				],
			},
		],
	};

	let siteBConfig = {
		global: {},
		pageTypeDefault: {
			name: 'default',
		},
		pageTypes: [
			{
				name: 'education-upcoming-webinars-view',
				action: 'Education-upcoming-webinars-view',
				isMatch: () =>
					/cbancnetwork\.com\/education\/webinars\/calendar/.test(
						window.location.href
					),
			},
			{
				name: 'education-ondemand-webinars-view',
				action: 'Education-ondemand-webinars-view',
				isMatch: () =>
					/cbancnetwork\.com\/education\/webinars\/on\_demand/.test(
						window.location.href
					),
			},
			{
				name: 'education-individual-webinar-view',
				action: 'Education-individual-webinar-view',
				isMatch: () =>
					/cbancnetwork\.com\/education\/webinars\/view\//.test(
						window.location.href
					),
				catalog: {
					Product: {
						_id: Evergage.resolvers.fromHref(
							(url) => url.split('/').pop().split('?')[0]
						),
						name: Evergage.resolvers.fromSelector('h1'),
						url: Evergage.resolvers.fromHref(),
						/*  imageUrl: () => {
                           const img = Evergage.cashDom('.hero').attr("style").split('background-image: url("')[1].split('"')[0];
                            return img ? img : null;
                       
                       }, */
						description: Evergage.resolvers.fromSelector('.description'),
						FieldOfStudy: () => {
							const fos = Evergage.cashDom('.purchase_details li')
								.last()
								.text()
								.split('Field of Study:')[1];
							return fos ? fos : null;
						},
						categories: () => {},
						relatedCatalogObjects: {
							WebinarSpeakers: () => {
								if (Evergage.cashDom('.speakers h5').text() == 'SPEAKERS') {
									const sid = Evergage.cashDom('.presenter_card a')
										.attr('href')
										.split('/')
										.pop();
									return sid ? [sid] : null;
								} else {
									return null;
								}
							},
						},
					},
				},
			},
			{
				name: 'education-webinar-bundles-view',
				action: 'Education-webinar-bundles-view',
				isMatch: () =>
					/cbancnetwork\.com\/education\/bundles/.test(window.location.href),
			},
			{
				name: 'education-my-orders-view',
				action: 'Education-my-orders-view',
				isMatch: () =>
					/cbancnetwork\.com\/education\/orders\/my\_orders/.test(
						window.location.href
					),
			},

			{
				name: 'education-speaker-view',
				action: 'Education-speaker-view',
				isMatch: () =>
					/cbancnetwork\.com\/education\/users\/view\//.test(
						window.location.href
					),
				catalog: {
					WebinarSpeakers: {
						_id: Evergage.resolvers.fromHref((url) => url.split('/').pop()),
						name: Evergage.resolvers.fromSelector('h5'),
						url: Evergage.resolvers.fromHref(),
						imageUrl: () => {
							const img = Evergage.cashDom('.presenter_card figure')
								.attr('style')
								.split('background-image: url("')[1]
								.split('"')[0];
							return img ? img : null;
						},
						description: Evergage.resolvers.fromSelector('.bio p'),
						JobTitle: Evergage.resolvers.fromSelector('.title p'),
						Company: Evergage.resolvers.fromSelector('.org_name span'),
						/*relatedCatalogObjects: {
                          
                               Product: () =>{
                                    
                                    return Evergage.resolvers.fromSelectorAttributeMultiple('.synopsis a', 'href', (features) => {
                                        return features.map((feature) => {
                                            return feature.split('/').pop();
                                        });
                                    });
                                
                                            
                                   
                        },
                               
      
                                
                       }*/
					},
				},
			},
			{
				name: 'education-webinar-reserve-seat',
				action: 'Education-webinar-reserve-seat',
				isMatch: () =>
					/cbancnetwork\.com\/education\/orders\/reserve\//.test(
						window.location.href
					),
			},
			{
				name: 'education-webinar-payment',
				action: 'Education-webinar-payment',
				isMatch: () =>
					/cbancnetwork\.com\/education\/orders\/pay\//.test(
						window.location.href
					),
			},
			{
				name: 'education-webinar-order-receipt',
				action: 'Education-webinar-order-receipt',
				isMatch: () =>
					/cbancnetwork\.com\/education\/orders\/receipt\//.test(
						window.location.href
					),
			},
		],
	};
	const findInDataLayer = (targetAttribute) => {
		if (!window.dataLayer) {
			return;
		}
		for (let i = 0; i < 100; i++) {
			if (!window.dataLayer[i][1]) {
				return;
			}
			const result = window.dataLayer[i][1];

			if (result && result[targetAttribute]) {
				return result;
			}
		}
		return;
	};
	let siteCConfig = {
		global: {
			contentZones: [
				{ name: 'CommunityRightRail', selector: '.right-rail-ad-community' },
				{ name: 'CommunityInFeed', selector: '.cuf-feed' },
				{ name: 'RightRailInterest-1', selector: '.interested-item1' },
				{ name: 'RightRailInterest-2', selector: '.interested-item2' },
				{ name: 'RightRailInterest-3', selector: '.interested-item3' },
			],
			  onActionEvent: (actionEvent) => {
                for (let r = 0; r < window.dataLayer.length; r++) {
                    if(window.dataLayer[r][1]){
                        let dl2 = window.dataLayer[r][1];
                        if(dl2.user_id){
                            const sfmcid = window.dataLayer[r][1].user_id;
                            actionEvent.user = actionEvent.user || {};
                            actionEvent.user.attributes = actionEvent.user.attributes || {};
                            actionEvent.user.attributes.sfmcContactKey = sfmcid;
                        }
                    }
                }
                
                let InRandone = Math.floor(Math.random() * (3 - 1 + 1) + 1);
                let InRandtwo = Math.floor(Math.random() * (3 - 1 + 1) + 1);
                let InRandthree = Math.floor(Math.random() * (3 - 1 + 1) + 1);
                let RightRailRand = Math.floor(Math.random() * (4 - 1 + 1) + 1);
                let InFeedRand = Math.floor(Math.random() * (4 - 1 + 1) + 1);
                
                if(InRandthree){
                actionEvent.user = actionEvent.user || {};
                actionEvent.user.attributes = actionEvent.user.attributes || {};
                actionEvent.user.attributes.Interested1 = InRandone;
                actionEvent.user.attributes.Interested2 = InRandtwo;
                actionEvent.user.attributes.Interested3 = InRandthree;
                actionEvent.user.attributes.RightRail = RightRailRand;
                actionEvent.user.attributes.InFeed = InFeedRand;
                };
                return actionEvent;
            }, 
		},
		pageTypeDefault: {
			name: 'default',
		},
		pageTypes: [
			{
				name: 'Community-Homepage',
				action: 'Community-Homepage-View',
				isMatch: () =>
					/edge\-community\.cbancnetwork\.com\/Community\/s\/$/.test(
						window.location.href
					),
				listeners: [
					Evergage.listener('click', '.askCommunityBtn', () => {
						Evergage.sendEvent({
							action: 'Ask-Question-Button-Clicked',
						});
					}),
					Evergage.listener('click', '.cuf-publisherShareButton', () => {
						Evergage.sendEvent({
							action: 'Asked-A-Question',
						});
					}),
				],
			},
			{
				name: 'Community-Topic-Page',
				action: 'Community-Topic-Page-View',
				isMatch: () =>
					/edge\-community\.cbancnetwork\.com\/Community\/s\/topic\//.test(
						window.location.href
					),
                    contentZones: [
				
                { name: 'LeaderboardSection', selector: '#carousel' },
				
			],
				listeners: [
					Evergage.listener('click', '.askCommunityBtn', () => {
						Evergage.sendEvent({
							action: 'Ask-Question-Button-Clicked',
						});
					}),

					Evergage.listener('click', '.like-target', () => {
						Evergage.sendEvent({
							action: 'Discussion-Post-Liked',
						});
					}),

					Evergage.listener('click', '.unlike-target', () => {
						Evergage.sendEvent({
							action: 'Discussion-Post-UnLiked',
						});
					}),

					Evergage.listener('click', '.cuf-publisherShareButton', () => {
						Evergage.sendEvent({
							action: 'Asked-A-Question',
						});
					}),

					Evergage.listener('click', '.cuf-following', () => {
						if (
							Evergage.cashDom('.cuf-following').attr('title') ==
							'Click to Unfollow'
						) {
							Evergage.sendEvent({
								action: 'Unfollowed-A-Topic',
							});
						} else if (
							Evergage.cashDom('.cuf-follow').attr('title') == 'Click to Follow'
						) {
							Evergage.sendEvent({
								action: 'Followed-A-Topic',
							});
						}
					}),

					Evergage.listener('click', '.slds-icon-utility-download', () => {
						Evergage.sendEvent({
							action: 'Document-Downloaded',
						});
					}),
					Evergage.listener('click', '.fileButton', () => {
						Evergage.sendEvent({
							action: 'Document-Downloaded',
						});
					}),
					Evergage.listener('click', '.previewerAction', () => {
						if (
							Evergage.cashDom('.previewerAction').attr('title') == 'Download'
						) {
							Evergage.sendEvent({
								action: 'Document-Downloaded',
							});
						}
					}),

					Evergage.listener('click', '.slds-file__crop', () => {
						Evergage.sendEvent({
							action: 'Document-Preview',
						});
					}),
				],
			},
			{
				name: 'Community-Discussion-Page',
				action: 'Community-Discussion-Page-View',
				isMatch: () =>
					/edge\-community\.cbancnetwork\.com\/Community\/s\/question\//.test(
						window.location.href
					),
				listeners: [
					Evergage.listener('click', '.like-target', () => {
						Evergage.sendEvent({
							action: 'Discussion-Post-Liked',
						});
					}),

					Evergage.listener('click', '.unlike-target', () => {
						Evergage.sendEvent({
							action: 'Discussion-Post-UnLiked',
						});
					}),
				],
			},
			{
				name: 'Community-Member-Profile-Page',
				action: 'Community-Member-Profile-Page-View',
				isMatch: () =>
					/edge\-community\.cbancnetwork\.com\/Community\/s\/data-request\//.test(
						window.location.href
					),
			},
			{
				name: 'Community-Settings-Page',
				action: 'Community-Settings--Page-View',
				isMatch: () =>
					/edge\-community\.cbancnetwork\.com\/Community\/s\/settings\//.test(
						window.location.href
					),
			},
		],
	};

	const handleSPAPageChange = () => {
		let url = window.location.href;
		const urlChangeInterval = setInterval(() => {
			if (url !== window.location.href) {
				url = window.location.href;

				Evergage.reinit();
			}
		}, 2000);
	};

	handleSPAPageChange();

	if (currentCookieDomain === 'www.marketplace.cbancnetwork.com') {
		Evergage.initSitemap(siteAConfig);
	} else if (currentCookieDomain === 'www.cbancnetwork.com') {
		Evergage.initSitemap(siteBConfig);
	} else if (currentCookieDomain === 'edge-community.cbancnetwork.com') {
		Evergage.initSitemap(siteCConfig);
	}
});