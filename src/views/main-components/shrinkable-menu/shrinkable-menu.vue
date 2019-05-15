<style lang="less">
    @import './styles/menu.less';
</style>

<template>
    <div :style="{background: bgColor}" class="ivu-shrinkable-menu">
        <slot name="top"></slot>
        <sidebar-menu 
            v-show="!shrink"
            :menu-theme="theme" 
            :menu-list="menuList" 
            :open-names="openNames"
            @on-change="handleChange"
            accordion
        ></sidebar-menu>
        <sidebar-menu-shrink 
            v-show="shrink"
            :menu-theme="theme" 
            :menu-list="menuList" 
            :icon-color="shrinkIconColor"
            @on-change="handleChange"
        ></sidebar-menu-shrink>
    </div>
</template>

<script>
import sidebarMenu from './components/sidebarMenu.vue';
import sidebarMenuShrink from './components/sidebarMenuShrink.vue';
import util from '@/libs/util';
export default {
    name: 'shrinkableMenu',
    components: {
        sidebarMenu,
        sidebarMenuShrink
    },
    props: {
        shrink: {
            type: Boolean,
            default: false
        },
        menuList: {
            type: Array,
            required: true
        },
        theme: {
            type: String,
            default: 'dark',
            validator (val) {
                return util.oneOf(val, ['dark', 'light']);
            }
        },
        beforePush: {
            type: Function
        },
        openNames: {
            type: Array
        }
    },
    computed: {
        bgColor () {
            return this.theme === 'dark' ? '#495060' : '#fff';
        },
        shrinkIconColor () {
            return this.theme === 'dark' ? '#fff' : '#495060';
        }
    },
    methods: {
        handleChange (name) {
            let willpush = true;
            if (this.beforePush !== undefined) {
                if (!this.beforePush(name)) {
                    willpush = false;
                }
            }
            let menuList =JSON.parse(localStorage.saiYunMenuList);
            let select = {};
            for (let i of menuList) {
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
            let id ='';
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
            if (willpush) {
                this.$router.push({
                    name: name
                });
            }
            this.$emit('on-change', name);
        }
    }
};
</script>
