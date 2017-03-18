import React from 'react';
import Icon from '../components/Icon.jsx';
import LeftNav from './LeftNav.jsx';
import ImageEditor from '../components/ImageEditor.jsx';

export default class Creator extends React.Component {
	constructor() {
		super();
	}
	render() {
		var footerButtons = [
			{
				content: 'Add more',
				onClick: this.props.onFooterClick
			}
		];
		return (
			<section className="creator" data-active={true || (this.props.items && this.props.items.length) || null}>
				 <LeftNav header={this.props.action == 'new' ? 'Upload queue' : 'Editing queue'} footers={footerButtons} items={this.props.items} />
				 <ImageEditor close={this.props.close}
				 			  submit={this.props.submit}
				 			  items={this.props.items}
				 			  isDisabled={this.props.isUploading}
				 			  tags={this.props.tags} />
			</section>
		);
	}
}
