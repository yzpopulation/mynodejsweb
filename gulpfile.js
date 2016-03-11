/**
 * Created by Administrator on 2016/3/7.
 */
//引入插件
var gulp = require('gulp');
var path = require('path');
var jade = require('gulp-jade');
var util = require("gulp-util");
var fs=require("fs");
var express=require('express');
var server = express();
var bodyParser = require('body-parser');
var paths = {
    jade: {
        src: 'src/**/*.jade',
        dist: 'dist'
    },
    img:{
        src:[ 'src/**/*.?(png|jpg|gif)'],
        dist: 'dist'
    },
    js:{
        src: 'src/**/*.js',
        dist: 'dist'
    },
    css:{
        src: 'src/**/*.css',
        dist: 'dist'
    },
    html:{
        src:'src/**/*.html',
        dist:'dist'
    },
    favicon:{
      src:'src/favicon.ico',
        dist:'dist'
    }
};


//创建watch任务去检测html文件,其定义了当html改动之后，去调用一个Gulp的Task
gulp.task('watch', function () {
    gulp.watch([paths.jade.src], ['jadeHtml']);
    gulp.watch([paths.html.src], ['exportHtml']);
    gulp.watch([paths.img.src],['exportImg']);
    gulp.watch([paths.js.src], ['exportJs']);
    gulp.watch([paths.css.src], ['exportCss']);
});

//使用connect启动一个Web服务器
//gulp.task('connect', function () {
//    connect.server({
//        root: 'www/index.html',
//        port: 80,
//        livereload:true,
//
//        //fallback:"www/index.html",
//        middleware: function (connect, opt) {
//            //console.log(opt);
//            console.log(connect);
//            console.log(opt);
//            return [
//                function (req, res, next) {
//                    var url = require('url').parse(req.url);
//                    switch (url.pathname) {
//                        case '' || '/' : // 模拟欢迎页,nodejs是高效流处理的方案,也可以通过配置文件来配置
//                            fs.readFile('www/index.html', function (err, content) {
//                                if (err) {
//                                    res.writeHead(404, {'Content-Type': 'text/plain; charset="UTF-8"'});
//                                    res.write(err.message);
//                                    res.end();
//                                } else {
//                                    res.writeHead(200, {'Content-Type': 'text/html; charset=UTF-8'});
//                                    res.write(content);
//                                    res.end();
//                                }
//                            });
//                            break;
//                        case '/aa':
//                            console.log(req.method);
//                            if (req.method==="GET"){
//                                res.writeHead(200, {'Content-Type': 'text/plain; charset="UTF-8"'});
//                                res.write("get");
//                                res.end();
//                            }else {
//                                   if (req.method==="POST"){
//                                    res.writeHead(200, {'Content-Type': 'text/plain; charset="UTF-8"'});
//                                    res.write("post");
//                                    res.end();
//                                }
//                            }
//
//                            break;
//                        //case '/test/delay':// 此处用于模拟缓慢的网络连接
//                        //    // 使用查询字符串来获取延迟时长,或者2000毫秒
//                        //    var delay = parseInt(url.query) || 2000;
//                        //    // 设置响应状态和头
//                        //    res.writeHead(200, {'Content-type': 'text/plain; charset=UTF-8'});
//                        //    // 立即开始编写响应主体
//                        //    res.write('Sleeping for' + delay + ' milliseconds...');
//                        //    // 在之后调用的另一个函数中完成响应
//                        //    setTimeout(function () {
//                        //        res.write('done.');
//                        //        res.end();
//                        //    }, delay);
//                        //    break;
//                        //case '/test/mirror':// 如果请求是test/mirror,则原文返回它
//                        //    // 响应状态和头
//                        //    res.writeHead(200, {'Content-type': 'text/plain; charset=UTF-8'});
//                        //    // 用请求的内容开始编写响应主体
//                        //    res.write(req.mothod + ' ' + req.url + ' HTTP/' + req.httpVersion + '\r\n');
//                        //    // 所有的请求头
//                        //    for (var h in req.headers) {
//                        //        res.write(h + ':' + req.headers[h] + '\r\n');
//                        //    }
//                        //    res.write('\r\n');// 使用额外的空白行来结束头
//                        //    // 在这些事件处理程序函数中完成响应
//                        //    // 当请求主体的数据块完成时,把其写入响应中
//                        //    req.on('data', function (chunk) {
//                        //        res.write(chunk);
//                        //    });
//                        //    // 当请求结束时,响应也完成
//                        //    req.on('end', function (chunk) {
//                        //        res.end();
//                        //    });
//                        //    break;
//                        //case '/json' : // 模拟JSON数据返回
//                        //    // 响应状态和头
//                        //    res.writeHead(200, {'Content-type': 'application/json; charset=UTF-8'});
//                        //    res.write(JSON.stringify({test: 'success'}));
//                        //    res.end();
//                        //    break;
//                        default:// 处理来自本地目录的文件
//                            var filename = url.pathname.substring(1);    // 去掉前导'/'
//                            var type = getType(filename.substring(filename.lastIndexOf('.') + 1));
//                            // 异步读取文件,并将内容作为单独的数据模块传给回调函数
//                            // 对于确实很大的文件,使用流API fs.createReadStream()更好
//                            fs.readFile('www/'+filename, function (err, content) {
//                                if (err) {
//                                    res.writeHead(404, {'Content-Type': 'text/plain; charset="UTF-8"'});
//                                    res.write(err.message);
//                                    res.end();
//                                } else {
//                                    res.writeHead(200, {'Content-Type': type});
//                                    res.write(content);
//                                    res.end();
//                                }
//                            });
//                            break;
//                    }
//
//                    //next();
//                }
//            ]
//        }
//
//
//    });
//});

