import axios from 'axios';
import env from '../../build/env';
import api from '@/api/fetch-api';

let util = {

};
util.title = function (title) {
    title = title || '青创云赛事后台管理';
    window.document.title = title;
};

const ajaxUrl = env === 'development'
    ? 'http://127.0.0.1:8888'
    : env === 'production'
        ? 'https://www.url.com'
        : 'https://debug.url.com';

util.ajax = axios.create({
    baseURL: ajaxUrl,
    timeout: 30000
});

util.inOf = function (arr, targetArr) {
    let res = true;
    arr.map(item => {
        if (targetArr.indexOf(item) < 0) {
            res = false;
        }
    });
    return res;
};

util.oneOf = function (ele, targetArr) {
    if (targetArr.indexOf(ele) >= 0) {
        return true;
    } else {
        return false;
    }
};

util.showThisRoute = function (itAccess, currentAccess) {
    if (typeof itAccess === 'object' && Array.isArray(itAccess)) {
        return util.oneOf(currentAccess, itAccess);
    } else {
        return itAccess === currentAccess;
    }
};

util.getRouterObjByName = function (routers, name) {
    if (!name || !routers || !routers.length) {
        return null;
    }
    let routerObj = null;
    for (let item of routers) {
        if (item.name === name) {
            return item;
        }
        routerObj = util.getRouterObjByName(item.children, name);
        if (routerObj) {
            return routerObj;
        }
    }
    return null;
};

util.handleTitle = function (vm, item) {
    if (typeof item.title === 'object') {
        return vm.$t(item.title.i18n);
    } else {
        return item.title;
    }
};

//判断数组是否拥有对应的字符串
util.arrayContains=function( str,array ){
    if(array instanceof Array){
        for (let i in array) {
            if (str == array[i]) return true;
        }
        return false;
    }else{
        return false;
    }
},

util.setCurrentPath = function (vm, name) {
    let title = '';
    let isOtherRouter = false;
    vm.$store.state.app.routers.forEach(item => {
        if (item.children.length === 1) {
            if (item.children[0].name === name) {
                title = util.handleTitle(vm, item);
                if (item.name === 'otherRouter') {
                    isOtherRouter = true;
                }
            }
        } else {
            item.children.forEach(child => {
                if (child.name === name) {
                    title = util.handleTitle(vm, child);
                    if (item.name === 'otherRouter') {
                        isOtherRouter = true;
                    }
                }
            });
        }
    });
    let currentPathArr = [];
    if (name === 'home_index') {
        currentPathArr = [
            {
                title: util.handleTitle(vm, util.getRouterObjByName(vm.$store.state.app.routers, 'home_index')),
                path: '',
                name: 'home_index'
            }
        ];
    } else if ((name.indexOf('_index') >= 0 || isOtherRouter) && name !== 'home_index') {
        currentPathArr = [
            {
                title: util.handleTitle(vm, util.getRouterObjByName(vm.$store.state.app.routers, 'home_index')),
                path: '/home',
                name: 'home_index'
            },
            {
                title: title,
                path: '',
                name: name
            }
        ];
    } else {
        let currentPathObj = vm.$store.state.app.routers.filter(item => {
            if (item.children.length == 0) {
                return item.name === name;
            } else {
                for(let val of item.children){
                    if (val.name === name) {
                        return true;
                    }
                    if(val.children!==undefined&&val.children.length >= 1){
                        for(let valChild of val.children){
                            if (valChild.name === name) {
                                return true;
                            }
                        }
                    }
                }
                return false
            }
        })[0];
        if (currentPathObj.children.length <= 1 && currentPathObj.name === 'home') {
            currentPathArr = [
                {
                    title: '首页',
                    path: '',
                    name: 'home_index'
                }
            ];
        } else if (currentPathObj.children.length <= 1 && currentPathObj.name !== 'home') {
            currentPathArr = [
                {
                    title: currentPathObj.title,
                    path: '',
                    name: name
                }
            ];
        } else {
            let childObj = currentPathObj.children.filter((child) => {
                if(child.children!==undefined&&child.children.length >= 1){
                    for(let val of child.children){
                        if (val.name === name) {
                            return true;
                        }
                    }
                }
                return child.name === name;
            })[0];
            if(childObj.children!==undefined) {
                let obj = {};
                for(let val of childObj.children){
                    if (val.name === name) {
                        obj={
                            title: val.title,
                            path: val.path + '/' + val.path,
                            name: name
                        }
                    }
                }
                currentPathArr = [
                    {
                        title: '首页',
                        path: '/home',
                        name: 'home_index'
                    },
                    {
                        title: currentPathObj.title,
                        path: '',
                        name: currentPathObj.name
                    },
                    {
                        title: childObj.title,
                        path: currentPathObj.path + '/' + childObj.path,
                        name: name
                    },
                    obj
                ];
            }else{
                currentPathArr = [
                    {
                        title: '首页',
                        path: '/home',
                        name: 'home_index'
                    },
                    {
                        title: currentPathObj.title,
                        path: '',
                        name: currentPathObj.name
                    },
                    {
                        title: childObj.title,
                        path: currentPathObj.path + '/' + childObj.path,
                        name: name
                    }
                ];
            }
        }
    }
    vm.$store.commit('setCurrentPath', currentPathArr);

    return currentPathArr;
};

