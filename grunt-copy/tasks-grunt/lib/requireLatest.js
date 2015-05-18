/**
 * require最新的文件
 */
var fs = require('fs');

module.exports = function(filePath, removeCache, fileExits) {
  if (fileExits || fs.existsSync(filePath)) {
    if (removeCache) {
      var cacheName = require.resolve(filePath);
      require.cache[cacheName] && delete require.cache[cacheName];
    }
    try {
      return require(filePath);
    } catch (e) {
      return 'path(' + filePath + '):' + e;
    }
  }
}