<style lang="less">
    @import '../styles/menu.less';
</style>

<template>
    <Menu ref="sideMenu" :active-name="$route.name" :open-names="openNames" :theme="menuTheme" width="auto" @on-select="changeMenu" :accordion="accordion">
        <template v-for="(item,index) in menuList">
            <MenuItem v-if="item.children.length==0" :name="item.name" :key="'h'+index">
                <Icon :type="item.icon" :size="iconSize"></Icon>
                <span class="layout-text" >{{ itemTitle(item) }}</span>
            </MenuItem>
            <Submenu v-if="item.children.length > 0" :name="item.name" :key="'s'+index">
                <template slot="title">
                    <Icon :type="item.icon" :size="iconSize"></Icon>
                    <span class="layout-text">{{ itemTitle(item) }}</span>
                </template>
                <template  v-for="(child,index) in item.children">
                    <MenuItem v-if="!child.hasOwnProperty('children')" :name="child.name" :key="'c'+index">
                        <Icon :type="child.icon" :size="iconSize" ></Icon>
                        <span class="layout-text" >{{ itemTitle(child) }}</span>
                    </MenuItem>
                    <Submenu v-else :name="child.name">
                        <template slot="title">{{ itemTitle(child) }}</template>
                        <template  v-for="(threeChild,index) in child.children">
                            <MenuItem  :name="threeChild.name" :key="'t'+index">
                                <Icon :type="threeChild.icon" :size="iconSize" ></Icon>
                                <span class="layout-text" >{{ itemTitle(threeChild) }}</span>
                            </MenuItem>
                        </template>
                    </Submenu>
                </template>
            </Submenu>
        </template>
    </Menu>
</template>

<script>
export default {
    name: 'sidebarMenu',
    props: {
        accordion:Boolean,
        menuList: Array,
        iconSize: Number,
        menuTheme: {
            type: String,
            default: 'dark'
        },
        openNames: {
            type: Array
        }
    },
    methods: {
        changeMenu (active) {
            this.$emit('on-change', active);
        },
        itemTitle (item) {
            if (typeof item.title === 'object') {
                return this.$t(item.title.i18n);
            } else {
                return item.title;
            }
        }
    },
    updated () {
        this.$nextTick(() => {
            if (this.$refs.sideMenu) {
                this.$refs.sideMenu.updateOpened();
                this.$refs.sideMenu.updateActiveName()
            }
        });
    }

};
</script>