util.openNewPage = function (vm, name, argu, query) {
    let pageOpenedList = vm.$store.state.app.pageOpenedList;
    let openedPageLen = pageOpenedList.length;
    let i = 0;
    let tagHasOpened = false;
    while (i < openedPageLen) {
        if (name === pageOpenedList[i].name) { // 页面已经打开
            vm.$store.commit('pageOpenedList', {
                index: i,
                argu: argu,
                query: query
            });
            tagHasOpened = true;
            break;
        }
        i++;
    }
    if (!tagHasOpened) {
        //确实是不是三级菜单
        let threeMenu=false;
        let tag = vm.$store.state.app.tagsList.filter((item) => {
            if (item.hasOwnProperty('children')) {
                for(let val of item.children){
                    if (val.name === name) {
                        threeMenu=true;
                        return name === val.name;
                    }
                }
                return false;
            } else {
                return name === item.name;
            }
        });
        if(threeMenu){
            for(let val of  tag[0].children){
                if (val.name === name) {
                    tag = val;
                }
            }
        }else{
            tag = tag[0];
        }
        if (tag) {
            tag = tag.children ? tag.children[0] : tag;
            if (argu) {
                tag.argu = argu;
            }
            if (query) {
                tag.query = query;
            }
            vm.$store.commit('increateTag', tag);
        }
    }
    vm.$store.commit('setCurrentPageName', name);
};

util.toDefaultPage = function (routers, name, route, next) {
    let len = routers.length;
    let i = 0;
    let notHandle = true;
    while (i < len) {
        if (routers[i].name === name && routers[i].children && routers[i].redirect === undefined) {
            route.replace({
                name: routers[i].children[0].name
            });
            notHandle = false;
            next();
            break;
        }
        i++;
    }
    if (notHandle) {
        next();
    }
};

util.fullscreenEvent = function (vm) {
    vm.$store.commit('initCachepage');
    // 权限菜单过滤相关
    vm.$store.commit('updateMenulist');
};

util.generaMenu = function(routers,data){
    data.forEach((data)=>{
        let menu = Object.assign({},data)
        menu.component =()=> require([`@/views/${data.name}.vue`])
        //menu.component = data.component;
        if(data.children!==undefined){
            menu.children=util.generaMenu(menu.children,data.children);
        }
        routers.push(menu);
    });
    return routers;
}
util.filterAsyncRouter=function(allNameRoute,asyncRouterMap) {
    const accessedRouters = asyncRouterMap.filter((route) => {
        if(util.contains(allNameRoute,route.name)){
            if (route.children && route.children.length) {
                route.children = util.filterAsyncRouter(allNameRoute,route.children);
            }
            return true;
        }
        return false;
    })
    return accessedRouters;
}
//判断数组中是否有存在某个值
util.contains=function(arr, obj) {
    var i = arr.length;
    while (i--) {
        if (arr[i] === obj) {
            return true;
        }
    }
    return false;
}
//获取某个遍历结果
util.ergodic= function(arr,name)
{
   let returnArray = [];
   for(let i=0;i <arr.length;i++){
       returnArray.push(arr[i]["name"]);
       if(arr[i].children!==undefined){
           returnArray = returnArray.concat(util.ergodic(arr[i].children));
       }
   }
   return returnArray;
};

