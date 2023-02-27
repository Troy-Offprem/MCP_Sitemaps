
import { SurveyReference, SurveyReferenceLookup } from "surveys";
export class StyleField {
	label: string;
	className: string;
}

export class ExitIntentPopupTemplate implements CampaignTemplateComponent {
	@header('Pop-Up Type')
	lightbox: boolean = true;

	@subtitle('Define header and subheader text styling.')
	@options([
		{ label: 'Light on Dark', className: 'evg-light-on-dark' },
		{ label: 'Dark on Light', className: 'evg-dark-on-light' }
	])
	style: StyleField = { label: 'Dark on Light', className: 'evg-dark-on-light' };

	@title("Pre-Attribute Message Text")
<<<<<<< HEAD
	@subtitle("Optional text field")
	preAttrMessageText: string = "Message Text";

	@title("User Attribute Default")
	@subtitle("Default text to appear if attribute is blank or null on the user profile")
	userAttrDefault: string = "Default";

	@title("Post-Attribute Message Text")
	@subtitle("Optional text field")
	postAttrMessageText: string = "Additional Message Text";
=======
    @subtitle("Optional text field")
    preAttrMessageText: string = "Message Text";

    @title("User Attribute Default")
    @subtitle("Default text to appear if attribute is blank or null on the user profile")
    userAttrDefault: string = "Default";

    @title("Post-Attribute Message Text")
    @subtitle("Optional text field")
    postAttrMessageText: string = "Additional Message Text";
>>>>>>> d14eae8705c7f9ba142f59f115c38bc5a3887447

	@title("Display Survey")
	surveyVisible = true;

<<<<<<< HEAD
	@title("Survey Selector")
	@lookupOptions(() => new SurveyReferenceLookup())
	surveyReference: SurveyReference;

	run(context: CampaignComponentContext) {
		const survey = context.services.surveys.getSurvey(this.surveyReference.id);
		const firstNameAttribute = context?.user?.attributes?.firstName as Attribute;
		const firstName = firstNameAttribute?.value;
		return {
			userAttr: firstName || this.userAttrDefault,
			survey: survey
		};
	}
=======
    @title("Survey Selector")
    @lookupOptions(() => new SurveyReferenceLookup())
    surveyReference: SurveyReference;

	run(context: CampaignComponentContext) {
        const survey = context.services.surveys.getSurvey(this.surveyReference.id);
        const firstNameAttribute = context?.user?.attributes?.firstName as Attribute;
        const firstName = firstNameAttribute?.value;
        return {
            userAttr: firstName || this.userAttrDefault,
			survey: survey
        };
    }
}
>>>>>>> d14eae8705c7f9ba142f59f115c38bc5a3887447
