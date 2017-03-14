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
			title: this.props.items[0].title
		})
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

			let suggestions = states().filter((state) => {
		    	return state.name.toLowerCase().slice(0, inputLength) === inputValue
			})

			return (
			    <Autosuggest
				    ref={props.ref}
				    suggestions={suggestions}
				    shouldRenderSuggestions={(value) => value && value.trim().length > 0}
				    getSuggestionValue={(suggestion) => suggestion.name}
				    renderSuggestion={(suggestion) => <span>{suggestion.name}</span>}
				    inputProps={{...props, onChange: handleOnChange}}
				    onSuggestionSelected={(e, {suggestion}) => {
				    	addTag(suggestion.name)
				    }}
				    onSuggestionsClearRequested={() => {}}
				    onSuggestionsFetchRequested={() => {}}
			    />
			)
		}
		// https://github.com/olahol/react-tagsinput#demo
		// https://github.com/moroshko/react-autosuggest

		var file = {
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
					<div className="input-row">
						<label htmlFor="editor-item-name">Title</label><input placeholder="Enter a title" className="input-plain" id="editor-item-name" type="text" value={this.state.title} onChange={this.setFileTitle.bind(this)} />
					</div>
					<div className="input-row">
						<label>Tags</label>
						<TagsInput 
								   value={this.state.tags} 
								   onChange={this.handleChange.bind(this)} 
								   renderInput={autoSuggest} />
					</div>
					<SubmitCancel cancel={this.props.close} submit={() => this.submitFile.bind(this)(file)} items={this.props.items} />
				</section>
			</section>
		);
	}
}

function states () {
  return [
    {abbr: 'AL', name: 'Alabama'},
    {abbr: 'AK', name: 'Alaska'},
    {abbr: 'AZ', name: 'Arizona'},
    {abbr: 'AR', name: 'Arkansas'},
    {abbr: 'CA', name: 'California'},
    {abbr: 'CO', name: 'Colorado'},
    {abbr: 'CT', name: 'Connecticut'},
    {abbr: 'DE', name: 'Delaware'},
    {abbr: 'FL', name: 'Florida'},
    {abbr: 'GA', name: 'Georgia'},
    {abbr: 'HI', name: 'Hawaii'},
    {abbr: 'ID', name: 'Idaho'},
    {abbr: 'IL', name: 'Illinois'},
    {abbr: 'IN', name: 'Indiana'},
    {abbr: 'IA', name: 'Iowa'},
    {abbr: 'KS', name: 'Kansas'},
    {abbr: 'KY', name: 'Kentucky'},
    {abbr: 'LA', name: 'Louisiana'},
    {abbr: 'ME', name: 'Maine'},
    {abbr: 'MD', name: 'Maryland'},
    {abbr: 'MA', name: 'Massachusetts'},
    {abbr: 'MI', name: 'Michigan'},
    {abbr: 'MN', name: 'Minnesota'},
    {abbr: 'MS', name: 'Mississippi'},
    {abbr: 'MO', name: 'Missouri'},
    {abbr: 'MT', name: 'Montana'},
    {abbr: 'NE', name: 'Nebraska'},
    {abbr: 'NV', name: 'Nevada'},
    {abbr: 'NH', name: 'New Hampshire'},
    {abbr: 'NJ', name: 'New Jersey'},
    {abbr: 'NM', name: 'New Mexico'},
    {abbr: 'NY', name: 'New York'},
    {abbr: 'NC', name: 'North Carolina'},
    {abbr: 'ND', name: 'North Dakota'},
    {abbr: 'OH', name: 'Ohio'},
    {abbr: 'OK', name: 'Oklahoma'},
    {abbr: 'OR', name: 'Oregon'},
    {abbr: 'PA', name: 'Pennsylvania'},
    {abbr: 'RI', name: 'Rhode Island'},
    {abbr: 'SC', name: 'South Carolina'},
    {abbr: 'SD', name: 'South Dakota'},
    {abbr: 'TN', name: 'Tennessee'},
    {abbr: 'TX', name: 'Texas'},
    {abbr: 'UT', name: 'Utah'},
    {abbr: 'VT', name: 'Vermont'},
    {abbr: 'VA', name: 'Virginia'},
    {abbr: 'WA', name: 'Washington'},
    {abbr: 'WV', name: 'West Virginia'},
    {abbr: 'WI', name: 'Wisconsin'},
    {abbr: 'WY', name: 'Wyoming'}
  ]
}