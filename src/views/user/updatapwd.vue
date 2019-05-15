<style lang="less">
</style>

<template>
    <div>
        <Card>
            <p slot="title">
                <Icon type="person"></Icon>
                修改密码
            </p>
            <div>
              <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80" style="width: 500px">
                 <FormItem label="旧密码" prop="oldPwd">
                     <Input type="password" v-model="formValidate.oldPwd" placeholder="请输入旧密码"></Input>
                 </FormItem>
                 <FormItem label="新密码" prop="newPwd" required>
                     <Input type="password" v-model="formValidate.newPwd" placeholder="请输入新密码"></Input>
                 </FormItem>
                 <FormItem label="确认密码" prop="checkPass" required>
                     <Input type="password" v-model="formValidate.checkPass" placeholder="请再次输入新密码"></Input>
                 </FormItem>
                 <FormItem>
                     <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
                 </FormItem>
             </Form>
          </div>
        </Card>
    </div>
</template>

<script>
import api from  '@/api/fetch-api';
export default {
    name: 'updatapwd',
    data () {
        const validatePassCheck = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入新密码'));
            } else{
              if(value.length < 6){
                callback(new Error('密码长度至少6位数'))
              }else if (this.formValidate.checkPass != '') {
                  this.$refs.formValidate.validateField('checkPass');
              }
              callback();
            }
        };
        const validateCheckPass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入新密码'));
            } else if (value !== this.formValidate.newPwd) {
              callback(new Error('两次输入密码不一致!'));
            } else {
              callback();
            }
        };
        return {
          formValidate: {
            oldPwd: '',
            newPwd: '',
            checkPass: '',
          },
          ruleValidate: {
            oldPwd: [
                { required: true, message: '请输入旧密码', trigger: 'blur' }
            ],
            newPwd: [
                { validator: validatePassCheck, trigger: 'blur' }
            ],
            checkPass: [
              { validator: validateCheckPass, trigger: 'blur' }
            ]
          }
        };
    },
    mounted () {
    },
    methods: {
      handleSubmit (name) {
          this.$refs[name].validate((valid) => {
              if (valid) {
                api(this,'/user/updatapwd', {
                  oldPwd: this.formValidate.oldPwd,
                  newPwd: this.formValidate.newPwd,
                },res => {
                    this.loading = false;
                    if(res.code == 0) {
                        this.$Message.info("修改成功");
                        this.$refs['formValidate'].resetFields();
                    }else{
                        this.$Message.error(res.message);
                    }
                },res => {
                    this.$Message.error(res.message);
                });

              }
          })
      },
    }
};
</script>
