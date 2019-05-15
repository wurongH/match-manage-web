<style lang="less">
    @import './own-space.less';
</style>

<template>
    <div>
        <Card>
            <p slot="title">
                <Icon type="person"></Icon>
                个人信息
            </p>
            <div>
                <Form 
                    ref="userForm"
                    :model="userForm" 
                    :label-width="100" 
                    label-position="right"
                    :rules="inforValidate"
                >
                    <FormItem label="用户姓名：" prop="name">
                        <div style="display:inline-block;width:300px;">
                            <Input v-model="userForm.name" ></Input>
                        </div>
                    </FormItem>
                    <FormItem label="电子邮箱：" prop="email">
                        <div style="display:inline-block;width:300px;">
                            <Input v-model="userForm.email" ></Input>
                        </div>
                    </FormItem>
                    <FormItem label="身份证号：" prop="idCardNo">
                        <div style="display:inline-block;width:300px;">
                            <Input v-model="userForm.idCardNo" ></Input>
                        </div>
                    </FormItem>
                    <!--<FormItem label="用户头像：">
                        &lt;!&ndash;<span>{{ userInfo.telephone }}</span>&ndash;&gt;
                        <Button type="text" style="width: 100px;" @click="changeHeader()">选择图片</Button>
                    </FormItem>-->
                    <FormItem label="手机号：">
                        <span>{{ userInfo.telephone }}</span>
                    </FormItem>
                    <FormItem label="创建人：">
                        <span>{{ userInfo.createUser }}</span>
                    </FormItem>
                    <FormItem label="登录密码修改：">
                        <Button type="text" size="small">暂不支持</Button>
                    </FormItem>

                    <div>
                        <Button type="text" style="width: 100px;" @click="cancelEditUserInfor">取消</Button>
                        <Button type="primary" style="width: 100px;" :loading="save_loading" @click="saveEdit">保存</Button>
                    </div>
                </Form>
            </div>
        </Card>
        <Modal v-model="headerCutVisible" :closable='false' :mask-closable=false :width="600" @on-ok="handlecrop1">
            <Col span="14" class="image-editor-con1">
            <div class="cropper" style="height: 380px">
                <img id="cropimg1" alt="">
            </div>
            </Col>
            <Col span="10" class="image-editor-con1">
                <Row type="flex" justify="center" align="middle" class="image-editor-con1-preview-con">
                    <div id="preview1"></div>
                </Row>
                <div class="image-editor-con1-btn-con margin-top-10">
                    <input type="file" accept="image/png, image/jpeg, image/gif, image/jpg" @change="handleChange1" id="fileinput1" class="fileinput" />
                    <label class="filelabel" for="fileinput1"><Icon type="image"></Icon>&nbsp;选择图片</label>
                </div>
            </Col>
        </Modal>
        <!--Modal v-model="editPasswordModal" :closable='false' :mask-closable=false :width="500">
            <h3 slot="header" style="color:#2D8CF0">修改密码</h3>
            <Form ref="editPasswordForm" :model="editPasswordForm" :label-width="100" label-position="right" :rules="passwordValidate">
                <FormItem label="原密码" prop="oldPass" :error="oldPassError">
                    <Input v-model="editPasswordForm.oldPass" placeholder="请输入现在使用的密码" ></Input>
                </FormItem>
                <FormItem label="新密码" prop="newPass">
                    <Input v-model="editPasswordForm.newPass" placeholder="请输入新密码，至少6位字符" ></Input>
                </FormItem>
                <FormItem label="确认新密码" prop="rePass">
                    <Input v-model="editPasswordForm.rePass" placeholder="请再次输入新密码" ></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="text">取消</Button>
                <Button type="primary" :loading="savePassLoading">保存</Button>
            </div>
        </Modal>-->
    </div>
</template>

