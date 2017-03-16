import React from 'react';
import Icon from '../components/Icon.jsx';
import TagList from '../components/TagList.jsx';

export default class Lightbox extends React.Component {
	pageLeft(e) {
		e.stopPropagation();
		this.props.pageLeft();
	}
	pageRight(e) {
		e.stopPropagation();
		this.props.pageRight();
	}
	render() {
		if (this.props.index != null) {
			return (
				<div className="lightbox" 
					 onClick={(e) => this.props.close()}
					 data-active>
					<nav className="header" onClick={(e) => e.stopPropagation()}>
						<h1>{this.props.items[this.props.index].title}</h1>
						<TagList tags={this.props.items[this.props.index].tags} />
						<button className="btn-icon btn-error" id="btn-delete" onClick={() => this.props.deleteFile(this.props.index)}><Icon>delete</Icon></button>
						<button className="btn-icon" id="btn-edit" onClick={() => this.props.editFile([this.props.items[this.props.index]], true)}><Icon>pencil</Icon></button>
						<button className="btn-icon" id="btn-close" onClick={this.props.close}><Icon>window-close</Icon></button>
					</nav>
					<button className="btn-icon" id="btn-page-left" onClick={this.pageLeft.bind(this)}><Icon>chevron-left</Icon></button>
					<button className="btn-icon" id="btn-page-right" onClick={this.pageRight.bind(this)}><Icon>chevron-right</Icon></button>
					<img onClick={(e) => e.stopPropagation()} src={this.props.items[this.props.index].src} />
				</div>
			);
		} else {
			return (<div className="lightbox"></div>);
		}
	}
}
