const electron = require('electron');
// Module to control application life.
const app = electron.app;
const ipc = electron.ipcMain;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let wm = new WindowManager();


function createMainWindow () {
  // Create the browser window.
	var small = [300, 150],
	    medium = [300, 450],
	    large = [900, 450];
    var mainWindow = wm.createWindow('MAIN', {
	    width: large[0],
	    height: large[1],
	    // frame: false,
	    alwaysOnTop: false,
	    autoHideMenuBar: true,
	    resizable: true,
	    minWidth: 300,
	    minHeight: 150
    });

    // and load the index.html of the app.
    mainWindow.loadURL(`file://${__dirname}/public/built/index.html`);
	require('electron-react-devtools').inject();


  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    wm.removeMainWindow();
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createMainWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (wm.getMainWindow() === null) {
    createMainWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

ipc.on('background', (event, opts) => {
	//console.log(opts);
	event.sender.send('background', 'hello from background');
});

function WindowManager() {
	var windows = [];
	this.createWindow = function(name, opts) {
		windows.push(new Window(name, opts));
		return windows[windows.length - 1].win;
	}
	this.getWindow = function(name) {
		for (var i = 0; i < windows.length; i++) {
			if (windows[i].name == name) return windows[i].win;
		}
		return null;
	}
	this.updateWindow = function(name, opts) {

	}
	this.getMain = function() {
		return windows[0];
	}
	this.getMainWindow = function() {
		return windows[0].win;
	}
	this.removeMainWindow = function() {
		// this would close all sub windows too
		windows = [];
	}
}
function Window(name, opts) {
	this.name = name;
	this.win = new BrowserWindow(opts);
}