export default {
  data () {
    return {
      //动态表单数据
      dynamicForm: [],
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
      //表头数据
      columns:[
        { type: 'index', title: '序号', width: 80 },
        { title: '姓名', key: 'userName' },
        { title: '参赛单位', key: 'universityName' },
        { title: '手机号码', key: 'memberPhone' },
        { title: '项目名称', key: 'title' },
        { title: '上传时间', key: 'submitTime' },
        { title: '组别', key: 'groupName' },
        { title: '排名', key: 'scoreSort' },
        { title: '状态', key: 'statusDescribe' },
        { title: '操作', slot: 'action', width: 250, align: 'center', }
      ],

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
