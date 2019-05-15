<style lang="less">
    @import 'expert-list.less';
</style>

<template>
    <div>
        <Row>
            <Col span="24">
                <Card v-if="baseMessage">
                    <Form  label-position="top" inline :model="search">
                        <FormItem label="届别" prop="sessionIndex"style="width: 212px;margin-bottom:10px">
                            <Select v-model="search.sessionIndex" placeholder="状态"  style="width:200px" >
                                <Option v-for="item in statusList" :value="item.matchId" :key="item.id">{{ item.sessionName }}</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="专家姓名	" prop="title" style="width: 212px;margin-bottom:10px" >
                            <Input v-model="search.title" :clearable="true" placeholder="请输入专家姓名"/>
                        </FormItem>
                        <FormItem label="联系方式" prop="telephone" style="width: 212px;margin-bottom:10px" >
                            <Input v-model="search.telephone" :clearable="true" placeholder="请输入联系方式"/>
                        </FormItem>
                        <FormItem label="状态" prop="status"style="width: 212px;margin-bottom:10px">
                            <Select v-model="search.status" placeholder="状态"  style="width:200px">
                                <Option v-for="item in statusAuditList" :value="item.value" :key="item.code" >{{ item.value }}</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="学位" prop="education"style="width: 212px;margin-bottom:10px">
                            <Select v-model="search.education"   style="width:200px">
                                <Option v-for="item in educationList" :value="item.code" :key="item.code" >{{ item.value }}</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="单位性质" prop="companyType"style="width: 212px;margin-bottom:10px">
                            <Select v-model="search.companyType"   style="width:200px">
                                <Option v-for="item in companyTypeList" :value="item.code" :key="item.code" >{{ item.value }}</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="擅长领域" prop="serviceArea"style="width: 212px;margin-bottom:10px">
                            <Select v-model="search.serviceArea"   style="width:200px">
                                <Option v-for="item in serviceAreaList" :value="item.id" :key="item.id" >{{ item.typeName }}</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="研究方向" prop="researchDirection"style="width: 212px;margin-bottom:10px">
                            <Select v-model="search.researchDirection"   style="width:200px">
                                <Option v-for="item in researchDirectionList" :value="item.code" :key="item.code" >{{ item.value }}</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="专家类型" prop="mentorType" style="width: 212px;margin-bottom:10px">
                            <Select v-model="search.mentorType"   style="width:200px">
                                <Option v-for="item in mentorTypeList" :value="item.code" :key="item.code" >{{ item.value }}</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="持有证书" prop="certFlag" style="width: 212px;margin-bottom:10px">
                            <Select v-model="search.certFlag" style="width:200px">
                                <Option v-for="item in certFlagList" :value="item.code" :key="item.code" >{{ item.value }}</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="是否担任评审" prop="reviewFlag" style="width: 212px;margin-bottom:10px">
                            <Select v-model="search.reviewFlag" style="width:200px">
                                <Option v-for="item in reviewFlagList" :value="item.code" :key="item.code" >{{ item.value }}</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="曾任评委" prop="reviewLevelArray" style="width: 212px;margin-bottom:10px">
                            <Select v-model="search.reviewLevelArray" style="width:200px">
                                <Option v-for="item in reviewLevelArrayList" :value="item.code" :key="item.code" >{{ item.value }}</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="是否获奖" prop="matchPrizeFlag" style="width: 212px;margin-bottom:10px">
                            <Select v-model="search.matchPrizeFlag" style="width:200px">
                                <Option v-for="item in matchPrizeFlagList" :value="item.code" :key="item.code" >{{ item.value }}</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="指导大赛" prop="matchPrizeType" style="width: 212px;margin-bottom:10px">
                            <Select v-model="search.matchPrizeType" style="width:200px">
                                <Option v-for="item in matchPrizeTypeList" :value="item.code" :key="item.code" >{{ item.value }}</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="投资人" prop="investFlag" style="width: 212px;margin-bottom:10px">
                            <Select v-model="search.investFlag" style="width:200px">
                                <Option v-for="item in investFlagList" :value="item.code" :key="item.code" >{{ item.value }}</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="创业者" prop="cyFlag" style="width: 212px;margin-bottom:10px">
                            <Select v-model="search.cyFlag" style="width:200px">
                                <Option v-for="item in cyFlagList" :value="item.code" :key="item.code" >{{ item.value }}</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="专家类别" prop="tutorsType" style="width: 212px;margin-bottom:10px">
                            <Select v-model="search.tutorsType" style="width:200px">
                                <Option v-for="item in tutorsTypeList" :value="item.id" :key="item.id" >{{ item.typeName }}</Option>
                            </Select>
                        </FormItem>
                        <FormItem>
                            <Button @click="submitSearch" type="primary" icon="ios-search" style="margin:20px 0 0 10px">搜索</Button>
                            <Button @click="searchCancel" type="default" style="margin:20px 10px 0 10px">取消</Button>
                        </FormItem>
                    </Form>
                    <div class="segmentingLine"></div>
                    <!-- <Row justify="start" style="margin-bottom:10px;">
                        <Col>
                            <Button  type="primary">+新增</Button>
                            <Button  type="primary">导出项目信息为Excel</Button>
                            <Button  type="primary">导出项目附件为rar</Button>
                        </Col>
                    </Row> -->
                    <Row justify="center">
                        <Table border :loading="loading" :data="listData" :columns="columns"></Table>
                    </Row>
                    <Row>
                        <Page class="page" :total=total @on-change="changePage" show-elevator></Page>
                        <Button  type="primary" @click="applyReviewExpert">向平台申请评审专家</Button>
                    </Row>

                    <Modal v-model="applyShow" width="1200" title="评审专家需求申请单">

                        <div class="common">
                            <span class="first">项目</span>
                        </div>
                        <div class="checkBox">
                            <span>领域</span>
                            <CheckboxGroup v-model="serviceAreaList">
                                <Checkbox :label="item.id" :key="item.id" v-for="item in serviceAreaList">
                                    <span>{{item.typeName}}</span>
                                </Checkbox>
                            </CheckboxGroup>
                        </div>
                        <div class="common">
                            <span class="first">专家</span>
                        </div>
                        <div class="checkBox">
                            <span>类型</span>
                            <CheckboxGroup v-model="tutorsType">
                                <Checkbox :label="item.id" :key="item.id" v-for="item in tutorsTypeList">
                                    <span>{{item.typeName}}</span>
                                </Checkbox>
                            </CheckboxGroup>
                        </div>
                        <div class="checkBox">
                            <span>级别</span>
                            <CheckboxGroup v-model="expertLevel">
                                <Checkbox :label="item.id" :key="item.id" v-for="(item, index) in expertLevelList" v-if="index < 2">
                                    <span>{{item.levelName + "评委"}}</span>
                                </Checkbox>
                            </CheckboxGroup>
                        </div>
                        <div class="checkBox">
                            <span>用途</span>
                            <CheckboxGroup v-model="expertPurpose">
                                <Checkbox :label="item.id" :key="item.id" v-for="item in expertPurposeList" >
                                    <span>{{item.label}}</span>
                                </Checkbox>
                            </CheckboxGroup>
                        </div>
                        <div>
                              <span>经费</span>
                              <input v-model="cost" placeholder="请输入费用"/>
                        </div>
                        <div>
                              <span>联系人</span>
                              <input v-model="linkman" placeholder="请输入姓名"/>
                              <span>联系方式</span>
                              <input  v-model="contact" placeholder="请输入联系方式"/>
                        </div>                  
                    <div class="common">
                        <span class="first">网络评审时间</span>
                        <DatePicker type="date" show-week-numbers placeholder="请选择提交时间" style="width: 200px"></DatePicker>
                    </div>

                    <div class="common">
                        <span class="first">现场评审时间</span>
                        <DatePicker type="date" show-week-numbers placeholder="请选择提交时间" style="width: 200px"></DatePicker>
                    </div>                                              
                        <div slot="footer">
                            <Button type="primary" @click="submitApply">提交</Button>
                        </div>
                    </Modal>

                    <Modal v-model="auditShow" width="400"
                           title="审核"
                    >
                        <p>
                            您对{{audit.name}}审核结果为：
                        </p>
                        <div slot="footer">
                            <Button type="primary" @click="auditAction('1')">通过</Button>
                            <Button type="primary" @click="auditAction('2')">未通过</Button>
                        </div>
                    </Modal>
                </Card>
            </Col>
        </Row>
    </div>
