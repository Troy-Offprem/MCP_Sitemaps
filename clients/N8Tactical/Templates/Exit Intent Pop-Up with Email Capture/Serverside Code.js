export class StyleField {
    label: string;
    className: string;
}

export class ExitIntentPopupWithEmailCapture implements CampaignTemplateComponent {

    @title("Background Image URL")
    imageUrl: string = "https://n8tactical.com/wp-content/uploads/2020/02/holster-finder-background.jpg";

    header: string = "Header Text";

    @subtitle("Optional text field")
    subheader: string = "Subheader Text";

    @title("CTA Text")
    ctaText: string = "Call To Action";

    @title("Opt-Out Text")
    @subtitle("Clicking this text closes the pop-up.")
    optOutText: string = "No Thanks";

    @title("Confirmation Screen Header")
    @subtitle("Text appears upon successful email submission. Click CTA to preview.")
    confirmationHeader: string = "Confirmation Header Text";

    @title("Confirmation Screen Subheader")
    @subtitle("Optional text field")
    confirmationSubheader: string = "Confirmation Subheader Text";

    run(context: CampaignComponentContext) {
        return {};
    }

}