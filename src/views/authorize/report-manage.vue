<style lang="less" scoped>
  @import 'report-manage.less';
</style>

<template>
  <div>
    <Row>
      <Col span="24">
        <Card v-if="baseMessageShow">
            <div class="title">
                <span>参数授权</span>
                <span>请在这里输入本届有资格上级赛事提交作品的选手的手机号码，输入后该选手登录系统后可在<i style="color:red">个人中心</i>提交上级赛事作品</span>
            </div>
            <div class="tel">
                <Input v-model="authorizeForm.telephone" :maxlength="11" :clearable="true" placeholder="输入选手手机号码" class="input"/>
                <Button type="primary" icon="ios-search" @click="showAuthorize" style="margin:0 0 0 10px" >授权</Button>
            </div>
            <div class="segmentingLine"></div>
            <Row type="flex" justify="start" class="filter">
              <Col span="4">
                <span>届别：</span>
                <Select v-model="matchId" placeholder="请选择届别"  style="width:200px" @on-change="getList">
                    <Option v-for="(item, index) in statusList" :value="item.matchId" :key="index">{{ item.sessionName }}</Option>
                </Select>
              </Col>
              <Col span="4">
                <span>组别：</span>
                <Select v-model="groupId" placeholder="请选择组别"  style="width:200px" @on-change="getList">
                    <Option v-for="(item, index) in groupList" :value="item.id" :key="index">{{ item.typeName }}</Option>
                </Select>
              </Col>
            </Row>
            <Row justify="center">
              <Table border :loading="loading" :data="tableData" :columns="columns" @on-selection-change="selectionChange">
                <template slot-scope="{ row, index }" slot="action">
                  <span class="text" @click="showModel('isShowRanking', row)">修改排名</span>
                  <span class="text" @click="getViewProjectInfo(row.entryId)">查看</span>
                  <span class="text" @click="showModel('isShowReview', row)">{{row.authorCheckStatus ? '取消' : ''}}审核</span>
                  <span class="text" @click="showModel('isShowReport', row)">{{row.sendStatus ? '取消' : ''}}上报</span>
                </template>
              </Table>
            </Row>
            <Row>
                <Page class="page" :total="total" @on-change="handleCurrentChange" :page-size="pageSize"></Page>
            </Row>
        </Card>
        <Card v-if="!baseMessageShow">
            <div style="text-align: right">
                <Button type="primary" @click="handleCancel" style="margin-left: 8px;">返回上一级</Button>
            </div>
            <div class="segmentingLine" style="margin-top: 5px"></div>
            <p style="color:#000;font-size: 18px">
                <Icon type="ios-list"></Icon>
                基本信息
            </p>
            <div class="segmentingLine" style="margin-top: 5px"></div>
            <baseMessage :viewProjectInfo="viewProjectInfo" :project='base_project' :team_member_model="team_member_model" :team_tutor_model="team_tutor_model" :project_file="project_file"></baseMessage>
        </Card>
      </Col>
    </Row>

    <!-- 上报 -->
    <Modal v-model="isShowReport" title="上报" width="400" class="report-modal">
      您将对"{{rankingForm.item.title}}"进行上报操作为：
      <div slot="footer">
        <Button type="primary" @click="reviewReportSubmit(2, rankingForm.item.sendStatus ? 0 : 1)">{{rankingForm.item.sendStatus ? '取消' : ''}}上报</Button>
      </div>
    </Modal>
    <!-- 审核 -->
    <Modal v-model="isShowReview" title="审核" width="400" class="review-modal">
      您将对"{{rankingForm.item.title}}"审核结果为：
      <div slot="footer">
        <Button type="primary" @click="reviewReportSubmit(1, 2)">返回重新提交</Button>
        <Button type="primary" @click="reviewReportSubmit(1, 1)" v-if="rankingForm.item.authorCheckStatus == 0">通过</Button>
        <Button type="primary" @click="reviewReportSubmit(1, 0)">未通过</Button>
      </div>
    </Modal>
    <!-- 排名 -->
    <Modal v-model="isShowRanking" title="修改排名" width="400" class="ranking-modal"
      @on-visible-change="val =>{ !val && this.$refs['rankingForm'].resetFields(); }">
      <Form ref="rankingForm" :model="rankingForm" :rules="rankingRule" inline>
        <FormItem prop="sortNum">
            <Input type="number" v-model="rankingForm.sortNum" placeholder="请输入排名"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="rankingSubmit('rankingForm')">提交</Button>
      </div>
    </Modal>
    <!-- 授权报送 -->
    <Modal v-model="isShowAuthorize" title="授权" @on-visible-change="authorizeVisibleChange" class="authorize-modal">
        <RadioGroup v-model="authorizeForm.radioVal">
          <Radio label="1">
              <span>授权到上级赛事</span>
          </Radio>
          <Radio label="2">
              <span>授权到其他赛事</span>
          </Radio>
      </RadioGroup>
      <div class="select" v-show="authorizeForm.radioVal == 2" style="margin-top: 20px;">
        <Select v-model="authorizeForm.macth" style="width:150px" placeholder="请选择赛道" @on-change="authorizeFormSelectChange">
          <Option :value="item.id" v-for="(item, index) in authorizeForm.listAllTrack" :key="index">{{item.trackName}}</Option>
        </Select>
        <Select v-model="authorizeForm[item.field_name]" :placeholder="`请选择${item.levelName}`" @on-change="areaSelectChange"
            style="width:150px" :key="index" v-for="(item, index) in dynamicForm">
            <Option v-for="d in item.data" :key="d.id" :value="`${d.id}.${index}.${d.levelId}.${d.trackId}`">{{d.manageName}}</Option>
        </Select>
      </div>
      <p class="info">姓名：{{authorizeForm.userName}}</p>
      <p class="info">院校：{{authorizeForm.universityName}}</p>
      <div slot="footer">
        <Button type="primary" @click="submitAuthorize">提交</Button>
      </div>
    </Modal>

  </div>
