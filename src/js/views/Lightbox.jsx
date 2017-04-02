import React from 'react';
import Icon from '../components/Icon.jsx';
import TagList from '../components/TagList.jsx';

export default class Lightbox extends React.Component {
	constructor() {
		super();
		this.handleKeyPress = this.handleKeyPress.bind(this);
	}
	componentDidMount() {
		window.addEventListener('keydown', this.handleKeyPress);
	}
	componentWillUnmount() {
		window.removeEventListener('keydown', this.handleKeyPress);
	}
	handleKeyPress(e) {
		if (this.props.index == null || this.props.isOverlaid) return;
		e.stopPropagation();
		console.log("[Lightbox]: handling keypress " +e.which+ " ("+ e.key + ")");
		switch (e.key) {
			case 'e':
				this.edit([this.props.items[this.props.index]])
				break;
			case 's':
				this.star([this.props.items[this.props.index]]);
				break;
			case 'Escape':
				this.close();
				break;
			case 'Delete':
				this.remove([this.props.items[this.props.index]])
				break;
			case 'ArrowLeft':
				this.pageLeft();
				break;
			case 'ArrowRight':
				this.pageRight();
				break;
		}
	}
	pageLeft(e) {
		if (e) e.stopPropagation();
		this.props.pageLeft();
	}
	pageRight(e) {
		if (e) e.stopPropagation();
		this.props.pageRight();
	}
	close() {
		this.props.close();
	}
	edit(file) {
		this.props.editFile(file, true);
	}
	remove(file) {
		this.props.deleteFile(file);
	}
	star(file) {
		this.props.starFile(file);
	}
	render() {
		if (this.props.index != null) {
			return (
				<div className="lightbox" 
					 onClick={(e) => this.props.close()}
					 data-active>
					<nav className="header" onClick={(e) => e.stopPropagation()}>
						<h1>{this.props.items[this.props.index].title}</h1>
						<TagList tags={this.props.items[this.props.index].tags.map(x => this.props.tags.find(y => y.title === x))} />
						<button className="btn-icon btn-error" id="btn-delete" onClick={() => this.remove([this.props.items[this.props.index]])}><Icon>delete</Icon></button>
						<button className="btn-icon" id="btn-edit" onClick={() => this.edit.bind(this)([this.props.items[this.props.index]])}><Icon>pencil</Icon></button>
						<button className="btn-icon" id="btn-close" onClick={this.close.bind(this)}><Icon>window-close</Icon></button>
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
