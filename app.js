var config = require('./config');
var colors = require('colors');
var express = require('express');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var fs = require('fs');
var busboy = require('connect-busboy');
var auth = require('./middlewares/auth');
var connect = require('connect');
var errorhandler = require('errorhandler');
var uuid = require('node-uuid');
var morgan = require('morgan');

var users = require('./routes/userRoute');
var resc = require('./routes/rescRoute');
var role = require('./routes/roleRoute');
var zooManager = require('./routes/zooRoute');

var app = express();

app.use(busboy({
    highWaterMark: 2 * 1024 * 1024,
    limits: {
        fileSize: 10 * 1024 * 1024
    }
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', require('ejs-mate'));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'views')));
app.use(session({
    secret: config.session_secret,
    resave: true,
    saveUninitialized: true
}));

//用户模块
app.use('/user', users);
//资源模块
app.use('/resc',resc);
//角色模块
app.use('/role',role);
//zookeeper管理模块
app.use('/zooManager', zooManager);

app.use('*', users);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    console.log(req.url);
    var filePath = __dirname + '/views' + req.url.substring(0, req.url.lastIndexOf("?"));
    ;
    if (req.url.indexOf('.html') != -1 && fs.existsSync(filePath)) {
        return res.sendFile(filePath);
    } else {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    }
});

// error handler
if (config.debug) {
    app.use(errorhandler());
} else {
    app.use(function (err, req, res, next) {
        logger.error(err);
        return res.status(500).send('500 status');
    });
}

module.exports = app;
