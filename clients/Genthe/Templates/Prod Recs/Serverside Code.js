import { RecommendationsConfig, recommend } from "recs";

export class EinsteinProductRecsTemplate implements CampaignTemplateComponent {

    /**
     * Business-User Controls
     */

    maximumNumberOfProducts: 2 | 3 | 4 | 5 | 6 = 5;
    
    @title("Genthe Product Recommendations Configuration")
    recsConfig: RecommendationsConfig = new RecommendationsConfig()
        .restrictItemType("Product")
        .restrictMaxResults(this.maximumNumberOfProducts);

    @header("Recommendation Display Attributes")

    @title("Show product pricing")
    pricingVisibility: boolean = true;

    @title("Show product body style")
    bodyStyleVisibility: boolean = true;

    @title("Show product fuel economy")
    fuelEconomyVisibility: boolean = false;

    @title("Show product exterior color")
    exteriorColorVisibility: boolean = false;

    @title("Show product engine")
    engineVisibility: boolean = true;

    @title("Show product drivetrain")
    drivetrainVisibility: boolean = false;

    run(context: CampaignComponentContext) {
        this.recsConfig.maxResults = this.maximumNumberOfProducts;
        return {
            itemType: this.recsConfig.itemType,
            maxResults: 3,
            products: recommend(context, this.recsConfig)
        };
    }

}
