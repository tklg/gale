import React from 'react';

import Infinite from 'react-infinite';
import ListItem from '../components/ListItem.jsx';

export default class LeftNav extends React.Component {
	constructor() {
		super();
		this.state = {
			height: window.innerHeight - 160
		}
		this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
	}
	componentDidMount() {
		this.updateWindowDimensions();
		window.addEventListener('resize', this.updateWindowDimensions);
	}
	componentWillUnmount() {
		window.removeEventListener('resize', this.updateWindowDimensions);
	}
	updateWindowDimensions() {
		this.setState({
			height: this.refs.container.offsetHeight || window.innerHeight - 160,
		});
	}
	render() {
		return (
			<nav className="nav-v">
				<header>
					<h1>{this.props.header} <span className="desc">{this.props.items.length}</span></h1>
				</header>
				<Infinite className="list folders-nav"
						  containerHeight={this.state.height}
						  elementHeight={40}
						  ref="container">
					{
						this.props.items.map((x, i) => {
							return <ListItem key={x._id || i} active={this.props.index == i?"true":null} onClick={() => this.props.onItemClick(i, x._id)}>{x.title}</ListItem>
						})
					}
				</Infinite>
				<footer>
					{
						this.props.footers.map((x, i) => {
							return <button key={i} className="btn btn-stacked" onClick={x.onClick}>{x.content}</button>
						})
					}
				</footer>
			</nav>
		);
	}
}
