(function() {

    function apply(context, template) {

        /**
         * The code below replaces the content of your selected content zone
         * with the HTML generated from Handlebars.
         *
         * If you instead wish to insert your generated HTML before or after your
         * selected content zone, use .before(html) or .after(html), respectively.
         *
         * Use Evergage.DisplayUtils.pageElementLoaded to defer the rendering of
         * the template until the content zone element is loaded on page.
         * The observer element that monitors for the content zone element to get inserted
         * into its DOM node is set to "body" by default. For performance optimization, this
         * default can be overridden by adding a second selector argument, which will be used
         * as the observer element instead.
         *
         * Visit the Display Utilities documentation to learn more:
         * https://developer.evergage.com/campaign-development/web-templates/web-display-utilities
         */
        const contentZoneSelector = Evergage.getContentZoneSelector(context.contentZone);
        return Evergage.DisplayUtils
            .pageElementLoaded(contentZoneSelector)
            .then((element) => {
                console.log('testing attach');
                const html = template(context);
                
                Evergage.DisplayUtils.pageElementLoaded('.slider .slide').then(() => {
                    const $firstSlide = Evergage.cashDom(element).find('.slide').eq(0);
                    $firstSlide.html(html);
                });
                
            });
    }

    function reset(context, template) {

        /** Remove the template from the DOM to reset the template. */
        Evergage.cashDom("#evg-new-template").remove();
    }

    function control(context) {

        /**
         * Add Evergage data attributes to elements you wish to track in the control experience.
         *
         * Visit the Campaign Stats Tracking documentation to learn more:
         * https://developer.evergage.com/campaign-development/web-templates/web-campaign-stats
         */
        const contentZoneSelector = Evergage.getContentZoneSelector(context.contentZone);
        return Evergage.DisplayUtils
            .pageElementLoaded(contentZoneSelector)
            .then((element) => {
                Evergage.cashDom(element).attr({
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

