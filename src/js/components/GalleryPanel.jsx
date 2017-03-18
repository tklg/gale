import React from 'react';
import TagList from './TagList.jsx';

export default class GalleryPanel extends React.Component {
	render() {
		return (
			<article className={"gallery-panel" + (this.props.isPlaceholder ? ' placeholder' : '')}
					 onClick={this.props.onClick}
					 data-selected={this.props.selected?true:null}>
				<div className="panel-overlay">
					<h1 title={this.props.title}>{this.props.title}</h1>
					{false && !this.props.isPlaceholder && 
						<TagList tags={this.props.tags} />
					}
				</div>
				<img src={this.props.children} />
			</article>
		);
	}
}
