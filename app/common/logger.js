var log4js = require('log4js');
var config =require('../config/config');
/**
 * 多进程的日志配置
 * @param mode
 */
exports.configure = function(mode) {
    log4js.configure(config.log4jsOptions);
}

/**
 * 暴露到应用的日志接口，调用该方法前必须确保已经configure过
 * @param name 指定log4js配置文件中的category。依此找到对应的appender。
 *              如果appender没有写上category，则为默认的category。可以有多个
 * @returns {Logger}
 */
exports.logger = function(name) {
    var dateFileLog = log4js.getLogger(name);
    dateFileLog.setLevel(log4js.levels.INFO);
    //dateFileLog.setLevel(log4js.levels.DEBUG);
    return dateFileLog;
}

/**
 * 用于express中间件，调用该方法前必须确保已经configure过
 * @returns {Function|*}
 */
exports.useLog = function() {
    return log4js.connectLogger(log4js.getLogger("zoe-ijhealth-app-log"), {level: log4js.levels.INFO});
}