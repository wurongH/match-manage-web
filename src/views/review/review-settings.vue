<style lang="less" scoped>
    @import 'review-settings.less';
</style>

<template>
    <div>
        <Row>
            <Col span="24">
                <Card>
                    <div class="header">
                        <span class="message">
                            <Icon type="ios-list"></Icon>
                            评审基本信息
                        </span>
                        <Select v-model="sessionIndex" placeholder="状态"  style="width:200px" @on-change="changeSessionIndex">
                            <Option v-for="item in statusList" :value="item.matchId" :key="item.sessionIndex+'01'">{{ item.sessionName }}</Option>
                        </Select>
                    </div>
                    <Row justify="start" style="margin-bottom:10px;margin-top: 30px;width: 1000px">
                        <Form :label-width="100" >
                            <FormItem label="评审时间">
                                <DatePicker :value="time" format="yyyy-MM-dd HH:mm:ss" type="datetimerange" @on-change="sendTimeChange" placeholder="请选择评审时间" style="width: 320px" ></DatePicker>
                            </FormItem>
                            <div class="title">
                                <span>评审专家</span>
                                <span>请在这里选择/编辑本赛事每个项目所属的评审专家人数</span>
                            </div>
                            <FormItem label="评审专家人数" prop="tutorCount">
                                <Input v-model="tutorCount" style="width: 150px" placeholder="请输入评审专家人数" />
                            </FormItem>
                            <div class="title">
                                <span>专家构成</span>
                                <span>一个项目的专家构成小于该项目的总人数</span>
                            </div>
                            <Row>
                                <Col span="6" v-for="item in tutorTypeCountJa" :key="item.id">
                                  <FormItem :label="item.typeName">
                                      <Input v-model="item.maxCount" :placeholder="'请输入'+item.typeName+'人数'"/>
                                  </FormItem>
                                </Col>
                            </Row>

                            <FormItem>
                                <Button type="primary" :loading="buttonLoading" @click="saveReviewSetting">&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp保存&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</Button>
                            </FormItem>
                          </Form>
                    </Row>
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
                statusList:[],
                sessionIndex:0,
                buttonLoading:false,
                time:[],
                tutorCount:'',
                tutorTypeCountJa:[],
            };
        },
        methods:{
            sendTimeChange(val){
                this.time = val;
            },
            changeSessionIndex(value){
                for(let item in this.statusList){
                    if(value ==item.matchId){
                        this.userInfo = item;
                    }
                }
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
                        this.getReviewSetting();
                    }else{
                        this.$Message.error(res.message);
                    }
                },res => {
                    this.$Message.error(res.message);
                });
            },
            getReviewSetting(){
                api(this,'/review/getReviewSetting',{
                    matchId:this.sessionIndex,
                },
                res => {
                    this.loading = false;
                    if(res.code == 0) {
                        this.time.push(res.data.reviewStartTime);
                        this.time.push(res.data.reviewEndTime);
                        this.tutorTypeCountJa = res.data.tutorTypeCountJa;
                        this.tutorCount = res.data.tutorCount;
                    }else{
                        this.$Message.error(res.message);
                    }
                },res => {
                    this.$Message.error(res.message);
                });
            },
            saveReviewSetting(){
                if(this.time.length==0){
                    this.$Message.error("请输入评审时间");
                    return;
                }
                this.buttonLoading = true;
                api(this,'/review/saveReviewSetting',{
                    matchId:this.sessionIndex,
                    reviewStartTime:this.time[0],
                    reviewEndTime:this.time[1],
                    tutorTypeCountJa:this.tutorTypeCountJa,
                    tutorCount:this.tutorCount
                },
                res => {
                    this.buttonLoading = false;
                    if(res.code == 0) {
                        this.$Message.info("保存成功");
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
