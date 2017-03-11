import React from 'react';
import ReactDOM from 'react-dom';

import Viewport from 'views/Viewport.jsx';

const electron = require('electron');
const remote = electron.remote;
const electronWindow = remote.getCurrentWindow();

// https://github.com/louischatriot/nedb
ReactDOM.render(
	<Viewport window={electronWindow} />,
	document.getElementById('react-root')
);
