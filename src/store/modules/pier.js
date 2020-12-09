import * as pierApi from '@/module/project-manage/api/pier'

const state = {
  allPiers: [],
  piers: [],
  total:0,
  // 墩详情数据
  list:{
    id: {
      value: '',
      label: 'id',
      hidden: true
    },
    itemId : {
      value: '',
      label: '所属项目',
      hidden: true
    },
    sectionId : {
      value: '',
      label: '所属标段',
      hidden: true
    },
    bridgeId : {
      value: '',
      label: '所属桥梁',
      hidden: true
    },
    pierNumber: {
      value: '',
      label: '墩号',
      disabled: false,
      list: null,
      isDate: null
    },
    mileage: {
      value: '',
      label: '中心里程',
      disabled: false,
      list: null,
      isDate: null
    },
    coordinates: {
      value: '',
      label: '坐标',
      disabled: false,
      list: null,
      isDate: null
    },
    pierHigh: {
      value: '',
      label: '墩高',
      disabled: false,
      list: null,
      isDate: null
    },
    figureNumber: {
      value: '',
      label: '图号',
      disabled: false,
      list: null,
      isDate: null
    },
    pierShape: {
      value: [],
      label: '墩形',
      list: [
        {id:'1',name:'实体'},
        {id:'2',name:'空心'},
      ],
      isDate: null,
      filterable: true,
      clearable: true,
      multiple: false,
      disabled: false,
    },
    planStartTime: {
      value: null,
      label: '计划开工日期',
      format: 'yyyy-MM-dd HH:mm:ss',
      disabled: false,
      list: null,
      isDate: true,
      type: 'date'
    },
    planEndTime: {
      value: null,
      label: '计划完工日期',
      format: 'yyyy-MM-dd HH:mm:ss',
      disabled: false,
      list: null,
      isDate: true,
      type: 'date'
    },
    actualStartTime: {
      value: null,
      label: '实际开工日期',
      format: 'yyyy-MM-dd HH:mm:ss',
      disabled: false,
      list: null,
      isDate: true,
      type: 'date'
    },
    actualEndTime: {
      value: null,
      label: '实际完工日期',
      format: 'yyyy-MM-dd HH:mm:ss',
      disabled: false,
      list: null,
      isDate: true,
      type: 'date'
    },
    basicGroup: {
      value: [],
      label: '基础类型',
      list: [
        {id:'1',name:'桩基础'},
        {id:'2',name:'眀控基础'},
        {id:'3',name:'挖井基础'},
        {id:'4',name:'沉井基础'},
      ],
      isDate: null,
      filterable: true,
      clearable: true,
      multiple: false,
      disabled: false,
    },
    projectState: {
      value: null,
      label: '工程数量',
      disabled: false,
      list: null,
      isDate: null,
      textarea: true,
    },
    threeD: {
      value: null,
      label: '3d',
      disabled: false,
      list: null,
      isDate: null
    },
    comment: {
      value: null,
      label: '备注',
      disabled: false,
      list: null,
      isDate: null
    },
  },
}
// 格式化
const getters = {
  pierEnumFormat: (state) => (key) => {
    for (let item of state.piers) {
      if (item.id === key) {
        return item.name
      }
    }
    return null
  },
}
// 初始化
const actions = {
  initList ({ commit }, {id, action}) {
    pierApi.getById(id).then(re => {
      commit('setList', re.result)
      if (action !== undefined) {
        action()
      }
    })
  },
  initPiers ({ commit },{bridgeId,action}) {
    pierApi.findByBridgeId(bridgeId).then(re => {
      commit('setAllPiers', re.result)
      if (action !== undefined) {
        action()
      }
    })
  },
  initPiersByParam ({ commit },param) {
    pierApi.getByCondition(param).then(re => {
      commit('setPiers', re.result.content)
      commit('setPiersTotal', re.result.totalElements)
    })
  },
}
// 取值
const mutations = {
  setList: (state, list) => {
    for (let i in state.list) {
      state.list[i].value = list[i]
    }
  },
  setAllPiers: (state, piers) => {
    state.allPiers = piers
  },
  setPiers: (state, piers) => {
    state.piers = piers
  },
  setPiersTotal: (state, total) => {
    state.total = total
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
