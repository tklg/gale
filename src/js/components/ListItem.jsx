import React from 'react';
import ReactDOM from 'react-dom';

export default class ListItem extends React.Component {
	constructor() {
		super();
		this.state = {
			active: false,
			value: null
		};
	}
	render() {
		return (
			<li data-active={this.state.active}
				onClick={() => this.props.onClick()}>
				{this.props.children}
			</li>
		);
	}
}
