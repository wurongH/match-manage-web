<style lang="less">
    @import './settled-audit.less';
</style>

<template>
    <div>
        <Row>
            <Col span="24">
            <Card>
                <p slot="title">
                    <Icon type="ios-list"></Icon>
                    审核列表
                </p>
                <Row type="flex" justify="start">
                    <!-- form表单的写法-->
                    <Form  label-position="top" inline>
                        <FormItem label="申请机构/所属部门/申请人姓名/联系电话/赛事名称" prop="title">
                            <Input v-model="search.fuzzySearch" :clearable="true" placeholder="请输入对应内容模糊搜索..."  />
                        </FormItem>
                        <FormItem label="审核状态" prop="status" style="width: 212px;margin-bottom:10px" >
                            <Select v-model="search.status" placeholder="审核状态">
                                <Option v-for="item in statusList" :value="item.code" :key="item.code">{{ item.value }}</Option>
                            </Select>
                        </FormItem>
                        <FormItem>
                            <Button @click="submitSearch" type="primary" icon="ios-search" style="margin:20px 0 0 10px">搜索</Button>
                            <Button @click="cancelSearch" type="default" style="margin:20px 10px 0 10px">取消</Button>
                        </FormItem>
                    </Form>
                </Row>
                <div class="segmentingLine"></div>
                <Row type="flex" justify="center" align="middle" class="advanced-router">
                    <Table :loading="loading" :columns="columns" :data="listData" style="width: 100%;"></Table>
                </Row>
                <div class="page">
                    <Page :total=total @on-change="changePage" show-elevator></Page>
                </div>
                <Modal v-model="auditShow" width="400"
                       title="审核"
                >
                    <p>
                        审核结果为：
                    </p>
                    <div slot="footer">
                        <Button type="primary" :loading="loading1" @click="checkApplyEvent('1')">通过</Button>
                        <Button type="primary" :loading="loading1"@click="checkApplyEvent('0')">拒绝通过</Button>
                    </div>
                </Modal>
                <Modal v-model="sendShow" width="400"
                       title="发送"
                >
                    <p>
                        重置密码并发送帐号
                    </p>
                    <div slot="footer">
                        <Button type="primary" :loading="loading2" @click="send('send')">发送</Button>
                        <Button type="primary" :loading="loading2"  @click="send('cancel')">取消</Button>
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
        name: 'new-list',
        data () {
            return {
                loading:false,
                loading1:false,
                loading2:false,
                applyId:'',
                auditShow:false,
                sendShow:false,
                pageNum:1,
                total:0,
                search:{
                    fuzzySearch:"",
                    status:'',
                },
                statusList:[{
                    code:0,
                    value:'待审核'
                },{
                    code:1,
                    value:'已审核'
                },{
                    code:2,
                    value:'审核未通过'
                }],
                columns: [
                    {
                        type: 'index',
                        title: '序号',
                        width: 80
                    },
                    {
                        title: '赛事级别',
                        key: 'levelIdDecribe',
                        align: 'center',
                        width: 100
                    },
                    {
                        title: '赛事名称',
                        key: 'manageName',
                        width: 150
                    },
                    {
                        title: '申请机构',
                        key: 'applyOrg',
                        width: 150
                    },
                    {
                        title: '所属部门',
                        key: 'belong',
                        width: 180
                    },
                    {
                        title: '申请人姓名',
                        key: 'contacts',
                        width: 130
                    },
                    {
                        title: '联系电话',
                        key: 'phone',
                        width: 120
                    },
                    {
                        title: '申请时间',
                        key: 'applyTime',
                        width: 180
                    },
                    {
                        title: '状态',
                        key: 'statusDecribe',
                        width: 80,
                    },
                    {
                        title: '账号状态',
                        key: 'sendStatusDecribe',
                        width: 80,
                    },
                    {
                        title: '帐号',
                        key: 'uid',
                        width: 120,
                    },
                    {
                        title: '操作',
                        key: 'action',
                        fixed: 'right',
                        width: 220,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('a',{
                                    style: {
                                        display:"inline-block",
                                        padding: '0 5px',
                                        lineHeight: '12px',
                                        color: '#3497F2'
                                    },
                                    on: {
                                        click: () => {
                                            window.open(params.row.attachment);
                                        }
                                    }
                                },'下载查看'),
                                h('a',{
                                    style: {
                                        display:params.row.status==0?"inline-block":'none',
                                        padding: '0 5px',
                                        lineHeight: '12px',
                                        color: '#3497F2'
                                    },
                                    on: {
                                        click: () => {
                                            this.applyId= params.row.id;
                                            this.auditShow =true;
                                        }
                                    }
                                },'审核'),
                                h('a',{
                                    style: {
                                        display:params.row.status==1?"inline-block":'none',
                                        padding: '0 5px',
                                        lineHeight: '12px',
                                        color: '#3497F2'
                                    },
                                    on: {
                                        click: () => {
                                            this.applyId= params.row.id;
                                            this.sendShow =true;
                                        }
                                    }
                                },'发送帐号密码'),
                            ]);
                        }
                    }
                ],
                listData: []
            };
        },
        created(){
            this.pageResultEventApplyList();
        },
        //页面刷新所需组件
        inject: ['reload'],
        methods:{
            send(message){
                if(message=="send"){
                    this.sendUidAndPwd();
                }else{
                    this.sendShow = false;
                }
            },
            submitSearch(){
                this.loading = true;
                this.listData= [];
                this.pageResultEventApplyList();
            },
            cancelSearch(){
                this.search.fuzzySearch = '';
                this.search.status = '';
                this.reload();
            },
            changePage (page) {
                this.pageNum = page;
                this.pageResultEventApplyList();
            },
            pageResultEventApplyList () {
                api(this,'/audit/pageResultEventApplyList',{
                    trackId:this.$store.state.userInfo.trackId,
                    manageId:this.$store.state.userInfo.manageId,
                    fuzzySearch:this.search.fuzzySearch,//新闻
                    status:this.search.status,
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
            checkApplyEvent(checkStatus){
                this.loading1=true;
                api(this,'/audit/checkApplyEvent',{
                    applyId:this.applyId,
                    checkStatus:checkStatus
                },res => {
                    if(res.code == 0) {
                        this.$Message.info('审核完成!');
                        this.auditShow =false;
                        this.loading1=false;
                        this.pageResultEventApplyList();
                    }else{
                        this.$Message.error(res.message);
                    }
                },res => {
                    this.$Message.error(res.message);
                });
            },
            sendUidAndPwd(){
                this.loading2=true;
                api(this,'/audit/sendUidAndPwd',{
                    applyId:this.applyId
                },res => {
                    if(res.code == 0) {
                        this.$Message.info(res.data);
                        this.sendShow = false;
                        this.loading2=false;
                        this.pageResultEventApplyList();
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
