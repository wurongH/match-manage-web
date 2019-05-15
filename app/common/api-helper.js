/**
 * author by @wzs 2018-02-03
 * api改写为promise写法,更好的做异步
*/
var http = require('http');
var https = require('https');
var querystring = require('querystring');
var utility = require("./utility");
var logger =require("./logger").logger('api-helper');
var Promise = require('bluebird');
var request = Promise.promisify(require('request'));
var fs = require('fs');
var pathReq = require('path');
var jsonBig = require('json-bigint');
var apiFun={
    getPlatformApi(path,parameter,req,res,type){
        return new Promise(function(resolve, reject){
            let token ='';
            if(req.body.token==undefined){
                token = req.session.SaiYunToken === undefined?"":req.session.SaiYunToken;
            }else{
                token = req.body.token;
                req.session.SaiYunToken = req.body.token;
                req.session.save();
            }
            console.log('传进去的token：'+token);
            parameter = utility.extend(req.query,req.body);
            parameter.appCode = 'MATCH_PC';
            var option={
                url:path+'?token='+token,
                method: 'POST',
                data:parameter
            };
            console.log("Request address and parameters:"+path+"?"+decodeURIComponent(querystring.stringify(option.data)));
            apiFun.getJsonApi(option).then((data)=>{
                resolve(data);
            }).catch((err)=>{
                reject(err);
            });
        });
    },
    getJsonApi(opt){
        return new Promise(function(resolve, reject){
            const option = {
                method: opt.method || 'POST',
                url: opt.url || '',
                json: false,

                headers: {
                    'version':'',
                    'Content-Type':"application/json",
                },
            };
            if(option.method === 'POST'){
                option.body = JSON.stringify(opt.data) || '';
            }
            request(option).then(function(response){
                if(response.statusCode === 200){
                    var _data = response['body'];
                    resolve(jsonBig.parse(_data));
                }else{
                    throw new Error('Request time out,Request address and parameters::'+opt.url);
                }
            }).catch(function(err){
                reject(err);
            });
        });
    },
    upload(opt,parameter,req,res, callback){

        let files = [ {
            urlKey : parameter.name,
            urlValue : pathReq.join(__dirname, '../uploads/'+ req.file.filename)
        }];

        parameter = utility.extend(req.query, req.body);
        var token = req.session.SaiYunToken === undefined?"":req.session.SaiYunToken;

        let options = {
            host : opt.host||"",
            port : opt.port||"",
            method :  opt.method||"POST",
            path : opt.path+'?token='+token,
            headers: {
                'Content-Type':"multipart/form-data",
            },
            data: parameter
        };
        console.log('上传文件名和提交路径 ', files, options);

        req = http.request(options, function(res) {
            let data='';
            res.on("data", function(chunk) {
                data += chunk;
            });
            res.on("end", function() {
                console.log('上传结束', data);
                var jsonData;
                try {
                    fs.unlink(files[0].urlValue,function(){
                        console.log('文件:'+ files[0].urlValue +'删除成功！');
                    });
                    jsonData = JSON.parse(data);
                    callback(false,jsonData);
                }catch(e){
                    callback(true,{err:e});
                }
            });
        });

        req.on('error', function(e) {
            fs.unlink(files[0].urlValue,function(){
                console.log('文件:'+ files[0].urlValue +'删除成功！');
            });
            callback(true, e);
        });
        this.postFile(files, req);
    },
    uploadTinymce(opt,req,res, callback){
        let files = [ {
            urlKey : 'multipartFile',
            urlValue : pathReq.join(__dirname, '../uploads/upload/'+ opt.name)
        }];
        let token = req.session.adminToken === undefined?"":req.session.adminToken;
        let options = {
            host : opt.host||"",
            port : opt.port||"",
            method :  opt.method||"POST",
            path :opt.path+'?token='+token,
            headers: {
                'Content-Type':"multipart/form-data",
            },
        };
        console.log(options);
        console.log('上传文件名和提交路径 ', files, options);

        req = http.request(options, function(res) {
            let data='';
            res.on("data", function(chunk) {
                data += chunk;
            });
            res.on("end", function() {
                console.log('上传结束', data);
                var jsonData;
                try {
                    fs.unlink(files[0].urlValue,function(){
                        console.log('文件:'+ files[0].urlValue +'删除成功！');
                    });
                    jsonData = JSON.parse(data);
                    callback(false,jsonData);
                }catch(e){
                    callback(true,{err:e});
                }
            });
        });

        req.on('error', function(e) {
            fs.unlink(files[0].urlValue,function(){
                console.log('文件:'+ files[0].urlValue +'删除成功！');
            });
            callback(true, e);
        });
        this.postFile(files, req);
    },
    postFile(fileKeyValue, req){
        var boundaryKey = Math.random().toString(16);
        var enddata = '\r\n----' + boundaryKey + '--';

        var files = new Array();
        for (var i = 0; i < fileKeyValue.length; i++) {
            var content = "\r\n----" + boundaryKey + "\r\n"
                + "Content-Type: application/octet-stream\r\n"
                + "Content-Disposition: form-data; name=\""
                + fileKeyValue[i].urlKey + "\"; filename=\""
                + pathReq.basename(fileKeyValue[i].urlValue) + "\"\r\n"
                + "Content-Transfer-Encoding: binary\r\n\r\n";
            var contentBinary = new Buffer(content, 'utf-8');// 当编码为ascii时，中文会乱码。
            files.push({
                contentBinary : contentBinary,
                filePath : fileKeyValue[i].urlValue
            });
        }
        var contentLength = 0;
        for (let i = 0; i < files.length; i++) {
            let stat = fs.statSync(files[i].filePath);
            contentLength += files[i].contentBinary.length;
            contentLength += stat.size;
        }

        req.setHeader('Content-Type', 'multipart/form-data; boundary=--'
            + boundaryKey);
        req.setHeader('Content-Length', contentLength + Buffer.byteLength(enddata));

        // 将参数发出
        var fileindex = 0;
        var doOneFile = function() {
            req.write(files[fileindex].contentBinary);
            var fileStream = fs.createReadStream(files[fileindex].filePath, {
                bufferSize : 4 * 1024
            });
            fileStream.pipe(req, {
                end : false
            });


            fileStream.on('end', function() {
                fileindex++;
                if (fileindex == files.length) {
                    req.end(enddata);
                } else {
                    doOneFile();
                }
            });
        };
        if (fileindex == files.length) {
            req.end(enddata);
        } else {
            doOneFile();
        }
    }
};
module.exports = apiFun;