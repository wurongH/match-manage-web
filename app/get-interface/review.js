let express = require('express');
let fs = require('fs');
let path = require('path');
let router = express.Router();
let multiparty = require('multiparty');
let apiHelper = require("../common/api-helper");
let config = require("../config/config");

//007061 获取赛事评审配置信息
router.post('/getReviewSetting', (req, res)=>{
    let path = config.allUrlSet.url.platformPort1+"match-boot/admin/matchInfo/getReviewSetting";
    apiHelper.getPlatformApi(path,null,req,res).then((data)=>{
        res.send(data);
    });
});

//007062 保存赛事评审配置信息
router.post('/saveReviewSetting', (req, res)=>{
    let path = config.allUrlSet.url.platformPort1+"match-boot/admin/matchInfo/saveReviewSetting";
    apiHelper.getPlatformApi(path,null,req,res).then((data)=>{
        res.send(data);
    });
});


//0074002 无标志随机抽取
router.post('/randomDrawing', (req, res)=>{
    let path = config.allUrlSet.url.platformPort1+"match-boot/admin/review/randomDrawing";
    apiHelper.getPlatformApi(path,null,req,res).then((data)=>{
        res.send(data);
    });
});

//007070 获取抽取的专家列表（传入专家类型、或组别）
router.post('/listSelectTutor', (req, res)=>{
    let path = config.allUrlSet.url.platformPort1+"match-boot/admin/review/listSelectTutor";
    apiHelper.getPlatformApi(path,null,req,res).then((data)=>{
        res.send(data);
    });
});

//007071 保存标志列表（专家类型、组别）
router.post('/saveListSelectTutor', (req, res)=>{
    let path = config.allUrlSet.url.platformPort1+"match-boot/admin/review/saveListSelectTutor";
    apiHelper.getPlatformApi(path,null,req,res).then((data)=>{
        res.send(data);
    });
});


//0074001 获取类型、数量，分组
router.post('/typesAndGroup', (req, res)=>{
    let path = config.allUrlSet.url.platformPort1+"match-boot/admin/review/typesAndGroup";
    apiHelper.getPlatformApi(path,null,req,res).then((data)=>{
        res.send(data);
    });
});


//0074003 获取抽取结果列表
router.post('/pageSelectResultList', (req, res)=>{
    let path = config.allUrlSet.url.platformPort1+"match-boot/admin/review/pageSelectResultList";
    apiHelper.getPlatformApi(path,null,req,res).then((data)=>{
        res.send(data);
    });
});

// 007055 获取专家信息getTutorInfo
router.post('/getTutorInfo', (req, res)=>{
    let path = config.allUrlSet.url.platformPort1+"match-boot/admin/tutorInfo/getTutorInfo";
    apiHelper.getPlatformApi(path,null,req,res).then((data)=>{
        res.send(data);
    });
});


//007109 移除选择的专家抽取
router.post('/removeSelect', (req, res)=>{
    let path = config.allUrlSet.url.platformPort1+"match-boot/admin/review/removeSelect";
    apiHelper.getPlatformApi(path,null,req,res).then((data)=>{
        res.send(data);
    });
});

//007101 获取赛事组别信息、符合项目、专家数
router.post('/listAssignGroup', (req, res)=>{
    let path = config.allUrlSet.url.platformPort1+"match-boot/admin/review/listAssignGroup";
    apiHelper.getPlatformApi(path,null,req,res).then((data)=>{
        res.send(data);
    });
});

//007102 一键指派
router.post('/oneKeyRandomAssign', (req, res)=>{
    let path = config.allUrlSet.url.platformPort1+"match-boot/admin/review/oneKeyRandomAssign";
    apiHelper.getPlatformApi(path,null,req,res).then((data)=>{
        res.send(data);
    });
});

//007103 按项目组一键指派
router.post('/oneKeyGroupAssign', (req, res)=>{
    let path = config.allUrlSet.url.platformPort1+"match-boot/admin/review/oneKeyGroupAssign";
    apiHelper.getPlatformApi(path,null,req,res).then((data)=>{
        res.send(data);
    });
});

//007115 获取指派界面自定义列
router.post('/assignFieldList', (req, res)=>{
    let path = config.allUrlSet.url.platformPort1+"match-boot/admin/review/assignFieldList";
    apiHelper.getPlatformApi(path,null,req,res).then((data)=>{
        res.send(data);
    });
});

//007107 确定指派
router.post('/confirmAssign', (req, res)=>{
    let path = config.allUrlSet.url.platformPort1+"match-boot/admin/review/confirmAssign";
    apiHelper.getPlatformApi(path,null,req,res).then((data)=>{
        res.send(data);
    });
});

//007115 分页获取指派结果列表
router.post('/pageProjectAssign', (req, res)=>{
    let path = config.allUrlSet.url.platformPort1+"match-boot/admin/review/pageProjectAssign";
    apiHelper.getPlatformApi(path,null,req,res).then((data)=>{
        res.send(data);
    });
});

//007116 获取待指派的专家列表（单个指派有选择标志）
router.post('/listAssignTutor', (req, res)=>{
    let path = config.allUrlSet.url.platformPort1+"match-boot/admin/review/listAssignTutor";
    apiHelper.getPlatformApi(path,null,req,res).then((data)=>{
        res.send(data);
    });
});

//007105 批量指派，会把原有的未评审的全部替换掉
router.post('/batchAssign', (req, res)=>{
    let path = config.allUrlSet.url.platformPort1+"match-boot/admin/review/batchAssign";
    apiHelper.getPlatformApi(path,null,req,res).then((data)=>{
        res.send(data);
    });
});

//0076001 获取字段配置信息
router.post('/scoreFieldList', (req, res)=>{
    let path = config.allUrlSet.url.platformPort1+"match-boot/admin/score/scoreFieldList";
    apiHelper.getPlatformApi(path,null,req,res).then((data)=>{
        res.send(data);
    });
});

//0076002 获取项目列表（传入分数计算方式支持检索，列为动态）
router.post('/projectScoreList', (req, res)=>{
    let path = config.allUrlSet.url.platformPort1+"match-boot/admin/score/projectScoreList";
    apiHelper.getPlatformApi(path,null,req,res).then((data)=>{
        res.send(data);
    });
});

//0076003 晋级、取消晋级
router.post('/projectPromote', (req, res)=>{
    let path = config.allUrlSet.url.platformPort1+"match-boot/admin/score/projectPromote";
    apiHelper.getPlatformApi(path,null,req,res).then((data)=>{
        res.send(data);
    });
});

//007107 删除某个指定的导师指派记录
router.post('/removeAssign', (req, res)=>{
    let path = config.allUrlSet.url.platformPort1+"match-boot/admin/review/removeAssign";
    apiHelper.getPlatformApi(path,null,req,res).then((data)=>{
        res.send(data);
    });
});
module.exports = router;
