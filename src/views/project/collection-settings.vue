<style lang="less" scoped>
    @import 'collection-settings.less';
</style>

<template>
    <div>
        <Row>
            <Col span="24">
                <Card>
                    <p slot="title">
                        <Icon type="ios-list"></Icon>
                        采集设置
                    </p>
                    <div class="amount">
                        <span class="first">项目数量</span>
                        <span class="color">请在这里设置不同组别每所院校可提交的项目最大值</span>
                        <Select v-model="sessionIndex" placeholder="状态"  style="width:200px" @on-change="changeSessionIndex">
                            <Option v-for="(item,index) in statusList" :value="item.matchId" :key="index">{{ item.sessionName }}</Option>
                        </Select>
                    </div>
                    <div class="segmentingLine"></div>
                    <div class="group">
                        <Form  :label-width="203" inline ref="formAll" >
                            <FormItem :label="item.groupName" :key="index" v-for="(item,index) in comTypeDtos">
                                <InputNumber  :min="0" v-model="item.maxCount"></InputNumber>
                            </FormItem>
                        </Form>
                    </div>
                    <div class="segmentingLine"></div>
                    <div class="amount">
                        <span class="color">请在这里选择/新增本赛事需要参赛选手提交的基本信息</span>
                    </div>
                    <div class="segmentingLine"></div>
                    <div class="common">
                        <span class="first">项目信息</span>
                    </div>
                    <div class="message">
                        <div class="checkBox">
                            <CheckboxGroup v-model="project">
                                <Checkbox :label="item.id" :key="item.id" v-for="item in PROJECT">
                                    <span>{{item.fieldLabel}}</span>
                                </Checkbox>
                            </CheckboxGroup>
                        </div>
                        <div class="button">
                            <Button  type="primary"  ghost @click="addNewField('PROJECT')">+新增字段</Button>
                            <Button  type="error"  ghost @click="deleteNewField('PROJECT')">-删除字段</Button>
                        </div>
                    </div>
                    <div class="common">
                        <span class="first">团队成员</span>
                    </div>
                    <div class="message">
                        <div class="checkBox">
                            <CheckboxGroup  v-model="team_member">
                                <Checkbox :label="item.id" :key="item.id" v-for="item in TEAM_MEMBER">
                                    <span>{{item.fieldLabel}}</span>
                                </Checkbox>
                            </CheckboxGroup>
                        </div>
                        <div class="button">
                            <Button  type="primary"  ghost @click="addNewField('TEAM_MEMBER')">+新增字段</Button>
                            <Button  type="error"  ghost @click="deleteNewField('TEAM_MEMBER')">-删除字段</Button>
                        </div>
                    </div>
                    <div class="common">
                        <span class="first">指导教师</span>
                    </div>
                    <div class="message">
                        <div class="checkBox">
                            <CheckboxGroup  v-model="team_tutor">
                                <Checkbox :label="item.id" :key="item.id" v-for="item in TEAM_TUTOR">
                                    <span>{{item.fieldLabel}}</span>
                                </Checkbox>
                            </CheckboxGroup>
                        </div>
                        <div class="button">
                            <Button  type="primary"  ghost @click="addNewField('TEAM_TUTOR')">+新增字段</Button>
                            <Button  type="error"  ghost @click="deleteNewField('TEAM_TUTOR')">-删除字段</Button>
                        </div>
                    </div>
                    <div class="common">
                        <span class="first">上传附件</span>
                    </div>
                    <div class="message">
                        <div class="checkBox">
                            <Form  :label-width="150" inline >
                                <FormItem :label="item.fieldLabel" prop="sessionIndex" :key="index+item.id" v-for="(item,index) in PROJECT_FILE">
                                    <div class="uploadModel">
                                        <Select placeholder="请选择" v-model="item.fieldFormat" style="width:200px">
                                            <Option v-for="(item,index) in fileList" :value="item.value" :key="item.key">{{ item.value }}</Option>
                                        </Select>
                                        <div class="upload" >
                                            <Upload
                                                    action="/file/uploadFile"
                                                    :on-success="uploadSuccess"
                                                    :before-upload="()=>handleBeforeUpload(item)"
                                            >
                                                <Button icon="ios-cloud-upload-outline">模板上传</Button>
                                            </Upload>
                                        </div>
                                        <div class="see" v-if="item.optionArray!==null">
                                            <Button @click="jumpToView(item.optionArray)">查看</Button>
                                        </div>
                                    </div>
                                </FormItem>
                            </Form>
                        </div>
                        <div class="button">
                            <Button  type="primary"  ghost @click="addNewField('PROJECT_FILE')">+新增字段</Button>
                            <Button  type="error"  ghost @click="deleteNewField('PROJECT_FILE')">-删除字段</Button>
                        </div>
                    </div>
                    <div class="segmentingLine"></div>
                    <div class="common">
                        <span class="first">提交时间</span>
                        <DatePicker :value="time"
                        format="yyyy-MM-dd HH:mm:ss" type="datetimerange" @on-change="sendTimeChange" placeholder="请选择提交时间" style="width: 320px"></DatePicker>
                    </div>
                    <p class="bottom">
                        <Button type="primary" :loading="buttonLoading" @click="sure">&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp保存&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</Button>
                    </p>
                    <Modal
                            v-model="newFieldShow"
                            title="新增字段"
                            :width="400"
                    >
                        <Form  :label-width="100"  ref="newField" :model="newField" :rules="ruleValidate" >
                            <FormItem label="字段名称" prop="fieldLabel">
                                <Input v-model="newField.fieldLabel" :clearable="true" placeholder="输入新增字段名称..." />
                            </FormItem>
                        </Form>
                        <div slot="footer">
                            <Button  type="primary" @click="sureAdd">确定</Button>
                        </div>
                    </Modal>
                    <Modal
                            v-model="deleteFieldShow"
                            title="删除字段"
                            :width="600"
                            :footer-hide="true"
                    >
                        <Row justify="center">
                            <Table border :loading="loading" :data="listData" :columns="columns"></Table>
                        </Row>
                    </Modal>
                </Card>
                <Spin size="large" fix v-if="spinShow"></Spin>
            </Col>
        </Row>
    </div>
