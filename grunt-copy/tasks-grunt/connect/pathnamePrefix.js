/**
 * 服务访问路径的前缀
 * @author wangzheng4@Finrila
 */

module.exports = function(connect, options, staticProxyFn) {

  pathnamePrefix = options.pathnamePrefix.replace(/\/+/g, '/').replace(/\/$/, '');

  return function(req, res, next) {
    var url = req.url.replace(/\/+/g, '/');
    var match = url.match(new RegExp('^' + pathnamePrefix + '(.*)$'));
    if (match) {
      if (match[1] === '' || /^\?/.test(match[1])) {
        match[1] = '/' + match[1];
      } else if (!/^\//.test(match[1])) { //处理路径与文件名字有重合的情况
        match = null;
      }
    }
    //console.log(url, match, pathnamePrefix, new RegExp('^' + pathnamePrefix + '(.*)$'));
    if (match) {
      req.url = match[1];
      next();
    } else if (/^\/*$/.test(req.url)) {
      res.setHeader('Content-Type', 'text/html');
      res.end('<h1><a href="' + pathnamePrefix + '">use ' + pathnamePrefix + '</a></h1>');
      return;
    } else {
      if (staticProxyFn) {
        staticProxyFn(req, res, next);
      } else {
        res.statusCode = 404;
        res.end();
      }
    }
  };
};