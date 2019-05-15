<style lang="less" scoped>
    @import 'extract-expert.less';
</style>

<template>
    <div>
        <Row>
            <Col span="24">
            <Card>
                <div class="header">
                    <span class="message">
                        <Icon type="ios-list"></Icon>
                        规则设置
                        </span>
                    <span class="title">
                        <span>以中华职业教育创新创业大赛为例</span>
                    </span>
                    <Select v-model="sessionIndex" placeholder="状态"  style="width:200px" @on-change="changeSessionIndex">
                        <Option v-for="item in statusList" :value="item.matchId" :key="item.sessionIndex">{{ item.sessionName }}</Option>
                    </Select>
                </div>
                <div class="segmentingLine"></div>
                    <Tabs value="name1">
                        <TabPane label="手动抽取" name="name1">
                            <div class="title">
                                <span>类型/数量</span>
                            </div>
                            <div>
                                <span class="amount" v-for="item in tutorTypeList" :key="item.comTypeId">
                                    <span>{{item.comTypeName}}</span>
                                    <span>{{item.tutorNum}}</span>
                                    <span>人</span>
                                </span>
                                <Button type="primary" style="margin-left: 30px" @click="signModalShow('tutorsType')">标记</Button>
                            </div>
                            <div class="segmentingLine"></div>
                            <div class="title">
                                <span>分组/标记</span>
                                <span>选择专家分组类型后，点击开始标记,对本届已审核入库的专家进行组别标记;选择不分组，则无需标记</span>
                            </div>
                            <RadioGroup v-model="group" @on-change="groupChange">
                                <Radio label="1"><span>分组</span></Radio>
                                <Radio label="2"><span>不分组</span></Radio>
                            </RadioGroup>
                            <div v-if="group==1" style="margin:20px 0">
                                <span class="amount" v-for="item in tutorGroupList" :key="item.comTypeId">
                                        <span>{{item.comTypeName}}</span>
                                        <span>{{item.tutorNum}}</span>
                                        <span>人</span>
                                </span>
                                <Button type="primary" style="margin-left: 30px" @click="randomModalShow('tutorGroup')">标记</Button>
                            </div>
                        </TabPane>
                        <TabPane label="随机抽取" name="name2">
                            <Form :label-width="100" >
                                <FormItem label="随机抽取人数:" prop="tutorCount">
                                    <InputNumber :min="0" v-model="professorNum"/>
                                </FormItem>
                                <FormItem>
                                    <Button type="primary" :loading="buttonLoading2" @click="randomDrawing">确认抽取</Button>
                                </FormItem>
                            </Form>
                        </TabPane>
                    </Tabs>
                <div class="segmentingLine"></div>
                <div class="title">
                    <span>抽取数量</span>
                </div>
                <Row justify="center">
                    <Table border :loading="loading" :data="listData" :columns="columns"></Table>
                </Row>
                <Row>
                    <Page class="page" :total=total @on-change="changePage" show-elevator></Page>
                </Row>
                <Modal
                        v-model="signModal"
                        title="标记"
                        :width="width"
                        :footer-hide="footerHide"
                >
                    <Row justify="start" style="margin-bottom:10px;">
                        <div style="display: inline-block;width: 400px">
                            <RadioGroup v-model="tutorsType" @on-change="tutorsTypeChange('tutorsType')">
                                <Radio :label="item.comTypeId" v-for="item in tutorTypeList" :key="item.comTypeId">
                                    <span>{{item.comTypeName}}</span>
                                </Radio>
                            </RadioGroup>
                        </div>
                        <div style="display: inline-block;float: right;">
                            <Button  type="primary" @click="saveListSelectTutor('tutorsType')">标记</Button>
                        </div>
                    </Row>
                    <Row justify="center">
                        <Table border ref='tutorsTypeTable' :loading="loading1" :data="listData1" :columns="columns1" height="425" @on-selection-change="selectionChange"></Table>
                    </Row>
                </Modal>
                <Modal
                        v-model="randomModal"
                        title="分组/标记"
                        :width="width"
                        :footer-hide="footerHide"
                >
                    <Row justify="start" style="margin-bottom:20px;">
                        <div style="display: inline-block;width: 400px">
                            <RadioGroup v-model="groupId" @on-change="groupTypeChange('tutorGroup')">
                                <Radio :label="item.comTypeId" v-for="item in tutorGroupList" :key="item.comTypeId">
                                    <span>{{item.comTypeName}}</span>
                                </Radio>
                            </RadioGroup>
                        </div>
                        <div style="display: inline-block;float: right;">
                            <InputNumber placeholder="请输入数量" :min="0" v-model="random"></InputNumber>
                            <Button  type="primary" @click="randomSelect">随机选择</Button>
                            <Button  type="primary" @click="saveListSelectTutor('tutorGroup')">标记</Button>
                        </div>
                    </Row>
                    <Row justify="center">
                        <Table border :loading="loading2" ref="selection2" :data="listData2" :columns="columns2" height="425" @on-selection-change="selectionChange"></Table>
                    </Row>
                </Modal>
            </Card>
            </Col>
        </Row>
    </div>
