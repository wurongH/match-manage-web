<style lang="less" scoped>
    @import 'task-distribution.less';
</style>

<template>
  <div>
    <Row>
      <Col span="24">
        <Card v-if="baseMessageShow">
          <div class="header">
              <span class="message">
                  <Icon type="ios-list"></Icon>
                  指派规则
              </span>
              <span class="title">届别:</span>
              <Select v-model="matchId" placeholder="状态"  style="width:200px" @on-change="statusChange">
                  <Option v-for="(item, index) in statusList" :value="item.matchId" :key="index">{{ item.sessionName }}</Option>
              </Select>
          </div>
          <Tabs value="tabs1">
            <TabPane label="手动指派" name="tabs1">
              <div class="header" v-for="(item, index) in assignGroupList" :key="index">
                <span class="title">{{item.typeName}}:</span>
                <span>符合条件项目数{{item.projectCount}}个,专家人数{{item.toturCount}}人</span>
                <span class="button">
                    <Button type="primary" @click="isShowAssignFirstFlag = true, isNoeKye = false, groupId = item.id">预指派</Button>
                </span>
            </div>
          </TabPane>
          <TabPane label="随机指派" name="tabs2">
            <span class="button">
              <Button type="primary" @click="isShowAssignFirstFlag = true, isNoeKye = true">一键随机预指派</Button>
              </span>
            </TabPane>
          </Tabs>

          <div class="segmentingLine"></div>
          <div class="dynamic-table-field">
            <span>列表设置</span>
            <CheckboxGroup v-model="dynamicTableFieldValue" @on-change="dynamicTableFieldValueChange">
              <Checkbox :label="index" v-for="(item, index) in dynamicTableField" :key="index">{{item.fieldLabel}}</Checkbox>
            </CheckboxGroup>
          </div>
          <div class="segmentingLine"></div>
          <div class="operating">
            <span>评审状态</span>
            <Select v-model="reviewStatus" clearable style="width:200px" @on-change="getList">
              <Option value="0">等待评审</Option>
              <Option value="1">已评审</Option>
              <Option value="2">评审异常</Option>
            </Select>
            <span>指派状态</span>
            <Select v-model="assignStatus" clearable style="width:200px" @on-change="getList">
              <Option value="0">未指派</Option>
              <Option value="1">已指派</Option>
              <Option value="2">指派预览</Option>
              <Option value="3">退回</Option>
            </Select>
            <Button  type="primary" @click="batchTask">批量预指派</Button>
          </div>
          <Row justify="center">
              <Table border :loading="loading" :data="tableData" :columns="columns" @on-selection-change="selectionChange">
                <template slot-scope="{ row, index }" slot="action">
                  <span class="text" @click="noeTack(row.entryId)">预指派</span>
                  <span class="text" @click="getViewProjectInfo(row.entryId)">查看</span>
                </template>
                <template v-for="i in 7" slot-scope="{ row, index }" :slot="`tutor${i}`">
                  <template>
                    <Tag v-if="row[`tutor${i}`] != ''" @on-close="showDel(row[`tutorAuditId${i}`])" color="primary" closable>{{row[`tutor${i}`]}}</Tag>
                  </template>
                </template>
              </Table>
          </Row>
          <Row>
              <Page class="page" :total="total"></Page>
          </Row>
          <Button type="primary" @click="submit">发布</Button>
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


    <!-- 是否指派第一名项目 -->
    <Modal v-model="isShowAssignFirstFlag" title="友情提示" @on-visible-change="_ =>{ this.assignFirstFlag = '1'; }" width="400" class="review-modal">
      <RadioGroup v-model="assignFirstFlag">
        <Radio label="1">给第一名指派</Radio>
        <Radio label="0">不给第一名指派</Radio>
      </RadioGroup>
      <div slot="footer">
        <Button type="primary" @click="isShowAssignFirstFlag = false">取消</Button>
        <Button type="primary" @click="oneKeyAssign">确定</Button>
      </div>
    </Modal>
    <!-- 是否删除专家 -->
    <Modal
        v-model="isShowDelModal"
        title="友情提示"
        @on-ok="del">
        <p>是否删除?</p>
    </Modal>
    <!-- 指派弹窗 -->
    <task ref="task" :value.sync="isTask" :selectTbaleData="selectData" :assignFirstFlag="assignFirstFlag" :matchId="matchId" @updata-data="getList"></task>
  </div>
