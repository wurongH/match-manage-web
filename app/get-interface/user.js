let express = require('express');
let fs = require('fs');
let path = require('path');
let router = express.Router();
let multiparty = require('multiparty');
let apiHelper = require("../common/api-helper");
let config = require("../config/config");


//007055 获取专家信息
router.post('/getTutorInfo', (req, res)=>{
    let path = config.allUrlSet.url.platformPort1+"match-boot/admin/tutorInfo/getTutorInfo";
    apiHelper.getPlatformApi(path,null,req,res).then((data)=>{
        res.send(data);
    });
});

//根据token获取用户信息
router.post('/verifyToken', (req, res)=>{
    let path = config.allUrlSet.url.platformPort1+"match-boot/token/verifyToken";
    apiHelper.getPlatformApi(path,null,req,res).then((data)=>{
        if(data.code==0){
            req.session.SaiYunToken = data.data.token;
            req.session.save();
        }
        res.send(data);
    });
});

//007050 管理员获取菜单
router.post('/listSubTreeMenu', (req, res)=>{
    let path = config.allUrlSet.url.platformPort1+"match-boot/admin/menu/listSubTreeMenu";
    apiHelper.getPlatformApi(path,null,req,res).then((data)=>{
        res.send(data);
    });
});

//修改密码
router.post('/updatapwd', (req, res)=>{
    let path = config.allUrlSet.url.platformPort1+"/oauth-boot/oauth/modifyPwd";
    apiHelper.getPlatformApi(path,null,req,res).then((data)=>{
        res.send(data);
    });
});


//退出登录 logout
router.post('/logout', (req, res)=>{
    let path = config.allUrlSet.url.platformPort1+"oauth-boot/oauth/logout";
    apiHelper.getPlatformApi(path,null,req,res).then((data)=>{
        res.send(data);
    });
});
module.exports = router;
