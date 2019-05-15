let express = require('express');
let fs = require('fs');
let path = require('path');
let router = express.Router();
let multiparty = require('multiparty');
let apiHelper = require("../common/api-helper");
let config = require("../config/config");

//0073005 分页获取已/未审核列表（模糊检索）
router.post('/pageResultEventApplyList', (req, res)=>{
    let path = config.allUrlSet.url.platformPort1+"match-boot/admin/manageInfo/pageResultEventApplyList";
    apiHelper.getPlatformApi(path,null,req,res).then((data)=>{
        res.send(data);
    });
});


//0073006 审核申请的赛事
router.post('/checkApplyEvent', (req, res)=>{
    let path = config.allUrlSet.url.platformPort1+"match-boot/admin/manageInfo/checkApplyEvent";
    apiHelper.getPlatformApi(path,null,req,res).then((data)=>{
        res.send(data);
    });
});



//007070 发送用户密码给管理员
router.post('/sendUidAndPwd', (req, res)=>{
    let path = config.allUrlSet.url.platformPort1+"match-boot/admin/manageInfo/sendUidAndPwd";
    apiHelper.getPlatformApi(path,null,req,res).then((data)=>{
        res.send(data);
    });
});

module.exports = router;
