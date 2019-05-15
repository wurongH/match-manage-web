<style lang="less" scoped>
    @import 'tournament-list.less';
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
                v-model="messageShow"
                title="赛事信息"
                :width="700"
        >
                <Form  :label-width="100"  ref="message" :model="message" :rules="ruleValidate" >
                    <FormItem label="届数" prop="sessionIndex" v-if="!edit">
                        <Select v-model="message.sessionIndex" placeholder="状态"  style="width:200px">
                            <Option v-for="item in statusList" :value="item.sessionIndex" :key="item.sessionIndex">{{ item.sessionName }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="届数" v-if="edit">
                        <Input v-model="editSessionIndex" :clearable="true" :disabled="true"  />
                    </FormItem>
                    <FormItem label="赛事信息" prop="matchName">
                        <Input v-model="message.matchName" :clearable="true" placeholder="输入赛事名称..." />
                    </FormItem>
                    <FormItem label="是否开启" prop="endFlag">
                        <i-switch v-model="message.endFlag" size="large">
                            <span slot="open">On</span>
                            <span slot="close">Off</span>
                        </i-switch>
                    </FormItem>
                    <FormItem label="评审须知" prop="notice">
                        <textarea v-model="message.notice" class='tinymce-textarea' id="tinymceEditerMessage" style="height: 400px"></textarea>
                        <Spin fix v-if="spinShow">
                            <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
                            <div>加载组件中...</div>
                        </Spin>
                    </FormItem>
                </Form>
                <div slot="footer">
                    <Button  type="primary" @click="Match()" :loading="buttonLoading">确定</Button>
                </div>
        </Modal>
    </div>
</template>

<script>
    import api from '@/api/fetch-api';
    import tinymce from 'tinymce';
    import 'tinymce/themes/modern/theme';
    //火狐兼容问题导入tinymce
    import 'tinymce/skins/lightgray/skin.min.css';
    import 'tinymce/skins/lightgray/content.min.css'
    import tinymceApi from './tinymceApi'
    import '../../dist/langs/zh_CN.GB2312.js'
    export default {
        data () {
            return {
                edit:false,
                spinShow:false,
                switch1: false,
                loading:false,
                buttonLoading:false,
                listData:[],
                messageShow:false,
                statusList:[],
                firstSessionIndex:'',//保存首次首次的届数
                editSessionIndex:'',
                columns: [
                    {
                        title: '届数',
                        key: 'sessionName',
                        align: 'center'
                    },{
                        title: '赛事名称',
                        key: 'matchName',
                        align: 'center'
                    },{
                        title: '赛事级别',
                        key: 'levelName',
                        align: 'center'
                    },{
                        title: '创建时间',
                        key: 'createTime',
                        align: 'center'
                    },{
                        title: '状态',
                        key: 'statusName',
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
                                        display:params.row.endFlag==0?"inline-block":'none',
                                        padding: '0 5px',
                                        lineHeight: '12px',
                                        color: '#3497F2'
                                    },
                                    on: {
                                        click: () => {
                                            this.$Modal.warning({
                                                title: '警告',
                                                content: '确定关闭此赛事吗？',
                                                closable:true,
                                                onOk: () => {
                                                    this.shutDownEvent(params.row.id);
                                                },
                                            });
                                        }
                                    }
                                },'关闭'),
                                h('a',{
                                    style: {
                                        display:"inline-block",
                                        padding: '0 5px',
                                        lineHeight: '12px',
                                        color: '#3497F2'
                                    },
                                    on: {
                                        click: () => {
                                            this.message={
                                                sessionIndex:params.row.sessionIndex,
                                                matchName:params.row.matchName,
                                                endFlag:params.row.endFlag==0?true:false,
                                                notice:params.row.notice,
                                                matchId:params.row.id,
                                            }
                                            this.edit =true;
                                            this.editSessionIndex =params.row.sessionIndex ;
                                            this.spinShow =true;
                                            if(tinymce.get('tinymceEditerMessage')){
                                                tinymce.get('tinymceEditerMessage').destroy();
                                            }
                                            localStorage.setItem('editorContentMessage',params.row.notice);
                                            this.tinyInit(this);
                                            this.messageShow = true;

                                        }
                                    }
                                },'编辑'),
                            ]);
                        }
                    }
                ],
                total:0,
                pageNum:1,
                pageSize:10,
                message:{
                    sessionIndex:'',
                    matchName:'',
                    endFlag:false,
                    notice:'',
                    matchId:''
                },
                ruleValidate: {
                    matchName: [
                        { required: true, message: '赛事信息不能为空', trigger: 'blur' }
                    ],
                    notice: [
                        { required: true, message: '评审须知不能为空', trigger: 'blur' }
                    ],
                }
            };
        },
        created(){
            this.listNewSessionIndex();
        },
        methods:{
            add(){
                //console.log(this.message);
               this.message={
                    sessionIndex:this.firstSessionIndex,
                    matchName:'',
                    endFlag:false,
                    notice:'',
                    matchId:''
               }
                this.edit =false;
                this.spinShow=true;
                if(tinymce.get('tinymceEditerMessage')){
                    localStorage.removeItem("editorContentMessage");
                    tinymce.get('tinymceEditerMessage').destroy();
                }
                this.tinyInit(this);
                this.messageShow = true;
            },
            Match(){
              if(this.message.matchId!==''){
                  this.updateMatch();
              }else{
                  this.newMatch();
              }
            },
            changePage (page) {
                this.pageNum = page;
                this.init();
            },
            switchChange (status) {
                this.$Message.info('开关状态：' + status);
            },
            updateMatch(){
                this.message.notice = tinymce.get('tinymceEditerMessage').getContent();
                this.$refs['message'].validate((valid) => {
                    if (valid) {
                        this.buttonLoading = true;
                        api(this,'/main/updateMatch',{
                            trackId:this.$store.state.userInfo.trackId,
                            levelId:this.$store.state.userInfo.levelId,
                            manageId:this.$store.state.userInfo.manageId,
                            matchName:this.message.matchName,
                            matchId:this.message.matchId,
                            endFlag:this.message.endFlag==true?0:1,
                            notice:this.message.notice
                        },res => {
                            this.buttonLoading = false;
                            if(res.code == 0) {
                                this.$Message.info('成功');
                                this.messageShow=false;
                                this.init();
                            }else{
                                this.$Message.error(res.message);
                            }
                        },res => {
                            this.$Message.error(res.message);
                        });
                    }
                })
            },
            newMatch(){
                this.message.notice = tinymce.get('tinymceEditerMessage').getContent();
                this.$refs['message'].validate((valid) => {
                    if (valid) {
                        this.buttonLoading = true;
                        api(this,'/main/newMatch',{
                            trackId:this.$store.state.userInfo.trackId,
                            levelId:this.$store.state.userInfo.levelId,
                            manageId:this.$store.state.userInfo.manageId,
                            matchName:this.message.matchName,
                            endFlag:this.message.endFlag==true?0:1,
                            notice:this.message.notice,
                            sessionIndex:this.message.sessionIndex
                        },res => {
                            this.buttonLoading = false;
                            if(res.code == 0) {
                                this.$Message.info('成功');
                                this.messageShow=false;
                                this.init();
                            }else{
                                this.$Message.error(res.message);
                            }
                        },res => {
                            this.$Message.error(res.message);
                        });
                    }
                })
            },
            shutDownEvent(matchId){
                api(this,'/main/endMatch',{
                    matchId:matchId
                },res => {
                    this.loading = false;
                    if(res.code == 0) {
                        this.$Message.info("关闭成功!");
                        this.init();
                    }else{
                        this.$Message.error(res.message);
                    }
                },res => {
                    this.$Message.error(res.message);
                });
            },
            init () {
                api(this,'/main/pageMatch',{
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
            listNewSessionIndex(){
                api(this,'/main/listNewSessionIndex',{
                    trackId:this.$store.state.userInfo.trackId,
                    levelId:this.$store.state.userInfo.levelId,
                    manageId:this.$store.state.userInfo.manageId,
                },res => {
                    this.loading = false;
                    if(res.code == 0) {
                        this.statusList = res.data;
                        if(res.data.length!==0){
                            this.message.sessionIndex = res.data[0].sessionIndex;
                            this.firstSessionIndex = res.data[0].sessionIndex;
                        }
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
            postBase64(base64,callback){
                let parameter={
                    imgData:base64
                }
                let _this=this;
                api(this,'/file-ctrl/uploadTinymce',parameter,res => {
                    if(res.code==0){
                        callback(res.data.url);
                    }else{
                        this.$Message.error(res.message);
                    }
                })
            },
            tinyInit(vm){
                let height = document.body.offsetHeight - 700;
                let _this = this;
                tinymce.init({
                    selector: '#tinymceEditerMessage',
                    branding: false,
                    upload_image_url: '/upload/cloud', //配置的上传图片的路由
                    elementpath: false,
                    height: height,
                    language: 'zh_CN.GB2312',
                    menubar: 'edit insert view format table tools',
                    plugins: [
                        'advlist autolink lists link image charmap preview hr anchor pagebreak imagetools',
                        'searchreplace visualblocks visualchars code fullpage',
                        'insertdatetime nonbreaking save table contextmenu directionality',
                        'paste textcolor colorpicker textpattern imagetools codesample '
                    ],
                    toolbar1: 'preview | undo redo | insert | styleselect | forecolor backcolor bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image emoticons media codesample',
                    autosave_interval: '20s',
                    image_advtab: true,
                    table_default_styles: {
                        width: '100%',
                        borderCollapse: 'collapse'
                    },
                    file_picker_types: 'image',
                    file_picker_callback: function(callback, value, meta) {
                        if (meta.filetype == 'image') {
                            // 触发input的click事件，并取得file对象
                            // 进行ajax上传图片
                            // 在上传成功的回调函数中，调用callback
                            var input = document.createElement('input');
                            input.setAttribute('type', 'file');
                            input.setAttribute('accept', 'image/*');
                            input.onchange = function() {

                                var file = this.files[0];
                                var reader = new FileReader();
                                reader.readAsDataURL(file);
                                reader.onload = function() {
                                    var base64 = reader.result;
                                    _this.postBase64(base64,callback);
                                };
                            };
                            input.click();
                        }
                    },
                    setup: function (editor) {
                        editor.on('init', function (e) {
                            vm.spinShow =false;
                            if (localStorage.editorContentMessage) {
                                tinymce.get('tinymceEditerMessage').setContent(localStorage.editorContentMessage);
                            }else{
                                tinymce.get('tinymceEditerMessage').setContent("");
                            }
                        });
                        editor.on('keydown', function (e) {
                            localStorage.editorContentMessage = tinymce.get('tinymceEditerMessage').getContent();
                        });
                        console.log("ID为: " + editor.id + " 的编辑器即将初始化.");
                    },
                    init_instance_callback : function(editor) {
                        console.log("ID为: " + editor.id + " 的编辑器已初始化完成.");
                    },
                });
            },
            postBase64(base64,callback){
                let parameter={
                    imgData:base64
                }
                let _this=this;
                api(this,'/file/uploadTinymce',parameter,res => {
                    if(res.code==0){
                        callback(res.data.url);
                    }else{
                        this.$Message.error(res.message);
                    }
                })
            },
        },
        mounted(){
            this.init();
            tinymce.init({});
        }
    };
</script>
