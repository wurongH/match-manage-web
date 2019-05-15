<style lang="less">
    @import "./main.less";
</style>
<template>
<div class="sub-single-page-con">
        <div class="sub-single-page">
            <keep-alive :include="cachePage">
                <router-view></router-view>
            </keep-alive>
        </div>
</div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import {routers, constantRouterMap,otherRouter,asyncRouterMap} from '../router/router';
import {router} from '../router/index';
export default {
    computed: {
        cachePage () {
            return this.$store.state.app.cachePage;
        },
    },
};
</script>
