let express = require('express');
let fs = require('fs');
let path = require('path');
let router = express.Router();
let multiparty = require('multiparty');
let apiHelper = require("../common/api-helper");
let config = require("../config/config");

//0072018 根据赛道id、等级id、管理id获取已经创建的赛事的届别
router.post('/listSessionIndex', (req, res)=>{
    let path = config.allUrlSet.url.platformPort1+"match-boot/admin/matchInfo/listSessionIndex";
    apiHelper.getPlatformApi(path,null,req,res).then((data)=>{
        res.send(data);
    });
});

//0072020 获取项目信息字段配置（项目信息、团队信息、指导老师信息、五种附件类型）
router.post('/defaultProjectCollectionSetting', (req, res)=>{
    let path = config.allUrlSet.url.platformPort1+"match-boot/admin/projectInfo/defaultProjectCollectionSetting";
    apiHelper.getPlatformApi(path,null,req,res).then((data)=>{
        res.send(data);
    });
});
//0072021 保存修改组别数量，保存新增对应的信息字段,保存设置开始时间、结束时间
router.post('/saveProjectCollectionSetting', (req, res)=>{
    let path = config.allUrlSet.url.platformPort1+"match-boot/admin/projectInfo/saveProjectCollectionSetting";
    apiHelper.getPlatformApi(path,null,req,res).then((data)=>{
        res.send(data);
    });
});

//007062 新增自定义字段
router.post('/addField', (req, res)=>{
    let path = config.allUrlSet.url.platformPort1+"match-boot/admin/extendfield/addField";
    apiHelper.getPlatformApi(path,null,req,res).then((data)=>{
        res.send(data);
    });
});

//007063 删除自定义字段
router.post('/delField', (req, res)=>{
    let path = config.allUrlSet.url.platformPort1+"match-boot/admin/extendfield/delField";
    apiHelper.getPlatformApi(path,null,req,res).then((data)=>{
        res.send(data);
    });
});

//007070 获取文件类型字典（用于下拉框）
router.post('/dictFileFormat', (req, res)=>{
    let path = config.allUrlSet.url.platformPort1+"match-boot/admin/projectInfo/dictFileFormat";
    apiHelper.getPlatformApi(path,null,req,res).then((data)=>{
        res.send(data);
    });
});

//0072022 获取项目列表，支持查询
router.post('/pageResultProjectList', (req, res)=>{
    let path = config.allUrlSet.url.platformPort1+"match-boot/admin/projectInfo/pageResultProjectList";
    apiHelper.getPlatformApi(path,null,req,res).then((data)=>{
        res.send(data);
    });
});

//0072023  获取项目性质的枚举类型
router.post('/declareTypeEnums', (req, res)=>{
    let path = config.allUrlSet.url.platformPort1+"match-boot/admin/projectInfo/declareTypeEnums";
    apiHelper.getPlatformApi(path,null,req,res).then((data)=>{
        res.send(data);
    });
});

//0072024 获取审核状态
router.post('/checkStatusEnums', (req, res)=>{
    let path = config.allUrlSet.url.platformPort1+"match-boot/admin/projectInfo/checkStatusEnums";
    apiHelper.getPlatformApi(path,null,req,res).then((data)=>{
        res.send(data);
    });
});

//0072025 查看项目详情（获取基本信息、团队、成员、pdf等）
router.post('/viewProjectInfo', (req, res)=>{
    let path = config.allUrlSet.url.platformPort1+"match-boot/admin/projectInfo/viewProjectInfo";
    apiHelper.getPlatformApi(path,null,req,res).then((data)=>{
        res.send(data);
    });
});

//0072026 审核项目（通过、未通过、退回重新提交）
router.post('/reviewProject', (req, res)=>{
    let path = config.allUrlSet.url.platformPort1+"match-boot/admin/projectInfo/reviewProject";
    apiHelper.getPlatformApi(path,null,req,res).then((data)=>{
        res.send(data);
    });
});

//0072027 项目列表页面下拉框选项值
router.post('/projectdropDownBox', (req, res)=>{
    let path = config.allUrlSet.url.platformPort1+"match-boot/admin/projectInfo/projectdropDownBox";
    apiHelper.getPlatformApi(path,null,req,res).then((data)=>{
        res.send(data);
    });
});


module.exports = router;
