/**
 * STK Compile
 */
var path = require('path');
var STK_combine = require('./lib/STK_combine');

module.exports = function(grunt) {

	grunt.registerMultiTask('stkCompile', function() {
        this.files.forEach(function(file) {
            grunt.file.mkdir(file.dest);
            file.src.map(function(filePath) {
                var src = path.join(file.cwd, filePath);
                var result = STK_combine(src, file.cwd);
                return grunt.file.write(file.dest + filePath, result);
            });
        });
    });

};