</template>

<script>
    import api from '@/api/fetch-api';
    import { mapActions } from 'vuex';
    import util from "@/libs/util.js";
    export default {
        data () {
            return {
                buttonLoading:false,
                buttonSize:'large',
                spinShow:false,
                total:0,
                time: [],
                statusList:[],
                sessionIndex:0,
                newFieldShow:false,
                deleteFieldShow:false,
                project:[],
                team_member:[],
                team_tutor:[],
                fileList:[],
                newField:{
                    matchId:'',
                    moduleEnum:'',
                    fieldLabel:'',
                    fieldType:'1'
                },
                PROJECT_FILE:[],
                PROJECT:[],
                TEAM_MEMBER:[],
                TEAM_TUTOR:[],
                loading:false,
                listData:[],
                userInfo:{},
                columns: [
                    {
                        title: '字段名',
                        key: 'fieldLabel',
                        align: 'center'
                    },{
                        title: '操作',
                        key: 'action',
                        width: 150,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('a',{
                                    style: {
                                        display:'inline-block',
                                        padding: '0 5px',
                                        lineHeight: '12px',
                                        color: '#3497F2'
                                    },
                                    on: {
                                        click: () => {
                                            this.$Modal.warning({
                                                title: '警告',
                                                content: '确定删除此字段吗？',
                                                closable:true,
                                                onOk: () => {
                                                    this.loading =true;
                                                    this.deleteField(params.row.id);
                                                },
                                            });
                                        }
                                    }
                                },'删除'),
                            ]);
                        }
                    }
                ],
                ruleValidate:{
                    fieldLabel: [
                        { required: true, message: '字段标题不能为空', trigger: 'blur' }
                    ],
                },
                comTypeDtos:[],
                projectSettingJson:[],
                nowIndex:'',
            };
        },
        methods:{
            handleBeforeUpload(item){
                this.nowIndex = item;
            },
            changeSessionIndex(value){
                for(let item in this.statusList){
                    if(value ==item.matchId){
                        this.userInfo = item;
                        this.sessionIndex = item.matchId;
                    }
                }
                this.defaultProjectCollectionSetting();
            },
            sendTimeChange(val){
                this.time = val;
            },
            jumpToView(url){
              window.open(url);
            },
            uploadSuccess (res, file,item) {
                if(res.code==0){
                    for(let i=0;i<this.PROJECT_FILE.length;i++){
                    if(this.PROJECT_FILE[i].id==this.nowIndex.id){
                        this.PROJECT_FILE[i].optionArray = res.data.url;
                    }
                }
                }else{
                    this.$Notice.error({
                        title: '文件上传失败',
                        desc: res.message
                    });
                }
            },
            changePage(){

            },
            sure(){
                let dict = [{
                        key:'project',
                        value:'PROJECT'
                    },
                    {
                        key:'team_member',
                        value:'TEAM_MEMBER'
                    },
                    {
                        key:'team_tutor',
                        value:'TEAM_TUTOR'
                    }];
                for(let i=0;i<dict.length;i++){
                    if(this[dict[i].key].length!==0){
                        for(let child of this[dict[i].value]){
                            child.showFlag = 0;
                            for ( let j = 0; j<this[dict[i].key].length; j++) {
                                if (child.id == this[dict[i].key][j]) {
                                    child.showFlag = 1;
                                }
                            }
                        }
                    }else{
                        for(let child of this[dict[i].value]){
                            child.showFlag = 0;
                        }
                    }
                };
                //console.log(this.time[0].length);
                if (this.time[0].length === 0) {
                    this.$Message.error("请选择提交时间");
                    return;
                }
//                for(let i=0;i<this.PROJECT_FILE.length;i++){
//                    if(this.$ref['upload'+this.PROJECT_FILE[i].id].length!==0){
//                        this.PROJECT_FILE[i].optionArray = this.$ref['upload'+this.PROJECT_FILE[i].id][0].fileList.url;
//                    }
//                }
                this.buttonLoading = true;
                this.saveProjectCollectionSetting();
            },
            sureAdd(){
                this.addField();
                this.newField.fieldLabel = '';
            },
            sureDelete(){

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
                        this.sessionIndex = res.data[0].matchId;
                        this.userInfo = res.data[0];
                        this.defaultProjectCollectionSetting();
                    }else{
                        this.$Message.error(res.message);
                    }
                },res => {
                    this.$Message.error(res.message);
                });
            },
            defaultProjectCollectionSetting(){
                api(this,'/project/defaultProjectCollectionSetting',{
                    trackId:this.userInfo.trackId,
                    levelId:this.userInfo.levelId,
                    manageId:this.userInfo.manageId,
                    matchId:this.sessionIndex,
                },res => {
                    this.loading = false;
                    if(res.code == 0) {
                        this.time.push(res.data.matchMainDto.startTime);
                        this.time.push(res.data.matchMainDto.endTime);
                        if(res.data.comTypeDtos.length!==0){
                            for(let item of res.data.comTypeDtos){
                                if(item.maxCount==null){
                                    item.maxCount = 0;
                                }else{
                                    item.maxCount = Number(item.maxCount);
                                }
                            }
                        }
                        this.comTypeDtos = res.data.comTypeDtos;
                        this.PROJECT = res.data.jsonObject.PROJECT;
                        for(let item of res.data.jsonObject.PROJECT){
                            if(item.showFlag==1){
                                this.project.push(item.id);
                            }
                        }
                        this.PROJECT_FILE = res.data.jsonObject.PROJECT_FILE;
                        this.TEAM_MEMBER = res.data.jsonObject.TEAM_MEMBER;
                        for(let item of res.data.jsonObject.TEAM_MEMBER){
                            if(item.showFlag==1){
                                this.team_member.push(item.id);
                            }
                        }
                        this.TEAM_TUTOR = res.data.jsonObject.TEAM_TUTOR;
                        for(let item of res.data.jsonObject.TEAM_TUTOR){
                            if(item.showFlag==1){
                                this.team_tutor.push(item.id);
                            }
                        }
                    }else{
                        this.$Message.error(res.message);
                    }
                },res => {
                    this.$Message.error(res.message);
                });
            },
            addField(){
                this.newField.matchId = this.sessionIndex;
                this.$refs['newField'].validate((valid) => {
                    if(valid){
                        api(this,'/project/addField',this.newField,res => {
                            this.loading = false;
                            if(res.code == 0) {
                                this.$Message.info('新增成功');
                                this[this.newField.moduleEnum] = res.data;
                                for(let item of res.data){//默认新增打勾
                                    if(item.showFlag==1&&this.newField.moduleEnum=='PROJECT'){
                                        this.project.push(item.id);
                                    }
                                    if(item.showFlag==1&&this.newField.moduleEnum=='TEAM_MEMBER'){
                                        this.team_member.push(item.id);
                                    }
                                    if(item.showFlag==1&&this.newField.moduleEnum=='TEAM_TUTOR'){
                                        this.team_tutor.push(item.id);
                                    }
                                }
                                this.newFieldShow =false;
                            }else{
                                this.$Message.error(res.message);
                            }
                        },res => {
                            this.$Message.error(res.message);
                        });
                    }
                })
            },
            deleteField(id){
                api(this,'/project/delField',{id:id},res => {
                    this.loading = false;
                    if(res.code == 0) {
                        this.$Message.info('删除成功');
                        let _this =this ;
                        _this.listData =[];
                        this[this.newField.moduleEnum]=[];
                        this[this.newField.moduleEnum]=res.data;
                        for(let item of res.data){
                            if(item.fixationFlag!==1){
                                _this.listData.push(item);
                            }
                        }

                        this.deleteFieldShow =false;
                    }else{
                        this.$Message.error(res.message);
                    }
                },res => {
                    this.$Message.error(res.message);
                });
            },
            addNewField(moduleEnum){
                this.newField.moduleEnum = moduleEnum;
                this.newFieldShow =true;
            },
            deleteNewField(moduleEnum){
                let _this =this ;
                _this.newField.moduleEnum = moduleEnum;
                _this.listData =[];
                for(let item of this[moduleEnum]){
                    if(item.fixationFlag!==1){
                        _this.listData.push(item);
                    }
                }
                this.deleteFieldShow =true;
            },
            saveProjectCollectionSetting(){
                this.projectSettingJson={
                    projectSettingJson:{
                        trackId:this.userInfo.trackId,
                        levelId:this.userInfo.levelId,
                        manageId:this.userInfo.manageId,
                        matchId:this.userInfo.matchId,
                        comType:this.comTypeDtos,
                        matchMain:{
                            startTime:this.time[0],
                            endTime:this.time[1],
                        },
                        PROJECT:this.PROJECT,
                        TEAM_TUTOR:this.TEAM_TUTOR,
                        TEAM_MEMBER:this.TEAM_MEMBER,
                        PROJECT_FILE:this.PROJECT_FILE
                    }
                }
                api(this,'/project/saveProjectCollectionSetting',this.projectSettingJson,res => {
                    this.buttonLoading = false;
                    if(res.code == 0) {
                        this.$Message.info("保存成功");
                    }else{
                        this.$Message.error(res.message);
                    }
                },res => {
                    this.$Message.error(res.message);
                });
            },
            dictFileFormat(id){
                api(this,'/project/dictFileFormat',{id:id},res => {
                    if(res.code == 0) {
                        this.fileList = res.data;
                    }else{
                        this.$Message.error(res.message);
                    }
                },res => {
                    this.$Message.error(res.message);
                });
            },
        },
        created(){
            this.listSessionIndex();
            this.dictFileFormat();
        }
    };
</script>
