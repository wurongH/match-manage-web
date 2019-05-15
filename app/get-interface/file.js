let express = require('express');
let router = express.Router();
let apiHelper = require("../common/api-helper");
let config = require("../config/config");
let multer  = require('multer');
let fs = require("fs");

//设置文件上传配置
let storage = multer.diskStorage({
    destination: function (req, file, cb) {//上传文件存放地址
        cb(null, 'app/uploads/');
    },
    filename: function (req, file, cb) {//上传文件生成的文件名
        let arr = file.originalname.split('.');
        cb(null, arr[0]+ '-' + Date.now() + '.' + arr[1]);
    }
});
let upload = multer({ storage: storage });

//文件上传
router.post('/uploadFile', upload.single('file'), (req, res)=> {
    let urlArr = config.allUrlSet.url.platformPort1.substring(7, config.allUrlSet.url.platformPort1.length-1).split(":");

    let opt = {
        host : urlArr[0],
        port : urlArr[1],
        method : "POST",
        path : "/fastdfs-boot/upload"
    };

    apiHelper.upload(opt,{name: 'multipartFile'},req,res, function(err, data){
        if(err){
            res.send({
                code: '99999999',
                data: data,
                message: '文件上传失败'
            });
        }else{
            console.log('data ', data);
            res.send(data);
        }
    });
});


//tinymce编辑器图片上传
router.post("/uploadTinymce",(req, res)=> {
    //接收前台POST过来的base64
    let base64Data = req.body.imgData.replace(/^data:image\/\w+;base64,/, "");
    let dataBuffer = new Buffer(base64Data, 'base64');
    let name = (new Date()).getTime()+".png";
    fs.writeFile("app/uploads/upload/"+name, dataBuffer, function(err) {
        if(err){
            res.send(err);
        }else{
            let urlArr = config.allUrlSet.url.platformPort1.substring(7, config.allUrlSet.url.platformPort1.length-1).split(":");
            let opt = {
                host : urlArr[0],
                port : urlArr[1],
                method : "POST",
                path : "/fastdfs-boot/upload",
                name:name
            };
            apiHelper.uploadTinymce(opt,req,res, function(err, data){
                if(err){
                    res.send({
                        code: '99999999',
                        data: data,
                        message: '文件上传失败'
                    });
                }else{
                    console.log('data ', data);
                    res.send(data);
                }
            });
        }
    });
});

module.exports = router;
