import React from 'react';

import LeftNav from '../views/LeftNav.jsx';
import Gallery from '../views/Gallery.jsx';
import WindowFrame from '../components/WindowFrame.jsx';

export default class Viewport extends React.Component {
	render() {
		return (
			<div>
				<WindowFrame window={this.props.window} />
				<main className="viewport">
					<LeftNav />
					<Gallery />
				</main>
			</div>
		);
	}
}
