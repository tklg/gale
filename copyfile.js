const fs = require('fs-extra');
const clevernails = require('clevernails');
const sharp = require('sharp');

function copy(src, path, clvnopts, dirPath, fName, fExt) {
	/*fs.copy(src, path, err => {
		console.log("err2: " + err);
		if (err) return err;
		else {
			console.log("process");
			clevernails.process(clvnopts, function(err, res) {
				if (err) {
					console.log("err: "+err);
					//var output = dirPath + "/" + fName + "_thumb." + fExt;
					sharp(src)
						 .resize(300, 300)
						 .toFile(clvnopts.output, err => {
						 	return clvnopts.output;
						 });
				}
				else return path;
			});
		}
	})*/
	fs.copySync(src, path);
	sharp(src)
		.resize(300, 300)
		.toFile(clvnopts.output, err => {
			return clvnopts.output;
		});
	/*clevernails.process(clvnopts, function(err, res) {
		if (err) {
			console.log("err: "+err);
			//var output = dirPath + "/" + fName + "_thumb." + fExt;
			sharp(src)
				 .resize(300, 300)
				 .toFile(clvnopts.output, err => {
				 	return clvnopts.output;
				 });
		}
		else return path;
	});*/
	return path;
}

module.exports = copy;