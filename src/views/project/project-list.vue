<style lang="less">
    @import 'project-list.less';
</style>

<template>
    <div>
        <Row>
            <Col span="24">
            <Card v-if="baseMessageShow">
                <Form  label-position="top" inline>
                    <FormItem label="届别" prop="sessionIndex"style="width: 212px;margin-bottom:10px">
                        <Select v-model="search.sessionIndex" placeholder="状态"  style="width:200px" @on-change="changeSessionIndex">
                            <Option v-for="item in statusList" :value="item.matchId" :key="item.id">{{ item.sessionName }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="项目组别" prop="status"  style="width: 212px;margin-bottom:10px">
                        <Select v-model="search.groupId" placeholder="项目组别" >
                            <Option v-for="item in dicComTypeDtoList" :value="item.id" :key="item.id">{{ item.typeName }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="项目领域" prop="serverArea"  style="width: 212px;margin-bottom:10px">
                        <Select v-model="search.serverArea" placeholder="项目领域" >
                            <Option v-for="item in dicComTypeDtoList3" :value="item.id" :key="item.id">{{ item.typeName }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="项目性质" prop="status"  style="width: 212px;margin-bottom:10px">
                        <Select v-model="search.declareType" placeholder="项目性质" >
                            <Option v-for="item in declareTypeDtoList" :value="item.declareType" :key="item.id">{{ item.declareTypeName }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="项目名称" prop="title" style="width: 212px;margin-bottom:10px" >
                        <Input v-model="search.title" :clearable="true" placeholder="请输入项目名称"/>
                    </FormItem>
                    <FormItem label="领衔人/负责人" prop="userName" style="width: 212px;margin-bottom:10px" >
                        <Input v-model="search.userName" :clearable="true" placeholder="请输入领衔人/负责人"/>
                    </FormItem>
                    <FormItem label="状态" prop="status"  style="width: 212px;margin-bottom:10px">
                        <Select v-model="search.checkStatus" placeholder="状态" >
                            <Option v-for="item in checkStatusDtoList" :value="item.checkStatus" :key="item.checkStatus">{{ item.checkStatusName }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem>
                        <Button @click="submitSearch" type="primary" icon="ios-search" style="margin:20px 0 0 10px">搜索</Button>
                        <Button @click="searchCancel" type="default" style="margin:20px 10px 0 10px">取消</Button>
                    </FormItem>
                </Form>
                <div class="segmentingLine"></div>
                <Row justify="start" style="margin-bottom:10px;">
                    <Col>
                        <Button  type="primary">导出项目信息为Excel</Button>
                        <Button  type="primary">导出项目附件为rar</Button>
                    </Col>
                </Row>
                <Row justify="center">
                    <Table border :loading="loading" :data="listData" :columns="columns"></Table>
                </Row>
                <Row>
                    <Page class="page" :total=total @on-change="changePage" show-elevator></Page>
                </Row>
            </Card>
            <Card v-if="!baseMessageShow">
                <div style="text-align: right">
                    <Button type="primary" @click="handleCancel" style="margin-left: 8px;">返回上一级</Button>
                </div>
                <div class="segmentingLine" style="margin-top: 5px"></div>
                <p style="color:#000;font-size: 18px">
                    <Icon type="ios-list"></Icon>
                    基本信息
                </p>
                <div class="segmentingLine" style="margin-top: 5px"></div>
                <baseMessage :viewProjectInfo="viewProjectInfo" :project='base_project' :team_member_model="team_member_model" :team_tutor_model="team_tutor_model" :project_file="project_file"></baseMessage>
            </Card>
            <Modal v-model="auditShow" width="400"
                   title="审核"
            >
                <p>
                    您将对 {{projectTitle}} 审核结果为：
                </p>
                <div slot="footer">
                    <Button type="primary" @click="audit('3')">返回重新提交</Button>
                    <Button type="primary" @click="audit('1')">通过</Button>
                    <Button type="primary" @click="audit('2')">未通过</Button>
                </div>
            </Modal>
            </Col>
        </Row>
    </div>
</template>

<script>
    import api from '@/api/fetch-api';
    import tinymce from 'tinymce';
    import 'tinymce/themes/modern/theme';
    import util from '@/libs/util';
    import { mapActions } from 'vuex'
    import baseMessage from '@/components/base-message'
    export default {
        components:{
            baseMessage
        },
        data () {
            return {
                auditShow:false,
                total:0,
                pageNum:1,
                loading:false,
                baseMessageShow:true,
                search:{
                  status:'',
                  sessionIndex:'',
                  title:'',
                  userName:'',
                  checkStatus:'*',
                  declareType:'*',
                  groupId:'*',
                  serverArea:'*',
                },
                firstSessionIndex:'',
                projectId:'',
                projectTitle:'',
                viewProjectInfo:{},
                base_project:[],
                team_member_model:[],
                team_tutor_model:[],
                project_file:[],
                userInfo:{},
                statusProjectList:[
                    {
                        value: '1',
                        label: '中职组'
                    },
                    {
                        value: '2',
                        label: '高职组'
                    },
                    {
                        value: '3',
                        label: '本科组'
                    }
                ],
                dicComTypeDtoList:[],
                dicComTypeDtoList3:[],
                declareTypeDtoList:[],
                checkStatusDtoList:[],
                statusList:[1,2,3],
                listData:[],
                columns:[
                    {
                        type: 'index',
                        title: '序号',
                        width: 80
                    },
                    {
                        title: '项目名称',
                        key: 'title',
                        width: 200,
                        align:'center'
                    },
                    {
                        title: '届别',
                        key: 'sessionName',
                        width: 120,
                        align:'center'
                    },
                    {
                        title: '项目组别',
                        key: 'groupName',
                        width: 200,
                        align:'center'
                    },
                    {
                        title: '项目领域',
                        key: 'typeName',
                        width: 200,
                        align:'center'
                    },
                    {
                        title: '项目性质',
                        key: 'declareTypeName',
                        width: 160,
                        align:'center'
                    },
                    {
                        title: '领衔人/负责人',
                        width: 150,
                        key: 'userName',
                        align:'center'
                    },
                    {
                        title: '手机号',
                        key: 'memberPhone',
                        width: 150,
                        align:'center'
                    },
                    {
                        title: '提交时间',
                        key: 'sendTime',
                        width: 170,
                        align:'center'
                    },
                    {
                        title: '状态',
                        key: 'checkStatusName',
                        width: 120,
                        align:'center'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 150,
                        fixed: 'right',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('a', {
                                    style: {
                                        display:params.row.checkStatus==0?'inline-block':'none',
                                        padding: '0 5px',
                                        lineHeight: '12px',
                                        color: '#3497F2'
                                    },
                                    on: {
                                        click: () => {
                                            this.projectId = params.row.id;
                                            this.projectTitle = params.row.title;
                                            this.auditShow =true;
                                        }
                                    }
                                }, '审核'),
                                h('a', {
                                    style: {
                                        display:params.row.checkStatus==1?'inline-block':'none',
                                        padding: '0 5px',
                                        lineHeight: '12px',
                                        color: '#3497F2'
                                    },
                                    on: {
                                        click: () => {
                                            this.$Modal.warning({
                                                title: '警告',
                                                content: '确定退回重新提交吗？',
                                                closable:true,
                                                onOk: () => {
                                                    this.audit('3');
                                                },
                                            });
                                        }
                                    }
                                }, '退回'),
                                h('a', {
                                    style: {
                                        display:'inline-block',
                                        padding: '0 5px',
                                        lineHeight: '12px',
                                        color: '#3497F2'
                                    },
                                    on: {
                                        click: () => {
                                            this.getViewProjectInfo(params.row.id);
                                        }
                                    }
                                }, '查看'),
                            ]);
                        }
                    }
                ],
            };
        },
        created(){
            this.listSessionIndex();
        },
        mounted () {
        },
        methods: {
            changeSessionIndex(value){
               for(let item in this.statusList){
                   if(value ==item.matchId){
                       this.userInfo = item;
                   }
               }
            },
            listSessionIndex(){
                api(this,'/project/listSessionIndex',{
                    trackId:this.$store.state.userInfo.trackId,
                    levelId:this.$store.state.userInfo.levelId,
                    manageId:this.$store.state.userInfo.manageId,
                },res => {
                    this.loading = false;
                    if(res.code == 0) {
                        this.statusList = res.data
                        this.search.sessionIndex = res.data[0].matchId;
                        this.firstSessionIndex = res.data[0].matchId;
                        this.userInfo = res.data[0];
                        this.projectdropDownBox();
                        this.loading = true;
                        this.list();
                    }else{
                        this.$Message.error(res.message);
                    }
                },res => {
                    this.$Message.error(res.message);
                });
            },
            list(){
                api(this,'/project/pageResultProjectList',{
                    trackId:this.userInfo.trackId,
                    levelId:this.userInfo.levelId,
                    manageId:this.userInfo.manageId,
                    matchId:this.search.sessionIndex,
                    title:this.search.title,
                    userName:this.search.userName,
                    checkStatus:this.search.checkStatus,
                    declareType:this.search.declareType,
                    groupId:this.search.groupId,
                    serverArea:this.search.serverArea,
                    pageNum:this.pageNum,
                    pageSize:10
                },res => {
                    this.loading = false;
                    if(res.code == 0) {
                        this.listData = res.data.data;
                        this.total = res.data.totalCount;
                    }else{
                        this.$Message.error(res.message);
                    }
                },res => {
                    this.$Message.error(res.message);
                });
            },
            projectdropDownBox(){
                api(this,'/project/projectdropDownBox',{
                    trackId:this.userInfo.trackId,
                    levelId:this.userInfo.levelId,
                    manageId:this.userInfo.manageId,
                    type:'1,2,3,4,5',
                    matchId:this.userInfo.matchId,
                },res => {
                    this.loading = false;
                    if(res.code == 0) {
                        let obj1 ={
                            checkStatus:'*',
                            checkStatusName:'全部'
                        }
                        let obj2 ={
                            declareType:'*',
                            declareTypeName:'全部'
                        }
                        let obj3 ={
                            id:'*',
                            typeName:'全部'
                        }
                       this.declareTypeDtoList =res.data.declareTypeDtoList;
                       this.declareTypeDtoList.unshift(obj2);
                       this.checkStatusDtoList =res.data.checkStatusDtoList;
                       this.checkStatusDtoList.unshift(obj3);
                       this.dicComTypeDtoList = res.data.dicComTypeDtoList;
                       this.dicComTypeDtoList.unshift(obj3);
                       this.dicComTypeDtoList3 = res.data.dicComTypeDtoList3;
                       this.dicComTypeDtoList3.unshift(obj3);
                    }else{
                        this.$Message.error(res.message);
                    }
                },res => {
                    this.$Message.error(res.message);
                });
            },
            getViewProjectInfo(entryId){
                api(this,'/project/viewProjectInfo',{
                    entryId:entryId,
                },res => {
                    this.loading = false;
                    if(res.code == 0) {
                        this.viewProjectInfo = res.data;
                        this.base_project =res.data.listProjectExtendCfg.data.PROJECT;
                        for(let item of  res.data.listProjectExtendCfg.data.TEAM_MEMBER){
                            let content={
                                title:item.fieldLabel,
                                key:item.fieldName,
                                align:'center',
                                width:140
                            }
                            this.team_member_model.push(content);
                        }
                        for(let item of  res.data.listProjectExtendCfg.data.TEAM_TUTOR){
                            let content={
                                title:item.fieldLabel,
                                key:item.fieldName,
                                align:'center',
                                width:140
                            }
                            this.team_tutor_model.push(content);
                        }
                        this.project_file = res.data.listProjectExtendCfg.data.PROJECT_FILE;
                        this.baseMessageShow = false;
                    }else{
                        this.$Message.error(res.message);
                    }
                },res => {
                    this.$Message.error(res.message);
                });
            },
            audit(reviewStatus){
                api(this,'/project/reviewProject',{
                    reviewStatus:reviewStatus,
                    projectId:this.projectId
                },res => {
                    this.loading = false;
                    if(res.code == 0) {
                        this.$Message.info('审核完成!');
                        this.auditShow =false;
                        this.list();
                    }else{
                        this.$Message.error(res.message);
                    }
                },res => {
                    this.$Message.error(res.message);
                });
            },
            handleCancel(){
                this.baseMessageShow =true;
            },
            submitSearch() {
                this.loading =true;
                this.listData=[];
                this.list();
            },
            searchCancel() {
                this.loading = true;
                this.search={
                    status:'',
                    sessionIndex:this.firstSessionIndex,
                    title:'',
                    userName:'',
                    checkStatus:'*',
                    declareType:'*',
                    groupId:'*',
                    serverArea:'*',
                }
                this.list();
            },
            changePage(val) {
                this.pageNum = val;
                this.listData= [];
                this.list();
            },
            handleFormatError() {

            },
        }
    };
</script>
