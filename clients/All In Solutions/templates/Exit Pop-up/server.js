export class StyleField {
    label: string;
    className: string;
}

export class ExitIntentPopupTemplate implements CampaignTemplateComponent {

    @header("Pop-Up Type")

    lightbox: boolean = true;

    @title("Background Image URL")
    imageUrl: string = "https://image.mail.allinsolutions.com/lib/fe31117371640479751278/m/1/331fb043-f025-4352-9a0d-c8e8a9628cb1.jpeg";

    @subtitle("Define header and subheader text styling.")
    @options([
        { label: "Light on Dark", className: "evg-light-on-dark" },
        { label: "Dark on Light", className: "evg-dark-on-light" }
    ])
    style: StyleField = { label: "Dark on Light", className: "evg-dark-on-light" };

    @richText(true)
    header: string = "Header Text";

    @subtitle("Optional rich text field")
    @richText(true)
    subheader: string = "Subheader Text";

    @subtitle("Optional rich text field")
    @richText(true)
    subheader2: string = "Subheader2 Text";


    @title("CTA Location Name")
    ctaText: string = "Center Name";

    @title("CTA Destination URL")
    @subtitle("Requires full URL string including https://")
    ctaUrl: string = "https://www.allinsolutions.com/";

    run(context: CampaignComponentContext) {
        return {};
    }

}