gulp.task('expressServer',function(){

    server.use(express.static('dist'));
    server.use(bodyParser.json({limit: '3mb'}));
    server.use(bodyParser.urlencoded({extended: false}));
    server.post('/postlogin',function(req,res,next){
        console.log(req.body);
        console.log(JSON.stringify(req.body));
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(req.body));
    });
    server.get('*',function(req,res,next){
        fs.readFile('dist/404.html',function(err,content){
            console.log(content);
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(content);
        });
    });
    server.listen(80);
});

gulp.task('exportHtml',function(){
    gulp.src(paths.html.src)
        .pipe(gulp.dest(paths.html.dist))
});

gulp.task('exportJs',function(){
   gulp.src(paths.js.src)
       .pipe(gulp.dest(paths.js.dist))
});

gulp.task('exportCss',function(){
    gulp.src(paths.css.src)
        .pipe(gulp.dest(paths.css.dist))
});

gulp.task('exportImg', function (){
    gulp.src(paths.img.src)
        .pipe(gulp.dest(paths.img.dist));
});

gulp.task('jadeHtml', function () {
    var source = paths.jade.src;
    var stream = gulp.src(source);
    return stream
        .pipe(jade({pretty: true}))
        .pipe(gulp.dest(paths.jade.dist));
});

gulp.task('export',['jadeHtml','exportImg','exportCss','exportJs','exportHtml']);

