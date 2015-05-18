/**
 * gruont-contrib-connect的中间件
 * @author wangzheng4@Finrila
 */

var http_api = require('./http_api');
var connect_json = require('./connect-json');
var connect_proxy = require('./connect-proxy');
var pathnamePrefix = require('./pathnamePrefix');
var access_control_allow = require('./access-control-allow');
var http = require('http');
var url = require('url');

module.exports = function(connect, options, middlewares) {

  //使用404资源静态代理
  var staticProxyFn;
  if (options.staticProxy) {
    middlewares.push(staticProxyFn = connect_proxy(options.staticProxy));
    setInterval(function() {
      http.get('http://127.0.0.1:' + options.port, function(res) {});
    }, 60000);
  }

  //access_control_allow
  middlewares.unshift(access_control_allow);
  //gzip
  middlewares.unshift(connect.compress({level:9}));
  //当文件访问需要加前缀时需要
  if (options.pathnamePrefix) {
    middlewares.unshift(pathnamePrefix(connect, options, staticProxyFn));
  }
  middlewares.unshift(http_api(connect, options));
  middlewares.unshift(connect_json);
  middlewares.unshift(connect.bodyParser());
  middlewares.unshift(connect.query());

  return middlewares;
}; 