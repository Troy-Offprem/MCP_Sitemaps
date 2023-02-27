import { RecommendationsConfig, recommend } from "recs";

export class EinsteinContentRecsTemplate implements CampaignTemplateComponent {


    @title("Header")
    header: string = "Title Text";

    run(context:CampaignComponentContext) {
        

        return {
            
        }
    }

}
