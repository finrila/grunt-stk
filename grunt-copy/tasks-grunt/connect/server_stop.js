/**
 * 解决不同目录下相同端口服务的互斥使用，避免多目录跳跃操作
 * 
 */
var exec = require('child_process').exec;

module.exports = function(connect, options) {
	
	return function(req, res, next) {
		if (req.url === options.serverStopUrl) {
			console.log(1);
			exec('grunt forever::stop --force');
			res.end('OK');
			return;
		}
		next();
	};

};