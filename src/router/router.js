import Main from '@/views/Main.vue';
import subMain from '@/views/sub-Main.vue';

//独立于异步组件，每次初始化需要的组件
export const constantRouterMap = [
    {
        path: '/login',
        name: 'login',
        meta: {
            title: 'Login - 登录'
        },
        component: resolve => { require(['@/views/login.vue'], resolve); }
    }
];

//所有组件必须要放在此处，用于权限赛选之用
export const asyncRouterMap=[
    {
        path: '/main',
        title: '主页',
        name: 'main',
        icon: 'ios-home',
        component:Main,
        children:[
            { path: 'tournament-list', title: '赛事列表', name: 'tournament-list', icon: 'ios-list-box',component: resolve => { require(['@/views/main/tournament-list.vue'], resolve); }},
            { path: 'banner-list', title: '轮播图', name: 'banner-list', icon: 'ios-list-box',component: resolve => { require(['@/views/main/banner-list.vue'], resolve); }},
            { path: 'organizing-committee', title: '组委会', name: 'organizing-committee', icon: 'ios-list-box',component: resolve => { require(['@/views/main/organizing-committee.vue'], resolve); }},
        ]
    }, {
        path: '/dynamic',
        title: '动态',
        name: 'dynamic',
        icon: 'ios-book',
        component:Main,
        children:[
            { path: 'new-list', title: '发布列表', name: 'new-list', icon: 'ios-list-box',component: resolve => { require(['@/views/dynamic/new-list.vue'], resolve); }},
        ]
    }, {
        path: '/project',
        title: '项目',
        name: 'project',
        icon: 'ios-folder-open',
        component:Main,
        children:[
            { path: 'collection-settings', title: '采集设置', name: 'collection-settings', icon: 'ios-list-box',component: resolve => { require(['@/views/project/collection-settings.vue'], resolve); }},
            { path: 'project-list', title: '项目列表', name: 'project-list', icon: 'ios-list-box',component: resolve => { require(['@/views/project/project-list.vue'], resolve); }},
        ]
    },{
        path: '/expert',
        title: '专家',
        name: 'expert',
        icon: 'ios-person',
        component:Main,
        children:[
            { path: 'expert-collection-settings', title: '采集设置', name: 'expert-collection-settings', icon: 'ios-list-box',component: resolve => { require(['@/views/expert/collection-settings.vue'], resolve); }},
            { path: 'expert-list', title: '专家列表', name: 'expert-list', icon: 'ios-list-box',component: resolve => { require(['@/views/expert/expert-list.vue'], resolve); }},
        ]
    },{
        path: '/review',
        title: '评审',
        name: 'review',
        icon: 'ios-reverse-camera',
        component:Main,
        children:[
            { path: 'review-settings', title: '评审设置', name: 'review-settings', icon: 'ios-list-box',component: resolve => { require(['@/views/review/review-settings.vue'], resolve); }},
            { path: 'extract-expert', title: '抽取专家', name: 'extract-expert', icon: 'ios-list-box',component: resolve => { require(['@/views/review/extract-expert.vue'], resolve); }},
            { path: 'task-distribution', title: '任务派发', name: 'task-distribution', icon: 'ios-list-box',component: resolve => { require(['@/views/review/task-distribution.vue'], resolve); }},
            { path: 'score-statistics', title: '成绩统计', name: 'score-statistics', icon: 'ios-list-box',component: resolve => { require(['@/views/review/score-statistics.vue'], resolve); }},
        ]
    }, {
        path: '/authorize',
        title: '授权/报送',
        name: 'authorize',
        icon: 'ios-person',
        component:Main,
        children:[
            { path: 'report-manage', title: '报送管理', name: 'report-manage', icon: 'ios-list-box',component: resolve => { require(['@/views/authorize/report-manage.vue'], resolve); }},
        ]
    },
    {
        path: '/audit',
        title: '审核',
        name: 'audit',
        icon: 'ios-checkbox',
        component:Main,
        children:[
            { path: 'settled-audit', title: '入驻审核', name: 'settled-audit', icon: 'ios-list-box',component: resolve => { require(['@/views/audit/settled-audit.vue'], resolve); }},
        ]
    },
    {
        path: '/match-manage',
        title: '赛事管理员',
        name: 'match',
        icon: 'ios-person',
        component:Main,
        children:[
            { path: 'create', title: '新建', name: 'match-manage-create', icon: 'ios-list-box',component: resolve => { require(['@/views/match-manage/create.vue'], resolve); }},
            { path: 'player', title: '选手', name: 'match-manage-Player', icon: 'ios-list-box',component: resolve => { require(['@/views/match-manage/player.vue'], resolve); }},
            { path: 'project', title: '项目', name: 'match-manage-project', icon: 'ios-list-box',component: resolve => { require(['@/views/match-manage/project.vue'], resolve); }},
            { path: 'expert', title: '专家', name: 'match-manage-expert', icon: 'ios-list-box',component: resolve => { require(['@/views/match-manage/expert.vue'], resolve); }},
            { path: 'review', title: '评审标准', name: 'match-manage-review', icon: 'ios-list-box',component: resolve => { require(['@/views/match-manage/review.vue'], resolve); }},
            { path: 'role', title: '角色定义', name: 'match-manage-role', icon: 'ios-list-box',component: resolve => { require(['@/views/match-manage/role.vue'], resolve); }},
        ]
    },
    {
        path: '/demand',
        title: '需求',
        name: 'demand',
        icon: 'ios-book',
        component:Main,
        children:[
            { path: 'school-service', title: '校赛服务', name: 'school-service', icon: 'ios-list-box',component: resolve => { require(['@/views/demand/school-service.vue'], resolve); }},
        ]
    },
];



// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
    path: '/',
    name: 'otherRouter',
    redirect: '/home',
    component: Main,
    children: [
        { path: 'home', title: {i18n: 'home'}, name: 'home_index', component: resolve => { require(['@/views/home/home.vue'], resolve); } },
        { path: 'ownspace', title: '个人中心', name: 'ownspace_index', component: resolve => { require(['@/views/own-space/own-space.vue'], resolve); } },
        { path: 'updatapwd', title: '修改密码', name: 'updatapwd', component: resolve => { require(['@/views/user/updatapwd.vue'], resolve); } }
    ]
};



// 所有上面定义的路由都要写在下面的routers里
export const routers = [
    ...constantRouterMap,
    otherRouter
];
