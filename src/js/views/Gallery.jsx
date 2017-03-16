import React from 'react';
import GalleryPanel from '../components/GalleryPanel.jsx';
import Infinite from 'react-infinite';

export default class Gallery extends React.Component {
	constructor() {
		super();
		this.state = {
			offset: 0,
			width: window.innerWidth - 260,
			height: window.innerHeight - 50,
			isInfiniteLoading: false
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
		this.setState({
			width: this.refs.container.offsetWidth || window.innerWidth - 260,
			height: this.refs.container.offsetHeight || window.innerHeight - 50,
		});
		this.setState({
			itemsPerPage: (this.state.width * this.state.height) / (250 * (this.props.viewMode == 'grid' ? 220 : this.state.width))
		});
	}
	loadMoreContent() {
		this.setState({
            isInfiniteLoading: true
        });
		console.log("loading more");
		this.props.loadMoreContent(null, null, () => {

			this.setState({
				isInfiniteLoading: false // set after ajax completes
			});
		});

		// load more starting at this.state.offset

	}
	getSpinner() {
		return <div className="spinner" />
	}
	getSplitItems(itemsPerRow) {
		var splitItems = [];
		if (this.props.files.length) {
			for (var i = 0; i < this.props.files.length; i += itemsPerRow) {
				splitItems.push(this.props.files.slice(i, i + itemsPerRow));
			}
			if (splitItems[splitItems.length - 1].length != itemsPerRow && this.props.viewMode == 'grid') {
				var l = splitItems[splitItems.length - 1].length;
				for (var j = 0; j < itemsPerRow - l; j++) {
					splitItems[splitItems.length - 1].push({placeholder:true});
				}
			}
		}
		return splitItems;
	}
	render() {
		var itemsPerRow = Math.floor(this.state.width / 220) || 1;
		var splitItems = this.getSplitItems.bind(this)(itemsPerRow);
		var elemHeight = this.props.viewMode == 'grid' ? 250 : 210;
		var infiniteLoadBeginEdgeOffset = 0;
		if (this.props.viewMode == 'grid') {
			// preloadAdditionalHeight={Infinite.containerHeightScaleFactor(2)}
			return (
				<Infinite containerHeight={this.state.height} elementHeight={elemHeight} className="gallery" ref="container"
						  infiniteLoadBeginEdgeOffset={infiniteLoadBeginEdgeOffset}
						  onInfiniteLoad={this.loadMoreContent.bind(this)}
						  loadingSpinnerDelegate={this.getSpinner()}
						  
						  isInfiniteLoading={this.state.isInfiniteLoading} >
					{
						splitItems.map((x, i) => {
							return (
								<div key={i} className={"gallery-row "+this.props.viewMode} >
									{
										x.map((y, j) => {
											if (y.placeholder) return <GalleryPanel key={i * itemsPerRow + j} viewMode={this.props.viewMode} isPlaceholder />
											return <GalleryPanel key={i * itemsPerRow + j} onClick={() => this.props.onItemClick(i * itemsPerRow + j)} flexMode={x.length} title={y.title} tags={y.tags}>{y.thumb}</GalleryPanel>
										})
									}
								</div>
							);
						})
					}
				</Infinite>
			);
		} else {
			return (
				<Infinite containerHeight={this.state.height} elementHeight={elemHeight} className="gallery" ref="container"
						  infiniteLoadBeginEdgeOffset={infiniteLoadBeginEdgeOffset}
						  onInfiniteLoad={this.loadMoreContent.bind(this)}
						  loadingSpinnerDelegate={this.getSpinner()}
						  
						  isInfiniteLoading={this.state.isInfiniteLoading} >
					{
						this.props.files.map((x, i) => <div key={i} className={"gallery-row "+this.props.viewMode}><GalleryPanel onClick={() => this.props.onItemClick(i)} flexMode="no-flex" title={x.title} tags={x.tags}>{x.thumb}</GalleryPanel></div>)
					}
				</Infinite>
			);
		}
	}
}
