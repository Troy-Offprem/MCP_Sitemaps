export class StyleField {
    label: string;
    className: string;
}

export class ExitIntentPopupWithEmailCapture implements CampaignTemplateComponent {

    @header("Pop-Up Type")

    lightbox: boolean = true;

    @title("Background Image URL")
    imageUrl: string = "https://image.marketing.byebyehouse.com/lib/fe2f11737164047f7c1174/m/1/437d1414-2f6d-42bd-96f5-fcaab6f1aafd.jpeg";

    @subtitle("Define header and subheader text styling.")
    @options([
        { label: "Light on Dark", className: "evg-light-on-dark" },
        { label: "Dark on Light", className: "evg-dark-on-light" }
    ])
    style: StyleField = { label: "Light on Dark", className: "evg-light-on-dark" };

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
