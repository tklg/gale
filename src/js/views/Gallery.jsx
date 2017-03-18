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
			isInfiniteLoading: false,
			selectionIndex: [-1],
			itemsPerPage: 1,
			itemsPerRow: 1,
			keyShiftPressed: false,
			selDirection: 0
		}
		this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
		this.handleKeyPress = this.handleKeyPress.bind(this);
		this.toggleShift = this.toggleShift.bind(this);
		this.onClick = this.onClick.bind(this);
	}
	componentDidMount() {
		this.updateWindowDimensions();
		window.addEventListener('resize', this.updateWindowDimensions);
		window.addEventListener('keydown', this.handleKeyPress);
		window.addEventListener('keyup', this.toggleShift);
	}
	componentWillUnmount() {
		window.removeEventListener('resize', this.updateWindowDimensions);
		window.removeEventListener('keydown', this.handleKeyPress);
		window.removeEventListener('keyup', this.toggleShift);
	}
	updateWindowDimensions() {
		this.setState({
			width: this.refs.container.offsetWidth || window.innerWidth - 260,
			height: this.refs.container.offsetHeight || window.innerHeight - 50,
		}, () => {
			this.setState({
				itemsPerPage: Math.round((this.state.width * this.state.height) / (250 * (this.props.viewMode == 'grid' ? 220 : this.state.width))) + (Math.floor(this.state.width / 220) || 1),
				itemsPerRow: Math.floor(this.state.width / 220) || 1
			});
		});
	}
	toggleShift(e) {
		if (this.props.isOverlaid) return;
		console.log("[Gallery]: handling keyup " +e.which+ " ("+ e.key + ")");
		if (e.key == 'Shift') {
			this.setState({
				keyShiftPressed: null
			})
		}
	}
	handleKeyPress(e) {
		if (this.props.isOverlaid) return;
		e.stopPropagation();
		console.log("[Gallery]: handling keypress " +e.which+ " ("+ e.key + ")");
		switch (e.key) {
			case 'Escape':
				var sels = [-1];
				this.setState({
					selectionIndex: sels,
					selDirection: 0
				})
				break;
			case 'Shift':
				this.setState({
					keyShiftPressed: true
				})
				break;
			case 'Enter':
				if (this.state.selectionIndex[0] != -1) this.props.onItemClick(this.state.selectionIndex[0])
				break;
			case 'e':
				if (this.state.selectionIndex[0] != -1) {
					var sels = this.props.files.filter((x, i) => this.state.selectionIndex.includes(i));
					this.props.editFile(sels, true);
				}
				break;
			case 's':
				if (this.state.selectionIndex[0] != -1) {
					var sels = this.props.files.filter((x, i) => this.state.selectionIndex.includes(i));
					this.props.starFile(sels);
				}
				break;
			case 'Delete':
				if (this.state.selectionIndex[0] != -1) {
					var sels = this.props.files.filter((x, i) => this.state.selectionIndex.includes(i));
					this.props.deleteFile(sels);
				}
				break;
			case 'ArrowLeft':
				var sels = this.state.selectionIndex;
				if (sels.length == 1) {
					this.setState({
						selDirection: -1
					})
				}
				if (this.state.keyShiftPressed) {
					if (this.state.selDirection == 1) {
						sels.pop();
					} else if (this.state.selDirection == -1) {
						sels.unshift(sels[0] - 1);
					}
				} else if (sels[0] > 0) {
					sels = [sels[0]];
					sels[0] -= 1;
				}
				this.setState({
					selectionIndex: sels
				})
				break;
			case 'ArrowRight':
				var sels = this.state.selectionIndex;
				if (sels.length == 1) {
					this.setState({
						selDirection: 1
					})
				}
				if (this.state.keyShiftPressed) {
					if (this.state.selDirection == 1) {
						sels.push(sels[sels.length - 1] + 1);
					} else if (this.state.selDirection == -1) {
						sels.shift();
					}
				} else if (sels[0] < this.props.files.length - 1) {
					sels = [sels[0]];
					sels[0] += 1;;
				}
				this.setState({
					selectionIndex: sels
				})
				break;
			case 'ArrowUp':
				var sels = this.state.selectionIndex;
				if (sels.length == 1) {
					this.setState({
						selDirection: -1
					})
				}
				if (this.state.keyShiftPressed) {
					if (this.state.selDirection == 1) {
						var cur = sels[0];
						sels.splice(sels.length - this.state.itemsPerRow, this.state.itemsPerRow);
						if (sels.length == 0) sels = [cur];
					} else if (this.state.selDirection == -1) {
						var cur = sels[0] - this.state.itemsPerRow;
						var n = new Array(this.state.itemsPerRow).fill(0).map((x, i) => i + cur);
						sels = n.concat(sels);
					}	
				} else if (sels[0] > this.state.itemsPerRow - 1) {
					sels = [sels[0]];
					sels[0] -= this.state.itemsPerRow;
				}
				this.setState({
					selectionIndex: sels
				})
				break;
			case 'ArrowDown':
				var sels = this.state.selectionIndex;
				if (sels.length == 1) {
					this.setState({
						selDirection: 1
					})
				}
				if (this.state.keyShiftPressed) {
					if (this.state.selDirection == 1) {
						var cur = sels[sels.length - 1];
						var n = new Array(this.state.itemsPerRow).fill(0).map((x, i) => i + cur + 1);
						sels = sels.concat(n);
					} else if (this.state.selDirection == -1) {
						var cur = sels[0];
						sels.splice(0, this.state.itemsPerRow);
						if (sels.length == 0) sels = [cur];
					}
				} else if (sels[0] < this.props.files.length - this.state.itemsPerRow) {
					sels = [sels[0]];
					if (sels[0] == -1) {
						sels[0] += 1;
					} else {
						sels[0] += this.state.itemsPerRow;
					}
				}
				this.setState({
					selectionIndex: sels
				})
				break;
		}
	}
	onClick(index) {
		if (this.state.keyShiftPressed) {
			var sels = this.state.selectionIndex;
			if (!sels.includes(index)) {
				if (sels[0] != -1) sels.push(index);
				else sels = [index];
			} else {
				sels = sels.filter(x => x != index);
				if (sels.length == 0) sels = [-1];
			}
			this.setState({
				selectionIndex: sels
			})
		} else {
			this.props.onItemClick(index);
		}
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
		var itemsPerRow = this.state.itemsPerRow;
		var splitItems = this.getSplitItems.bind(this)(itemsPerRow);
		var elemHeight = this.props.viewMode == 'grid' ? 250 : 210;
		var infiniteLoadBeginEdgeOffset = 0;
		/*this.setState({
			selectionIndex: [-1]
		})*/
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
											return <GalleryPanel key={i * itemsPerRow + j} 
																 selected={this.state.selectionIndex.indexOf(i * itemsPerRow + j) > -1}
																 onClick={() => this.onClick(i * itemsPerRow + j)}
																 flexMode={x.length}
																 title={y.title}
																 tags={y.tags}>{y.thumb}</GalleryPanel>
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
						this.props.files.map((x, i) => <div key={i} className={"gallery-row "+this.props.viewMode}><GalleryPanel selected={this.state.selectionIndex.indexOf(i) > -1} onClick={() => this.onClick(i)} flexMode="no-flex" title={x.title} tags={x.tags}>{x.thumb}</GalleryPanel></div>)
					}
				</Infinite>
			);
		}
	}
}
