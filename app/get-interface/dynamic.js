let express = require('express');
let fs = require('fs');
let path = require('path');
let router = express.Router();
let multiparty = require('multiparty');
let apiHelper = require("../common/api-helper");
let config = require("../config/config");

//根据token获取用户信息
router.post('/pageNews', (req, res)=>{
    let path = config.allUrlSet.url.platformPort1+"match-boot/admin/homepage/pageNews";
    apiHelper.getPlatformApi(path,null,req,res).then((data)=>{
        res.send(data);
    });
});

//0072011 置顶新闻，资料，通知
router.post('/topNews', (req, res)=>{
    let path = config.allUrlSet.url.platformPort1+"match-boot/admin/homepage/topNews";
    apiHelper.getPlatformApi(path,null,req,res).then((data)=>{
        res.send(data);
    });
});

//0072007 新增新闻(通知、下载，组委会)
router.post('/updateNews', (req, res)=>{
    let path = config.allUrlSet.url.platformPort1+"match-boot/admin/homepage/updateNews";
    apiHelper.getPlatformApi(path,null,req,res).then((data)=>{
        res.send(data);
    });
})
//0072012 删除新闻，通知，资料
router.post('/deleteNews', (req, res)=>{
    let path = config.allUrlSet.url.platformPort1+"match-boot/admin/homepage/deleteNews";
    apiHelper.getPlatformApi(path,null,req,res).then((data)=>{
        res.send(data);
    });
});


module.exports = router;
