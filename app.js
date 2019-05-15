/**
 * 加载依赖库，原来这个类库都封装在connect中，现在需地注单独加载
 * @type {*|exports|module.exports}
 */
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var session = require('express-session');
var redisStore = require('connect-redis')(session);
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var ejs =require('ejs');
var config = require('./app/config/config');
var log4js= require("./app/common/logger");
var compression = require('compression');

/**
 * 加载路由控制
 */
var routes = require('./app/routes');
/**
 * 创建项目实例
 */
var app = express();
app.use(compression());
/**
 * 开发环境执行打包
 */
if(config.environment.commonEnv==="dev"){
    var webpack = require('webpack');
    var webpackConfig = require('./build/webpack.dev.config');
    var compiler = webpack(webpackConfig);
    app.use(require('webpack-dev-middleware')(compiler, {
        publicPath:"/dist",
        lazy:false,
        stats: {
            colors: true,
            chunks: false
        },
    }));
    app.use(require('webpack-hot-middleware')(compiler,{
        log: false, path: '/__webpack_hmr', heartbeat: 10 * 1000
    }));
    //define static Catalog
    app.use(express.static(path.join(__dirname, 'src')));
}else{
    //define static Catalog
    app.use(express.static(path.join(__dirname, 'dist')));
}
/**
 * 定义EJS模板引擎和模板文件位置
 * 注册html模板引擎 将模版页后缀换成.html
 * 将模板引擎换成html
 *  view engine setup
 */
app.set('dist', path.join(__dirname, 'dist'));
//app.set('src', path.join(__dirname, 'src'));
app.engine('.html',ejs.__express);
app.set('view engine', 'html');

/**
 * 定义日志和输出级别
 */
//app.use(logger('dev'));
log4js.configure();
app.use(log4js.useLog());
/**
 * 定义数据解析器
 */
app.use(bodyParser.json({limit:'50mb'}));
app.use(bodyParser.urlencoded({ limit:'50mb',extended: false }));
/**
 * 定义cookie解析器
 */
app.use(cookieParser());
/**
 * 定义session
 */
app.use(session({
    cookie: {maxAge: 1000 * 60 * 60 * 24 * 30},//30 days
    store: new redisStore(config.sessionOptions),
    secret: 'ijhealthSession',
    resave: true,
    saveUninitialized: true
}));

/**
 * 拦截器，传通用值到ejs页面
 *浏览器header，文件路径等等
 * 同时设置缓存
 */
app.use(function(req, res, next){
  res.setHeader("Cache-Control", "no-cache");
  res.locals.defaultLogin = config.allUrlSet.url.defaultLogin;
  res.locals.headers = {
    headers: req.headers,
    pathName: req._parsedUrl.pathname.toLowerCase()//页面路径，不带参数
  };
  next();
});

/**
 * 匹配路径和路由
 */
routes.route(app);

/**
 * 404错误处理
 * catch 404 and forward to error handler
 */
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  //next(err);
  res.render('404');
});

/**
 * 开发环境，500错误处理和错误堆栈跟踪
 */
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
  });
}

/**
 * 生产环境，500错误处理
 * production error handler
 * no stacktraces leaked to user
 */
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});
module.exports = app;