</template>

<script>
    import api from '@/api/fetch-api';
    import  util from '@/libs/util';
    export default {
        data () {
            return {
                width:700,
                footerHide:true,
                signModal:false,
                randomModal:false,
                group:"1",
                random:null,
                crowd:11,
                loading:false,
                loading1:false,
                loading2:false,
                buttonLoading:false,
                buttonLoading1:false,
                buttonLoading2:false,
                total:0,
                time:'',
                statusList:[],
                sessionIndex:0,
                userInfo:{},
                tutorsType:"",
                groupId:"",
                tutorGroupList:[],
                tutorTypeList:[],
                selectIdArray:[],
                unSelectIdArray:[],
                pageNum:1,
                professorNum:0,//随机抽取的专家人数
                columns:[
                    {
                        type: 'index',
                        title:'序号',
                        width: 80,
                        align: 'center'
                    },
                    {
                        title: '姓名',
                        key: 'userName',
                        align: 'center'
                    },
                    {
                        title: '专家类型',
                        key: 'tutorsTypeName',
                        align: 'center'
                    },
                    {
                        title: '擅长领域',
                        key: 'serviceAreaString',
                        align: 'center'
                    },
                    {
                        title: '创业者',
                        key: 'cyFlagString',
                        align: 'center'
                    },
                    {
                        title: '投资人',
                        key: 'investFlagString',
                        align: 'center'
                    },
                    {
                        title: '曾任评委',
                        key: 'reviewFlagString',
                        align: 'center'
                    },
                    {
                        title: '获奖指导老师',
                        width: 150,
                        key: 'matchPrizeFlagString',
                        align: 'center'
                    },
                    {
                        title: '届别',
                        key: 'sessionName',
                        align: 'center'
                    },
                    {
                        title: '组别',
                        key: 'groupName',
                        align: 'center'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 150,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('a', {
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
                                                content: '确定移除此专家吗？',
                                                closable:true,
                                                onOk: () => {
                                                    this.removeSelect(params.row.id);
                                                },
                                            });
                                        }
                                    }
                                }, '移除'),
                            ]);
                        }
                    }
                ],
                columns1:[
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '专家姓名',
                        key: 'userName',
                        width: 120,
                        align:'center',
                    },
                    {
                        title: '工作单位',
                        key: 'belong',
                        align:'center',
                    },
                    {
                        title: '曾担任评委',
                        key: 'reviewFlagString',
                        width: 105,
                        align:'center',
                    },
                    {
                        title: '持有证书',
                        key: 'certFlagString',
                        width: 100,
                        align:'center',
                    },
                ],
                columns2:[
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '专家姓名',
                        key: 'userName',
                        width: 120,
                        align:'center',
                    },
                    {
                        title: '工作单位',
                        key: 'belong',
                        align:'center',
                    },
                    {
                        title: '曾担任评委',
                        key: 'reviewFlagString',
                        width: 105,
                        align:'center',
                    },
                    {
                        title: '持有证书',
                        key: 'certFlagString',
                        width: 100,
                        align:'center',
                    },
                ],
                listData:[],
                listData1:[],
                listData2:[],
            };
        },
        methods:{
            randomSelect(){
                if(this.random == 0){
                    this.$message.info('随机不能为0');
                    return;
                }
                if(this.random > this.listData2.length){
                    this.$message.info('随机数不能大于当前专家总数');
                    return;
                }
                if(this.random == this.listData2.length){
                    this.selectIdArray = [];
                    for(let item of this.listData2){
                        item['_checked'] = true;
                        this.selectIdArray.push(item.id);
                    }
                    return;
                }else{
                    let nowRandom = this.proRandom(this.random,0,this.listData2.length);
                    this.selectIdArray=[];
                    this.listData2.forEach( ( item, i ) => {
                        item['_checked'] = false;
                        for(let j=0;j<=nowRandom.length-1;j++){
                            if(i == nowRandom[j]){
                                item['_checked'] = true;
                                this.selectIdArray.push(item.id);
                                break;
                            }
                        }
                    } );
                }
            },
            getRandom (min,max){ //生成随机数
                return parseInt(Math.random() * (max - min) + min);
            },
            dealRepeat(set,min,max){   //去重
                if(set.has(undefined)){
                    set.delete(undefined);
                    set.add(this.getRandom(min,max));
                    if(!set.has(undefined)){
                        return set;
                    }else{
                        return this.dealRepeat(set,min,max);
                    }
                }else{
                    return set;
                }
            },
            proRandom(n,min,max){ //生成min-max之间不重复的随机数
                var set = new Set();
                for(let i = 0 ; i < n; i ++){
                    let r = this.getRandom(min,max);
                    set.add(r);
                    set = this.dealRepeat(set,min,max);
                }
                return [...set];
            },
            selectionChange(selection){
                this.selectIdArray = [];
                if(selection.length==0){
                    this.selectIdArray = [];
                }else{
                    for(let item of selection){
                        this.selectIdArray.push(item.id);
                    }
                }

            },
            groupChange(){
                if(this.group == "2"){
                    this.groupId = ""; //不分组清空类型
                    this.pageSelectResultList();
                }
            },
            tutorsTypeChange(type){
                this.listData1 = [];
                this.listSelectTutor(type);
            },
            groupTypeChange(type){
                this.listData2 = [];
                this.listSelectTutor(type);
            },
            changePage (page) {
                this.pageNum = page;
                this.list();
            },
            changeSessionIndex(){
                for(let item in this.statusList){
                    if(value ==item.matchId){
                        this.userInfo = item;
                    }
                }
            },
            randomModalShow(type){ //分组随机选择框
              this.listSelectTutor(type);
              this.randomModal =true;
            },
            signModalShow(type){//
                this.listSelectTutor(type);
                this.signModal =true;
            },
            randomDrawing(){
                if(this.professorNum==0||this.professorNum<0){
                    this.$Message.info("输入的人数不合法!");
                    return;
                }
                api(this,'/review/randomDrawing',{
                    trackId:this.userInfo.trackId,
                    levelId:this.userInfo.levelId,
                    manageId:this.userInfo.manageId,
                    matchId:this.userInfo.matchId,
                    professorNum:this.professorNum
                },res => {
                    this.loading = false;
                    if(res.code == 0) {
                        this.pageNum = 1;
                        this.listData = [];
                        this.pageSelectResultList();
                    }else{
                        this.$Message.error(res.message);
                    }
                },res => {
                    this.$Message.error(res.message);
                });
            },
            removeSelect(id){
                api(this,'/review/removeSelect',{
                    applyId:id
                },res => {
                    if(res.code == 0) {
                      this.typesAndGroup();
                        this.pageSelectResultList();
                    }else{
                        this.$Message.error(res.message);
                    }
                },res => {
                    this.$Message.error(res.message);
                });
            },
            typesAndGroup(){
                api(this,'/review/typesAndGroup',{
                    trackId:this.userInfo.trackId,
                    levelId:this.userInfo.levelId,
                    manageId:this.userInfo.manageId,
                    matchId:this.userInfo.matchId
                },res => {
                    this.loading = false;
                    if(res.code == 0) {
                        this.tutorGroupList = res.data.tutorGroupList;
                        this.tutorTypeList = res.data.tutorTypeList;
                        this.tutorsType = res.data.tutorTypeList[0].comTypeId;
                        this.groupId = res.data.tutorGroupList[0].comTypeId;
                    }else{
                        this.$Message.error(res.message);
                    }
                },res => {
                    this.$Message.error(res.message);
                });
            },
            listSelectTutor (type) {
                let param = {};
                if(type == "tutorsType"){
                    param ={
                        trackId:this.userInfo.trackId,
                        levelId:this.userInfo.levelId,
                        manageId:this.userInfo.manageId,
                        matchId:this.userInfo.matchId,
                        tutorsType:this.tutorsType,
                        subGroupId:""
                    }
                }else{
                    param ={
                        trackId:this.userInfo.trackId,
                        levelId:this.userInfo.levelId,
                        manageId:this.userInfo.manageId,
                        matchId:this.userInfo.matchId,
                        groupId:this.groupId,
                        subGroupId:""
                    }
                }
                api(this,'/review/listSelectTutor',param,res => {
                    this.loading = false;
                    if(res.code == 0) {
                        for(let item of res.data){
                            if(item.checkFlag==1){
                                item['_checked'] = true;
                                this.selectIdArray.push(item.id);
                            }else{
                                item['_checked']= false;
                            }
                        }
                        if(type == "tutorsType"){
                            this.listData1 = res.data;
                        }else{
                            this.listData2 = res.data;
                        }
                    }else{
                        this.$Message.error(res.message);
                    }
                },res => {
                    this.$Message.error(res.message);
                });
            },
            pageSelectResultList(){
                api(this,'/review/pageSelectResultList',{
                    trackId:this.userInfo.trackId,
                    levelId:this.userInfo.levelId,
                    manageId:this.userInfo.manageId,
                    matchId:this.userInfo.matchId,
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
            saveListSelectTutor(type){
              debugger
                this.unSelectIdArray = [];
                let param ={};
                if(type == "tutorsType"){
                    for(let item of this.listData1){
                        if(!util.arrayContains(item.id,this.selectIdArray)){
                            this.unSelectIdArray.push(item.id);
                        }
                    }
                    param={
                        matchId:this.userInfo.matchId,
                        tutorsType:this.tutorsType,
                        subGroupId:"",
                        selectIdArray:this.selectIdArray.join(','),
                        unSelectIdArray:this.unSelectIdArray.join(','),
                    }
                }else{
                    for(let item of this.listData2){
                        if(!util.arrayContains(item.id,this.selectIdArray)){
                            this.unSelectIdArray.push(item.id);
                        }
                    }
                    param={
                        matchId:this.userInfo.matchId,
                        groupId:this.groupId,
                        subGroupId:"",
                        selectIdArray:this.selectIdArray.join(','),
                        unSelectIdArray:this.unSelectIdArray.join(','),
                    }
                }
                api(this,'/review/saveListSelectTutor',param,res => {
                    this.loading = false;
                    if(res.code == 0) {
                      this.typesAndGroup()
                       this.pageSelectResultList();
                       if(type == "tutorsType"){
                           this.signModal = false;
                       }else{
                           this.randomModal = false;
                       }
                    }else{
                        this.$Message.error(res.message);
                    }
                },res => {
                    this.$Message.error(res.message);
                });
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
                        this.typesAndGroup();
                        this.pageSelectResultList();
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
        },
        mounted(){

        }
    };
</script>
