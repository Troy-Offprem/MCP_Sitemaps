export class StyleField {
	label: string;
	className: string;
}

export class ExitIntentPopupWithEmailCapture implements CampaignTemplateComponent {
	@header('Pop-Up Type')
	lightbox: boolean = true;

	@title('Image URL')
	imageUrl: string = 'https://image.mail.allinsolutions.com/lib/fe31117371640479751278/m/1/331fb043-f025-4352-9a0d-c8e8a9628cb1.jpeg';

	@subtitle('Define header and subheader text styling.')
	@options([
		{ label: 'Light on Dark', className: 'evg-light-on-dark' },
		{ label: 'Dark on Light', className: 'evg-dark-on-light' }
	])
	style: StyleField = { label: 'Light on Dark', className: 'evg-light-on-dark' };

	@richText(true)
	header: string = 'Header Text';

	@subtitle('Optional text field')
	@richText(true)
	subheader: string = 'Subheader Text';

	@subtitle('Optional rich text field')
	@richText(true)
	subheader2: string = 'Subheader2 Text';

	@title('CTA Text')
	ctaText: string = 'Call To Action';

	@title('Opt-Out Text')
	@subtitle('Clicking this text closes the pop-up.')
	optOutText: string = 'No Thanks';

	@title('Confirmation Screen Header')
	@subtitle('Text appears upon successful email submission. Click CTA to preview.')
	confirmationHeader: string = 'Confirmation Header Text';

	@title('Confirmation Screen Subheader')
	@subtitle('Optional text field')
	confirmationSubheader: string = 'Confirmation Subheader Text';

	run(context: CampaignComponentContext) {
		return {};
	}
}
