import React from 'react';
import GalleryPanel from '../components/GalleryPanel.jsx';

export default class Gallery extends React.Component {
	constructor() {
		super();
		this.state = {
			viewMode: 'panel',
			width: 0,
			height: 0,
			items: [
				{
					'id': '',
					'src': "https://placehold.it/200x200/333/fff",
					'title': "test1",
					'tags': [{
						name: 'test'
					}],
					'star': false
				},
				{
					'id': '',
					'src': "https://placehold.it/200x200/333/fff",
					'title': "test2",
					'tags': [],
					'star': false
				},
				{
					'id': '',
					'src': "https://placehold.it/200x200/333/fff",
					'title': "test3",
					'tags': [],
					'star': false
				},
				{
					'id': '',
					'src': "https://placehold.it/200x200/333/fff",
					'title': "test4",
					'tags': [],
					'star': false
				}
			]
		}
		this.handleWidth = 100;
		this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
	}
	componentDidMount() {
		this.updateWindowDimensions();
		window.addEventListener('resize', this.updateWindowDimensions.bind(this));
	}
	componentWillUnmount() {
		window.removeEventListener('resize', this.updateWindowDimensions.bind(this));
	}
	updateWindowDimensions() {
		this.setState({ width: this.refs.container.offsetWidth, height: this.refs.container.offsetHeight });
	}
	loadContent() {

	}
	render() {
		console.log(this.state.width);
		var itemsPerRow = Math.floor(this.state.width / 220) || 1;
		var splitItems = [];
		console.log("Placing " + itemsPerRow + " items per row");
		for (var i = 0; i < this.state.items.length; i += itemsPerRow) {
			splitItems.push(this.state.items.slice(i, i + itemsPerRow));
		}
		if (splitItems[splitItems.length - 1].length != itemsPerRow && this.state.viewMode == 'panel') {
			var l = splitItems[splitItems.length - 1].length;
			for (var j = 0; j < itemsPerRow - l; j++) {
				splitItems[splitItems.length - 1].push({placeholder:true});
			}
		}
		console.log(splitItems);
		if (this.state.viewMode == 'panel') {
			return (
				<div className="gallery" ref="container">
					{
						splitItems.map((x, i) => {
							return (
								<div key={i} className="gallery-row">
									{
										x.map((y, j) => {
											if (y.placeholder) return <GalleryPanel key={i + j} viewMode={this.state.viewMode} isPlaceholder />
											return <GalleryPanel key={i + j} viewMode={this.state.viewMode} flexMode={x.length} title={y.title} tags={y.tags}>{y.src}</GalleryPanel>
										})
									}
								</div>
							);
						})
					}
				</div>
			);
		} else {
			return (
				<div className="gallery" ref="container">
					<div className="gallery-row">
						{
							this.state.items.map((x, i) => <GalleryPanel key={i} viewMode={this.state.viewMode} flexMode="no-flex" title={x.title} tags={x.tags}>{x.src}</GalleryPanel>)
						}
					</div>
				</div>
			);
		}
	}
}
