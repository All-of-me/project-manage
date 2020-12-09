import * as beamApi from '@/module/project-manage/api/beam'

const state = {
  allBeams: [],
  beams: [],
  total:0,
  // 梁详情数据
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
    serialNumber: {
      value: '',
      label: '编号',
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
    firstPierNumber: {
      value: '',
      label: '起点墩号',
      disabled: false,
      list: null,
      isDate: null
    },
    judgeParclose: {
      value: [],
      label: '有无声屏障',
      list: [
        {id:'1',name:'有声屏障'},
        {id:'2',name:'无声屏障'},
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
  beamEnumFormat: (state) => (key) => {
    for (let item of state.beams) {
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
    beamApi.getById(id).then(re => {
      commit('setList', re.result)
      if (action !== undefined) {
        action()
      }
    })
  },
  initBeams ({ commit },bridgeId) {
    beamApi.findByBridgeId(bridgeId).then(re => {
      commit('setAllBeams', re.result)
    })
  },
  initBeamsByParam ({ commit },param) {
    beamApi.getByCondition(param).then(re => {
      commit('setBeams', re.result.content)
      commit('setBeamTotal', re.result.totalElements)
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
  setAllBeams: (state, beams) => {
    state.allBeams = beams
  },
  setBeams: (state, beams) => {
    state.beams = beams
  },
  setBeamTotal: (state, total) => {
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
