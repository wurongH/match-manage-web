import * as types from './mutation-types';
import {router} from '../router/index';
import Cookies from 'js-cookie';
import api from  '@/api/fetch-api';

export const getUser = function ({commit},obj) {
    try{
        return new Promise(function(resolve, reject){
            api(obj.name,'/user/verifyToken',{token:obj.token},res => {
                if(res.code==0){
                    commit(types.SET_USERINFO, res.data);
                    localStorage.setItem("userInfo",JSON.stringify(res.data));
                    resolve(res);
                }else{
                    obj.name.$Modal.error({
                        title: '登录失效',
                        content:'登录凭证已失效，请重新登录',
                        closable:true,
                        onOk: () => {
                            localStorage.removeItem('saiYunMenuList');
                            window.location.href = localStorage.returnUrl=="undefined"?defaultLogin:localStorage.returnUrl;
                        }
                    });
                    //resolve(res);
                }
            });
        })
    }catch(err){
        console.log('您尚未登陆或者session失效');
        router.push({
            name: 'login'
        });
    }
};
export const getMenuList = function ({commit},obj) {
    let menuList=[]
    try{
       return new Promise(function(resolve, reject){
            api(obj.name,'/user/listSubTreeMenu',{},res => {
                if(res.code==0){
                    if(res.data.length==0){
                        resolve([]);
                    }else{
                        res.data.map((value,key,arr)=>{
                            if(!(value.menuUrl===null||value.menuUrl===""||value.menuUrl===undefined)){
                                let obj={
                                    path:value.menuUrl,
                                    icon:value.menuIcon,
                                    name:value.menuUrl.replace(/\//g,''),
                                    title:value.menuName,
                                    id:value.id,
                                    children:[]
                                }
                                if(value.subMenuDto.length!==0){
                                    value.subMenuDto.map((value1,key,arr)=>{
                                        let obj1={
                                            path:value1.menuUrl,
                                            icon:value1.menuIcon,
                                            name:value1.menuUrl.replace(/\//g,''),
                                            id:value1.id,
                                            title:value1.menuName,
                                        }
                                        obj.children.push(obj1);
                                    })
                                }
                                menuList.push(obj);
                            }
                        })
                    }
                    resolve(menuList);
                }
            });
            //如果菜单跪了，先写死数据在这边
           /*  let menuList = [{
                path: '/main',
                title: '主页',
                name: 'main',
                icon: 'ios-home',
                children:[
                    { path: 'tournament-list', title: '赛事列表', name: 'tournament-list', icon: 'ios-list-box'},
                    { path: 'banner-list', title: '轮播图', name: 'banner-list', icon: 'ios-list-box'},
                    { path: 'organizing-committee', title: '组委会', name: 'organizing-committee', icon: 'ios-list-box'},
                ]
            }, {
                path: '/dynamic',
                title: '动态',
                name: 'dynamic',
                icon: 'ios-book',
                children:[
                    { path: 'new-list', title: '新闻列表', name: 'new-list', icon: 'ios-list-box'},
                ]
            }, {
                path: '/project',
                title: '项目',
                name: 'project',
                icon: 'ios-folder-open',
                children:[
                    { path: 'collection-settings', title: '采集设置', name: 'collection-settings', icon: 'ios-list-box'},
                    { path: 'project-list', title: '项目列表', name: 'project-list', icon: 'ios-list-box'},
                ]
            },{
                path: '/expert',
                title: '专家',
                name: 'expert',
                icon: 'ios-person',
                children:[
                    { path: 'expert-collection-settings', title: '采集设置', name: 'expert-collection-settings', icon: 'ios-list-box'},
                    { path: 'expert-list', title: '专家列表', name: 'expert-list', icon: 'ios-list-box'},
                ]
            },{
                path: '/review',
                title: '评审',
                name: 'review',
                icon: 'ios-reverse-camera',
                children:[
                    { path: 'review-settings', title: '评审设置', name: 'review-settings', icon: 'ios-list-box'},
                    { path: 'extract-expert', title: '抽取专家', name: 'extract-expert', icon: 'ios-list-box'},
                    { path: 'task-distribution', title: '任务派发', name: 'task-distribution', icon: 'ios-list-box'},
                    { path: 'score-statistics', title: '成绩统计', name: 'score-statistics', icon: 'ios-list-box'},
                ]
            },{
                path: '/authorize',
                title: '授权/报送',
                name: 'authorize',
                icon: 'ios-person',
                children:[
                    { path: 'report-manage', title: '报送管理', name: 'report-manage', icon: 'ios-list-box'},
                ]
            },{
                path: '/audit',
                title: '审核',
                name: 'audit',
                icon: 'ios-checkbox',
                children:[
                    { path: 'settled-audit', title: '入驻审核', name: 'settled-audit', icon: 'ios-list-box'},
                ]
            }]*/
           // resolve(menuList);
        })
        commit("updateMenulist", menuList);
        return menuList;
    }catch(err){
        console.log('获取菜单失败');
        router.push({
            name: 'login'
        });
    }
};
