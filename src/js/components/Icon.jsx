import React from 'react';

export default class Icon extends React.Component {
	render() {
		return (
			<i onClick={this.props.onClick} className={'mdi mdi-' + this.props.children}></i>
		);
	}
}
