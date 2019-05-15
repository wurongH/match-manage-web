<style lang="less">
    @import "./main.less";
</style>
<template>
    <div class="main" :class="{'main-hide-text': shrink}">
        <div class="sidebar-menu-con" :style="{width: shrink?'60px':'200px', overflow: shrink ? 'visible' : 'auto'}">
            <shrinkable-menu
                :shrink="shrink"
                @on-change="handleSubmenuChange"
                :theme="menuTheme"
                :before-push="beforePush"
                :open-names="openedSubmenuArr"
                :menu-list="menuList">
                <div slot="top" class="logo-con">
                    <img v-show="!shrink"  src="../images/logo.jpg" key="max-logo" class="big" />
                    <img v-show="shrink" src="../images/logo-min.jpg" key="min-logo" />
                </div>
            </shrinkable-menu>
        </div>
        <div class="main-header-con" :style="{paddingLeft: shrink?'60px':'200px'}">
            <div class="main-header">
                <div class="navicon-con">
                    <Button :style="{transform: 'rotateZ(' + (this.shrink ? '-90' : '0') + 'deg)'}" type="text" @click="toggleClick">
                        <Icon type="ios-menu" size="32"></Icon>
                    </Button>
                </div>
                <div class="header-middle-con">
                    <div class="main-breadcrumb">
                        <breadcrumb-nav :currentPath="currentPath"></breadcrumb-nav>
                    </div>
                </div>
                <div class="header-avator-con">
                    <theme-switch></theme-switch>
                    <div class="user-dropdown-menu-con">
                        <Row type="flex" justify="end" align="middle" class="user-dropdown-innercon">
                            <Dropdown transfer trigger="click" @on-click="handleClickUserDropdown">
                                <a href="javascript:void(0)">
                                    <span class="main-user-name">{{ userName }}</span>
                                    <Icon type="ios-arrow-down"></Icon>
                                </a>
                                <DropdownMenu slot="list">
                                    <DropdownItem name="ownSpace">个人中心</DropdownItem>
                                    <DropdownItem name="updatapwd" divided>修改密码</DropdownItem>
                                    <DropdownItem name="loginout" divided>退出登录</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                            <Avatar  src="../images/common_img_user_default.png" style="background: #619fe7;margin-left: 10px;" icon="person"></Avatar>
                        </Row>
                    </div>
                </div>
            </div>
        </div>
        <div class="single-page-con" :style="{left: shrink?'60px':'200px'}">
            <div class="single-page">
                <keep-alive :include="cachePage">
                    <router-view></router-view>
                </keep-alive>
            </div>
        </div>
    </div>
