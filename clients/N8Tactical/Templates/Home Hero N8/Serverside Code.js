export class StyleField {
    label: string;
    className: string;
}

export class BannerWithCTATemplate implements CampaignTemplateComponent {

    @title("Background Image URL")
    @subtitle("Replace the placeholder image URL with the image URL for your background image.")
    imageURL: string = "https://cdn.evergage.com/evergage-content/nto/nto_hero_banner_bike.jpg";


    run(context: CampaignComponentContext) {
        return {};
    }

}