</template>

<script>
    import api from '@/api/fetch-api';
    export default {
        data () {
            return {
                cost: '',
                linkman: '',
                contact: '',
                total:0,
                loading:false,
                baseMessage:true,
                search:{
                    status:10,
                    sessionIndex:1,
                    title:'',
                    userName:'',
                    telephone:'',
                    education:'*',
                    companyType:'*',
                    researchDirection:'*',
                    mentorType:'*',
                    certFlag:'*',
                    reviewFlag:'*',
                    matchPrizeFlag:'*',
                    matchPrizeType:'*',
                    investFlag:'*',
                    cyFlag:'*',
                    tutorsType:'*',
                    serviceArea:'*',
                    reviewLevelArray:'*',
                },
                audit:{
                    userId:'',
                    name:'',
                },
                auditShow:false,

                // 向平台申请评审专家界面
                applyShow: true,
                expertType:[],
                expertLevel:[],
                expertPurpose:[],
                expertPurposeList: [
                    {
                        value: '1',
                        label: '网络评审'
                    },
                    {
                        value: '2',
                        label: '现场评审'
                    }
                ],
                expertLevelList: [],
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
                statusList:[],
                listData:[],
                statusAuditList:[
                    {code:'*',value:'全部'},
                    {code:'0',value:'待审核'},
                    {code:'1',value:'已审核'},
                    {code:'2',value:'审核未通过'},
                ],
                educationList:[
                    {code:'*',value:'全部'},
                    {code:'学士',value:'学士'},
                    {code:'硕士',value:'硕士'},
                    {code:'博士',value:'博士'},
                ],
                companyTypeList:[
                    {code:'*',value:'全部'},
                    {code:'科研院所/教育机构',value:'科研院所/教育机构'},
                    {code:'企业',value:'企业'},
                    {code:'政府机构',value:'政府机构'},
                    {code:'行业协会/社团组织',value:'行业协会/社团组织'},
                ],
                serviceAreaList:[],
                researchDirectionList:[
                    {code:'*',value:'全部'},
                    {code:'项目评估',value:'项目评估'},
                    {code:'结对帮扶',value:'结对帮扶'},
                    {code:'培训授课',value:'培训授课'},
                    {code:'咨询指导',value:'咨询指导'},
                    {code:'实践指导',value:'实践指导'},
                    {code:'其他方式',value:'其他方式'},
                ],
                mentorTypeList:[
                    {code:'*',value:'全部'},
                    {code:'实战型',value:'实战型'},
                    {code:'评审型',value:'评审型'},
                    {code:'培训型',value:'培训型'},
                ],
                certFlagList:[
                    {code:'*',value:'全部'},
                    {code:'0',value:'是'},
                    {code:'1',value:'否'},
                    ],
                reviewFlagList:[
                    {code:'*',value:'全部'},
                    {code:'0',value:'是'},
                    {code:'1',value:'否'},
                ],
                reviewLevelArrayList:[
                    {code:'*',value:'全部'},
                    {code:'国赛',value:'国赛'},
                    {code:'省赛',value:'省赛'},
                ],
                matchPrizeFlagList:[
                    {code:'*',value:'全部'},
                    {code:'0',value:'是'},
                    {code:'1',value:'否'},
                ],
                matchPrizeTypeList:[
                    {code:'*',value:'全部'},
                    {code:'国赛金牌',value:'国赛金牌'},
                    {code:'国赛银牌',value:'国赛银牌'},
                    {code:'国赛铜牌',value:'国赛铜牌'},
                    {code:'省赛金牌',value:'省赛金牌'},
                    {code:'省赛银牌',value:'省赛银牌'},
                    {code:'省赛铜牌',value:'省赛铜牌'},
                ],
                investFlagList:[
                    {code:'*',value:'全部'},
                    {code:'0',value:'是'},
                    {code:'1',value:'否'},
                ],
                cyFlagList:[
                    {code:'*',value:'全部'},
                    {code:'0',value:'是'},
                    {code:'1',value:'否'},
                ],
                tutorsTypeList:[],
                tutorsType: [],                
                columns:[
                    {
                        type: 'index',
                        title: '序号',
                        width: 80,
                        align:'center'
                    },
                    {
                        title: '专家姓名',
                        key: 'userName',
                        align:'center',
                        width: 140,
                    },
                    {
                        title: '联系方式',
                        key: 'telephone',
                        width: 140,
                        align:'center',
                    },
                    {
                        title: '专家类别',
                        key: 'tutorsTypeName',
                        width: 120,
                        align:'center',
                    },
                    {
                        title: '审核状态',
                        key: 'statusName',
                        width: 100,
                        align:'center',
                    },
                    {
                        title: '工作单位',
                        key: 'belong',
                        width: 200,
                        align:'center',
                    },
                    {
                        title: '单位性质',
                        key: 'companyType',
                        width: 160,
                        align:'center',
                    },
                    {
                        title: '学历',
                        key: 'education',
                        width: 120,
                        align:'center',
                    },
                    {
                        title: '擅长领域',
                        key: 'serviceAreaString',
                        width: 180,
                        align:'center',
                    },
                    {
                        title: '投资人',
                        key: 'investFlagString',
                        width: 160,
                        align:'center',
                    },
                    {
                        title: '创业者',
                        key: 'cyFlagString',
                        width: 100,
                        align:'center',
                    },
                    {
                        title: '持有证书',
                        key: 'certFlagString',
                        width: 100,
                        align:'center',
                    },
                    {
                        title: '曾任评委',
                        key: 'reviewFlagString',
                        width: 100,
                        align:'center',
                    },
                    {
                        title: '组别',
                        key: 'groupName',
                        width: 100,
                        align:'center',
                    },
                    {
                        title: '子组别',
                        key: 'subGroupName',
                        width: 100,
                        align:'center',
                    },
                    {
                        title: '操作',
                        key: 'action',
                        fixed:'right',
                        width: 150,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('a', {
                                    style: {
                                        display:params.row.status==0?'inline-block':'none',
                                        padding: '0 5px',
                                        lineHeight: '12px',
                                        color: '#3497F2'
                                    },
                                    on: {
                                        click: () => {
                                            this.audit.name = params.row.userName;
                                            this.audit.userId =params.row.id;
                                            this.auditShow =true;
                                        }
                                    }
                                }, '审核'),
                             /*   h('a', {
                                    style: {
                                        display:'inline-block',
                                        padding: '0 5px',
                                        lineHeight: '12px',
                                        color: '#3497F2'
                                    },
                                    on: {
                                        click: () => {
                                            this.baseMessage = true;
                                        }
                                    }
                                }, '编辑'),*/
                            ]);
                        }
                    }
                ],
            };
        },
        mounted () {
            this.listSessionIndex();
        },
        methods: {
            changeSessionIndex(value){
                for(let item in this.statusList){
                    if(value ==item.matchId){
                        this.userInfo = item;
                    }
                }
            },
            //获取大赛通用类型字典   专家类型  邻域接口
            getMatchComType(dictType){
                api(this,'/expert/getMatchComType',{
                    trackId:this.userInfo.trackId,
                    levelId:this.userInfo.levelId,
                    matchId:this.userInfo.matchId,
                    dictType:dictType,
                },res => {
                    console.log(res);
                    if(res.code == 0) {
                        if(dictType==4){
                            console.log(res.data);
                            this.tutorsTypeList =res.data;
                        }else{
                            this.serviceAreaList = res.data;
                        }

                    }else{
                        this.$Message.error(res.message);
                    }
                },res => {
                    this.$Message.error(res.message);
                });
            },
            //获取比赛等级列表
            listMatchLevel() {
                api(this, '/authorize/listMatchLevel', {
                    trackId: this.userInfo.trackId
                }, res => {
                    if (res.code === 0) {
                        //console.log(res.data);
                       // this.expertLevel = res.data.levelName
                        this.expertLevelList = res.data
                    } else {
                        this.$Message.error(res.message)
                    }
                }, res => {
                    this.$Message.error(res.message)
                })
            },
            listSessionIndex(){
                api(this,'/project/listSessionIndex',{
                    trackId:this.$store.state.userInfo.trackId,
                    levelId:this.$store.state.userInfo.levelId,
                    manageId:this.$store.state.userInfo.manageId,
                },res => {
                    if(res.code == 0) {
                        this.statusList = res.data;
                        this.search.sessionIndex = res.data[0].matchId;
                        this.userInfo = res.data[0];
                        this.loading =true;
                        this.list();
                        this.getMatchComType(3);
                        this.getMatchComType(4);
                        this.listMatchLevel()
                    }else{
                        this.$Message.error(res.message);
                    }
                },res => {
                    this.$Message.error(res.message);
                });
            },
            list(){
                api(this,'/expert/pageTutorList',{
                    trackId:this.userInfo.trackId,
                    levelId:this.userInfo.levelId,
                    manageId:this.userInfo.manageId,
                    matchId:this.search.sessionIndex,
                    pageNum:this.pageNum,
                    pageSize:10,
                    status:this.search.status,
                    userName:this.search.userName,
                    telephone:this.search.telephone,
                    education:this.search.education,
                    companyType:this.search.companyType,
                    researchDirection:this.search.researchDirection,
                    mentorType:this.search.mentorType,
                    certFlag:this.search.certFlag,
                    reviewFlag:this.search.reviewFlag,
                    matchPrizeFlag:this.search.matchPrizeFlag,
                    matchPrizeType:this.search.matchPrizeType,
                    investFlag:this.search.investFlag,
                    cyFlag:this.search.cyFlag,
                    tutorsType:this.search.tutorsType,
                    serviceArea:this.search.serviceArea,
                    reviewLevelArray:this.search.reviewLevelArray,
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
            handleCancel(){
                this.baseMessage =false;
            },
            submitSearch() {
                this.listData=[];
                this.list();
            },
            searchCancel() {
                this.search={
                    status:10,
                    sessionIndex:1,
                    title:'',
                    userName:'',
                    telephone:'',
                    education:'*',
                    companyType:'*',
                    researchDirection:'*',
                    mentorType:'*',
                    certFlag:'*',
                    reviewFlag:'*',
                    matchPrizeFlag:'*',
                    matchPrizeType:'*',
                    investFlag:'*',
                    cyFlag:'*',
                    tutorsType:'*',
                    serviceArea:'*',
                    reviewLevelArray:'*',
                }
                this.list();
            },
            changePage (page) {
                this.pageNum = page;
                this.list();
            },
            //向平台申请评审专家
            applyReviewExpert() {
                this.applyShow = true
                this.listMatchLevel()
            },
            //提交评审专家申请单
            submitApply() {
                
            },
            auditAction(status){
                api(this,'/expert/modifyTutorStatus',{
                    status:status,
                    applyId:this.audit.userId
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
        }
    };
</script>
