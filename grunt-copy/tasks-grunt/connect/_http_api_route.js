/**
 * 假接口数据服务的处理文件
 */
var fs = require("fs");
var path = require("path");
var forEachFileDir = require('../lib/forEachFileDir');
var jsonReg = /\.json$/i;
var jsReg = /\.js$/i;
var methodReg = /^POST|GET$/i;

module.exports = function(connect, options) {

  var dataPath = path.join(__dirname, '../../', options.dataPath);
  var dataRouteTablesPath = path.join(dataPath, './routetables/');
  var dataRouteTablesFileMap = {};
  var dataRouteTablesMap = {};

  function _require(filePath, removeCache) {
    if (removeCache) {
      var cacheName = require.resolve(filePath);
      require.cache[cacheName] && delete require.cache[cacheName];
    }
    return require(filePath);
  }

  function addFileRouteTables(filePath, removeCache) {

    var fileObject = dataRouteTablesFileMap[filePath] = _require(filePath, removeCache);

    for (var route in fileObject) {
      dataRouteTablesMap[route] = fileObject[route];
    }

    for (var _filePath in dataRouteTablesFileMap) {
      if (_filePath != filePath) {
        for (var route in dataRouteTablesFileMap[_filePath]) {
          if (fileObject[route]) {
            dataRouteTablesMap[route].error = 'route(' + route + ') was defined in two files (' + _filePath + ',' + filePath + ')';
          } else {
            ('error' in dataRouteTablesMap[route]) && delete dataRouteTablesMap[route].error;
          }
        }
      }
    }
  }
  forEachFileDir(dataRouteTablesPath, function(filePath) {
    // console.log(filePath);
    jsReg.test(filePath) && addFileRouteTables(filePath);
  });

  // console.log(JSON.stringify(dataRouteTablesMap));
  // console.log(JSON.stringify(dataRouteTablesFileMap));
  fs.watch(dataRouteTablesPath, function(e, fileName) {
    console.log('watchFile', dataRouteTablesPath, 'changed', fileName);
    addFileRouteTables(path.join(dataRouteTablesPath, fileName), true);
  });
  return function(req, res, next) {
    var routeObject = dataRouteTablesMap[req.url.replace(/\?.*?$/, '').replace(/\/+/g, '/')],
      method, _path, data, fn, error;

    if (routeObject) {
      error = routeObject.error;
      if (error) {
        return endError(error);
      }
      if (method = routeObject.method) {
        method = method.toUpperCase();
        if (!methodReg.test(method)) {
          return endError('route value method(' + method + ') error!');
        }
        if (req.method !== method) {
          return endError('route only support method ' + method + '!');
        }
      }
      _path = routeObject.path;
      if (_path) {
        if (typeof(_path) !== 'string') {
          return endError('route value path is not a string!');
        }
        if (jsonReg.test(_path)) {
          jsonPath = path.join(dataPath, _path);
          if (path.existsSync(jsonPath)) {
            res.json(fs.readFileSync(jsonPath, 'utf-8'));
          } else {
            return endError('route value path(' + path + ') not found!');
          }
        } else if (jsReg.test(_path)) {
          return _require(path.join(dataPath, _path), true)(req, res, next);
        }
      }
      data = routeObject.data;
      if (data) {
        return res.json(data);
      }
      fn = routeObject.fn;
      if (fn) {
        if (typeof(fn) === 'function') {
          return fn(req, res, next);
        } else {
          return endError('route value fn is not a function!');
        }
      }
      return endError('route(' + JSON.stringify(routeObject) + ') is not work!!');
    }

    next();

    function endError(error) {
      res.end('http_data throw error:' + error);
    }
  };

};