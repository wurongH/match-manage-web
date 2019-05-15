export default {
  data () {
    return {
      //界别数据
      statusList: [],
      matchId: '',

      //赛事组别信息、符合项目、专家数
      assignGroupList: [],

      //是否指派第一名项目
      assignFirstFlag: '1',
      isNoeKye: false,
      groupId: '',
      isShowAssignFirstFlag: false,

      //表格自定义列
      assignFieldList: [],
      defaultColumns: [
        { type: 'selection', width: 60, align: 'center' },
        { type: 'index', title: '序号', width: 80 },
      ],
      tableAction: [{ title: '操作', slot: 'action', width: 180, align: 'center', fixed: 'right', }],

      //表格镖头数据
      columns: [],
      //表格中数据
      selectData: [],

      //表格动态展示字段
      dynamicTableField: [],
      dynamicTableFieldValue: [],

      //是否显示指派弹窗
      isTask: false,

      //指派状态
      assignStatus: '',
      //评审状态
      reviewStatus: '',

      //是否删除专家弹层
      isShowDelModal: false,
      //教师id
      tutorAuditId: ''
    }
  },
  computed: {
  },
  created(){
  },
  methods: {
  }
}
