import React from 'react';

import LeftNav from './LeftNav.jsx';
import Gallery from './Gallery.jsx';
import WindowFrame from './WindowFrame.jsx';
import Lightbox from './Lightbox.jsx';
import Creator from './Creator.jsx';
import Dragover from './Dragover.jsx';
import Modal from './Modal.jsx';
import SubmitCancel from '../components/SubmitCancel.jsx';
import electron from 'electron';

const ipc = electron.ipcRenderer;
const dialog = electron.remote.dialog;
const nonce = require('nonce')();

export default class Viewport extends React.Component {
	constructor() {
		super();
		this.state = {
			lightboxItem: null,
			creatorItem: [],
			modalContent: null,
			modalValue: 'test',
			files: [],
			activeFolder: -1,
			activeFolderID: '',
			folders: [],
			itemsPerPage: 40,
			currentOffset: 0
		}
	}
	componentDidMount() {
		/*ajax({
			channel: 'db.files.find',
			data: {},
			offset: 0,
			limit: this.state.itemsPerPage,
			success: function(data) {
				this.setState({
					files: data,
					currentOffset: this.state.currentOffset + this.state.itemsPerPage
				});
			}.bind(this),
			error: function(data) {
				console.error(data)
			}.bind(this)
		});*/
		this.openFolder(-1);
		ajax({
			channel: 'db.folders.find',
			data: {},
			offset: 0,
			limit: 30,
			success: function(data) {
				this.setState({
					folders: data,
					activeFolderID: data[0]._id,
					activeFolder: 0
				});
			}.bind(this),
			error: function(data) {
				console.error(data)
			}.bind(this)
		});
	}
	openLightbox(item) {
		this.setState({
			lightboxItem: item
		})
	}
	closeLightbox() {
		this.setState({
			lightboxItem: null
		})
	}
	openCreator(item) {
		this.setState({
			creatorItem: item
		})
	}
	closeCreator() {
		this.setState({
			creatorItem: []
		})
	}
	openFolderModal() {
		this.setState({
			modalContent: {
				header: 'Enter a name for the new folder:',
				content: <input placeholder="Folder name" className="input-plain" type="text" onChange={this.updateModalValue.bind(this)} />,
				footer: <SubmitCancel submit={this.addFolder.bind(this)} cancel={this.closeFolderModal.bind(this)} />
			}
		})
	}
	updateModalValue(e) {
	    this.setState({
	    	modalValue: e.target.value
	    }, x => {
	    	// ffs state y u no update value for input
	    });
	}
	closeFolderModal() {
		this.setState({
			modalContent: null,
			modalValue: ''
		})
	}
	addFolder() {
		if (this.state.modalValue.length > 0) {
			var folders = this.state.folders;
			ajax({
				channel: 'db.folders.insert',
				data: {
					title: this.state.modalValue,
					date: Date.now()
				},
				success: function(data) {
					//console.log(data);
					folders.push(data);
					this.setState({
						folders: folders
					})
				}.bind(this),
				error: function(data) {
					console.error(data)
				}.bind(this)
			})

		}
		this.closeFolderModal();
	}
	openFolder(index, id, cb) {
		var cur = this.state.files;
		if (index != null && !!id) {
			cur = [];
			this.setState({
				currentOffset: 0
			})
		}
		this.setState({
			activeFolder: index || this.state.activeFolder,
			activeFolderID: id || this.state.activeFolderID
		}, () => {
			var data = {
				parent: id || this.state.activeFolderID
			};
			if (index == -1) data = {};
			ajax({
				channel: 'db.files.find',
				data: data,
				offset: this.state.currentOffset,
				limit: this.state.itemsPerPage,
				success: function(data) {
					cur = cur.concat(data);
					this.setState({
						files: cur,
						currentOffset: this.state.currentOffset + this.state.itemsPerPage
					}, () => {
						if (cb) cb();
					});
				}.bind(this),
				error: function(data) {
					console.error(data)
				}.bind(this)
			});
		})
	}
	openFileDialog(dir) {
		var res = dialog.showOpenDialog({
			properties: [dir ? 'openDirectory' : 'openFile', 'multiSelections'],
			filters: [
				{name: 'Image Files', extensions: ['jpg', 'jpeg', 'png', 'gif', 'webm', 'webp']},
				{name: 'All Files', extensions: ['*']}
			]
		});
		if (res) {
			this.addFiles(res);
		}
	}
	addFiles(files) {
		var cur = this.state.creatorItem;
		files = files.map(x => {
			return {
				src: x,
				title: x.substr(x.lastIndexOf('\\') + 1)
			}
		});
		for (var i = 0; i < files.length; i++) {
			cur.push(files[i]);
		}
		this.setState({
			creatorItem: cur
		});
	}
	uploadFile(file) {
		console.log(file);
		var rem = this.state.creatorItem;
		rem.shift();
		if (rem.length === 0) {
			this.closeCreator();
		}
		this.setState({
			creatorItem: rem
		})
		var f = {
			title: file.title,
			star: false,
			tags: file.tags.map(x => this.state.tags[x]),
			parent: this.state.activeFolderID,
			src: this.state.activeFolderID,
			date: Date.now()
		}
		var ext = file.localSrc.substr(file.localSrc.lastIndexOf('.') + 1);
		ajax({
			channel: 'db.files.insert',
			data: f,
			success: function(data) {
				var id = data._id;
				ajax({
					channel: 'db.files.update',
					data: [
						{_id: id},
						{
							$set: {src: f.src + '/' + id + '.' + ext}
						}
					],
					success: function(data) {
						console.log('new src: ' + f.src + '/' + id + '.' + ext);
						ajax({
							channel: 'files.push',
							data: {
								src: file.localSrc,
								path: f.src + '/' + id + '.' + ext
							},
							success: function(data) {
								// nesting
								if (rem.length === 0) {
									this.openFolder();
								}

							}.bind(this),
							error: function(data) {
								console.error(data)
							}.bind(this)
						});
					}.bind(this),
					error: function(data) {
						console.error(data)
					}.bind(this)
				});
			}.bind(this),
			error: function(data) {
				console.error(data)
			}.bind(this)
		});
	}
	render() {
		var footerButtons = [
			{
				content: 'New folder',
				onClick: this.openFolderModal.bind(this)
			},
			{
				content: 'Upload files',
				onClick: (() => this.openFileDialog.bind(this)(false))
			}/*,
			{
				content: 'Upload folder',
				onClick: (() => this.openFileDialog.bind(this)(true))
			}*/
		];
		return (
			<div>
				<WindowFrame window={this.props.window} title={(this.state.folders[this.state.activeFolder] || {}).title || 'Gale'} />
				<main className="viewport">
					<Dragover />
					<Modal content={this.state.modalContent} close={this.closeFolderModal.bind(this)} />
					<Lightbox item={this.state.lightboxItem} close={this.closeLightbox.bind(this)} />
					{!!this.state.creatorItem.length && <Creator items={this.state.creatorItem} 
							 close={this.closeCreator.bind(this)}
							 onFooterClick={() => this.openFileDialog.bind(this)(false)}
							 submit={this.uploadFile.bind(this)} />}
					<LeftNav header="Folders" footers={footerButtons} items={this.state.folders} onItemClick={this.openFolder.bind(this)} />
					<Gallery files={this.state.files}
							 onItemClick={this.openLightbox.bind(this)}
							 loadMoreContent={this.openFolder.bind(this)} />
				</main>
			</div>
		);
	}
}

