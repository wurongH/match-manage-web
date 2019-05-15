<style lang="less">
    @import './login.less';
</style>

<template>
    <div class="login" @keydown.enter="handleSubmit">
        <div class="login-main" >
            <div class="title">欢迎登录</div>
            <Form ref="form" :model="form" :rules="rules" >
                <FormItem prop="userName">
                    <Input type="text" v-model="form.userName" placeholder="请输入账号">
                    <Icon type="ios-person-outline" slot="prepend"></Icon>
                    </Input>
                </FormItem>
                <FormItem prop="password">
                    <Input type="password" v-model="form.password" placeholder="请输入密码">
                    <Icon type="ios-lock-outline" slot="prepend"></Icon>
                    </Input>
                </FormItem>
                <FormItem prop="code">
                    <Input  placeholder="请输入右侧验证码-不区分大小写" style="width: 190px" v-model="form.code" />
                    <label @click="changeCode()" style="letter-spacing:10px;background: rgb(162, 162, 162);display: inline-block;height: 42px;width:95px;color: #fff;text-align: center;" >{{checkCode}}</label>
                </FormItem>
                <Checkbox>下次自动登录</Checkbox>
                <FormItem>
                    <Button style="height:42px;margin-top: 20px;font-size: 15px;"type="primary" size="large" @click="handleSubmit('form')" long>登录</Button>
                </FormItem>
            </Form>
            <Spin size="large" fix v-if="spinShow"></Spin>
        </div>
        <!--<div class="bottom">
            <p> 版权所有</p>
        </div>-->
    </div>
</template>

<script>
import Cookies from 'js-cookie';
import Util from '../libs/util';
import {routers, constantRouterMap,otherRouter,asyncRouterMap} from '../router/router';
import {router} from '../router/index';
import { mapActions, mapState } from 'vuex'
import api from  '@/api/fetch-api';
export default {
    data () {
        let validateTelephone = (rule, value, callback) => {
            var myreg=/^[1][3,4,5,7,8][0-9]{9}$/;
            if (!myreg.test(value)) {
                callback(new Error('请输入合法手机号'));
            } else {
                callback();
            }
        };
        let validateCode = (rule, value, callback) => {
            if (value.toUpperCase().length!== 4) {
                callback(new Error('请输入正确的验证码'));
            } else {
                callback();
            }
        };
        return {
            spinShow:false,
            checkCode:'',
            allNameRoute:[],
            form: {
                userName: '',
                password: '',
                code:'',
            },
            rules: {
                userName: [
                    { required: true, message: '账号不能为空', trigger: 'blur' },
                    { validator:validateTelephone}
                ],
                password: [
                    { required: true, message: '密码不能为空', trigger: 'blur' }
                ],
                code:[
                    {required: true, message: '请输入验证码', trigger: 'blur' },
                    { validator:validateCode}
                ],
            }
        };
    },
    created(){
        this.createCode();
    },
    methods: {
        changeCode(){
          this.createCode();
        },
        // 图片验证码
        createCode(){
            let $this = this;
            api(this,'/user/getRandomCode',{},(res) => {
                if(res.code == 0){
                    this.checkCode = res.data;//把code值赋给验证码
                }else{
                    $this.$Message.error(res.message);
                }
            });
        },
        ...mapActions(['getallRef','getUser','getMenuList']),
        handleSubmit () {
            Cookies.set('user', '测试');
            this.getMenuList('').then((data)=>{
                var str = JSON.stringify(data);
                if(str=="[]"){
                    localStorage.setItem("menuList",str);
                    //首页的控制权限
                    this.$router.push({
                        name: 'home_index'
                    });
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
                    localStorage.setItem("menuList",str);
                    //首页的控制权限
                    this.$router.push({
                        name: 'home_index'
                    });
                }
            })
            /*this.$refs.form.validate((valid) => {
                if (valid) {
                    this.spinShow=true;
                    try{
                        let parameter = {
                            username:this.form.userName,
                            password:this.form.password,
                            code:this.form.code
                        };
                        api(this,'/user/login',parameter,res => {
                            if(res.code==0){
                                this.getUser().then((data)=>{
                                    if(data.code!==0){
                                        this.$Notice.error({
                                            title: '登录失败',
                                            desc: data.message
                                        });
                                        this.createCode();
                                        this.spinShow=false;
                                        return;
                                    }
                                    data = data.data;
                                    Cookies.set('user', data.name);
                                    this.$store.commit('setAvator',data.headUrl);
                                    this.getMenuList(data).then((data)=>{
                                        var str = JSON.stringify(data);
                                        if(str=="[]"){
                                            localStorage.setItem("menuList",str);
                                            //首页的控制权限
                                            this.$router.push({
                                                name: 'home_index'
                                            });
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
                                            localStorage.setItem("menuList",str);
                                            //首页的控制权限
                                            this.$router.push({
                                                name: 'home_index'
                                            });
                                        }
                                    })
                                })
                            }else{
                                this.createCode();
                                this.spinShow=false;
                                this.$Notice.error({
                                    title: '登录失败',
                                    desc: res.message
                                });
                            }
                        });
                    }catch(err){
                        this.createCode();
                        this.spinShow=false;
                        this.$Notice.error({
                            title: '登录失败',
                            desc: "抱歉，网络出现问题，请重试！"
                        });
                    }
                }
            });*/
        }
    }
};
</script>

<style>

</style>
