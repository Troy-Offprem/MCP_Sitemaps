import { RecommendationsConfig, recommend } from "recs";

export class DiscussionPostsTemplate implements CampaignTemplateComponent {

    @title("Number of Discussion Posts")
    maxQuestions: 2 | 3 | 4 | 5 | 6 = 4;

    @title(" ")
    recsConfig: RecommendationsConfig = new RecommendationsConfig()
        .restrictItemType("DiscussionPosts")
        .restrictMaxResults(this.maxQuestions);

    run(context: CampaignComponentContext) {
        this.recsConfig.maxResults = this.maxQuestions;

        return {
            itemType: this.recsConfig.itemType,
            discussionPosts: recommend(context, this.recsConfig)
        };
    }

}