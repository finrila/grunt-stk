/*
	假数据接口的路由表配置
	相对的目录为 connect任务中定义的属性dataPath值
	属性说明: path/data/fn是互斥属性，优先级是path>data>fn
	method: {string}请求类型，默认GET POST都可用
	path: {string}指定文件路径,可以是json文件位置也可以是中间件处理js文件
	data: {string|object}指定返回数据，可以是字符串或者对象
	fn: {function}指定中间件处理方法
*/

module.exports = {
  //指定文件路径为json文件 POST请求时生效
  "/api/data1": {
    "method": "POST",
    "path": "data1.json"
  },
  //指定文件路径为json文件 GET请求时生效
  "/api/folder1/data2": {
    "method": "GET",
    "path": "folder1/data2.json"
  },
  //指定文件路径为js文件 ,会把文件当成一个connect中间件来处理 使用GET或者POST请求时生效
  "/api/folder2/data3": {
    "path": "folder2/data3.js"
  },
  //直接返回字符串
  "/api/string": {
  	"method": "POST",
    "data": "OK!"
  },
  //指定返回对象 使用GET或者POST请求时生效
  "/api/object": {
  	"method": "POST",
    "data": {
    	code: 10000,
    	'object': 'object'
    }
  },
  //指定为方法,会把该方法当成一个connect中间件来处理 使用GET请求时生效
  "/api/function": {
    "method": "GET",
    "fn": function(req, res, next) {
      res.end('I\'m a function response!');
    }
  }
};