</template>
<script>
import shrinkableMenu from './main-components/shrinkable-menu/shrinkable-menu.vue';
import tagsPageOpened from './main-components/tags-page-opened.vue';
import breadcrumbNav from './main-components/breadcrumb-nav.vue';
import themeSwitch from './main-components/theme-switch/theme-switch.vue';
import Cookies from 'js-cookie';
import util from '@/libs/util.js';
import { mapActions, mapState } from 'vuex'
import {routers, constantRouterMap,otherRouter,asyncRouterMap} from '../router/router';
import {router} from '../router/index';
import api from  '@/api/fetch-api';
import Util from '../libs/util';
export default {
    components: {
        shrinkableMenu,
        tagsPageOpened,
        breadcrumbNav,
        themeSwitch
    },
    data () {
        return {
            shrink: false,
            isFullScreen: false
        };
    },
    computed: {
        openedSubmenuArr(){
            console.log("菜单:"+this.$store.state.app.openedSubmenuArr);
            if(this.$store.state.app.openedSubmenuArr.length!==0){
                return  [this.$store.state.app.openedSubmenuArr[this.$store.state.app.openedSubmenuArr.length-1]];
            }else{
                return  this.$store.state.app.openedSubmenuArr;
            }

        },
        menuList () {
            return this.$store.state.app.menuList;
        },
        pageTagsList () {
            return this.$store.state.app.pageOpenedList; // 打开的页面的页面对象
        },
        currentPath () {
            return this.$store.state.app.currentPath; // 当前面包屑数组
        },
        avatorPath () {
            return localStorage.avatorImgPath != 'null'?localStorage.avatorImgPath:'';
        },
        cachePage () {
            return this.$store.state.app.cachePage;
        },
        menuTheme () {
            return 'light';
        },
        mesCount () {
            return this.$store.state.app.messageCount;
        },
        userName(){
            return this.$store.state.userInfo.userName;
        }
    },
    methods: {
        ...mapActions(['getUser','getMenuList']),
        init () {
            let messageCount = 3;
            this.messageCount = messageCount.toString();
            this.checkTag(this.$route.name);
            this.$store.commit('setMessageCount', 3);
        },
        toggleClick () {
            this.shrink = !this.shrink;
        },

        setFreshButtonId(data,name){
            let select = {};
            let id='';
            for (let i of data) {
                if (i.name == name) {
                    select =i;
                    break
                }else{
                    if(i.hasOwnProperty('children')){
                        for (let j of i.children) {
                            if (j.name == name) {
                                select =j;
                                break
                            }else{
                                if(j.hasOwnProperty('children')){
                                    for (let k of j.children) {
                                        if (k.name == name) {
                                            select =k;
                                            break
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            if(select.hasOwnProperty('children')&&select.children.length!==0) {
                for (let j of select.children) {
                    if(j.name == name){
                        id = j.id;
                    }
                    if (j.hasOwnProperty('children')) {
                        for (let k of j.children) {
                            if (k.name == name) {
                                id = k.id;
                                break
                            }
                        }
                    }
                }
            }else{
                id = select.id
            }
            this.$store.commit('setButtonId',id);
        },
        handleClickUserDropdown (name) {
            if (name === 'ownSpace') {
                util.openNewPage(this, 'ownspace_index');
                this.$router.push({
                    name: 'ownspace_index'
                });
            } else if (name === 'loginout') {
                // 退出登录
                let parameter={}
                api(this,'/user/logout',parameter,res => {
                    if(res.code==0){
                        localStorage.removeItem('saiYunMenuList');
                        window.location.href = localStorage.returnUrl=="undefined"?decodeURIComponent(defaultLogin):decodeURIComponent(localStorage.returnUrl);
                    }else{
                        localStorage.removeItem('saiYunMenuList');
                        window.location.href = localStorage.returnUrl=="undefined"?decodeURIComponent(defaultLogin):decodeURIComponent(localStorage.returnUrl);
                    }
                });
            }else if(name == 'updatapwd'){
              this.$router.push({
                  name: 'updatapwd'
              });
            }
        },
        checkTag (name) {
            let openpageHasTag = this.pageTagsList.some(item => {
                if (item.name === name) {
                    return true;
                }
            });
            if (!openpageHasTag) { //  解决关闭当前标签后再点击回退按钮会退到当前页时没有标签的问题
                util.openNewPage(this, name, this.$route.params || {}, this.$route.query || {});
            }
        },
        handleSubmenuChange (val) {},
        beforePush (name) {
            return true;
        },
    },
    watch: {
        '$route' (to) {
            this.$store.commit('setCurrentPageName', to.name);
            let pathArr = util.setCurrentPath(this, to.name);
            this.checkTag(to.name,this.$route.name);
            localStorage.currentPageName = to.name;
        },
        lang () {
            util.setCurrentPath(this, this.$route.name); // 在切换语言时用于刷新面包屑
        }
    },
    mounted () {
        this.init();
    },
    created () {
        //判断用户是否自主刷新，若自主刷新，需要重新获取一次用户信息
        if(this.$route.query.token!==undefined){
            localStorage.setItem('returnUrl',this.$route.query.returnUrl);
            this.getUser({token:this.$route.query.token,name:this}).then((data)=>{
                if(data.code==0&&(localStorage.getItem('saiYunMenuList')==null||localStorage.getItem('saiYunMenuList')==undefined)){
                    this.getMenuList({name:this}).then((data)=>{
                        var str = JSON.stringify(data);
                        if(str=="[]"){
                            localStorage.setItem("saiYunMenuList",str);
                            let menuList = JSON.parse(str);
                            this.setFreshButtonId(menuList,this.$route.name);
                            // 显示打开的页面的列表
                            this.$store.commit('setOpenedList');
                        }else{
                            this.$store.commit('updateMenulist',data);
                            //登录动态添加路由
                            let menuList = JSON.parse(str);
                            let allNameRoute = Util.ergodic(JSON.parse(str),"name");
                            let routes = Util.filterAsyncRouter(allNameRoute,asyncRouterMap);
                            //动态路由需要把404放在路由最后，不然匹配会出现进来就是404的情况
                            const page404 = {
                                path: '/!*',
                                name: 'error-404',
                                meta: {
                                    title: '404-页面不存在'
                                },
                                component: resolve => { require(['@/views/error-page/404.vue'], resolve); }
                            };
                            routes.push(page404);
                            router.addRoutes(routes);
                            localStorage.setItem("saiYunMenuList",str);
                            this.setFreshButtonId(menuList,this.$route.name);
                            // 显示打开的页面的列表
                            this.$store.commit('setOpenedList');
                        }
                    })
                }else{
                    let str = localStorage.saiYunMenuList;
                    let menuList = JSON.parse(str);
                    if(this.$store.getters.getMenuList.length===0){
                        //动态添加路由
                        this.$store.commit('updateMenulist',menuList);
                        let allNameRoute = Util.ergodic(JSON.parse(str),"name");
                        let routes = Util.filterAsyncRouter(allNameRoute,asyncRouterMap);
                        //动态路由需要把404放在路由最后，不然匹配会出现进来就是404的情况
                        const page404 = {
                            path: '/!*',
                            name: 'error-404',
                            meta: {
                                title: '404-页面不存在'
                            },
                            component: resolve => { require(['@/views/error-page/404.vue'], resolve); }
                        };
                        routes.push(page404);
                        router.addRoutes(routes);
                        localStorage.setItem("saiYunMenuList",str);
                        this.setFreshButtonId(menuList,this.$route.name);
                        // 显示打开的页面的列表
                        this.$store.commit('setOpenedList');
                        this.setFreshButtonId(menuList,this.$route.name);
                        // 显示打开的页面的列表
                        this.$store.commit('setOpenedList');
                    }else{
                        this.$store.commit('updateMenulist',menuList);
                        this.setFreshButtonId(menuList,this.$route.name);
                        // 显示打开的页面的列表
                        this.$store.commit('setOpenedList');
                    }
                }
            });
        }else{
            this.$store.state.userInfo = JSON.parse(localStorage.getItem("userInfo"));
        }
    }
};
</script>
