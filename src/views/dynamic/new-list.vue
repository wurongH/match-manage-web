<style lang="less">
    @import './new-list.less';
</style>

<template>
    <div>
        <Row>
            <Col span="24">
                <Card>
                    <p slot="title">
                        <Icon type="ios-list"></Icon>
                        发布列表
                    </p>
                    <Row type="flex" justify="start">
                        <!-- form表单的写法-->
                        <Form  label-position="top" inline>
                            <FormItem label="标题" prop="title" style="width: 212px;margin-bottom:10px">
                                <Input v-model="search.title" :clearable="true" placeholder="请输入标题..." style="width: 200px;margin-bottom: 10px;" />
                            </FormItem>
                            <FormItem label="类型" prop="type" style="width: 212px;margin-bottom:10px" >
                                <Select v-model="search.type" placeholder="类型">
                                    <Option v-for="item in typeList" :value="item.code" :key="item.code">{{ item.value }}</Option>
                                </Select>
                            </FormItem>
                            <FormItem>
                                <Button @click="submitSearch" type="primary" icon="ios-search" style="margin:20px 0 0 10px">搜索</Button>
                                <Button @click="cancelSearch" type="default" style="margin:20px 10px 0 10px">取消</Button>
                            </FormItem>
                        </Form>
                    </Row>
                    <div class="segmentingLine"></div>
                    <Row justify="start" style="margin-bottom:10px;">
                        <Col >
                            <Button  type="primary" @click="add">新增</Button>
                        </Col>
                    </Row>
                    <Row type="flex" justify="center" align="middle" class="advanced-router">
                        <Table :loading="loading" :columns="columns" :data="listData" style="width: 100%;"></Table>
                    </Row>
                    <div class="page">
                        <Page :total=total @on-change="changePage" show-elevator></Page>
                    </div>
                    <Modal
                            v-model="newShow"
                            title="新增动态"
                            :width="700"
                    >
                        <Form  :label-width="100" :model="newAdd" :rules="ruleValidate">
                            <FormItem label="动态类型" prop="type" >
                                <RadioGroup v-model="newAdd.type">
                                    <Radio label="1">
                                        <span>新闻</span>
                                    </Radio>
                                    <Radio label="2">
                                        <span>重要通知</span>
                                    </Radio>
                                    <Radio label="3">
                                        <span>附件下载</span>
                                    </Radio>
                                </RadioGroup>
                            </FormItem>
                            <FormItem label="标题" prop="title">
                                <Input v-model="newAdd.title" :clearable="true" placeholder="输入标题..." />
                            </FormItem>
                            <FormItem label="摘要" prop="summary">
                                <Input v-model="newAdd.summary" :clearable="true" placeholder="输入摘要..." />
                            </FormItem>
                            <FormItem label="封面图" prop="indexImageUrl" required='true'>
                                <div class="demo-upload-list" v-if="newAdd.indexImageUrl!==''">
                                    <img :src="newAdd.indexImageUrl">
                                </div>
                                <Upload
                                        ref="upload"
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
                            <FormItem label="附件上传">
                                <Upload
                                        :on-success="uploadFileSuccess"
                                        action="/file/uploadFile"
                                        ref="uploadFile"
                                >
                                    <Button icon="ios-cloud-upload-outline">点击上传附件</Button>
                                </Upload>
                            </FormItem>
                            <FormItem label="内容" prop="content">
                                <textarea v-model="newAdd.content" class='tinymce-textarea' id="tinymceEditerMessage" style="height: 300px"></textarea>
                            </FormItem>
                        </Form>
                        <div slot="footer">
                            <Button  type="primary" @click="updateNews()" :loading="buttonLoading">确定</Button>
                        </div>
                    </Modal>
                </Card>
            </Col>
        </Row>
    </div>
</template>

