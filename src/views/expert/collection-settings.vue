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
                        专家-采集设置
                    </p>
                    <div class="amount">
                        <span class="first">采集设置</span>
                        <span class="color">请在这里选择/新增需要评审专家提交的基本信息</span>
                        <Select v-model="sessionIndex" placeholder="状态"  style="width:200px" @on-change="changeSessionIndex">
                            <Option v-for="item in statusList" :value="item.matchId" :key="item.sessionIndex+'01'">{{ item.sessionName }}</Option>
                        </Select>
                    </div>
                    <div class="segmentingLine"></div>
                    <div class="common">
                        <span class="first">采集信息</span>
                    </div>
                    <div class="message">
                        <div class="checkBox">
                            <CheckboxGroup v-model="professor_info">
                                <Checkbox :label="item.id" :key="item.id+'1'" v-for="item in PROFESSOR_INFO">
                                    <span>{{item.fieldLabel}}</span>
                                </Checkbox>
                            </CheckboxGroup>
                        </div>
                        <div class="button">
                            <Button  type="primary"  ghost @click="addNewField('PROFESSOR_INFO')">+新增字段</Button>
                            <Button  type="error"  ghost @click="deleteNewField('PROFESSOR_INFO')">-删除字段</Button>
                        </div>
                    </div>
                    <div class="common">
                        <span class="first">附件要求</span>
                    </div>
                    <div class="segmentingLine"></div>
                    <Row justify="start" style="margin-bottom:10px;">
                        <Col>
                            <Button  type="primary" @click="addNewField('PROFESSOR_FILE')">新增</Button>
                        </Col>
                    </Row>
                    <Row justify="center">
                        <Table border  :data="PROFESSOR_FILE" :columns="columns1"></Table>
                    </Row>
                    <p class="bottom">
                        <Button type="primary" :loading="buttonLoading" @click="saveTutorFieldCfg">&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp保存&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</Button>
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
            </Col>
        </Row>
    </div>
</template>

<script>
    import api from '@/api/fetch-api';
    import { mapActions } from 'vuex';

    export default {
        data () {
            return {
                buttonLoading:false,
                loading:false,
                newFieldShow:false,
                deleteFieldShow:false,
                listData:[],
                time:'',
                statusList:[],
                sessionIndex:0,
                userInfo:{},
                professor_info:[],
                PROFESSOR_INFO:[],
                PROFESSOR_FILE:[],
                newField:{
                    matchId:'',
                    moduleEnum:'',
                    fieldLabel:'',
                    fieldType:'1'
                },
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
                columns1: [
                    {
                        type: 'index',
                        title: '序号',
                        width: 120,
                        align: 'center'
                    },{
                        title: '附件名称',
                        key: 'fieldLabel',
                        align: 'center'
                    },{
                        title: '操作',
                        key: 'action',
                        width:200,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('a',{
                                    style: {
                                        display:params.row.fixationFlag!==1?'inline-block':'none',
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
                                                    this.newField.moduleEnum = "PROFESSOR_FILE";
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
            };
        },
        methods:{
            sureAdd(){
                this.addField();
            },
            add(){

            },
            changeSessionIndex(value){
                for(let item in this.statusList){
                    if(value ==item.matchId){
                        this.userInfo = item;
                        this.sessionIndex = item.matchId
                    }
                }
                this.listTutorFieldCfg();
            },
            listSessionIndex(){
                api(this,'/project/listSessionIndex',{
                    trackId:this.$store.state.userInfo.trackId,
                    levelId:this.$store.state.userInfo.levelId,
                    manageId:this.$store.state.userInfo.manageId,
                },res => {
                    this.loading = false;
                    if(res.code == 0) {
                        this.statusList = res.data;
                        this.sessionIndex = res.data[0].matchId;
                        this.userInfo = res.data[0];
                        this.listTutorFieldCfg();
                    }else{
                        this.$Message.error(res.message);
                    }
                },res => {
                    this.$Message.error(res.message);
                });
            },
            listTutorFieldCfg(){
                api(this,'/expert/listTutorFieldCfg',{
                    trackId:this.userInfo.trackId,
                    levelId:this.userInfo.levelId,
                    manageId:this.userInfo.manageId,
                    matchId:this.sessionIndex,
                },res => {
                    if(res.code == 0) {
                        this.PROFESSOR_FILE = res.data.PROFESSOR_FILE;
                        this.PROFESSOR_INFO = res.data.PROFESSOR_INFO;
                        if(res.data.PROFESSOR_INFO.length!==0){
                            for(let item of res.data.PROFESSOR_INFO){
                                if(item.showFlag==1){
                                    this.professor_info.push(item.id);
                                }
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
                                    if(item.showFlag==1&&this.newField.moduleEnum=='PROFESSOR_INFO'){
                                        this.professor_info.push(item.id);
                                    }
                                    if(item.showFlag==1&&this.newField.moduleEnum=='PROFESSOR_FILE'){
                                        this.listTutorFieldCfg();
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
                        if(this.newField.moduleEnum=="PROFESSOR_FILE"){
                            this.listTutorFieldCfg();
                            return;
                        }
                        this.listData =[];
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
                this.newField.fieldLabel ="";
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
            saveTutorFieldCfg(){
                let dict = [{
                    key:'professor_info',
                    value:'PROFESSOR_INFO'
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
                }
                api(this,'/expert/saveTutorFieldCfg',{
                    trackId:this.userInfo.trackId,
                    levelId:this.userInfo.levelId,
                    manageId:this.userInfo.manageId,
                    matchId:this.sessionIndex,
                    PROFESSOR_INFO:this.PROFESSOR_INFO,
                    PROFESSOR_FILE:this.PROFESSOR_FILE
                },res => {
                    if(res.code == 0) {
                        this.$Message.info("保存完成!");
                    }else{
                        this.$Message.error(res.message);
                    }
                },res => {
                    this.$Message.error(res.message);
                });
            }
        },
        created(){
            this.listSessionIndex();
        }
    };
</script>
