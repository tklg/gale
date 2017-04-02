import React from 'react';
import TagsInput from 'react-tagsinput'
import Autosuggest from 'react-autosuggest';
import Icon from './Icon.jsx';

export default class Search extends React.Component {
	constructor() {
		super();
		this.state = {
			active: null,
			inputValue: ''
		}
		this.getInput = this.getInput.bind(this);
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
	handleChange(tags) {
		console.log(tags);
		this.props.handleSearchInput(tags);
	}
	autoSuggest({addTag, ...props}) {
		const handleOnChange = (e, {newValue, method}) => {
	    	if (method === 'enter') {
	        	e.preventDefault()
	    	} else {
	    		props.onChange(e)
	    	}
		}
		const inputValue = (props.value && props.value.trim().toLowerCase()) || ''
		const inputLength = inputValue.length
		let suggestions = this.props.tags.filter(tag => {
	    	return tag.title.toLowerCase().slice(0, inputLength) === inputValue
		})
		//console.log(inputValue);
		//console.log(suggestions);
		return (
		    <Autosuggest
			    ref={props.ref}
			    suggestions={suggestions}
			    shouldRenderSuggestions={(value) => value && value.trim().length > 0}
			    getSuggestionValue={(suggestion) => suggestion.title}
			    renderSuggestion={(suggestion) => <span>{suggestion.title}</span>}
			    inputProps={{...props, onChange: handleOnChange}}
			    onSuggestionSelected={(e, {suggestion}) => {
			    	addTag(suggestion.title)
			    }}
			    onSuggestionsClearRequested={() => {}}
			    onSuggestionsFetchRequested={() => {}}
		    />
		)
	}
	getInput() {
		return <TagsInput 
					value={this.props.searchTags} 
					onChange={this.handleChange.bind(this)} 
					renderInput={this.autoSuggest.bind(this)}
					addKeys={[9,13,188]}
					onlyUnique={true} />
	}
	render() {
		return (
			<div className="search-container" data-active={this.props.searchActive}>
				<Icon onClick={this.state.active ? this.clearInput.bind(this) : null}>{this.state.active ? 'close-circle' : 'magnify'}</Icon>
				{false && <input ref="search_input" type="text" id="search" placeholder="Search" value={this.state.inputValue} onChange={this.updateInputValue.bind(this)} />}
				{this.getInput()}
			</div>
		);
	}
}
