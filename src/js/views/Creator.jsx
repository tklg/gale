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
			<section className="creator" data-active={(this.props.items && this.props.items.length) || null}>
				 <LeftNav header="Upload queue" footers={footerButtons} items={this.props.items} />
				 <ImageEditor close={this.props.close} submit={this.props.submit} items={this.props.items} />
			</section>
		);
	}
}
