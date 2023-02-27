(function () {
	const pageExitMillis = 500;

	/**
	 * @function buildBindId
	 * @param {Object} context
	 * @description Create unique bind ID based on the campaign and experience IDs.
	 */
	function buildBindId(context) {
		return `${context.campaign}:${context.experience}`;
	}

	/**
	 * @function setDismissal
	 * @param {Object} context
	 * @description Add click listener to the overlay and "X" button that removes the template from the DOM.
	 */
	function setDismissal(context) {
		const dismissSelectors = `
            #evg-exit-intent-popup .evg-overlay,
            #evg-exit-intent-popup .evg-btn-dismissal,
            #evg-exit-intent-popup .evg-btn-secondary
        `;

		SalesforceInteractions.cashDom(dismissSelectors).on('click', () => {
			SalesforceInteractions.cashDom('#evg-exit-intent-popup').remove();
<<<<<<< HEAD
			Evergage.sendEvent({
				name: 'Survey Dismissal',
				action: 'Survey Dismissal'
			});
=======
>>>>>>> d14eae8705c7f9ba142f59f115c38bc5a3887447
		});
	}

	function apply(context, template) {
		if (!context.contentZone) return;

		/**
		 * The pageExit method waits for the user's cursor to exit through the top edge of the page before rendering the
		 * template after a set delay.
		 *
		 * Visit the Template Display Utilities documentation to learn more:
		 * https://developer.evergage.com/campaign-development/web-templates/web-display-utilities
		 */
		return SalesforceInteractions.DisplayUtils.bind(buildBindId(context))
			.pageExit(pageExitMillis)
			.then((element) => {
				if (SalesforceInteractions.cashDom('#evg-exit-intent-popup').length > 0) return;
				const { preAttrMessageText, userAttr, postAttrMessageText } = context;
<<<<<<< HEAD
				context.header = `${preAttrMessageText}` + ' ' + `${userAttr},` + ' ' + `${postAttrMessageText}`;
=======
				context.header = `${preAttrMessageText}`+' '+`${userAttr},`+' '+`${postAttrMessageText}`;
>>>>>>> d14eae8705c7f9ba142f59f115c38bc5a3887447

				const html = template(context);
				SalesforceInteractions.cashDom('body').append(html);
				setDismissal(context);

				const $survey = Evergage.cashDom('#evg-surveys');
				return Evergage.Surveys.injectSurveyResourcesIntoPage().then(() => {
					var defaultThemeColors = Survey.StylesManager.ThemeColors['default'];
					defaultThemeColors['$main-color'] = '#4a4a4a';
					defaultThemeColors['$main-hover-color'] = '#7ff07f';
					defaultThemeColors['$text-color'] = '#4a4a4a';
					defaultThemeColors['$header-color'] = '#7ff07f';

					defaultThemeColors['$header-background-color'] = '#f5f5f5';
					defaultThemeColors['$body-container-background-color'] = '#f5f5f5';

<<<<<<< HEAD
=======
					// const myCss = {
					// 	"rating": {
					// 		"root": "btn-group",
					// 		"item": "btn btn-default btn-secondary",
					// 		"selected": "active",
					// 		"minText": "sv_q_rating_min_text",
					// 		"itemText": "sv_q_rating_item_text",
					// 		"maxText": "sv_q_rating_max_text",
					// 		"disabled": ""
					// 	},
					// 	navigationButton: 'button btn-lg'
					// };

>>>>>>> d14eae8705c7f9ba142f59f115c38bc5a3887447
					Survey.StylesManager.applyTheme('default');
					return Evergage.Surveys.renderSurvey(context.survey, $survey).then(() => {
						Evergage.cashDom(element).append($survey);
					});
				});
			});
	}

	function reset(context, template) {
		SalesforceInteractions.DisplayUtils.unbind(buildBindId(context));
		SalesforceInteractions.cashDom('#evg-exit-intent-popup').remove();
	}

	function control(context) {
		return SalesforceInteractions.DisplayUtils.bind(buildBindId(context))
			.pageExit(pageExitMillis)
			.then(() => {
				if (context.contentZone) return true;
			})
			.then((element) => {
				Evergage.cashDom('#evg-surveys').attr({
					'data-evg-campaign-id': context.campaign,
					'data-evg-experience-id': context.experience,
					'data-evg-user-group': context.userGroup
				});
			});
	}

	registerTemplate({
		apply: apply,
		reset: reset,
		control: control
	});
})();
