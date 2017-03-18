import React from 'react';
import Icon from './Icon.jsx';

export default class SubmitCancel extends React.Component {
	constructor() {
		super();
		this.state = {
			keyShiftPressed: false
		}
		this.toggleShift = this.toggleShift.bind(this);
		this.handleKeyPress = this.handleKeyPress.bind(this);
	}
	componentDidMount() {
		window.addEventListener('keydown', this.toggleShift);
		window.addEventListener('keyup', this.handleKeyPress);
	}
	componentWillUnmount() {
		window.removeEventListener('keydown', this.toggleShift);
		window.removeEventListener('keyup', this.handleKeyPress);
	}
	toggleShift(e) {
		if (e.key == 'Shift') {
			this.setState({
				keyShiftPressed: true
			})
		}
	}
	handleKeyPress(e) {
		e.stopPropagation();
		console.log("[SubmitCancel]: handling keypress " +e.which+ " ("+ e.key + ")");
		switch (e.key) {
			case 'Enter':
				if (this.state.keyShiftPressed) this.submit();
				break;
			case 'Shift':
				this.setState({
					keyShiftPressed: false
				})
				break;
			case 'Escape':
				this.cancel();
				break;
		}
	}
	cancel() {
		this.props.cancel();
	}
	submit() {
		if (!this.props.isDisabled) {
			this.props.submit();
		}
	}
	render() {
		return (
			<nav className="submit-cancel">
				<button className="btn btn-error" onClick={this.cancel.bind(this)}><Icon>cancel</Icon>Cancel</button>
				<button className="btn btn-success" onClick={this.submit.bind(this)} title="Shift+Enter to submit"><Icon>save</Icon>{(this.props.items || []).length > 1 ? 'Next' : 'Save'}</button>
			</nav>
		);
	}
}
