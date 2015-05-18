var fs = require('fs');
var path = require('path');
var removeComment = require('./removeComment.js');

var reg = /\$Import\s*\(\s*(['|"])([a-zA-Z0-9\-\.\_]*)\1\s*\)\s*\;?/g;

function _import( jsPath, basePath, importMap, notimportMap, parentFile ) {
	if ( importMap[ jsPath ] ) {
		return '';
	}
	
	importMap[ jsPath ] = true;
	
	if ( !fs.existsSync( jsPath ) ) {
		throw new Error([jsPath, ' is not exist', parentFile ? 'in ' + parentFile : '', '!'].join(' '));
	}
	
	var jsStr = fs.readFileSync( jsPath, 'utf-8' );
	
	return removeComment(jsStr).replace( reg, function( _, _a,importName ) {
		importName = importName.replace(/\./g, '/');
		var _jsPath = realImportPath(importName);
		console.log(importName, _jsPath);
		if ( notimportMap[ _jsPath ] ) {
			return '';
		} else {
			return _import( _jsPath, basePath, importMap, notimportMap, jsPath );
		}
	} );
	
	function realImportPath(importName) {
		if (/^\./.test(importName)) {
			return path.join( path.dirname(jsPath), importName + '.js' );
		} else {
			return path.join( basePath, importName + '.js' );
		}
	}
}

module.exports = function(jsPath, basePath) {
	return _import ( jsPath, basePath, {}, {} );
};
