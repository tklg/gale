import React from 'react';
import FrameButton from '../components/FrameButton.jsx';
import Search from '../components/Search.jsx';

export default class WindowFrame extends React.Component {
	constructor() {
		super();
		this.window = null;
	}
	toggleWindow() {
		if (!this.window.isMaximized()) {
	        this.window.maximize();          
	    } else {
	        this.window.unmaximize();
	    }
	}
	render() {
		this.window = this.props.window;
		return (
			<header className="frame-header" id="windowframe">
				{process.versions.electron && 
					<div className="electron-windowframe">
					<span className="title">{false && this.state.title}</span>
					<div id="drag-handle"></div>
					<FrameButton onClick={this.window.openDevTools} title="Open DevTools" icon="bug"></FrameButton>
				    <FrameButton onClick={this.window.minimize} title="Minimize" icon="window-minimize"></FrameButton>
				    <FrameButton onClick={this.toggleWindow.bind(this)} title="Restore Down" icon="window-maximize"></FrameButton>
				    <FrameButton onClick={this.window.close} title="Close" icon="close"></FrameButton>
				    </div>
				}
				<div className="nav-placeholder"></div>
				<h1 className="folder-name">{this.props.title}</h1>
				<Search/>
			</header>
		);
	}
}