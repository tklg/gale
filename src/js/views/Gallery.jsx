import React from 'react';
import GalleryPanel from '../components/GalleryPanel.jsx';
import Infinite from 'react-infinite';

export default class Gallery extends React.Component {
	constructor() {
		super();
		this.state = {
			viewMode: 'grid',
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
			itemsPerPage: (this.state.width * this.state.height) / (250 * (this.state.viewMode == 'grid' ? 220 : this.state.width))
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
	getSplitItems() {
		var splitItems = [];
		if (this.props.files.length) {
			var itemsPerRow = Math.floor(this.state.width / 220) || 1;
			for (var i = 0; i < this.props.files.length; i += itemsPerRow) {
				splitItems.push(this.props.files.slice(i, i + itemsPerRow));
			}
			if (splitItems[splitItems.length - 1].length != itemsPerRow && this.state.viewMode == 'grid') {
				var l = splitItems[splitItems.length - 1].length;
				for (var j = 0; j < itemsPerRow - l; j++) {
					splitItems[splitItems.length - 1].push({placeholder:true});
				}
			}
		}
		return splitItems;
	}
	render() {
		var splitItems = this.getSplitItems.bind(this)();
		var infiniteLoadBeginEdgeOffset = 0;
		if (this.state.viewMode == 'grid') {
			return (
				<Infinite containerHeight={this.state.height} elementHeight={250} className="gallery" ref="container"
						  infiniteLoadBeginEdgeOffset={infiniteLoadBeginEdgeOffset}
						  onInfiniteLoad={this.loadMoreContent.bind(this)}
						  loadingSpinnerDelegate={this.getSpinner()}
						  preloadAdditionalHeight={Infinite.containerHeightScaleFactor(2)}
						  isInfiniteLoading={this.state.isInfiniteLoading} >
					{
						splitItems.map((x, i) => {
							return (
								<div key={i} className={"gallery-row "+this.state.viewMode} >
									{
										x.map((y, j) => {
											if (y.placeholder) return <GalleryPanel key={i + j} viewMode={this.state.viewMode} isPlaceholder />
											return <GalleryPanel key={i + j} onClick={() => this.props.onItemClick(y)} flexMode={x.length} title={y.title} tags={y.tags}>{y.src}</GalleryPanel>
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
				<Infinite containerHeight={this.state.height} elementHeight={250} className="gallery" ref="container"
						  infiniteLoadBeginEdgeOffset={infiniteLoadBeginEdgeOffset}
						  onInfiniteLoad={this.loadMoreContent.bind(this)}
						  loadingSpinnerDelegate={this.getSpinner()}
						  preloadAdditionalHeight={Infinite.containerHeightScaleFactor(2)}
						  isInfiniteLoading={this.state.isInfiniteLoading} >
					{
						this.props.files.map((x, i) => <div className={"gallery-row "+this.state.viewMode}><GalleryPanel key={i} onClick={() => this.props.onItemClick(x)} flexMode="no-flex" title={x.title} tags={x.tags}>{x.src}</GalleryPanel></div>)
					}
				</Infinite>
			);
		}
	}
}
