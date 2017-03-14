import React from 'react';
import Icon from '../components/Icon.jsx';
import TagList from '../components/TagList.jsx';

export default class Lightbox extends React.Component {
	render() {
		if (this.props.item) {
			return (
				<div className="lightbox" 
					 onClick={(e) => this.props.close()}
					 data-active>
					<nav onClick={(e) => e.stopPropagation()}>
						<h1>{this.props.item.title}</h1>
						<TagList tags={this.props.item.tags} />
						<button className="btn-icon" id="btn-close" onClick={this.props.close}><Icon>window-close</Icon></button>
					</nav>
					<img onClick={(e) => e.stopPropagation()} src={this.props.item.src} />
				</div>
			);
		} else {
			return (<div className="lightbox"></div>);
		}
	}
}
