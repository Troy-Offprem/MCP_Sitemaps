import { RecommendationsConfig, recommend } from "recs";

export class EinsteinProductRecsTemplate implements CampaignTemplateComponent {

    /**
     * Developer Controls
     */


    maximumNumberOfProducts: 2 | 4 | 6 | 8 | 12 = 6;

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

    @title('On sale')
    onSaleVisibility = false

    @title('Show Price')
    priceVisibility = true

    run(context: CampaignComponentContext) {
        this.recsConfig.maxResults = this.maximumNumberOfProducts;

        return {
            itemType: this.recsConfig.itemType,
            products: recommend(context, this.recsConfig)
        };
    }

}
