import { RecommendationsConfig, recommend } from "recs";

export class DiscussionPostsTemplate implements CampaignTemplateComponent {

    @title("Number of Webinars")
    maxWebinars: 1 | 2 | 3 = 1;

    @title(" ")
    recsConfig: RecommendationsConfig = new RecommendationsConfig()
        .restrictItemType("Webinars")
        .restrictMaxResults(this.maxWebinars);

    run(context: CampaignComponentContext) {
        this.recsConfig.maxResults = this.maxWebinars;

        return {
            itemType: this.recsConfig.itemType,
            webinars: recommend(context, this.recsConfig)
        };
    }

}