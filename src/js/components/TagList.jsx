import React from 'react';

export default class TagList extends React.Component {
	render() {
		return (
			<div className="tags" title={this.props.tags.toString()}>
				{
					this.props.tags.map((x, i) => {
						return <span key={i} className="tag">{x}</span>
					})
				}
			</div>
		);
	}
}