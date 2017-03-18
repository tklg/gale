import React from 'react';

export default class ListItem extends React.Component {
	constructor() {
		super();
		this.state = {
			value: null
		};
	}
	render() {
		return (
			<li data-active={this.props.active}
				onClick={() => this.props.onClick()}>
				{this.props.children}
			</li>
		);
	}
}