//gulp.task('httpserver',function(){
//    // 这是一个简单的Node HTTP服务器,能处理当前目录的文件
//// 并能实现两种特殊的URL用于测试
//// 用HTTP://localhost:8000或http://127.0.0.1:8000连接这个服务器
//
//// 首先加载所有需要用到的模块
//    var http = require('http');        // Http服务器API
//    var fs = require('fs');            // 用于处理本地文件
//    var server = new http.Server();    // 创建新的HTTP服务器
//    server.listen(8000);            // 监听端口8000
//    var rootpath='www/'              //根目录
//
//// 使用on方法注册时间处理
//    server.on('request', function(request, response) { // 当有request请求的时候触发处理函数
//        console.log('request');
//        // 解析请求的URL
//        var url = require('url').parse(request.url);
//        // 特殊URL会让服务器在发送响应前先等待
//        switch(url.pathname) {
//            case ''||'/' : // 模拟欢迎页,nodejs是高效流处理的方案,也可以通过配置文件来配置
//                fs.readFile(rootpath+'index.html', function(err, content){
//                    if(err) {
//                        response.writeHead(404, { 'Content-Type':'text/plain; charset="UTF-8"' });
//                        response.write(err.message);
//                        response.end();
//                    } else {
//                        response.writeHead(200, { 'Content-Type' : 'text/html; charset=UTF-8' });
//                        response.write(content);
//                        response.end();
//                    }
//                });
//                break;
//            case '/test/delay':// 此处用于模拟缓慢的网络连接
//                // 使用查询字符串来获取延迟时长,或者2000毫秒
//                var delay = parseInt(url.query) || 2000;
//                // 设置响应状态和头
//                response.writeHead(200, {'Content-type':'text/plain; charset=UTF-8'});
//                // 立即开始编写响应主体
//                response.write('Sleeping for' + delay + ' milliseconds...');
//                // 在之后调用的另一个函数中完成响应
//                setTimeout(function(){
//                    response.write('done.');
//                    response.end();
//                }, delay);
//                break;
//            case '/test/mirror':// 如果请求是test/mirror,则原文返回它
//                // 响应状态和头
//                response.writeHead(200, {'Content-type':'text/plain; charset=UTF-8'});
//                // 用请求的内容开始编写响应主体
//                response.write(request.mothod + ' ' + request.url + ' HTTP/' + request.httpVersion + '\r\n');
//                // 所有的请求头
//                for (var h in request.headers) {
//                    response.write(h + ':' + request.headers[h] + '\r\n');
//                }
//                response.write('\r\n');// 使用额外的空白行来结束头
//                // 在这些事件处理程序函数中完成响应
//                // 当请求主体的数据块完成时,把其写入响应中
//                request.on('data', function(chunk) { response.write(chunk); });
//                // 当请求结束时,响应也完成
//                request.on('end', function(chunk){ response.end(); });
//                break;
//            case '/json' : // 模拟JSON数据返回
//                // 响应状态和头
//                response.writeHead(200, {'Content-type':'application/json; charset=UTF-8'});
//                response.write(JSON.stringify({test:'success'}));
//                response.end();
//                break;
//            default:// 处理来自本地目录的文件
//                var filename = url.pathname.substring(1);    // 去掉前导'/'
//                var type = getType(filename.substring(filename.lastIndexOf('.')+1));
//                // 异步读取文件,并将内容作为单独的数据模块传给回调函数
//                // 对于确实很大的文件,使用流API fs.createReadStream()更好
//                fs.readFile(rootpath+filename, function(err, content){
//                    if(err) {
//                        response.writeHead(404, { 'Content-Type':'text/plain; charset="UTF-8"' });
//                        response.write(err.message);
//                        response.end();
//                    } else {
//                        response.writeHead(200, { 'Content-Type' : type });
//                        response.write(content);
//                        response.end();
//                    }
//                });
//                break;
//        }
//
//    });
//})


function getType(endTag) {
    var type = null;
    switch (endTag) {
        case 'html' :
        case 'htm' :
            type = 'text/html; charset=UTF-8';
            break;
        case 'js' :
            type = 'application/javascript; charset="UTF-8"';
            break;
        case 'css' :
            type = 'text/css; charset="UTF-8"';
            break;
        case 'txt' :
            type = 'text/plain; charset="UTF-8"';
            break;
        case 'manifest' :
            type = 'text/cache-manifest; charset="UTF-8"';
            break;
        default :
            type = 'application/octet-stream';
            break;
    }
    return type;
}
//运行Gulp时
//，
//默认的Task
gulp.task('default', ['export', 'watch','expressServer']);