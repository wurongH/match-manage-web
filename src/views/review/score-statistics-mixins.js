export default {
  data () {
    return {
      //界别数据
      statusList: [],
      matchId: '',

      //表格动态展示字段
      dynamicTableField: [],
      dynamicTableFieldValue: [],

      //表格自定义列
      assignFieldList: [],
      defaultColumns: [
        { type: 'index', title: '序号', width: 80 },
      ],
      tableAction: [{ title: '操作', slot: 'action', width: 150, align: 'center', fixed: 'right', }],

      type: '1',
      //评审状态
      status: '',

      //表格镖头数据
      columns: [],
    }
  },
  computed: {
  },
  created(){
  },
  methods: {
  }
}