function fileDragDrop(e, elem) {
	e.preventDefault();
    e.stopPropagation();
    var items = e.dataTransfer.items;
    files = [];
    for (var i = 0; i < items.length; i++) {
        if (items[i].webkitGetAsEntry) {
            var item = items[i].webkitGetAsEntry();
            if (item) {
                traverseFileTree(item, files);
            }
        }
    }
}
function traverseFileTree(item, files) {
	if (item.isFile) {
        item.file(function(file) {
        	// add file
        });
    } else if (item.isDirectory) {
        var dirReader = item.createReader();
        var readEntries= function() {
            dirReader.readEntries(function(entries) {
                for (i = 0; i < entries.length; i++) {
                    traverseFileTree(entries[i], files);
                }
                if (!entries.length) {
                    console.log('done');
                } else {
                    readEntries();
                }
            });
        }
    	readEntries();
    }
}

function RequestQueue() {
	var q = [];
	this.add = function(act) {
		q.push(act);
		if (q.length === 1) this.exec();
	}
	this.exec = function() {
		q[0]();
	}
	this.complete = function() {
		q.shift();
		if (q.length > 0) this.exec();
	}
}
// synchronous async requests
const queue = new RequestQueue();
const ajax = opts => {
	var enq = function() {
		var _nonce = nonce();
		ipc.once('result', (e, resp) => {
			if (resp._nonce == _nonce) {
				var data = resp.data;
				if (resp.error) {
					opts.error(data);
				} else {
					opts.success(data);
				}
			}
			queue.complete();
		});
		ipc.send(opts.channel, {
			_nonce: _nonce,
			data: opts.data,
			offset: opts.offset,
			limit: opts.limit
		});
	}
	queue.add(enq);
}
