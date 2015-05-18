var forEachFileDir = require('./forEachFileDir');
var iteratorLimit = require('./iteratorLimit');
var cpFile = require('cp-file');
var path = require('path');

module.exports = function(src, dest, callback) {
	src = path.join(src);
	dest = path.join(dest);

	var fileArray = [];

	forEachFileDir(src, function(filePath) {
		fileArray.push({
			src: filePath,
			dest: path.join(dest, filePath.replace(src, ''))
		});
	});

	iteratorLimit(fileArray, 3, function(next, item, index, source) {
		cpFile(item.src, item.dest, function (err) {
		    if (err) {
		    	throw new Error('copy error: srcPath: ' + item.src + '; destPath:' + item.dest);
		    }
		    if (index === fileArray.length - 1) {
		    	return callback();
		    }
		    next();
		});
	});
};