var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
// var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./core/routes/routesLoader')(express.Router());
var index = require('./core/routes/index');

var nunjucks = require('nunjucks');

var app = express();

/**
 * -- nunjucks  view engine
 */
// nunjucks.configure('core/view/nunjucks');
nunjucks.configure(path.join(__dirname, 'core/views/nunjucks'), {
    autoescape: true,
    lstripBlocks:true,
    trimBlocks:true,
    // noCache:true,//缓存
    throwOnUndefined: true,
    express: app
});
app.set('view engine', 'html');
/* -- jade(pug)  view engine setup
 app.set('views', path.join(__dirname, 'core/views'));
 app.enable("view cache");
 app.set('view engine', 'pug');
 */

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

// 路由
app.use(index);
app.use(routes);
/* 静态资源
 *  【静态资源】放在【路由】后面的原因:
 * 从磁盘读取文件,而相比较而言磁盘IO操作的效率较低.当路由未找到的时候再去着静态文件。
 * */
app.use(express.static(path.join(__dirname, 'public')));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    err.title = 404;
    console.log('404');
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            title:404,
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        title:404,
        message: err.message,
        error: err
    });
});

module.exports = app;