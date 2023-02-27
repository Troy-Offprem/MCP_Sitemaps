export class StyleField {
    label: string;
    className: string;
}

export class BannerWithCTATemplate implements CampaignTemplateComponent {

    @title("Background Image URL")
    @subtitle("Replace the placeholder image URL with the image URL for your background image.")
    imageURL: string = "https://cdn.evergage.com/evergage-content/nto/nto_hero_banner_bike.jpg";

    @title("Link URL")
    @subtitle("This is the URL in which the slide links to")
    linkURL: string = "https://www.google.com";

    @title("Alt Text")
    @subtitle("The alt text for the image")
    altText: string = "Fantastic offers!";

    run(context: CampaignComponentContext) {
        return {};
    }

}