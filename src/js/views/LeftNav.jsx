import React from 'react';
import ReactDOM from 'react-dom';

import ListItem from '../components/ListItem.jsx';

export default class LeftNav extends React.Component {
	constructor() {
		super();
		this.state = {
			folders: [
				{
					'onClick': "",
					'folderName': "test"
				},
				{
					'onClick': "",
					'folderName': "test"
				},
				{
					'onClick': "",
					'folderName': "test"
				},
				{
					'onClick': "",
					'folderName': "test"
				}
			]
		}
	}
	loadContent() {

	}
	render() {
		return (
			<nav className="nav-v">
				<ul className="folders-nav">
					{
						this.state.folders.map((x, i) => {
							return <ListItem key={i} onClick={x.onClick}>{x.folderName+' '+i}</ListItem>
						})
					}
				</ul>
			</nav>
		);
	}
}
