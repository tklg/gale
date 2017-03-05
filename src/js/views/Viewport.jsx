import React from 'react';
import ReactDOM from 'react-dom';

import LeftNav from '../views/LeftNav.jsx';
import Gallery from '../views/Gallery.jsx';

export default class Viewport extends React.Component {
	render() {
		return (
			<div className="viewport">
				<LeftNav />
				<Gallery />
			</div>
		);
	}
}
