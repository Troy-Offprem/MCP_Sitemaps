import { RecommendationsConfig, recommend } from 'recs';

export class EinsteinContentRecsTemplate implements CampaignTemplateComponent {
	/**
	 * Developer Controls
	 */

	@hidden(true)
	maximumNumberOfItems: 2 | 4 | 6 = 4;

	/**
	 * Business-User Controls
	 */
	@richText(true)
	header1: string = 'Header Text';

	@richText(true)
	textBox1: string = 'TextBox Text';

	@richText(true)
	textBox2: string = 'TextBox Text';

	@richText(true)
	textBox3: string = 'TextBox Text';

	@richText(true)
	header2: string = 'Header Text';

	@richText(true)
	textBox4: string = 'TextBox Text';

	@title('Recommendations Block Title')
	header3: string = 'Title Text';

	@title(' ')
	recsConfig: RecommendationsConfig = new RecommendationsConfig().restrictItemType('Blog').restrictMaxResults(this.maximumNumberOfItems);

	@header('Recommendation Display Options')
	@title('Show content name')
	nameVisibility: boolean = true;

	@title('Show content description')
	descriptionVisibility: boolean = true;

	@richText(true)
	header4: string = 'Header Text';

	@richText(true)
	textBox5: string = 'TextBox Text';

	@richText(true)
	textBox6: string = 'TextBox Text';

	@richText(true)
	header5: string = 'Header Text';

	@richText(true)
	textBox7: string = 'TextBox Text';

	@richText(true)
	header6: string = 'Header Text';

	@richText(true)
	textBox8: string = 'TextBox Text';

	run(context: CampaignComponentContext) {
		this.recsConfig.maxResults = this.maximumNumberOfItems;

		return {
			itemType: this.recsConfig.itemType,
			blogs: recommend(context, this.recsConfig)
		};
	}
}
