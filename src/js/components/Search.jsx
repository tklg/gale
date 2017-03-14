import React from 'react';
import Icon from './Icon.jsx';

export default class Search extends React.Component {
	constructor() {
		super();
		this.state = {
			active: null,
			inputValue: ''
		}
	}
	updateInputValue(e) {
	    this.setState({
	    	active: !!e.target.value || null,
	    	inputValue: e.target.value
	    });
	}
	clearInput(e) {
		this.refs.search_input.focus();
		this.setState({
			active: null,
	    	inputValue: ''
	    });
	}
	render() {
		return (
			<div className="search-container" data-active={this.state.active}>
				<Icon onClick={this.state.active ? this.clearInput.bind(this) : null}>{this.state.active ? 'close-circle' : 'magnify'}</Icon>
				<input ref="search_input" type="text" id="search" placeholder="Search" value={this.state.inputValue} onChange={this.updateInputValue.bind(this)} />
			</div>
		);
	}
}
