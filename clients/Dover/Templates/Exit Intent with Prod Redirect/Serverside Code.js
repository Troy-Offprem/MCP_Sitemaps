export class StyleField {
    label: string;
    className: string;
}

export class ExitIntentPopupTemplate implements CampaignTemplateComponent {

    @title("Header Image")
    headerImageUrl: string = "https://www.doverfcu.com/themes/custom/doverfcu/logo.svg";

    @title("Product Image")
    productImageUrl: string = "https://www.doverfcu.com/sites/default/files/2019-03/KasasaHomepageBanner_0.jpg"

    header: string = "Header Text";

    @subtitle("Optional text field")
    subheader: string = "Subheader Text";

    @title("CTA Text")
    @subtitle("Text found on call to action button.")
    ctaText: string = "Call To Action";

    @title("Redirect URL")
    @subtitle("The full URL of where to send users when clicking the CTA button.")
    redirectUrl: string = "https://www.doverfcu.com";


    @title("Opt-Out Text")
    @subtitle("Clicking this text closes the pop-up.")
    optOutText: string = "Maybe next time.";

    run(context: CampaignComponentContext) {
        return {};
    }

}
