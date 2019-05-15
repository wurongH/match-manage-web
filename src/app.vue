<template>
    <div class="app-main-top">
        <div v-show="printState" v-html="printContent"></div>
        <div v-show="!printState" id="main" class="app-main">
            <router-view v-if="isRouterAlive"></router-view>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'app',
        provide () {
            return {
                reload: this.reload
            }
        },
        data () {
            return {
                printContent: this.$store.state.app.printContent,
                printState: this.$store.state.app.printState,
                theme: this.$store.state.app.themeColor,
                isRouterAlive: true
            };
        },
        watch: {
            '$store.state.app.printState': function(val, oldVal) {
                this.printState = val;
            },
            '$store.state.app.printContent': function(val, oldVal) {
                this.printContent = val;
            },
        },
        mounted () {

        },
        beforeDestroy () {

        },
        methods: {
            //使用provide/inject组合刷新页面
            reload () {
                this.isRouterAlive = false
                this.$nextTick(function () {
                    this.isRouterAlive = true
                })
            }
        }
    };
</script>

<style>
html,body{
    width: 100%;
    height: 100%;
    background: #f0f0f0;
    overflow: hidden;
}
.app-main-top{
    width: 100%;
    height: 100%;
}
.app-main{
    width: 100%;
    height: 100%;
}
</style>
