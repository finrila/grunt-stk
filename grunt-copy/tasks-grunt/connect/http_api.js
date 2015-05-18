/**
 * 假接口数据服务的处理文件
 * @author wangzheng4@Finrila
 */
var fs = require("fs");
var path = require("path");
var forEachFileDir = require('../lib/forEachFileDir');
// var watchPath = require('../lib/watchPath');
var requireLatest = require('../lib/requireLatest');
var jsReg = /\.js$/i;
var methodReg = /^POST|GET$/i;

module.exports = function(connect, options) {

  var apiPath = path.join(__dirname, '../../', options.apiPath);
  var apiRouteMap = {};

  

  function _pathToRoute(path) {
    return path.replace(apiPath, '').replace(/\.js$/i, '');
  }

  function _setApiRouteMap(filePath) {

    var apiObject;

    if (apiObject = requireLatest(filePath, true, true)) {
      apiRouteMap[_pathToRoute(filePath)] = apiObject;  
    }

  }

  // forEachFileDir(apiPath, function(filePath) {
  //   if (jsReg.test(filePath)) {
  //     _setApiRouteMap(filePath);
  //   }
  // });
  // console.log(111, apiPath);

  // watchPath(apiPath, function(e, fileName) {
  //   console.log('watchFile', apiPath, 'changed', fileName);
  //   _setApiRouteMap(fileName);
  // });

  // console.log(apiRouteMap);

  return function(req, res, next) {

    var pathname = req.url.replace(/\?.*?$/, '').replace(/\/+/g, '/').substr(1);

    // var apiObject = apiRouteMap[pathname];
    var apiObject = requireLatest(path.join(apiPath, pathname) + '.js', true);
    
    var error, method, data;

    if (apiObject) {

      if (error = apiObject.error) {
        return endError('api set error:' + error);
      }

      if (method = apiObject.method) {
        method = method.toUpperCase();
        if (!methodReg.test(method)) {
          return endError('api set method(' + method + ') error!');
        }
        if (req.method !== method) {
          return endError('only support method ' + method + '!');
        }
      }

      if (data = apiObject.data) {
        if (typeof(data) === 'function') {
          return data(req, res, next);
        } else {
          return res.json(data);
        }
      }

      return endError('api set (' + JSON.stringify(apiObject) + ') is not work!!');
    }
    next();

    function endError(error) {
      res.statusCode = 500;
      res.end('http_api throw error:' + error);
    }
  };

};