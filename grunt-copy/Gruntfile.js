var fs = require('fs');
var http = require('http');
var cprocess = require('child_process');

module.exports = function(grunt) {
	
    var serverPort = 7777;
    var pathnamePrefix = '/';
    
    var Config = {
        // 清理
        clean: {
            'output': ["output"]
        },
        // 文件合并
        concat: {
        },
        // 拷贝
        copy: {
			'output': {
				'files': [{
                    'expand': true,
                    'cwd': './',
                    'src': ['images/**/*', 'css/**/*'],
                    'dest': 'output/'
                }]
			}
        },//预处理我们的前端jade模板
        stkCompile: {
            js: {
                'cwd': 'js/',
                'src': ['**/*.js'],
                'dest': 'output/js/'
            }
        },
		uglify: {
			'js': {
				'files': [{
					expand: true,
					cwd: 'output/js/',
					src: ['**/*.js'],
					dest: 'output/js/',
					ext: '.js'
				}]
			}
		},
		// CSS压缩
		cssmin: {
			'css': {
				cwd: 'css/',
                src: ['**/*.css'],
                dest: 'output/css/',
                ext: '.css'
			}
		},
        // 监听文件变化任务
        watch: {
            'debug': {
                'files': ['js/**/*', 'css/**/*', 'js/**/*'],
                'tasks': ['debug']
            }
        },
        connect: {
            'options': {
                'port': serverPort,
                'hostname': '*',
                'apiPath': 'api/',
                'pathnamePrefix': pathnamePrefix, //默认为'/'
                // 'serverStopUrl': serverStopUrl,
                'keepalive': true,
                //静态文件代理配置，指路由及本地找不到的文件会向该代理列表发送请求，结果由该服务器决定
                //可以根据host和pathname来分别设置代理 可以只写代理地址默认端口为80，如果是自定义代理服务器可以设置为对象{hostname: '127.0.0.1',port:8888}
                'staticProxy': {
                },
                'middleware': require('./tasks-grunt/connect/middleware.js')
            },
            "default": {
                'options': {
                    'base': './'
                }
            }
        }
    };
	
    grunt.initConfig(Config);
    
    // 加载已安装的任务脚本
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
    // 加载自定义任务脚本
    grunt.loadTasks('./tasks-grunt/');
    
    grunt.registerTask('default', '默认任务', function(){
        console.log('支持命令列表:');
        console.log();
		console.log(' 基本命令:');
        console.log('    1、STK处理 处理成未压缩混淆的代码，结果处理到output目录，用于调试阶段的引用');
        console.log('    grunt debug');
        console.log('    2、STK处理 处理成压缩混淆后的代码，结果处理到output目录，用于上线后的引用');
        console.log('    grunt build');
        console.log('    3、监控代码变更并自动运行grunt debug');
        console.log('    grunt watchDebug');
        console.log('    4、静态调试服务器');
        console.log('    grunt blockServer');
    });
	
	//处理到dist
    grunt.registerTask('debug', ['clean:output', 'copy:output', 'stkCompile:js']);
	grunt.registerTask('build', ['debug', 'cssmin', 'uglify']);
	grunt.registerTask('watchDebug', ['watch:debug']);
    grunt.registerTask('blockServer', function() {
        var done = this.async();
        cprocess.exec('grunt debug', function() {
            cprocess.exec('grunt connect:default').stdout.pipe(process.stdout);
            cprocess.exec('grunt watchDebug').stdout.pipe(process.stdout);
        }).stdout.pipe(process.stdout);
    });
	
};
