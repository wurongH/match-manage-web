/**
 * author by @wzs 2018-02-03
 * 配置重新定义,精简配置
 */
let app = require('express')();
let platFormUrl= {};
let env="dev";
    switch(env){
        case "dev":
            platFormUrl={
                platformPort1:"http://10.0.0.52:9051/",
                port:3030,
                redisHost:'10.0.0.26',
                redisPort:6383,
                defaultLogin:'http://ptb.zhzjcxcy.com'
            };
            break;
        case "docker-dev":
            platFormUrl={
                platformPort1:"",
                port:3030,
                redisHost:'localhost',
                redisPort:6383,
                defaultLogin:'http://ptb.zhzjcxcy.com'
            };
            break;
        case "test":
            platFormUrl={
                platformPort1:"",
                port:3030,
                redisHost:'localhost',
                redisPort:6383,
                defaultLogin:'http://ptb.zhzjcxcy.com'
            };
            break;
        case "real":
            platFormUrl={
                platformPort1:"http://47.107.249.116:9051/",
                port:3030,
                redisHost:'localhost',
                redisPort:6383,
                defaultLogin:'http://ptb.zhzjcxcy.com'
            };
            break;
    }
module.exports={
    allUrlSet: {
        url:platFormUrl
    },
    //环境变量,设置环境变量
    environment:{
        commonEnv:env
    },
    /**
     * 平台API地址
     */
    apiPlatformUrl : {
        host:'172.16.34.220',
        port:'8080',
    },
    /**
     * log4js配置信息
     */
    log4jsOptions:{
        "appenders": [
            {
                "type": "console",
                "category": "console"
            },
            {
                "type": "dateFile",
                "filename": "logs/",
                "pattern": "zoe-ijhealth-app-yyyy-MM-dd.log",
                "alwaysIncludePattern": true,
                "pollInterval": 1,
                "category": "zoe-ijhealth-app",
                maxLogSize: 1024,
                backups:4
            }
        ],
        replaceConsole: true
    },
    /**
     * session配置
     */
    sessionOptions : {
        host : platFormUrl.redisHost,
        port : platFormUrl.redisPort,//端口号
        ttl : 60 * 60 * 24 * 30,   //Session的有效期为30天
        //  pass : 'zoenet'  //密码
    }
};
