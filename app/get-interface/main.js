let express = require('express');
let fs = require('fs');
let path = require('path');
let router = express.Router();
let apiHelper = require("../common/api-helper");
let config = require("../config/config");


//赛道列表
router.post('/pageMatch', (req, res)=>{
    let path = config.allUrlSet.url.platformPort1+"match-boot/admin/matchInfo/pageMatch";
    apiHelper.getPlatformApi(path,null,req,res).then((data)=>{
        res.send(data);
    });
});

//根据赛道id，等级id，管理id，获取届别
router.post('/listNewSessionIndex', (req, res)=>{
    let path = config.allUrlSet.url.platformPort1+"match-boot/admin/matchInfo/listNewSessionIndex";
    apiHelper.getPlatformApi(path,null,req,res).then((data)=>{
        res.send(data);
    });
});

//修改赛事信息
router.post('/updateMatch', (req, res)=>{
    let path = config.allUrlSet.url.platformPort1+"match-boot/admin/matchInfo/updateMatch";
    apiHelper.getPlatformApi(path,null,req,res).then((data)=>{
        res.send(data);
    });
});

//新增赛事信息
router.post('/newMatch', (req, res)=>{
    let path = config.allUrlSet.url.platformPort1+"match-boot/admin/matchInfo/newMatch";
    apiHelper.getPlatformApi(path,null,req,res).then((data)=>{
        res.send(data);
    });
});

//关闭赛事
router.post('/endMatch', (req, res)=>{
    let path = config.allUrlSet.url.platformPort1+"match-boot/admin/matchInfo/endMatch";
    apiHelper.getPlatformApi(path,null,req,res).then((data)=>{
        res.send(data);
    });
});

//根据赛道id、等级id、管理id获取轮播图
router.post('/pageHomeSlideShow', (req, res)=>{
    let path = config.allUrlSet.url.platformPort1+"match-boot/admin/homepage/pageHomeSlideShow";
    apiHelper.getPlatformApi(path,null,req,res).then((data)=>{
        res.send(data);
    });
});


//更新轮播图
router.post('/updateHomeSlideShow', (req, res)=>{
    let path = config.allUrlSet.url.platformPort1+"match-boot/admin/homepage/updateHomeSlideShow";
    apiHelper.getPlatformApi(path,null,req,res).then((data)=>{
        res.send(data);
    });
});

//删除轮播图
router.post('/deleteHomeSlideShow', (req, res)=>{
    let path = config.allUrlSet.url.platformPort1+"match-boot/admin/homepage/deleteHomeSlideShow";
    apiHelper.getPlatformApi(path,null,req,res).then((data)=>{
        res.send(data);
    });
});

//新增组委会
router.post('/updateNews', (req, res)=>{
    let path = config.allUrlSet.url.platformPort1+"match-boot/admin/homepage/updateNews";
    apiHelper.getPlatformApi(path,null,req,res).then((data)=>{
        res.send(data);
    });
});

//新增组委会
router.post('/getCommitteeInfo', (req, res)=>{
    let path = config.allUrlSet.url.platformPort1+"match-boot/admin/homepage/getCommitteeInfo";
    apiHelper.getPlatformApi(path,null,req,res).then((data)=>{
        res.send(data);
    });
});



module.exports = router;
