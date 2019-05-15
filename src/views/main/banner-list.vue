<style lang="less" scoped>
    @import 'banner-list.less';
</style>

<template>
    <div>
        <Row>
            <Col span="24">
                <Card>
                    <Row justify="start" style="margin-bottom:10px;">
                        <Col>
                            <Button  type="primary" @click="add">新增</Button>
                        </Col>
                    </Row>
                    <div class="segmentingLine"></div>
                    <Row type="flex" justify="center" align="middle" class="advanced-router">
                        <Table  :loading="loading" :columns="columns" :data="listData" style="width: 100%;"></Table>
                    </Row>
                    <div class="page">
                        <Page :total=total @on-change="changePage" show-elevator></Page>
                    </div>
                </Card>
            </Col>
        </Row>

        <Modal
                v-model="bannerShow"
                title="轮播图"
                :width="600"
        >
                <Form  :label-width="100">
                    <FormItem label="轮播类型" prop="type">
                        <RadioGroup v-model="banner.type">
                            <Radio label="TOP">
                                <span>首页顶部轮播图</span>
                            </Radio>
                            <Radio label="HOME_IMPRESSION">
                                <span>历届印象</span>
                            </Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem label="图片上传" prop="imageUrl">
                            <div class="demo-upload-list" v-if="banner.imageUrl!==''">
                                <img :src="banner.imageUrl">
                            </div>
                            <Upload
                                    ref="upload"
                                    v-if="banner.imageUrl==''"
                                    :show-upload-list="false"
                                    :on-success="uploadSuccess"
                                    :format="['jpg','jpeg','png']"
                                    :max-size="2048"
                                    :on-format-error="handleFormatError"
                                    :on-exceeded-size="handleMaxSize"
                                    type="drag"
                                    action="/file/uploadFile"
                                    style="display: inline-block;width:58px;">
                                <div style="width: 58px;height:58px;line-height: 58px;">
                                    <Icon type="ios-camera" size="20"></Icon>
                                </div>
                            </Upload>
                    </FormItem>
                    <FormItem label="URL地址" prop="url">
                        <Input v-model="banner.clickUrl" :clearable="true" placeholder="请输入跳转的URL地址..." />
                    </FormItem>
                </Form>
            <div slot="footer">
                <Button  type="primary" @click="sure()">确定</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import api from '@/api/fetch-api';
    export default {
        data () {
            return {
                switch1: false,
                loading:false,
                listData:[],
                bannerShow:false,
                uploadList: [],
                defaultList: [],
                pageNum:1,
                pageSize:10,
                columns: [
                    {
                        type: 'index',
                        title:'序号',
                        width: 80,
                        align: 'center'
                    },
                    {
                        title: '缩略图',
                        key: 'imageUrl',
                        align: 'center',
                        width: 200,
                        render: (h,params) => {
                            return h('img',{
                                domProps: {
                                    src: params.row.imageUrl==null?require("@/images/no-goods.jpg"):params.row.imageUrl
                                },
                                style: {
                                    height: '50px',
                                    width:'50px',
                                    marginTop:'5px'
                                },
                            })
                        }
                    },{
                        title: '轮播类型',
                        key: 'moduleText',
                        align: 'center'
                    },{
                        title: '创建时间',
                        key: 'createTime',
                        align: 'center'
                    },{
                        title: '操作',
                        key: 'action',
                        width: 150,
                        align: 'center',
                        render: (h, params) => {
                                return h('div', [
                                    h('a', {
                                        style: {
                                            display: 'inline-block',
                                            padding: '0 5px',
                                            lineHeight: '12px',
                                            color: '#3497F2'
                                        },
                                        on: {
                                            click: () => {
                                                this.banner={
                                                    type:params.row.moduleCode,
                                                    imageUrl:params.row.imageUrl,
                                                    clickUrl:params.row.clickUrl,
                                                    homeSlideShowId:params.row.id
                                                }
                                                this.bannerShow = true;
                                            }
                                        }
                                    }, '编辑'),
                                    h('a', {
                                        style: {
                                            display: 'inline-block',
                                            padding: '0 5px',
                                            lineHeight: '12px',
                                            color: '#3497F2'
                                        },
                                        on: {
                                            click: () => {
                                                this.$Modal.warning({
                                                    title: '警告',
                                                    content:'确定删除此条banner？',
                                                    closable:true,
                                                    onOk: () => {
                                                        this.deleteHomeSlideShow(params.row.id);
                                                    }
                                                });
                                            }
                                        }
                                    }, '删除')
                                ])
                        }
                    }
                ],
                total:0,
                banner:{
                    type:'TOP',
                    imageUrl:'',
                    clickUrl:'',
                    homeSlideShowId:'',
                }
            };
        },
        created(){

        },
        methods:{
            add(){
                this.banner={
                    id:'',
                    type:'TOP',
                    imageUrl:'',
                    clickUrl:'',
                    homeSlideShowId:''
                }
                this.bannerShow = true;
            },
            sure(){
                this.updateHomeSlideShow();
            },
            uploadSuccess (res, file) {
                if(res.code==0){
                    this.banner.imageUrl = res.data.url
                }else{
                    this.$Notice.error({
                        title: '图片上传失败',
                        desc: res.message
                    });
                }
            },
            handleFormatError (file) {
                this.$Notice.warning({
                    title: '文件格式错误',
                    desc: '当前文件是' + file.name + ' 的格式,请选择jpg、jpeg或png文件.'
                });
            },
            handleMaxSize (file) {
                this.$Notice.warning({
                    title: '文件大小超出限制',
                    desc: '文件' + file.name + ' 大小超出2M.'
                });
            },
            changePage (page) {
                this.pageNum = page;
                this.init();
            },
            switchChange (status) {
                this.$Message.info('开关状态：' + status);
            },
            init () {
                api(this,'/main/pageHomeSlideShow',{
                    trackId:this.$store.state.userInfo.trackId,
                    levelId:this.$store.state.userInfo.levelId,
                    manageId:this.$store.state.userInfo.manageId,
                    pageNum:this.pageNum,
                    pageSize:this.pageSize
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
            updateHomeSlideShow(){
                api(this,'/main/updateHomeSlideShow',{
                    trackId:this.$store.state.userInfo.trackId,
                    levelId:this.$store.state.userInfo.levelId,
                    manageId:this.$store.state.userInfo.manageId,
                    homeSlideShowId:this.banner.homeSlideShowId,
                    moduleCode:this.banner.type,
                    imageUrl:this.banner.imageUrl,
                    clickUrl:this.banner.clickUrl,
                },res => {
                    this.loading = false;
                    if(res.code == 0) {
                        this.bannerShow =false;
                        this.init();
                    }else{
                        this.$Message.error(res.message);
                    }
                },res => {
                    this.$Message.error(res.message);
                });
            },
            deleteHomeSlideShow(id){
                api(this,'/main/deleteHomeSlideShow',{
                    homeSlideShowId:id
                },res => {
                    this.loading = false;
                    if(res.code == 0) {
                        this.bannerShow =false;
                        this.init();
                    }else{
                        this.$Message.error(res.message);
                    }
                },res => {
                    this.$Message.error(res.message);
                });
            },
            searchDict () {
                this.init();
            },
            searchCancel () {
                this.param.pageNum = 1;
                this.init();
            },
        },
        mounted(){
            this.init();
        }
    };
</script>
