export class StyleField {
	label: string;
	className: string;
}

export class InfobarWithCTATemplate implements CampaignTemplateComponent {
	@subtitle('Define infobar background & text styling.')
	@options([
		{ label: 'Light on Dark', className: 'evg-light-on-dark' },
		{ label: 'Dark on Light', className: 'evg-dark-on-light' }
	])
	style: StyleField = { label: 'Light on Dark', className: 'evg-light-on-dark' };
<<<<<<< HEAD

=======
	
>>>>>>> d14eae8705c7f9ba142f59f115c38bc5a3887447
	@subtitle('Optional text field')
	messageText: string = 'Infobar Message Text';

	@subtitle('Optional text field')
	messageText2: string = 'Infobar Message Text';

	run(context: CampaignComponentContext) {
		return {};
	}
}
