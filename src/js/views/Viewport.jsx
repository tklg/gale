import React from 'react';

import LeftNav from './LeftNav.jsx';
import Gallery from './Gallery.jsx';
import WindowFrame from './WindowFrame.jsx';
import Lightbox from './Lightbox.jsx';
import Creator from './Creator.jsx';
import Dragover from './Dragover.jsx';
import Modal from './Modal.jsx';
import SubmitCancel from '../components/SubmitCancel.jsx';
import TagsInput from 'react-tagsinput'
import Autosuggest from 'react-autosuggest';
import electron from 'electron';

const ipc = electron.ipcRenderer;
const dialog = electron.remote.dialog;
const nonce = require('nonce')();

export default class Viewport extends React.Component {
	constructor() {
		super();
		this.state = {
			viewMode: 'grid', // row
			lightboxIndex: null,
			creatorItem: [],
			creatorAction: 'new',
			modalContent: null,
			modalValue: '',
			files: [],
			activeFolder: 0, // -1
			activeFolderID: '', // ALL
			folders: [],
			tags: [],
			searchTags: [],
			itemsPerPage: 40,
			currentOffset: 0,
			isUploading: null
		}
	}
	componentDidMount() {
		ajax({
			channel: 'db.folders.find',
			data: {},
			offset: 0,
			limit: 30,
			success: function(data) {
				console.log(data);
				if (data.length) {
					this.setState({
						folders: data,
						activeFolder: 0,
						activeFolderID: data[0]._id
					}, () => {
						this.openFolder(0, data[0]._id);
					});
				}
			}.bind(this),
			error: function(data) {
				console.error(data)
			}.bind(this)
		});
		ajax({
			channel: 'db.tags.find',
			data: {},
			offset: 0,
			limit: 0,
			success: function(data) {
				this.setState({
					tags: data
				});
			}.bind(this),
			error: function(data) {
				console.error(data)
			}.bind(this)
		});
	}
	openLightbox(index) {
		this.setState({
			lightboxIndex: index
		})
	}
	closeLightbox() {
		this.setState({
			lightboxIndex: null
		})
	}
	changeLightboxPage(dir) {
		var nd = this.state.lightboxIndex + dir;
		if (nd > this.state.files.length - 1) nd = 0;
		else if (nd < 0) nd = this.state.files.length - 1;
		this.setState({
			lightboxIndex: nd
		});
	}
	openCreator(item, update) {
		console.log(item);
		this.setState({
			creatorItem: item,
			creatorAction: update ? 'edit' : 'new'
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
				footer: <SubmitCancel submit={this.addFolder.bind(this)} cancel={this.closeModal.bind(this)} />
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
	closeModal() {
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
		this.closeModal();
	}
	openFolder(index, id, cb, tags) {
		var changed = false;
		console.log("opening folder: " + (index == null ? this.state.activeFolder : index) + " " + (id || this.state.activeFolderID));
		if (index != this.state.activeFolder) changed = true;
		var cur = this.state.files;
		if (index == -1 || (index != null && !!id)) {
			cur = [];
			this.setState({
				currentOffset: 0
			})
		}
		this.setState({
			activeFolder: (index == null ? this.state.activeFolder : index),
			activeFolderID: id || this.state.activeFolderID
		}, () => {
			var data = {};
			if (this.state.activeFolder != -1) {
				data = {
					parent: id || this.state.activeFolderID
				};
			}
			if (tags) {
				if (data.parent) {
					data = {
						$and: {
							parent: id || this.state.activeFolderID,
							tags: {$elemMatch: {
								$in: tags
							}}
						}
					}
				} else { // mess
					data = {
						tags: {$elemMatch: {
							$in: tags
						}}
					}
				}
			}
			ajax({
				channel: 'db.files.find',
				data: data,
				offset: this.state.currentOffset,
				limit: this.state.itemsPerPage,
				success: function(data) {
					if (data.length || changed) {
						cur = cur.concat(data);
						var newOffset = this.state.currentOffset + data.length
						this.setState({
							files: cur,
							currentOffset: newOffset
						}, () => {
							if (cb) cb();
						});
					} else {
						console.log("no new files");
						if (cb) cb();
					}
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
	addTag(tag, cb) {
		var tags = this.state.tags;
		ajax({
			channel: 'db.tags.insert',
			data: {
				title: tag,
				folder: this.state.activeFolderID,
				shortcut: null
			},
			success: function(data) {
				tags.push(data);
				this.setState({
					tags: tags
				}, () => {
					if (cb) cb();
				})
			}.bind(this),
			error: function(data) {
				console.error(data)
			}.bind(this)
		})
	}
	tagExists(tag) {
		for (var i = 0; i < this.state.tags.length; i++) {
			if (this.state.tags[i].title == tag) return true;
		}
		return false;
	}
	uploadFile(file, cb) {
		var rem = this.state.creatorItem;
		console.log(file);
		console.log("remaining:");
		console.log(rem);
		if (rem.length == 0) return;
		rem.shift();
		this.setState({
			isUploading: true
		})
		file.tags.forEach(tag => {
			if (!this.tagExists(tag)) this.addTag(tag);
		})
		if (file.id == undefined) {
			var f = {
				title: file.title,
				star: false,
				tags: file.tags,
				parent: this.state.activeFolderID,
				src: this.state.activeFolderID,
				thumb: this.state.activeFolderID,
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
								$set: {
									src: f.src + '/' + id + '.' + ext,
									thumb: f.src + '/' + id + '_thumb.' + ext,
								}
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
									//rem.shift();
									if (rem.length === 0) {
										this.closeCreator();
										this.openFolder();
									} else {
										if (cb) cb();
									}
									this.setState({
										creatorItem: rem,
										isUploading: null
									})
									console.log("done");
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
		} else {
			// update
			ajax({
				channel: 'db.files.update',
				data: [
					{_id: file.id},
					{
						$set: {
							title: file.title,
							tags: file.tags
						}
					}
				],
				success: function(data) {
					//var rem = this.state.creatorItem;
					//rem.shift();
					if (rem.length === 0) {
						this.closeCreator();
						this.openFolder(this.state.activeFolder, this.state.activeFolderID);
					} else {
						if (cb) cb();
					}
					this.setState({
						creatorItem: rem,
						isUploading: null,
						creatorAction: 'new'
					})
					console.log("done");
				}.bind(this),
				error: function(data) {
					console.error(data)
				}.bind(this)
			});
		}
	}
	removeFile(file, index) {
		file = file[0];
		console.log(file);
		ajax({
			channel: 'db.files.remove',
			data: {_id: file._id},
			success: function(data) {
				ajax({
					channel: 'files.delete',
					data: {
						src: file.src,
					},
					success: function(data) {
						var files = this.state.files;
						if (this.state.lightboxIndex != null) {
							files.splice(this.state.lightboxIndex, 1);
							if (files.length == 0) {
								this.setState({
									lightboxIndex: null,
									files: []
								})
								return;
							}
							if (this.state.files.length <= this.state.lightboxIndex) this.changeLightboxPage(-1);
							this.setState({
								files: files
							}, () => {
								this.changeLightboxPage(0);
							})
						} else {
							// reload files
						}
						console.log("removed");
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
	starFile(file) {
		file = file[0];
		var star = !file.star;
		ajax({
			channel: 'db.files.update',
			data: [
				{
					_id: file._id
				},
				{'$set': {
					star: star
				}}
			],
			success: function(data) {
				this.openFolder(this.state.activeFolder, this.state.activeFolderID);
				console.log("starred");
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
				<WindowFrame window={this.props.window} title={(this.state.activeFolder == -1 ? 'Gale' : (this.state.folders[this.state.activeFolder] || {}).title || 'Gale')} />
				<main className="viewport">
					<Dragover />
					<Modal content={this.state.modalContent} close={this.closeModal.bind(this)} />
					<Lightbox index={this.state.lightboxIndex}
							  items={this.state.files}
							  close={this.closeLightbox.bind(this)}
							  editFile={this.openCreator.bind(this)}
							  deleteFile={this.removeFile.bind(this)}
							  starFile={this.starFile.bind(this)}
							  isOverlaid={!!this.state.creatorItem.length}
							  pageLeft={() => this.changeLightboxPage.bind(this)(-1)}
							  pageRight={() => this.changeLightboxPage.bind(this)(1)} />
					{(!!this.state.creatorItem.length ||
					 !!this.state.isUploading) &&
					 <Creator items={this.state.creatorItem} 
							 close={this.closeCreator.bind(this)}
							 onFooterClick={() => this.openFileDialog.bind(this)(false)}
							 submit={this.uploadFile.bind(this)}
							 isUploading={this.state.isUploading} 
							 tags={this.state.tags}
							 action={this.state.creatorAction} />}
					<LeftNav header="Folders"
							 footers={footerButtons}
							 items={this.state.folders}
							 onItemClick={this.openFolder.bind(this)}
							 index={this.state.activeFolder} />
					<Gallery files={this.state.files}
							 onItemClick={this.openLightbox.bind(this)}
							 loadMoreContent={this.openFolder.bind(this)}
							 viewMode={this.state.viewMode}
							 editFile={this.openCreator.bind(this)}
							 deleteFile={this.removeFile.bind(this)}
							 starFile={this.starFile.bind(this)}
							 isOverlaid={!!this.state.lightboxIndex?true:null} />
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
