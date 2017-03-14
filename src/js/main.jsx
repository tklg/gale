import electron from 'electron';
import React from 'react';
import ReactDOM from 'react-dom';

import Viewport from 'views/Viewport.jsx';

const electronWindow = electron.remote.getCurrentWindow();

// https://github.com/louischatriot/nedb
ReactDOM.render(
	<Viewport window={electronWindow} />,
	document.getElementById('react-root')
);
