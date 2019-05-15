/**
 * @author by wzs
 */
import Vue from 'vue';
import iView from 'iview';
import Util from '../libs/util';
import VueRouter from 'vue-router';
import store from '../store';
import Cookies from 'js-cookie';
import {routers,constantRouterMap,otherRouter,asyncRouterMap} from './router';

Vue.use(VueRouter);

// 路由配置
const RouterConfig = {
    mode: 'history',
    routes: routers
};
export const router = new VueRouter(RouterConfig);

router.beforeEach((to, from, next) => {
    iView.LoadingBar.start();
    Util.title(to.meta.title);
    if (to.name!=='home_index'&&(localStorage.getItem('saiYunMenuList')==null||localStorage.getItem('saiYunMenuList')==undefined)) { // 判断是否已经登录且前往的是登录页
        Util.title();
        next({
            name: 'home_index'
        });
    }//动态添加路由，为了解决菜单权限的问题（防止刷新丢失路由的情况）。
    if(store.getters.getMenuList.length===0&&to.name !== 'home_index'){
        let routes = [];
        let menuList = JSON.parse(localStorage.saiYunMenuList);
        let allNameRoute = Util.ergodic(JSON.parse(localStorage.saiYunMenuList),"name");
        routes = Util.filterAsyncRouter(allNameRoute,asyncRouterMap);
        //动态路由需要把404放在路由最后，不然匹配会出现进来就是404的情况
        const page404 = {
            path: '/*',
            name: 'error-404',
            meta: {
                title: '404-页面不存在'
            },
            component: resolve => { require(['@/views/error-page/404.vue'], resolve); }
        };
        routes.push(page404);
        router.addRoutes(routes);
        store.commit('updateMenulist',menuList);
        next({ ...to });
    }else{
        Util.toDefaultPage([otherRouter, ...constantRouterMap], to.name, router, next);
    }
});
router.afterEach((to) => {
    Util.openNewPage(router.app, to.name, to.params, to.query);
    iView.LoadingBar.finish();
    window.scrollTo(0, 0);
});
