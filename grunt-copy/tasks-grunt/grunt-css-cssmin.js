/**
 * cssmin
 */
var path = require('path');
var exec = require('child_process').exec;
var removeComment = require('./lib/removeComment.js');

var importReg = /@import\s*(url\s*\()*\s*(['"]?)([\w\-\.\:\/\\\s]+)\2\s*(\))*\s*;?/igm;
var urlReg = /url\s*\(\s*(['"]?)([^\)\:]+)\1\s*\)/ig;

module.exports = function(grunt) {

	grunt.registerMultiTask('cssmin', function() {

    options = this.options({
      charset: '@charset "UTF-8";'
    });

		this.files.forEach(function(file) {
			var cache = {};

			file.src.map(function(filepath) {
				console.log('minning: ' + filepath);
				// var src = grunt.file.read(path.join(file.cwd, filepath));
				// var oneResult = concatOne(filepath, file.cwd);
				
				var oneResult = concatOne(filepath, file.cwd);
				//去{}:;,前后的空格
				oneResult = options.charset + oneResult.replace(/\s*([\{\}:;,])\s*/gim, '$1')
							   .replace(/\s+!important/gim, '!important')
							   .replace(/@charset[^;]+;/gim, '')
							   .replace(/\n+/g, '')
							   .replace(/;\}/g, '}');
                       
				grunt.file.write(file.dest + filepath, oneResult);
			});

			function concatOne(filepath, basepath) {
				console.log(basepath, filepath);
				var filefullpath = path.join(basepath, filepath).replace(/\\/g, '/');

				if (cache[filefullpath]) {
					return cache[filefullpath];
				}

				var src = grunt.file.read(filefullpath);

        //去注释
        src = src.replace(/\/\*[\s\S]*?\*\//gim, '');

				var fileBasePath = nameToPath(filefullpath);
				var result = src.replace(importReg, function(a, b, c, importPath) {
					var importSrc = concatOne(importPath, fileBasePath);
          var importBasePath = nameToPath(importPath);
					//url处理 /url\s*\(\s*(['"]?)([^\)\:]+)\1\s*\)
					return importSrc.replace(urlReg, function(matchString, b, urlPath) {
            var newUrlPath = relative(fileBasePath, importBasePath, urlPath);
						return matchString.replace(urlPath, newUrlPath);
					});
				});
        // result = result.replace(/((?:@charset|@import)[^;]+;)\s*/gim, '$1\n');
				// console.log(result);
				return cache[filefullpath] = result;
			}

		});

	});


};

var relative = function(topPath, importPath, urlPath) {
  return path.relative(topPath, path.resolve(topPath, importPath, urlPath).replace(/\\/g, '/')).replace(/\\/g, '/');
};


function nameToPath(name) {
	return name.substr(0, name.lastIndexOf('/') + 1);
}