import React from 'react';
import Icon from './Icon.jsx';

export default class SubmitCancel extends React.Component {
	render() {
		return (
			<nav className="submit-cancel">
				<button className="btn btn-error" onClick={this.props.cancel}><Icon>cancel</Icon>Cancel</button>
				<button className="btn btn-success" onClick={this.props.submit}><Icon>save</Icon>{(this.props.items || []).length > 1 ? 'Next' : 'Save'}</button>
			</nav>
		);
	}
}
