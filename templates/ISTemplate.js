Evergage.init({
	cookieDomain: ''
}).then(() => {

	const config = {
		global: {
			contentZones: [],
			listeners: []
		},
		pageTypeDefault: {
			name: 'default'
		},
		pageTypes: []
	};

	Evergage.initSitemap(config);
});
