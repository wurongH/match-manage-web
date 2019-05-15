<style lang="less">
    @import './school-service.less';
</style>

<template>
  <div>
    <Row>
      <Col span="24">
        <Card>
          <div class="header">
            <span>
              <Icon type="ios-list"></Icon>
              校赛服务
            </span>
            <span>状态</span>
            <Select v-model="sessionIndex" style="width:100px">
                <Option>全部</Option>
                <Option>未处理</Option>
                <Option>已处理</Option>
            </Select>
          </div>

            <Row justify="center">
              <Table border :loading="loading" :data="tableData" :columns="columns" @on-selection-change="selectionChange">
                <template slot-scope="{ row, index }" slot="action">
                  <span class="text" @click="showModel('isShowRanking', row)">处理</span>
                </template>
              </Table>
            </Row>



        </Card>
        
      </Col>
    </Row>
  </div>
</template>
<script>
import api from '@/api/fetch-api';
import schoolServiceMixins from './school-service-mixins.js';
import tableMixin from '@/mixins/table'
import baseMessage from '@/components/base-message'
export default {
  name: 'school-service',
  data () {
    return {

    }
  },
  components: {
    baseMessage
  },
  mixins: [ schoolServiceMixins, tableMixin ],
  methods: {
  //获取表格数据
  getList() {
    api(this, '/')  
  }
  
  }

}

</script>