</template>

<script>
  import api from '@/api/fetch-api';
  import taskDistributionMixins from './task-distribution-mixins';
  import baseMessage from '@/components/base-message'
  import task from './components/task';
  import tableMixin from '@/mixins/table'
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
      task,
      baseMessage
    },
    mixins: [ taskDistributionMixins, tableMixin ],
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
      //删除专家
      del(){
        api(this, '/review/removeAssign',{
          tutorAuditId: this.tutorAuditId
        },res => {
          this.loading = false;
          if(res.code == 0) {
            this.$Message.success('删除成功');
            this.getList();
          }else{
            this.$Message.error(res.message);
          }
        },res => {
          this.$Message.error(res.message);
        });
      },
      showDel(id){
        this.tutorAuditId = id
        this.isShowDelModal = true;
      },
      //批量指派
      batchTask(){
        if(!this.selectTbaleData.length){
          this.$Message.error("请选择需要指派的数据");
          return;
        }
        this.selectData = this.selectTbaleData;
        this.isTask = true
      },
      //单个指派
      noeTack(entryId){
        this.selectData = [{ entryId }]
        this.isTask = true
      },
      //界别选择
      statusChange(){
        this.getListAssignGroup()
        this.getAssignFieldList()
        this.getList()
      },
      //动态表单选择
      dynamicTableFieldValueChange(data){
        var columns = [];
        data.map(v =>{
          columns.push({ key: this.dynamicTableField[v].fieldName, title: this.dynamicTableField[v].fieldLabel, width: 200 })
        })
        this.columns = [ ...this.defaultColumns, ...columns, ...this.tableAction ]
      },
      //获取指派界面自定义列
      getAssignFieldList(){
        api(this,'/review/assignFieldList',{
          matchId: this.matchId,
        },res => {
          this.loading = false;
          if(res.code == 0) {
            this.assignFieldList = res.data;
            res.data.map(v =>{
              if(v.fixation){
                if(v.fieldName.indexOf('tutor') != -1){
                  this.defaultColumns.push({ slot: v.fieldName, title: v.fieldLabel, width: 150 })
                }else{
                  this.defaultColumns.push({ key: v.fieldName, title: v.fieldLabel, width: v.fieldName == 'entryTitle' ? 200 : 100 })
                }
              }else{
                this.dynamicTableField.push(v)
              }
            })
            this.columns = [ ...this.defaultColumns, ...this.tableAction ]
          }else{
            this.$Message.error(res.message);
          }
        },res => {
          this.$Message.error(res.message);
        });
      },
      //获取赛事组别信息、符合项目、专家数
      getListAssignGroup(){
        api(this,'/review/listAssignGroup',{
          matchId: this.matchId
        },res => {
          this.loading = false;
          if(res.code == 0) {
            this.assignGroupList = res.data
          }else{
            this.$Message.error(res.message);
          }
        },res => {
          this.$Message.error(res.message);
        });
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
            this.matchId = res.data[0].matchId;
            this.getListAssignGroup()
            this.getAssignFieldList();
            this.getList()
          }else{
            this.$Message.error(res.message);
          }
        },res => {
          this.$Message.error(res.message);
        });
      },
      //按项目组一键指派 当个指派
      oneKeyAssign(){
        api(this, this.isNoeKye ? '/review/oneKeyRandomAssign' : '/review/oneKeyGroupAssign',{
          matchId: this.matchId,
          groupId: this.groupId,
          assignFirstFlag: this.assignFirstFlag
        },res => {
          this.loading = false;
          if(res.code == 0) {
            this.$Message.success('提交成功');
            this.isShowAssignFirstFlag = false;
            this.getList();
          }else{
            this.$Message.error(res.message);
          }
        },res => {
          this.$Message.error(res.message);
        });
      },
      //获取表格数据
      getList(){
        api(this,'/review/pageProjectAssign', {
          assignStatus: this.assignStatus,
          reviewStatus: this.reviewStatus,
          matchId: this.matchId,
          pageNum: this.currentPage,
          pageSize: this.pageSize,
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
      //确定指派
      submit(){
        api(this, '/review/confirmAssign',{
          matchId: this.matchId,
        },res => {
          this.loading = false;
          if(res.code == 0) {
            this.$Message.success('发布成功');
            this.getList();
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