</template>

<script>
  import reportManageMixins from './report-manage-mixins';
  import tableMixin from '@/mixins/table'
  import api from '@/api/fetch-api';
  import baseMessage from '@/components/base-message'
  export default {
      data () {
        return {

          viewProjectInfo: {},
          base_project: [],
          team_member_model: [],
          team_tutor_model:[],
          project_file:[],
          baseMessageShow:true,
        };
      },
      components: {
        baseMessage
      },
      mixins: [ reportManageMixins, tableMixin ],
      methods:{
        handleCancel(){
            this.baseMessageShow =true;
        },
        getViewProjectInfo(entryId){
          api(this,'/project/viewProjectInfo',{
            entryId
          },res => {
            this.loading = false;
            if(res.code == 0) {
              this.viewProjectInfo = res.data;
              this.base_project =res.data.listProjectExtendCfg.data.PROJECT;
              for(let item of  res.data.listProjectExtendCfg.data.TEAM_MEMBER){
                let content={
                    title:item.fieldLabel,
                    key:item.fieldName,
                    align:'center',
                    width:140
                }
                this.team_member_model.push(content);
              }
              for(let item of  res.data.listProjectExtendCfg.data.TEAM_TUTOR){
                let content={
                    title:item.fieldLabel,
                    key:item.fieldName,
                    align:'center',
                    width:140
                }
                this.team_tutor_model.push(content);
              }
              this.project_file = res.data.listProjectExtendCfg.data.PROJECT_FILE;
              this.baseMessageShow = false;
            }else{
              this.$Message.error(res.message);
            }
          },res => {
            this.$Message.error(res.message);
          });
        },
        //显示授权弹窗
        showAuthorize(){
          if (this.authorizeForm.telephone === '') {
            this.$Message.error("请输入手机号");
            return;
          }
          if(!(/^1[34578]\d{9}$/.test(this.authorizeForm.telephone))){
            this.$Message.error("手机格式错误");
            return
          }
          !this.authorizeForm.listAllTrack.length && this.getListAllTrack();
          this.managerLevelId.trackId === '' && this.getParentManagerLevelId();
          this.getStuInfoByPhone();
          this.isShowAuthorize = true;
        },
        //授权窗口关闭事件
        authorizeVisibleChange(val){
          this.authorizeForm.macth = ''
          if(!val){
            this.dynamicForm = []
            this.authorizeForm.radioVal = '1';
          }
        },
        //提交授权
        submitAuthorize(){
          var submitData = {
            ...this.managerLevelId, userId: this.authorizeForm.userId,
          }
          if(this.authorizeForm.radioVal == 2){
            if(this.authorizeForm.macth === ''){
              this.$Message.error("请选择赛道");
              return
            }
            debugger
            if(this.authorizeForm[this.dynamicForm[0].field_name] === ''){
              this.$Message.error(`请选择${this.dynamicForm[0].levelName}`);
              return
            }
            var selectIndex = -1;
            this.dynamicForm.map((v, index) =>{
              if(this.authorizeForm[v.field_name] === ''){
                selectIndex = index;
              }
            })
            var [ manageId, index, levelId, trackId ] = this.authorizeForm[this.dynamicForm[(selectIndex == -1 ? this.dynamicForm.length : selectIndex) - 1].field_name].split('.');
            submitData.manageId = manageId;
            submitData.levelId = levelId;
            submitData.trackId = trackId;
          }
          api(this,'/authorize/authorityToSubmit', submitData, res => {
            this.loading = false;
            if(res.code == 0) {

              this.isShowAuthorize = false;
              this.authorizeForm.telephone = '';
            }else{
              this.$Message.error(res.message);
            }
          },res => {
            this.$Message.error(res.message);
          });
          // this.isShowAuthorize = false;
        },
        //根据手机号获取用户信息
        getStuInfoByPhone(){
          api(this,'/authorize/getStuInfoByPhone', {
            telephone: this.authorizeForm.telephone,
          },res => {
              this.loading = false;
              if(res.code == 0) {
                this.authorizeForm.userId = res.data.userId
                this.authorizeForm.userName = res.data.userName
                this.authorizeForm.universityName = res.data.universityName
              }else{
                  this.$Message.error(res.message);
              }
          },res => {
              this.$Message.error(res.message);
          });
        },
        //获取赛道列表
        getListAllTrack(){
          api(this,'/authorize/listAllTrack', {}, res => {
              this.loading = false;
              if(res.code == 0) {
                this.authorizeForm.listAllTrack = res.data
              }else{
                  this.$Message.error(res.message);
              }
          },res => {
              this.$Message.error(res.message);
          });
        },
        //界别选择事件
        authorizeFormSelectChange(val){
          val && ( this.trackId = val, this.getListMatchLevel())
        },
        //获取已经创建的赛事的届别
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
                    this.defaultProjectCollectionSetting();
                }else{
                    this.$Message.error(res.message);
                }
            },res => {
                this.$Message.error(res.message);
            });
        },
        //选择子级管理列表
        getlistSubTreeMenu(parentId, index){
          api(this,'/authorize/selectSubManageList',{
              parentId,
              trackId: this.trackId
          },res => {
              this.loading = false;
              if(res.code == 0) {
                  this.dynamicForm[index].data = res.data
              }else{
                  this.$Message.error(res.message);
              }
          },res => {
              this.$Message.error(res.message);
          });
        },
        //获取比赛等级列表
        getListMatchLevel(){
          api(this,'/authorize/listMatchLevel', { trackId: this.trackId }, res => {
              this.loading = false;
              if(res.code == 0) {
                res.data.pop()
                res.data.map(v =>{
                  v.data = [];
                  v.field_name = `area${v.id}`;
                  this.$set(this.authorizeForm, v.field_name, '');
                })
                this.dynamicForm = res.data
                this.getlistSubTreeMenu(0, 0)
              }else{
                this.$Message.error(res.message);
              }
          },res => {
            this.$Message.error(res.message);
          });
        },
        //选择区域事件
        areaSelectChange(val){
          var [ id, index ] = val.split('.');
          (~~index < this.dynamicForm.length - 1) && this.getlistSubTreeMenu(id, ~~index + 1)
        },
        //获取父赛道id，父管理id，父等级id
        getParentManagerLevelId(){
          api(this,'/authorize/getParentManagerLevelId', { manageId:this.$store.state.userInfo.manageId, }, res => {
              this.loading = false;
              if(res.code == 0) {
                this.managerLevelId = {
                  trackId: res.data.trackId,
                  levelId: res.data.levelId,
                  manageId: res.data.manageId
                }
              }else{
                this.$Message.error(res.message);
              }
          },res => {
            this.$Message.error(res.message);
          });
        },
        //获取表格数据
        getList(){
          api(this,'/authorize/pageResulEntryInfoList', {
            trackId:this.$store.state.userInfo.trackId,
            levelId:this.$store.state.userInfo.levelId,
            manageId:this.$store.state.userInfo.manageId,
            pageNum: this.currentPage,
            pageSize: this.pageSize,
            matchId: this.matchId,
            groupId: this.groupId,
          }, res => {
              this.loading = false;
              if(res.code == 0) {
                this.tableData = res.data.data;
                this.total = res.data.total;
              }else{
                this.$Message.error(res.message);
              }
          },res => {
            this.$Message.error(res.message);
          });
        },
        //获取已经创建的赛事的届别
        listNewSessionIndex(){
          api(this,'/authorize/listParentSessionIndex',{
            manageId: this.$store.state.userInfo.manageId,
          },res => {
            this.loading = false;
            if(res.code == 0) {
              this.statusList = res.data;
              this.matchId = res.data[0].matchId;
              this.getList();
              this.getGroupList();
            }else{
              this.$Message.error(res.message);
            }
          },res => {
            this.$Message.error(res.message);
          });
        },
        //获取组别数据
        getGroupList(){
          api(this,'/expert/getMatchComType',{
            trackId: this.$store.state.userInfo.trackId,
            dictType: 1,
            matchId: this.matchId
          },res => {
            this.loading = false;
            if(res.code == 0) {
              this.groupList = res.data;
            }else{
              this.$Message.error(res.message);
            }
          },res => {
            this.$Message.error(res.message);
          });
        },
        //修改排名
        rankingSubmit(name){
          this.$refs[name].validate((valid) => {
            if (valid) {
              api(this,'/authorize/modifyRanking',{
                entryId: this.rankingForm.item.entryId,
                sort: this.rankingForm.sortNum
              },res => {
                this.loading = false;
                if(res.code == 0) {
                  this.$Message.success('排名成功');
                  this.getList();
                }else{
                  this.$Message.error(res.message);
                }
                this.isShowRanking = false;
              },res => {
                this.$Message.error(res.message);
              });
            }
          })
        },
        //审核与上报
        reviewReportSubmit(type, status){
          api(this,'/authorize/auditOrReport',{
            entryId: this.rankingForm.item.entryId,
            type,
            checkStatus: status,
            sendStatus: status
          },res => {
            this.loading = false;
            if(res.code == 0) {
              this.$Message.success('提交成功');
              this.getList();
            }else{
              this.$Message.error(res.message);
            }
            this.isShowReview = false;
          },res => {
            this.$Message.error(res.message);
          });
        },
      },
      created(){
        //获取界别数据
        this.listNewSessionIndex();
      }
  };
</script>
