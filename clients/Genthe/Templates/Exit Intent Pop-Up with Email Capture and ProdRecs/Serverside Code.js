import { RecommendationsConfig, recommend } from "recs";

export class StyleField {
    label: string;
    className: string;
}

export class ExitIntentPopupWithEmailCapture implements CampaignTemplateComponent {

    @title("Background Image URL")
    imageUrl: string = "https://pictures.dealer.com/d/dickgenthechevroletgm/1734/6fdeaa05495997c1dda4ed23f8f5ab17x.jpg?impolicy=downsize&h=160";

    header: string = "BEFORE YOU GO";

    @subtitle("Sign")
    subheader: string = "Sign up for email updates!";

    @title("CTA Text")
    ctaText: string = "SUBSCRIBE";

    @title("Opt-Out Text")
    @subtitle("Clicking this text closes the pop-up.")
    optOutText: string = "Maybe later.";

    @title("Confirmation Screen Header")
    @subtitle("Text appears upon successful email submission. Click CTA to preview.")
    confirmationHeader: string = "Thank you!";

    @title("Product Recommendations Header")
    @subtitle("If no text is provided, product recommendations will not display.")
    confirmationSubheader: string = "Check out these recommendations";

    maximumNumberOfProducts: 2 | 3 | 4 = 2;
    
    @title(" ")
    recsConfig: RecommendationsConfig = new RecommendationsConfig()
        .restrictItemType("Product")
        .restrictMaxResults(this.maximumNumberOfProducts);

    @title("Display pricing")
    pricingVisibility: boolean = true;
    

    run(context: CampaignComponentContext) {
        this.recsConfig.maxResults = this.maximumNumberOfProducts;

        return {
            itemType: this.recsConfig.itemType,
            products: recommend(context, this.recsConfig)
        };
    }
}