<script>
import Cookies from 'js-cookie';
import api from  '@/api/fetch-api';
import Cropper from 'cropperjs';
import './cropper.min.css';
export default {
    name: 'ownspace_index',
    data () {
        let validateTelephone = (rule, value, callback) => {
            var myreg=/^[1][3,4,5,7,8][0-9]{9}$/;
            if (!myreg.test(value)) {
                callback(new Error('请输入合法手机号'));
            } else {
                callback();
            }
        };
        let validateIdCardNo = (rule, value, callback) => {
            var myreg=/^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|31)|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}([0-9]|x|X)$/;
            if (!myreg.test(value)) {
                callback(new Error('请输入合法身份证'));
            } else {
                callback();
            }
        };
        const valideRePassword = (rule, value, callback) => {
            if (value !== this.editPasswordForm.newPass) {
                callback(new Error('两次输入密码不一致'));
            } else {
                callback();
            }
        };
        return {
            cropper1: {},
            option1: {
                showCropedImage: false,
                cropedImg: ''
            },
            userForm: {
                name:'',
                telephone:'',
                email:'',
                idCardNo:'',
                createUser:'',
            },
            headerCutVisible:false,
            save_loading: false,
            checkIdentifyCodeLoading: false,
            inforValidate: {
                name: [
                    { required: true, message: '请输入姓名', trigger: 'blur' }
                ],
                telephone: [
                    { required: true, message: '请输入手机号码' },
                    { validator: validateTelephone }
                ],
                email: [
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
                ],
                idCardNo: [
                    { required: true, message: '请输入身份证号', trigger: 'blur' },
                    { validator: validateIdCardNo }
                ],
            },
            editPasswordForm: {
                oldPass: '',
                newPass: '',
                rePass: ''
            },
            passwordValidate: {
                oldPass: [
                    { required: true, message: '请输入原密码', trigger: 'blur' }
                ],
                newPass: [
                    { required: true, message: '请输入新密码', trigger: 'blur' },
                    { min: 6, message: '请至少输入6个字符', trigger: 'blur' },
                    { max: 32, message: '最多输入32个字符', trigger: 'blur' }
                ],
                rePass: [
                    { required: true, message: '请再次输入新密码', trigger: 'blur' },
                    { validator: valideRePassword, trigger: 'blur' }
                ]
            },
        };
    },
    computed:{
        userInfo(){
            this.userForm={
                name:this.$store.state.userInfo.name,
                email:this.$store.state.userInfo.email,
                idCardNo:this.$store.state.userInfo.idCardNo
            };
            return this.$store.state.userInfo;
        }
    },
    mounted () {

        let img1 = document.getElementById('cropimg1');
        this.cropper1 = new Cropper(img1, {
            dragMode: 'move',
            preview: '#preview1',
            restore: false,
            center: false,
            highlight: false,
            cropBoxMovable: false,
            toggleDragModeOnDblclick: false
        });
    },
    methods: {
        changeHeader(){
            this.headerCutVisible = !this.headerCutVisible;
        },
        handleChange1 (e) {
            let file = e.target.files[0];
            let reader = new FileReader();
            reader.onload = () => {
                this.cropper1.replace(reader.result);
                reader.onload = null;
            };
            reader.readAsDataURL(file);
        },
        handlecrop1 () {
            debugger
            let file = this.cropper1.getCroppedCanvas().toDataURL();
            this.option1.cropedImg = file;
            this.option1.showCropedImage = true;
        },
        showEditPassword () {
            this.editPasswordModal = true;
        },
        cancelEditUserInfor () {
            this.$store.commit('removeTag', 'ownspace_index');
            localStorage.pageOpenedList = JSON.stringify(this.$store.state.app.pageOpenedList);
            let lastPageName = '';
            if (this.$store.state.app.pageOpenedList.length > 1) {
                lastPageName = this.$store.state.app.pageOpenedList[1].name;
            } else {
                lastPageName = this.$store.state.app.pageOpenedList[0].name;
            }
            this.$router.push({
                name: lastPageName
            });
        },
        saveEdit () {
            this.$refs['userForm'].validate((valid) => {
                if (valid) {
                        let parameter={
                            name:this.userForm.name,
                            email:this.userForm.email,
                            idCardNo:this.userForm.idCardNo,
                        }
                        api(this,'/user/updateUserInfoByToken',parameter,res => {
                            if(res.code==0){
                                this.$store.commit('set-userinfo',res.data);
                                Cookies.set("user",res.data.name);
                                this.$Message.success('保存成功');
                            }else{
                                this.$Message.success(res.message);
                            }
                        });
                }
            });
        }
    }
};
</script>
