<template>
    <div class="base">
        <div class="list">
            <ul>
                <li v-for="(item,index) in project" :key="Math.random()" :class="{'right':index%2!==0}">
                    <span>{{item.fieldLabel}}</span>
                    <span v-if="item.fieldType!==5">{{viewProjectInfo[item.fieldName]}}</span>
                    <span v-if="item.fieldType==5"><img :src="viewProjectInfo[item.fieldName]"></span>
                </li>
            </ul>
        </div>
        <Tabs value="name1">
            <TabPane label="团队成员" name="name1">
                <Row type="flex" justify="center" align="middle" class="advanced-router">
                    <Table  :columns="team_member_model" :data="viewProjectInfo.teamMemberArray" style="width: 100%;"></Table>
                </Row>
            </TabPane>
            <TabPane label="导师" name="name2">
                <Row type="flex" justify="center" align="middle" class="advanced-router">
                    <Table  :columns="team_tutor_model" :data="viewProjectInfo.teamTutorArray" style="width: 100%;"></Table>
                </Row>
            </TabPane>
        </Tabs>
        <div class="color">参赛用户信息</div>
        <div class="segmentingLine"></div>
        <div >
            <Tabs>
                <TabPane :label="item.fieldLabel" :key="Math.random()" v-for="item in project_file">
                    <iframe :width="width" height="500px" :src="viewProjectInfo[item.fieldName]" v-if="viewProjectInfo[item.fieldName]!==''"></iframe>
                    <div v-if="viewProjectInfo[item.fieldName]==''" style="text-align: center">暂无数据</div>
                </TabPane>
            </Tabs>
        </div>
    </div>
</template>
<script>
    import pdf from './pdf-viewer'
    export default {
        components:{
            pdf
        },
        data() {
            return {
                pdfUrl:'http://www.fjtzb.cn/uploadFiles/uploadImgs/201904031657280215.pdf',
                total1:0,
                total2:0,
                columns1: [],
                columns2:[],
                listData1:[],
                listData2:[],
                width:window.document.body.offsetWidth -300
            }
        },
        props: {
            viewProjectInfo:Array,
            project:Array,
            team_member_model:Array,
            team_tutor_model:Array,
            project_file:Array
        },
        methods: {
            changePage(){

            }
        }
    }
</script>
<style lang="less" scoped>
    .base{
        .list{
            margin-bottom: 10px;
            ul{
                li{
                    display: inline-block;
                    list-style: none;
                    width: 60%;
                    &>span:nth-of-type(1){
                        display: inline-block;
                        background-color: #EDF3F4;
                        width: 100px;
                        height: 30px;
                        line-height: 30px;
                        margin: 2px;
                        text-align: center;
                        vertical-align: middle;
                    }
                    &>span:nth-of-type(2){
                        &>img{
                            vertical-align:middle;
                            max-width: 200px;
                            max-height: 200px;
                        }

                    }
                }
                .right{
                    float: right;
                    width: 40%;
                }
            }
        }
        .color{
            padding-top: 10px;
            color: #57a3f3;
        }
    }
</style>
