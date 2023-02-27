import { RecommendationsConfig, recommend } from "recs";

export class EinsteinContentRecsTemplate implements CampaignTemplateComponent {

    /**
     * Developer Controls
     */


    maximumNumberOfItems: 3 = 3;

    /**
     * Business-User Controls
     */

    @title(" ")
    recsConfig: RecommendationsConfig = new RecommendationsConfig()
        .restrictItemType("Article")
        .restrictMaxResults(this.maximumNumberOfItems);

    @header('Recommendation Display Options')

    @title("Show content name")
    nameVisibility: boolean = true;

    @title("Show content description")
    descriptionVisibility: boolean = true;

    run(context:CampaignComponentContext) {
        this.recsConfig.maxResults = this.maximumNumberOfItems;

        return {
            itemType: this.recsConfig.itemType,
            articles: recommend(context, this.recsConfig)
        }
    }

}
