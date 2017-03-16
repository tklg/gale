import React from 'react';
import TagsInput from 'react-tagsinput'
import Autosuggest from 'react-autosuggest';
import SubmitCancel from './SubmitCancel.jsx';

export default class ImageEditor extends React.Component {
	constructor() {
		super();
		this.state = {
			tags: [],
			title: ''
		};
	}
	componentDidMount() {
		console.log(this.props.items);
		this.setState({
			title: this.props.items[0].title,
			tags: this.props.items[0].tags ? this.props.items[0].tags : []
		})
		if (this.props.items[0].title.includes(',')) {
			var possible = this.props.items[0].title.substring(0, this.props.items[0].title.lastIndexOf('.'));
			this.setState({
				tags: possible.split(',')
			})
		}
	}
	handleChange(tags) {
	    this.setState({tags})
	}
	setFileTitle(e) {
		this.setState({
			title: e.target.value
		})
	}
	submitFile(file) {
		this.props.submit(file);
		this.setState({
			tags: [],
			title: (this.props.items[0] || {}).title || ''
		})
	}
	render() {
		function autoSuggest({addTag, ...props}) {
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
		// https://github.com/olahol/react-tagsinput#demo
		// https://github.com/moroshko/react-autosuggest

		var file = {
			id: (this.props.items[0] || {})._id,
			title: this.state.title,
			localSrc: (this.props.items[0] || {}).src || '',
			tags: this.state.tags
		};
		return (
			<section className="editor">
				<div className="preview">
					<img src={(this.props.items[0] || {}).src || ''} />
				</div>
				<section className="controls">
					<section className="uploading" data-active={this.props.isDisabled}></section>
					<div className="input-row">
						<label htmlFor="editor-item-name">Title</label><input placeholder="Enter a title" className="input-plain" id="editor-item-name" type="text" value={this.state.title} onChange={this.setFileTitle.bind(this)} />
					</div>
					<div className="input-row">
						<label>Tags</label>
						<TagsInput 
								   value={this.state.tags} 
								   onChange={this.handleChange.bind(this)} 
								   renderInput={autoSuggest.bind(this)} />
					</div>
					<SubmitCancel cancel={this.props.close} submit={() => this.submitFile.bind(this)(file)} items={this.props.items} />
				</section>
			</section>
		);
	}
}