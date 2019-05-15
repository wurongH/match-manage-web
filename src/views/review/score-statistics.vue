<style lang="less" scoped>
  @import 'score-statistics.less';
</style>

<template>
  <div>
    <Row>
      <Col span="24">
        <Card v-if="baseMessageShow">
          <div class="header">
              <span class="message">
                  <Icon type="ios-list"></Icon>
                  成绩列表
              </span>
              <span class="title">届别:</span>
              <Select v-model="matchId" placeholder="状态"  style="width:200px" @on-change="statusChange">
                  <Option v-for="(item, index) in statusList" :value="item.matchId" :key="index">{{ item.sessionName }}</Option>
              </Select>
          </div>
          <div class="title">
              <span>计算方法</span>
              <span>请在这里选择本赛事项目最终等分的计算方法</span>
          </div>
          <div class="segmentingLine"></div>
          <RadioGroup v-model="type" @on-change="getList">
            <Radio label="1">求和</Radio>
            <Radio label="2">求平均数</Radio>
            <Radio label="3">取高去低求和</Radio>
            <Radio label="4">取高去低求平均数</Radio>
          </RadioGroup>
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
            <Select v-model="status" clearable style="width:200px" @on-change="getList">
              <Option value="0">未评审</Option>
              <Option value="1">已评审</Option>
            </Select>
          </div>
          <Row justify="center">
            <Table border :loading="loading" :data="tableData" :columns="columns" @on-selection-change="selectionChange">
              <template slot-scope="{ row, index }" slot="action">
                <span class="text" :title="`${row.promoteDescribe == '未晋级' ? '' : '取消'}晋级到现场总决赛`" @click="projectPromote(row)">{{row.promoteDescribe == '未晋级' ? '晋级' : '取消晋级'}}</span>
                <span class="text" @click="getViewProjectInfo(row.entryId)">查看</span>
              </template>
            </Table>
          </Row>
          <Row>
            <Page class="page" :total="total"></Page>
          </Row>
          <Button type="primary" @click="exportExcel">导出成绩为EXCEL</Button>
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
  </div>
</template>

<script>
  import api from '@/api/fetch-api';
  import scoreStatisticsMixins from './score-statistics-mixins';
  import baseMessage from '@/components/base-message'
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
      baseMessage
    },
    mixins: [ scoreStatisticsMixins, tableMixin ],
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
      exportExcel(){
        this.$Notice.open({
          title: '友情提示',
          desc: '有待开发'
        });
      },
      //晋级与取消晋级
      projectPromote(row){
        api(this,'/review/projectPromote',{
          entryId: row.entryId,
          promote: row.promoteDescribe == '未晋级' ? 1 : 0,
        },res => {
          this.loading = false;
          if(res.code == 0) {
            this.$Message.success('提交成功');
            this.getList()
          }else{
            this.$Message.error(res.message);
          }
        },res => {
          this.$Message.error(res.message);
        });
      },
      //动态表单选择
      dynamicTableFieldValueChange(data){
        var columns = [];
        data.map(v =>{
          columns.push({ key: this.dynamicTableField[v].fieldName, title: this.dynamicTableField[v].fieldLabel, width: 200 })
        })
        this.columns = [ ...this.defaultColumns, ...columns, ...this.tableAction ]
      },
      //界别选择
      statusChange(){
        this.getAssignFieldList()
        this.getList()
      },
      //获取成绩界面自定义列
      getAssignFieldList(){
        api(this,'/review/scoreFieldList',{
          matchId: this.matchId,
        },res => {
          this.loading = false;
          if(res.code == 0) {
            this.assignFieldList = res.data;
            res.data.map(v =>{
              if(v.fixation){
                this.defaultColumns.push({ key: v.fieldName, title: v.fieldLabel, width: v.fieldName == 'entryTitle' ? 200 : 100 })
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
            this.getAssignFieldList();
            this.getList()
          }else{
            this.$Message.error(res.message);
          }
        },res => {
          this.$Message.error(res.message);
        });
      },
      //获取表格数据
      getList(){
        api(this,'/review/projectScoreList', {
          trackId: this.$store.state.userInfo.trackId,
          levelId: this.$store.state.userInfo.levelId,
          manageId: this.$store.state.userInfo.manageId,
          type: this.type,
          pageNum: this.currentPage,
          pageSize: this.pageSize,
          fuzzySearch: '',
          matchId: this.matchId,
          status: this.status
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
    },

    created(){
        this.listSessionIndex();
    }
  };
</script>
