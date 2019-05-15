<template>
  <div class="components-task">
    <!-- 指派 -->
    <Modal v-model="showValue" title="指派" class="task-modal" :width="900">
      <Table border :loading="loading" :data="tableData" :columns="columns" @on-selection-change="selectionChange"></Table>
      <div slot="footer">
        <Button type="primary" @click="submit">提交</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import api from '@/api/fetch-api';
  export default {
  	name: "components-task",
    props: {
      value: Boolean,
      selectTbaleData: {
        type: Array,
        default () {
          return []
        }
      },
      matchId: String,
      assignFirstFlag: String
    },
    watch: {
      value (val) {
        this.showValue = val
        val ? this.getListAssignTutor() : (this.selectApplyIdArray = '', this.tableData = [])
      },
      showValue (val) {
        this.$emit('update:value', val);
      }
    },
  	data(){
  		return {
  			showValue: false,
        loading: false,
        columns: [
          { type: 'selection', width: 60, align: 'center' },
          { key: 'userName', title: '专家姓名', },
          { key: 'belong', title: '工作单位', },
          { key: 'reviewFlagString', title: '曾担任评委', },
          { key: 'certFlagString', title: '持有证书', }
        ],
        tableData: [],
        selectApplyIdArray: ''
  		}
  	},

  	created(){
  		//On Component created
  	},
    computed: {
      entryIdArray(){
        var entryIdArray = '';
        this.selectTbaleData.map(v =>{
          entryIdArray += `${v.entryId},`
        })
        return entryIdArray.substring(0, entryIdArray.length - 1)
      }
    },
  	methods: {
      //存储表格选中数据
      selectionChange(selection){
        var selectApplyIdArray = '';
        selection.map(v =>{
          selectApplyIdArray += `${v.id},`
        })
        this.selectApplyIdArray = selectApplyIdArray.substring(0, selectApplyIdArray.length - 1)
      },
      //获取待指派的专家列表
      getListAssignTutor(){
        api(this,'/review/listAssignTutor', {
          entryIdArray: this.entryIdArray,
          matchId: this.matchId,
        }, res => {
            this.loading = false;
            if(res.code == 0) {
              res.data.map(v =>{
                v._checked = !!v.checkFlag
              })
              this.tableData = res.data;
            }else{
              this.$Message.error(res.message);
            }
        },res => {
          this.$Message.error(res.message);
        });
      },
      submit(){
        if(this.selectApplyIdArray == ''){
          this.$Message.error('请选择数据');
          return;
        }
        api(this,'/review/batchAssign', {
          entryIdArray: this.entryIdArray,
          selectApplyIdArray: this.selectApplyIdArray,
          matchId: this.matchId,
          assignFirstFlag: this.assignFirstFlag
        }, res => {
            this.loading = false;
            if(res.code == 0) {
              this.$Message.success('提交成功');
              this.$emit('update:value', false);
              this.$emit('updata-data')
            }else{
              this.$Message.error(res.message);
            }
        },res => {
          this.$Message.error(res.message);
        });
      }
  	}
  }
</script>
<style lang="less" scoped>
  @import './task.less';
</style>