<script>
    import api from '@/api/fetch-api';
    import tinymce from 'tinymce';
    import 'tinymce/themes/modern/theme';
    export default {
        name: 'new-list',
        data () {
            return {
                loading:true,
                buttonLoading:false,
                newShow:false,
                newAdd:{
                    type:"1",
                    title:'',
                    indexImageUrl:'',
                    content:'',
                    summary:'',
                    newId:'',
                    attachmentUrlArray:'',
                },
                total:0,
                pageNum:1,
                search:{
                  title:'',
                  type:1
                },
                typeList:[{
                    code:1,
                    value:'新闻'
                },{
                    code:2,
                    value:'重要通知'
                },{
                    code:3,
                    value:'附件下载'
                }],
                columns: [
                    {
                        type: 'index',
                        title: '序号',
                        width: 80
                    },
                    {
                        title: '标题',
                        key: 'title',
                        align: 'center'
                    },
                    {
                        title: '类型',
                        key: 'typeName'
                    },
                    {
                        title: '创建时间',
                        key: 'createTime'
                    },
                    {
                        title: '浏览人数',
                        key: 'viewCount'
                    },
                    {
                        title: '操作',
                        key: 'action',
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
                                            this.$Modal.success({
                                                title: '',
                                                content:'确定置顶这条新闻？',
                                                closable:true,
                                                onOk: () => {
                                                    this.topNews(params.row.id);
                                                }
                                            });
                                        }
                                    }
                                },'置顶'),
                                h('a',{
                                    style: {
                                        display:"inline-block",
                                        padding: '0 5px',
                                        lineHeight: '12px',
                                        color: '#3497F2'
                                    },
                                    on: {
                                        click: () => {
                                            this.$Modal.warning({
                                                title: '警告',
                                                content:'确定删除这条新闻？',
                                                closable:true,
                                                onOk: () => {
                                                    this.deleteNews(params.row.id);
                                                }
                                            });
                                        }
                                    }
                                },'删除'),
                                h('a',{
                                    style: {
                                        display:"inline-block",
                                        padding: '0 5px',
                                        lineHeight: '12px',
                                        color: '#3497F2'
                                    },
                                    on: {
                                        click: () => {
                                            this.newAdd={
                                                    type:params.row.newsType.toString(),
                                                    title:params.row.title,
                                                    indexImageUrl:params.row.indexImageUrl,
                                                    content:params.row.content,
                                                    newId:params.row.id,
                                                    summary:params.row.summary
                                            }
                                            if(tinymce.get('tinymceEditerMessage')){
                                                tinymce.get('tinymceEditerMessage').setContent(params.row.content);
                                            }else{
                                                this.tinyInit(this);
                                            }
                                            this.newShow =true;
                                        }
                                    }
                                },'编辑'),
                            ]);
                        }
                    }
                ],
                ruleValidate: {
                    title: [
                        { required: true, message: '标题不能为空', trigger: 'blur' }
                    ],
                    summary: [
                        { required: true, message: '摘要不能为空', trigger: 'blur' }
                    ],
                },
                listData: []
            };
        },
        created(){
          this.pageNews();
        },
        methods:{
            submitSearch(){
                this.loading = true;
                this.listData= [];
                this.pageNews();
            },
            cancelSearch(){
                this.search={
                    title:'',
                    type:1,
                }
            },
            add(){
                this.newAdd={
                    type:"1",
                    title:'',
                    indexImageUrl:'',
                    content:'',
                    summary:'',
                    newId:'',
                    attachmentUrlArray:'',
                };
                if(tinymce.get('tinymceEditerMessage')){
                    tinymce.get('tinymceEditerMessage').setContent("");
                }else{
                    this.tinyInit(this);
                }
                this.newShow =true;
                this.$refs.uploadFile.clearFiles();
            },
            uploadFileSuccess(res,flie){
                if(res.code==0){
                    this.newAdd.attachmentUrlArray = res.data.url;
                }else{
                    this.$Notice.error({
                        title: '图片上传失败',
                        desc: res.message
                    });
                }
            },
            uploadSuccess (res, file, fileList) {
                if(res.code==0){
                    this.newAdd.indexImageUrl = res.data.url
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
                this.pageNews();
            },
            pageNews () {
                api(this,'/dynamic/pageNews',{
                    trackId:this.$store.state.userInfo.trackId,
                    levelId:this.$store.state.userInfo.levelId,
                    manageId:this.$store.state.userInfo.manageId,
                    type:this.search.type,//新闻
                    title:this.search.title,
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
            updateNews () {
                this.buttonLoading =true;
                this.newAdd.content = tinymce.get('tinymceEditerMessage').getContent();
                api(this,'/dynamic/updateNews',{
                    trackId:this.$store.state.userInfo.trackId,
                    levelId:this.$store.state.userInfo.levelId,
                    manageId:this.$store.state.userInfo.manageId,
                    newId:this.newAdd.newId,
                    title:this.newAdd.title,
                    type:this.newAdd.type,//新闻
                    indexImageUrl:this.newAdd.indexImageUrl,
                    attachmentUrlArray:this.newAdd.attachmentUrlArray,
                    content:this.newAdd.content,
                    summary:this.newAdd.summary
                },res => {
                    this.buttonLoading =false;
                    if(res.code == 0) {
                        this.newShow =false;
                        tinymce.get('tinymceEditerMessage').setContent("");
                        this.pageNews();
                    }else{
                        this.$Message.error(res.message);
                    }
                },res => {
                    this.$Message.error(res.message);
                });
            },
            topNews(id){
                api(this,'/dynamic/topNews',{
                    newId:id
                },res => {
                    if(res.code == 0) {
                        this.$Message.info('置顶成功!');
                        this.loading = true;
                        this.pageNews();
                    }else{
                        this.$Message.error(res.message);
                    }
                },res => {
                    this.$Message.error(res.message);
                });
            },
            deleteNews(id){
                api(this,'/dynamic/deleteNews',{
                    newId:id
                },res => {
                    if(res.code == 0) {
                        this.$Message.info('删除成功!');
                        this.loading = true;
                        this.pageNews();
                    }else{
                        this.$Message.error(res.message);
                    }
                },res => {
                    this.$Message.error(res.message);
                });
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
                        'advlist autolink lists link image charmap print preview hr anchor pagebreak imagetools',
                        'searchreplace visualblocks visualchars code fullpage',
                        'insertdatetime media nonbreaking save table contextmenu directionality',
                        'paste textcolor colorpicker textpattern imagetools codesample '
                    ],
                    toolbar1: ' newnote print preview | undo redo | insert | styleselect | forecolor backcolor bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image emoticons media codesample',
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
                            vm.spinShow = false;
                        });
                        editor.on('keydown', function (e) {
                            localStorage.editorContentMessage = tinymce.get('tinymceEditerMessage').getContent();
                        });
                    }
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
        }
    };
</script>
