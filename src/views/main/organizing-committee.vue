<style lang="less">
    @import 'organizing-committee.less';
</style>

<template>
    <div>
        <Row>
            <Col span="24">
                <Card>
                    <p slot="title">
                        <Icon type="ios-list"></Icon>
                        组委会
                    </p>
                    <Form  :label-width="120">
                        <FormItem label="图片上传" prop="indexImageUrl">
                            <RadioGroup v-model="choose">
                                <Radio label="1">
                                    <div class="select" v-if="organize.indexImageUrl!==''">
                                        <img class="default" :src="organize.indexImageUrl">
                                    </div>
                                    <Upload
                                            ref="upload"
                                            :show-upload-list="false"
                                            :default-file-list="defaultList"
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
                                </Radio>
                                <Radio label="2">
                                    <div class="select">
                                        <img class='default' src="https://o5wwk8baw.qnssl.com/a42bdcc1178e62b4694c830f028db5c0/avatar"/>
                                        <span>默认图1</span>
                                    </div>
                                </Radio>
                                <Radio label="3">
                                    <div class="select">
                                        <img class='default'src="https://o5wwk8baw.qnssl.com/a42bdcc1178e62b4694c830f028db5c0/avatar"/>
                                        <span>默认图2</span>
                                    </div>
                                </Radio>
                            </RadioGroup>
                        </FormItem>
                        <FormItem label="组织架构" prop="content">
                            <textarea v-model="organize.content" class='tinymce-textarea' id="tinymceEditerMessage" style="height: 500px"></textarea>
                            <Spin fix v-if="spinShow">
                                <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
                                <div>加载组件中...</div>
                            </Spin>
                        </FormItem>
                    </Form>
                    <p class="button">
                        <Button  type="primary" @click="updateNews" :loading="buttonLoading">保存</Button>
                    </p>
                </Card>
            </Col>
        </Row>
    </div>
</template>

<script>
    import tinymce from 'tinymce';
    import 'tinymce/themes/modern/theme';
    import api from '@/api/fetch-api';
    export default {
        name: 'organizing-committee',
        data () {
            return {
                spinShow:false,
                buttonLoading:false,
                choose:'',
                organize:{
                    content:'',
                    indexImageUrl:'',
                },
                uploadList:[],
                defaultList:[]
            };
        },
        methods:{
            updateNews(){
                this.buttonLoading =true;
                this.organize.content = tinymce.get('tinymceEditerMessage').getContent();
                api(this,'/main/updateNews',{
                    trackId:this.$store.state.userInfo.trackId,
                    levelId:this.$store.state.userInfo.levelId,
                    manageId:this.$store.state.userInfo.manageId,
                    newId:this.organize.newId,
                    type:4,
                    indexImageUrl:this.organize.indexImageUrl,
                    content:this.organize.content
                },res => {
                    this.buttonLoading =false;
                    if(res.code == 0) {
                        this.$Message.info('保存成功！');
                    }else{
                        this.$Message.error(res.message);
                    }
                },res => {
                    this.$Message.error(res.message);
                });
            },
            getCommitteeInfo(){
                api(this,'/main/getCommitteeInfo',{
                    trackId:this.$store.state.userInfo.trackId,
                    levelId:this.$store.state.userInfo.levelId,
                    manageId:this.$store.state.userInfo.manageId,
                },res => {
                    this.loading = false;
                    if(res.code == 0) {
                        if(res.data.indexImageUrl!==null){
                            this.organize.indexImageUrl = res.data.indexImageUrl;
                            this.choose = "1";
                        }
                        this.spinShow=true;
                        if(tinymce.get('tinymceEditerMessage')){
                            localStorage.removeItem("editorContentMessage");
                            tinymce.get('tinymceEditerMessage').destroy();
                        }
                        localStorage.editorContentMessage=res.data.content==null?'':res.data.content;
                        this.tinyInit(this);
                    }else{
                        this.$Message.error(res.message);
                    }
                },res => {
                    this.$Message.error(res.message);
                });
            },
            uploadSuccess (res, file) {
                if(res.code==0){
                    this.organize.indexImageUrl = res.data.url;
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
            tinyInit(vm){
                let height = document.body.offsetHeight - 430;
                let _this = this;
                tinymce.init({
                    selector: '#tinymceEditerMessage',
                    branding: false,
                    upload_image_url: '/file/uploadTinymce', //配置的上传图片的路由
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
                                    debugger
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
                            if (localStorage.editorContentMessage) {
                                tinymce.get('tinymceEditerMessage').setContent(localStorage.editorContentMessage);
                            }else{
                                tinymce.get('tinymceEditerMessage').setContent("");
                            }
                        });
                        editor.on('keydown', function (e) {
                            localStorage.editorContentMessage = tinymce.get('tinymceEditerMessage').getContent();
                        });
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
           this.getCommitteeInfo();
        }
    };
</script>
