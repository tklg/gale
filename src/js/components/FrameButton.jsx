import React from 'react';
import Icon from './Icon.jsx';

export default class FrameButton extends React.Component {
	render() {
		return (
			<button className="btn-windowframe" title={this.props.title} onClick={() => this.props.onClick()}>
				<Icon>{this.props.icon}</Icon>
			</button>
		);
	}
}
