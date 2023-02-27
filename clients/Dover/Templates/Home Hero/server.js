export class StyleField {
    label: string;
    className: string;
}

export class BannerWithCTATemplate implements CampaignTemplateComponent {

    @title("Background Image URL")
    @subtitle("Replace the placeholder image URL with the image URL for your background image.")
    imageURL: string = "https://cdn.evergage.com/evergage-content/nto/nto_hero_banner_bike.jpg";

    @title("CTA Text")
    @subtitle("If you do not want a call-to-action, simply remove this text.")
    ctaText: string = "Call To Action";

    @title("Horizontal Position")
    @subtitle("CTA display position on X axis.")
    @options([
        { label: "Left", className: "is-align-left" },
        { label: "Center", className: "is-align-center" },
        { label: "Right", className: "is-align-right" }
    ])
    xPosition: StyleField = { label: "Center", className: "is-align-center" };
    
    @title("Vertical Position")
    @subtitle("CTA display position on Y axis.")
    @options([
        { label: "Top", className: "is-align-top" },
        { label: "Middle", className: "is-align-middle" },
        { label: "Bottom", className: "is-align-bottom" }
    ])
    yPosition: StyleField = { label: "Bottom", className: "is-align-bottom" };

    @title("CTA Destination URL")
    @subtitle("Requires full URL string including https://")
    ctaUrl: string = "https://www.doverfcu.com/accounts/personal-accounts/kasasa";

    run(context: CampaignComponentContext) {
        return {};
    }

}
