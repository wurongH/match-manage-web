/**
 * 重新规整工具类
 * @type {{resJson: module.exports.resJson, typeOf: module.exports.typeOf, isEmpty: module.exports.isEmpty, extend: module.exports.extend, arrayContains: module.exports.arrayContains, encode: module.exports.encode, decode: module.exports.decode}}
 */
module.exports = {
    resJson: function (err, res, json) {
        if (!err) {
            res.json({code: '9999', message: err});
        }
        else if (util.type(json) === 'undefined') {
            res.json({code: '0', message: '失败'});
        } else {
            var records = json.length;
            res.json({code: '1', message: '', records: records, rows: json});
        }
    },
    /**
     * 获取对象类型
     * @param obj
     * @returns {*|string}
     */
    typeOf: function (obj) {
        var toString = Object.prototype.toString;
        var type = {
            "undefined": "undefined",
            "number": "number",
            "boolean": "boolean",
            "string": "string",
            "[object Function]": "function",
            "[object RegExp]": "regexp",
            "[object Array]": "array",
            "[object Date]": "date",
            "[object Error]": "error"
        };

        return type[typeof obj] || type[toString.call(obj)] || (obj ? "object" : "null");
    },
    /**
     * 判断对象是否为空
     * @param object
     * @returns {boolean}
     */
    isEmpty: function (object) {
        if (object == "" || type(object) == "undefined" || type(object) == "null") {
            return true;
        } else {
            return false;
        }
    },
    /**
     * 对像扩展
     * @param target 目标对象
     * @param source  源对象
     * @param flag    是否增开不
     * @returns {*}
     */

    extend: function (target, source, flag) {
        for (var key in source) {
            target[key] = source[key];
        }
        return target;
    },
    /**
     * 判断元素是否在数组内
     * @param arr 数据
     * @param obj  查询的元素
     * @returns {boolean}
     */
    arrayContains: function (arr, obj) {
        var i = arr.length;
        while (i--) {
            if (arr[i] === obj) {
                return true;
            }
        }
        return false;
    },
    encode:function encode(crypto,plaintext){
        var param = {
            alg: 'des-ede3-cbc',    //3des-ecb
            autoPad: true,
            key: 'cptbtptpbcptdtptp$@#$%^&',
            iv: "asdfsasd"
        }
        var key = new Buffer(param.key);
        var iv = new Buffer(param.iv ? param.iv : 0)
        var alg = param.alg;
        var autoPad = param.autoPad;
        //encrypt
        var cipher = crypto.createCipheriv(alg, key, iv);
        cipher.setAutoPadding(autoPad)  //default true
        var ciph = cipher.update(plaintext, 'utf-8', 'base64');
        ciph += cipher.final('base64');
        return ciph;
    },

    decode:function decode(crypto,plaintext){
        var param = {
            alg: 'des-ede3-cbc',    //3des-ecb
            autoPad: true,
            key: 'cptbtptpbcptdtptp$@#$%^&',
            iv: "asdfsasd"
        }
        var key = new Buffer(param.key);
        var iv = new Buffer(param.iv ? param.iv : 0)
        var alg = param.alg;
        var autoPad = param.autoPad;

        var cipher = crypto.createCipheriv(alg, key, iv);
        var decipher = crypto.createDecipheriv(alg, key, iv);
        cipher.setAutoPadding(autoPad)
        var txt = decipher.update(plaintext, 'base64', 'utf-8');
        txt += decipher.final('utf-8');
        return txt;
    },
}
