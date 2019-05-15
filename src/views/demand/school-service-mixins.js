export default {
  data () {
    return {
      //动态表单数据
      dynamicForm: [],
      /*
      //是否显示授权弹窗
      isShowAuthorize: false,
      authorizeForm: {
        //授权手机号
        telephone: '13107928973',
        //用户id
        userId: '',
        //姓名
        userName: '',
        //院校
        universityName: '',
        //Radio val
        radioVal: '1',

        //赛道列表
        listAllTrack: [],

        //赛道
        macth: '',
      },
      //界别数据
      statusList: [],
      matchId: '',

      //组别数据
      groupList: [],
      groupId: '*',

      //赛道id存储
      trackId: '',

      managerLevelId: {
        trackId: '',
        levelId: '',
        manageId: ''
      },
      */
      //表头数据
      columns:[
        
        { title: '单位名称', key: 'componyName' },
        { title: '联系人', key: 'userName' },
        { title: '联系电话', key: 'memberPhone' },
        { title: '赛事名称', key: 'title' },
        { title: '项目数量', key: 'submitTime' },
        { title: '项目领域', key: 'groupName' },
        { title: '专家类型', key: 'scoreSort' },
        { title: '专家级别', key: 'statusDescribe' },
        { title: '专家用途', key: 'groupName' },
        { title: '经费预算', key: 'scoreSort' },
        { title: '网络评审时间', key: 'statusDescribe' },
        { title: '现场评审时间', key: 'groupName' },
        { title: '处理状态', key: 'scoreSort' },
        { title: '操作', slot: 'action', width: 250, align: 'center', }
      ],


      //  借鉴 expert-list.vue
      // [
      //   {
      //     title: '操作',
      //     key: 'action',
      //     fixed:'right',
      //     width: 150,
      //     align: 'center',
      //     render: (h, params) => {
      //         return h('div', [
      //             h('a', {
      //                 style: {
      //                     display:params.row.status==0?'inline-block':'none',
      //                     padding: '0 5px',
      //                     lineHeight: '12px',
      //                     color: '#3497F2'
      //                 },
      //                 on: {
      //                     click: () => {
      //                         this.audit.name = params.row.userName;
      //                         this.audit.userId =params.row.id;
      //                         this.auditShow =true;
      //                     }
      //                 }
      //             }, '审核'),
      // ]







      //当前行数据
      rowData: {},
      //排名
      rankingForm: {
        sortNum: '',
        item: {},
      },
      rankingRule: {
        sortNum: [
          { required: true, message: '请输入排名', trigger: 'blur' }
        ],
      },
      isShowRanking: false,

      //审核
      isShowReview: false,

      //上报
      isShowReport: false
    }
  },
  computed: {
  },
  created(){
  },
  methods: {
    showModel(modelName, item){
      this[modelName] = true;
      this.rankingForm.item = item;

      // this.rankingForm.sortNum = item.scoreSort
    }
  }
}
