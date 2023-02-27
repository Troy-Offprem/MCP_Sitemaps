(function() {

    /**
     * @function buildBindId
     * @param {Object} context
     * @description Create unique bind ID based on the campaign and experience IDs.
     */
    function buildBindId(context) {
        return `${context.campaign}:${context.experience}`;
    }

    function setConfirmationPanel() {
        SalesforceInteractions.cashDom(".formDiv .evg-cta").on("click", () => {
            const emailAddress = SalesforceInteractions.cashDom('.evg-form input[name="email"]').val();
            if (emailAddress) {
                SalesforceInteractions.cashDom(".formDiv").addClass("evg-hide");
                SalesforceInteractions.cashDom(".evg-confirm-panel").removeClass("evg-hide");
                SalesforceInteractions.cashDom(`.evg-btn-dismissal`).removeAttr("data-evg-dismissal");
                SalesforceInteractions.sendEvent({
                    interaction: {
                        name: "Newsletter Sign Up"
                    },
                    user: {
                        id: emailAddress,
                        attributes: {
                            emailAddress: emailAddress
                        }
                    }
                });
            }
        });
    }

    function apply(context, template) {
        const contentZoneSelector = SalesforceInteractions.mcis.getContentZoneSelector(context.contentZone);

        /**
         * The pageElementLoaded method waits for the content zone to load into the DOM
         * before rendering the template. The observer element that monitors for the content
         * zone element to get inserted into its DOM node is set to "body" by default.
         * For performance optimization, this default can be overridden by adding
         * a second selector argument, which will be used as the observer element instead.
         *
         * Visit the Template Display Utilities documentation to learn more:
         * https://developer.evergage.com/campaign-development/web-templates/web-display-utilities
         */
        return SalesforceInteractions.DisplayUtils
            .bind(buildBindId(context))
            .pageElementLoaded(contentZoneSelector)
            .then((element) => {
                const html = template(context);
                SalesforceInteractions.cashDom(element).before(html);
                setConfirmationPanel()
            });
    }

    function reset(context, template) {
        SalesforceInteractions.DisplayUtils.unbind(buildBindId(context));
        SalesforceInteractions.cashDom(`[data-evg-campaign-id="${context.campaign}"][data-evg-experience-id="${context.experience}"]`)
            .remove();
    }

    function control(context) {
        const contentZoneSelector = SalesforceInteractions.mcis.getContentZoneSelector(context.contentZone);
        return SalesforceInteractions.DisplayUtils
            .bind(buildBindId(context))
            .pageElementLoaded(contentZoneSelector)
            .then((element) => {
                SalesforceInteractions.cashDom(element).attr({
                    "data-evg-campaign-id": context.campaign,
                    "data-evg-experience-id": context.experience,
                    "data-evg-user-group": context.userGroup
                });
            });
    }

    registerTemplate({
        apply: apply,
        reset: reset,
        control: control
    });

})();
