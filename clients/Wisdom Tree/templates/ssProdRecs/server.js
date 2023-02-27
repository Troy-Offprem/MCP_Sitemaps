import { RecommendationsConfig, recommend } from "recs";

export class EinsteinProductRecsTemplate implements CampaignTemplateComponent {

    /**
     * Business-User Controls
     */

    @title("Number of Recs")
    maximumNumberOfProducts: 2 | 4 | 6 | 8 | 10 | 12 = 4;

    @title(" ")
    recsConfig: RecommendationsConfig = new RecommendationsConfig()
        .restrictItemType("Product")
        .restrictMaxResults(this.maximumNumberOfProducts);

    run(context: CampaignComponentContext) {
        this.recsConfig.maxResults = this.maximumNumberOfProducts;

        return {
            itemType: this.recsConfig.itemType,
            precs_new: recommend(context, this.recsConfig)
        };
    }

}