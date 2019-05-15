/**
 * created by @wzs
 */
let index = require("./index/index");
let user = require("./get-interface/user");
let main = require("./get-interface/main");
let file = require("./get-interface/file");
let dynamic = require("./get-interface/dynamic");
let project = require("./get-interface/project");
let expert = require("./get-interface/expert");
let review = require("./get-interface/review");
let authorize = require("./get-interface/authorize");
let audit = require("./get-interface/audit");
exports.route=function(app){
    //首页
    app.use('/',index);

    app.use('/user', user);

    app.use('/main',main);

    app.use('/file',file);

    app.use('/dynamic',dynamic);

    app.use('/project',project);

    app.use('/expert',expert);

    app.use('/review',review);

    app.use('/authorize',authorize);

    app.use('/audit',audit);
}
