import { RecommendationsConfig, recommend } from "recs";

export class EinsteinProductRecsTemplate implements CampaignTemplateComponent {

    /**
     * Developer Controls
     */

    maximumNumberOfProducts: 2 | 3 | 4 | 5 | 6 | 8 = 4;

    @hidden(true)
    maxRatingBound: number = 5;

    /**
     * Business-User Controls
     */

    @title(" ")
    recsConfig: RecommendationsConfig = new RecommendationsConfig()
        .restrictItemType("Product")
        .restrictMaxResults(this.maximumNumberOfProducts);

    @header("Recommendation Display Attributes")

    @title("Show product on sale")
    onSaleVisibility: boolean = false;

    @title("Show product price")
    priceVisibility: boolean = true;

    run(context: CampaignComponentContext) {
        this.recsConfig.maxResults = this.maximumNumberOfProducts;

        return {
            itemType: this.recsConfig.itemType,
            products: recommend(context, this.recsConfig)
        };
    }
}
