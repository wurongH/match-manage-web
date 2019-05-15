let express = require('express');
let fs = require('fs');
let path = require('path');
let router = express.Router();
let multiparty = require('multiparty');
let apiHelper = require("../common/api-helper");
let config = require("../config/config");

//007050 获取专家字段(包括附件字段配置)
router.post('/listTutorFieldCfg', (req, res)=>{
    let path = config.allUrlSet.url.platformPort1+"match-boot/admin/tutorInfo/listTutorFieldCfg";
    apiHelper.getPlatformApi(path,null,req,res).then((data)=>{
        res.send(data);
    });
});

//007051 修改专家字段(包括附件字段配置)
router.post('/saveTutorFieldCfg', (req, res)=>{
    let path = config.allUrlSet.url.platformPort1+"match-boot/admin/tutorInfo/saveTutorFieldCfg";
    apiHelper.getPlatformApi(path,null,req,res).then((data)=>{
        res.send(data);
    });
});


//007059 分页获取专家列表
router.post('/pageTutorList', (req, res)=>{
    let path = config.allUrlSet.url.platformPort1+"match-boot/admin/tutorInfo/pageTutorList";
    apiHelper.getPlatformApi(path,null,req,res).then((data)=>{
        res.send(data);
    });
});

//0070157 审核导师状态
router.post('/modifyTutorStatus', (req, res)=>{
    let path = config.allUrlSet.url.platformPort1+"match-boot/admin/tutorInfo/modifyTutorStatus";
    apiHelper.getPlatformApi(path,null,req,res).then((data)=>{
        res.send(data);
    });
});


//007055 获取专家信息
router.post('/getTutorInfo', (req, res)=>{
    let path = config.allUrlSet.url.platformPort1+"match-boot/admin/tutorInfo/getTutorInfo";
    apiHelper.getPlatformApi(path,null,req,res).then((data)=>{
        res.send(data);
    });
});

//007014获取大赛通用类型字典
router.post('/getMatchComType', (req, res)=>{
    let path = config.allUrlSet.url.platformPort1+"match-boot/matchInfo/getMatchComType";
    apiHelper.getPlatformApi(path,null,req,res).then((data)=>{
        res.send(data);
    });
});
module.exports = router;