//判断手机号码
util.isTelephone= function(phone){
    return phone && /^0?1[3|4|5|6|7|8|9][0-9]{9}$/.test(phone)?true:false;
};

util.isSeatNumber = function (phone) {
    return phone && /^0\d{2,3}-\d{7,8}$/.test(phone) ? true : false;
}

//判断邮箱
util.isEmail= function(email){
    return email && /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/.test(email)?true:false;
};

// 判断网址
util.isWebsite= function(url){
    return url && /^(https?|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/.test(url)?true:false;
};

var vcity={ 11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",
    21:"辽宁",22:"吉林",23:"黑龙江",31:"上海",32:"江苏",
    33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",
    42:"湖北",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",
    51:"四川",52:"贵州",53:"云南",54:"西藏",61:"陕西",62:"甘肃",
    63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"
};

//检查号码是否符合规范，包括长度，类型
function isCardNo(card){
    //身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
    var reg = /(^\d{15}$)|(^\d{17}(\d|X)$)/;
    if(reg.test(card) === false)
    {
        return false;
    }

    return true;
};

//取身份证前两位,校验省份
function checkProvince(card) {
    var province = card.substr(0,2);
    if(vcity[province] == undefined)
    {
        return false;
    }
    return true;
};

//检查生日是否正确
function checkBirthday(card) {
    var len = card.length;
    //身份证15位时，次序为省（3位）市（3位）年（2位）月（2位）日（2位）校验位（3位），皆为数字
    if(len == '15')
    {
        var re_fifteen = /^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/;
        var arr_data = card.match(re_fifteen);
        var year = arr_data[2];
        var month = arr_data[3];
        var day = arr_data[4];
        var birthday = new Date('19'+year+'/'+month+'/'+day);
        return verifyBirthday('19'+year,month,day,birthday);
    }
    //身份证18位时，次序为省（3位）市（3位）年（4位）月（2位）日（2位）校验位（4位），校验位末尾可能为X
    if(len == '18')
    {
        var re_eighteen = /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/;
        var arr_data = card.match(re_eighteen);
        var year = arr_data[2];
        var month = arr_data[3];
        var day = arr_data[4];
        var birthday = new Date(year+'/'+month+'/'+day);
        return verifyBirthday(year,month,day,birthday);
    }
    return false;
}

//校验日期
function verifyBirthday(year,month,day,birthday) {
    var now = new Date();
    var now_year = now.getFullYear();
    //年月日是否合理
    if(birthday.getFullYear() == year && (birthday.getMonth() + 1) == month && birthday.getDate() == day)
    {
        //判断年份的范围（0岁到200岁之间)
        var time = now_year - year;
        if(time >= 0 && time <= 200)
        {
            return true;
        }
        return false;
    }
    return false;
}

//校验位的检测
function checkParity(card) {
    //15位转18位
    card = changeFivteenToEighteen(card);
    var len = card.length;
    if(len == '18')
    {
        var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
        var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
        var cardTemp = 0, i, valnum;
        for(i = 0; i < 17; i ++)
        {
            cardTemp += card.substr(i, 1) * arrInt[i];
        }
        valnum = arrCh[cardTemp % 11];
        if (valnum == card.substr(17, 1))
        {
            return true;
        }
        return false;
    }
    return false;
};

//15位转18位身份证号
function changeFivteenToEighteen(card) {
    if(card.length == '15')
    {
        var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
        var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
        var cardTemp = 0, i;
        card = card.substr(0, 6) + '19' + card.substr(6, card.length - 6);
        for(i = 0; i < 17; i ++)
        {
            cardTemp += card.substr(i, 1) * arrInt[i];
        }
        card += arrCh[cardTemp % 11];
        return card;
    }
    return card;
};

//返回根据生日对应的年龄
function jsGetAge(strBirthday) {
    var returnAge;
    var strBirthdayArr = strBirthday.split("-");
    var birthYear = strBirthdayArr[0];
    var birthMonth = strBirthdayArr[1];
    var birthDay = strBirthdayArr[2];

    var d = new Date();
    var nowYear = d.getFullYear();
    var nowMonth = d.getMonth() + 1;
    var nowDay = d.getDate();

    if (nowYear == birthYear) {
        returnAge = 0;//同年 则为0岁
    } else {
        var ageDiff = nowYear - birthYear; //年之差
        if (ageDiff > 0) {
            if (nowMonth == birthMonth) {
                var dayDiff = nowDay - birthDay;//日之差
                if (dayDiff < 0) {
                    returnAge = ageDiff - 1;
                }
                else {
                    returnAge = ageDiff;
                }
            } else {
                var monthDiff = nowMonth - birthMonth;//月之差
                if (monthDiff < 0) {
                    returnAge = ageDiff - 1;
                }
                else {
                    returnAge = ageDiff;
                }
            }
        }
        else {
            returnAge = -1;//返回-1 表示出生日期输入错误 晚于今天}
        }
    }
    return returnAge;//返回周岁年龄
}

// 身份证号码效验
util.checkIDCard = function(card){
    //是否为空
    if(card === ''){
        return false;
    }
    //校验长度，类型
    if(isCardNo(card) === false){
        return false;
    }
    //检查省份
    if(checkProvince(card) === false){
        return false;
    }
    //校验生日
    if(checkBirthday(card) === false){
        return false;
    }
    //检验位的检测
    if(checkParity(card) === false){
        return false;
    }
    return true;
};

//返回根据生日对应的年龄
util.jsGetAge = function(strBirthday) {
    if(!strBirthday){
        return "";
    }
    var returnAge;
    var strBirthdayArr = strBirthday.split("-");
    var birthYear = strBirthdayArr[0];
    var birthMonth = strBirthdayArr[1];
    var birthDay = strBirthdayArr[2];

    var d = new Date();
    var nowYear = d.getFullYear();
    var nowMonth = d.getMonth() + 1;
    var nowDay = d.getDate();

    if (nowYear == birthYear) {
        returnAge = 0;//同年 则为0岁
    } else {
        var ageDiff = nowYear - birthYear; //年之差
        if (ageDiff > 0) {
            if (nowMonth == birthMonth) {
                var dayDiff = nowDay - birthDay;//日之差
                if (dayDiff < 0) {
                    returnAge = ageDiff - 1;
                }
                else {
                    returnAge = ageDiff;
                }
            } else {
                var monthDiff = nowMonth - birthMonth;//月之差
                if (monthDiff < 0) {
                    returnAge = ageDiff - 1;
                }
                else {
                    returnAge = ageDiff;
                }
            }
        }else {
            returnAge = -1;//返回-1 表示出生日期输入错误 晚于今天}
        }
    }
    return returnAge;//返回周岁年龄
};
// 添加时间格式化（fmt:yyyy-MM-dd hh:mm:ss）
util.Format = function(date,fmtStr){
    Date.prototype.Format = function (fmt) {
        var o = {
            "M+": this.getMonth() + 1, //月份
            "d+": this.getDate(), //日
            "h+": this.getHours(), //小时
            "m+": this.getMinutes(), //分
            "s+": this.getSeconds(), //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    };
    return date.Format(fmtStr);
};
// 比较时间大小，时间精确到年、月、日、分、秒均可
util.compareTime = function(startTime,endTime) {
    let result = Date.parse(startTime) - Date.parse(endTime);
    if (result < 0) {
        return "small";
    } else if (result > 0) {
        return "big";
    } else if (result == 0) {
        return "same";
    } else {
        return 'exception';
    }
};

/**
 * 名称：DataLength
 * 功能：计算数据的长度
 * 入口参数：fData：需要计算的数据
 * 出口参数：返回fData的长度(Unicode长度为2，非Unicode长度为1)
 */
util.dataLength=function(data){
    var intLength=0;
    for (var i=0;i<data.length;i++)
    {
        if ((data.charCodeAt(i) < 0) || (data.charCodeAt(i) > 255))
            intLength=intLength+2;
        else
            intLength=intLength+1;
    }
    return intLength;
};
/**
 * 名称：promise同步请求
 * url：请求路径
 * data：请求参数
 */
util.commonPromise=function(url, data){
    let vm = this;
    return new Promise(function(resolve, reject){
        api(vm, url, data, res => {//成功
            resolve(res);
        }, res => {
            reject(res);
        });
    })
};
//对象拼接方法
util.extend =function(target, source) {
    for (var obj in source) {
        target[obj] = source[obj];
    }
    return target;
}
export default util;
