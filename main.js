const electron = require('electron');
const Datastore = require('nedb');
const fs = require('fs-extra');
//const mkdirp = require('mkdirp');
const clevernails = require('clevernails');
const sharp = require('sharp');
// Module to control application life.
const app = electron.app;
const ipc = electron.ipcMain;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;
const {requireTaskPool} = require('electron-remote');
const copy = requireTaskPool(require.resolve('./copyfile'));

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let wm = new WindowManager();


function createMainWindow () {
  // Create the browser window.
	var small = [300, 150],
	    medium = [300, 450],
	    large = [900, 750];
    var mainWindow = wm.createWindow('MAIN', {
	    width: large[0],
	    height: large[1],
	    frame: false,
	    alwaysOnTop: false,
	    autoHideMenuBar: true,
	    resizable: true,
	    minWidth: 500,
	    useContentSize: true
    });

    // and load the index.html of the app.
    mainWindow.loadURL(`file://${__dirname}/public/built/index.html`);


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

const db = {
	files: new Datastore({
		filename: app.getPath('pictures') + '/.gale_storage/db/files.db',
		autoload: true
	}),
	tags: new Datastore({
		filename: app.getPath('pictures') + '/.gale_storage/db/tags.db',
		autoload: true
	}),
	folders: new Datastore({
		filename: app.getPath('pictures') + '/.gale_storage/db/folders.db',
		autoload: true
	})
}

ipc.on('handshake', (event, opts) => {
	event.sender.send('handshake', 'hello from background');
});
ipc.on('db.files.insert', (e, data) => {
	console.log('db.files.insert');
	var doc = data.data;
	var _nonce = data._nonce;
	db.files.insert(doc, function(err, newDoc) {
		e.sender.send('result', {
			_nonce: _nonce,
			data: newDoc
		});
	});
});
ipc.on('db.files.find', (e, data) => {
	console.log('db.files.find');
	var doc = data.data;
	var _nonce = data._nonce;
	db.files.find(doc).sort({date: 1}).skip(data.offset || 0).limit(data.limit || 50).exec(function(err, docs) {
		e.sender.send('result', {
			_nonce: _nonce,
			data: docs
		});
	});
});
ipc.on('db.files.update', (e, data) => {
	console.log('db.files.update');
	var doc = data.data[0];
	var newDoc = data.data[1];
	var picsDir = app.getPath('pictures').replace(/\\/g, '/') + '/.gale_storage'; // ?????
	if (newDoc['$set']) {
		if (newDoc['$set'].src) newDoc['$set'].src = picsDir + "/" + newDoc['$set'].src;
		if (newDoc['$set'].thumb) newDoc['$set'].thumb = picsDir + "/" + newDoc['$set'].thumb;
	}
	var opts = data.data[2] || {};
	var _nonce = data._nonce;
	db.files.update(doc, newDoc, opts, function(err, num) {
		e.sender.send('result', {
			_nonce: _nonce,
			data: num
		});
	});
});
ipc.on('db.files.remove', (e, data) => {
	console.log('db.files.remove');
	var doc = data.data;
	var opts = data.opts || {};
	var _nonce = data._nonce;
	db.files.remove(doc, opts, function(err, num) {
		e.sender.send('result', {
			_nonce: _nonce,
			data: num
		});
	});
});
ipc.on('db.folders.insert', (e, data) => {
	console.log('db.folders.insert');
	var doc = data.data;
	var _nonce = data._nonce;
	db.folders.insert(doc, function(err, newDoc) {
		e.sender.send('result', {
			_nonce: _nonce,
			data: newDoc
		});
	});
});
ipc.on('db.folders.find', (e, data) => {
	console.log('db.folders.find');
	var doc = data.data;
	var _nonce = data._nonce;
	db.folders.find(doc).sort({title: 1}).skip(data.offset || 0).limit(data.limit || 50).exec(function(err, docs) {
		e.sender.send('result', {
			_nonce: _nonce,
			data: docs
		});
	});
});
ipc.on('db.folders.remove', (e, data) => {
	console.log('db.folders.remove');
	var doc = data.data;
	var opts = data.opts || {};
	var _nonce = data._nonce;
	db.folders.remove(doc, opts, function(err, num) {
		e.sender.send('result', {
			_nonce: _nonce,
			data: num
		});
	});
});
ipc.on('db.tags.insert', (e, data) => {
	console.log('db.tags.insert');
	var doc = data.data;
	var _nonce = data._nonce;
	db.tags.insert(doc, function(err, newDoc) {
		e.sender.send('result', {
			_nonce: _nonce,
			data: newDoc
		});
	});
});
ipc.on('db.tags.find', (e, data) => {
	console.log('db.tags.find');
	var doc = data.data;
	var _nonce = data._nonce;
	db.tags.find(doc).sort({title: 1}).skip(data.offset || 0).limit(data.limit || 50).exec(function(err, docs) {
		e.sender.send('result', {
			_nonce: _nonce,
			data: docs
		});
	});
});

ipc.on('files.push', (e, data) => {
	console.log('files.push');
	var src = data.data.src;
	var picsDir = app.getPath('pictures').replace(/\\/g, '/') + '/.gale_storage';
	var path = picsDir + "/" + data.data.path;
	var dirPath = path.substring(0, path.lastIndexOf('/'));
	var fName = path.substring(path.lastIndexOf('/') + 1, path.lastIndexOf('.'));
	var fExt = path.substr(path.lastIndexOf('.') + 1);
	var _nonce = data._nonce;
	var cbc = false;
	//var output = dirPath + "/" + fName + "_thumb." + fExt;
	var clvnopts = {
		input: src,
		output: dirPath + "/" + fName + "_thumb." + fExt,
		size: [300, 300]
	}
	fs.mkdirp(dirPath, function(err) {
		console.log("start");
		copy(src, path, clvnopts, dirPath, fName, fExt)
			.then(res => {
				console.log("done");
				console.log(res);
				resp(res, false)
			});
		/*fs.copy(src, path, err => {
			if (err) resp(err, true);
			else {
				clevernails.process(clvnopts, function(err, res) {
				if (err) {
					//var output = dirPath + "/" + fName + "_thumb." + fExt;
					sharp(src)
						 .resize(300, 300)
						 .toFile(clvnopts.output, err => {
						 	resp(clvnopts.output, false)
						 });
				}
				else resp(path, false);
			});
			}
		})*/
	})
	function resp(err, isErr) {
		if (!cbc) {
			if (isErr) {
				e.sender.send('result', {
					_nonce: _nonce,
					error: err
				});
			} else {
				e.sender.send('result', {
					_nonce: _nonce,
					data: err
				});
			}
			cbc = true;
		}
	}
});
ipc.on('files.delete', (e, data) => {
	console.log('files.delete');
	var _nonce = data._nonce;
	var src = data.data.src;
	var fExt = src.substr(src.lastIndexOf('.') + 1);
	var thumb = src.substring(0, src.lastIndexOf('.')) + '_thumb.' + fExt;
	fs.unlink(src, (err) => {
		if (err) {
			e.sender.send('result', {
				_nonce: _nonce,
				data: err
			});
			return;
		}
		fs.unlink(thumb, (err) => {
			e.sender.send('result', {
				_nonce: _nonce,
				data: err
			});
		})
	})
});