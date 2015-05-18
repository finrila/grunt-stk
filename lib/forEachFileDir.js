var fs = require('fs');
var path = require('path');

module.exports = function forEachFileDir(dir, readFile, callback) {

  if (typeof readFile === 'function') {
    callback = readFile;
    readFile = false;
  }

  if (fs.existsSync(dir)) {
    fs.readdirSync(dir).forEach(function(filename) {
      var filePath = path.join(dir, filename);
      if (fs.statSync(filePath).isDirectory()) {
        forEachFileDir(filePath, callback);
      } else {
        callback(filePath, readFile && fs.readFileSync(filePath, 'utf-8'));
      }
    });
  }

};