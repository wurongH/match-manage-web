let express = require('express');
let fs = require('fs');
let path = require('path');
let router = express.Router();
let multiparty = require('multiparty');
let apiHelper = require("../common/api-helper");
let config = require("../config/config");

//0073001 根据手机号获取用户信息
router.post('/getStuInfoByPhone', (req, res)=>{
    let path = config.allUrlSet.url.platformPort1+"match-boot/admin/projectInfo/getStuInfoByPhone";
    apiHelper.getPlatformApi(path,null,req,res).then((data)=>{
        res.send(data);
    });
});

//0073002 授权提交权限
router.post('/authorityToSubmit', (req, res)=>{
    let path = config.allUrlSet.url.platformPort1+"match-boot/admin/projectInfo/authorityToSubmit";
    apiHelper.getPlatformApi(path,null,req,res).then((data)=>{
        res.send(data);
    });
});

//0073003 下级管理员分页获取报送（项目）列表
router.post('/pageResulEntryInfoList', (req, res)=>{
    let path = config.allUrlSet.url.platformPort1+"match-boot/admin/projectInfo/pageAuthorProjectList";
    apiHelper.getPlatformApi(path,null,req,res).then((data)=>{
        res.send(data);
    });
});


//0073004 下级管理员审核项目，下级管理员上报项目
router.post('/auditOrReport', (req, res)=>{
    let path = config.allUrlSet.url.platformPort1+"match-boot/admin/projectInfo/auditOrReport";
    apiHelper.getPlatformApi(path,null,req,res).then((data)=>{
        res.send(data);
    });
});

//007001 获取所有赛道列表
router.post('/listAllTrack', (req, res)=>{
    let path = config.allUrlSet.url.platformPort1+"match-boot/index/listAllTrack";
    apiHelper.getPlatformApi(path,null,req,res).then((data)=>{
        res.send(data);
    });
});

//007006 选择子级管理列表
router.post('/selectSubManageList', (req, res)=>{
    let path = config.allUrlSet.url.platformPort1+"match-boot/index/selectSubManageList";
    apiHelper.getPlatformApi(path,null,req,res).then((data)=>{
        res.send(data);
    });
});

//007015 获取比赛等级列表
router.post('/listMatchLevel', (req, res)=>{
    let path = config.allUrlSet.url.platformPort1+"match-boot/matchInfo/listMatchLevel";
    apiHelper.getPlatformApi(path,null,req,res).then((data)=>{
        res.send(data);
    });
});

//0073005 获取父赛道id，父管理id，父等级id
router.post('/getParentManagerLevelId', (req, res)=>{
    let path = config.allUrlSet.url.platformPort1+"match-boot/admin/projectInfo/getParentManagerLevelId";
    apiHelper.getPlatformApi(path,null,req,res).then((data)=>{
        res.send(data);
    });
});

//007102 获取父级届列表（倒序）
router.post('/listParentSessionIndex', (req, res)=>{
    let path = config.allUrlSet.url.platformPort1+"match-boot/admin/matchInfo/listParentSessionIndex";
    apiHelper.getPlatformApi(path,null,req,res).then((data)=>{
        res.send(data);
    });
});

//0073006 修改项目排名
router.post('/modifyRanking', (req, res)=>{
    let path = config.allUrlSet.url.platformPort1+"match-boot/admin/projectInfo/modifyRanking";
    apiHelper.getPlatformApi(path,null,req,res).then((data)=>{
      console.log(110);
        res.send(data);
    });
});

//0073004 下级管理员审核项目，下级管理员上报项目
router.post('/auditOrReport', (req, res)=>{
    let path = config.allUrlSet.url.platformPort1+"match-boot/admin/projectInfo/auditOrReport";
    apiHelper.getPlatformApi(path,null,req,res).then((data)=>{
      console.log(110);
        res.send(data);
    });
});
module.exports = router;
