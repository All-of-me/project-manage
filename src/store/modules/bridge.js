import * as bridgeApi from '@/module/project-manage/api/bridge'
import * as sectionApi from '@/module/project-manage/api/section'
import * as projectApi from '@/module/project-manage/api/project'
import * as sysApi from '@/base/api/user'

const state = {
  allBridges: [],
  bridges: [],
  total:0,
  // 桥梁详情数据
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
    bridgeNumber: {
      value: '',
      label: '桥号',
      disabled: false,
      list: null,
      isDate: null
    },
    bridgeGroup: {
      value: '',
      label: '分类',
      list: [
        {id:'1',name:'正线单线桥'},
        {id:'2',name:'正线双线桥'},
      ],
      isDate: null,
      filterable: true,
      clearable: true,
      multiple: false,
      disabled: false,
    },
    sectionId: {
      value: '',
      label: '标段',
      list: [],
      listKey: 'id',
      listLabel: 'sectionTitle',
      isDate: null,
      filterable: true,
      clearable: true,
      multiple: false,
      disabled: false,
    },
    bridgeTitle: {
      value: null,
      label: '桥梁名称',
      disabled: false,
      list: null,
      isDate: null
    },
    origin: {
      value: null,
      label: '起点',
      disabled: false,
      list: null,
      isDate: null
    },
    terminus: {
      value: null,
      label: '终点',
      disabled: false,
      list: null,
      isDate: null
    },
    designId: {
      value: [],
      label: '设计者',
      list: [],
      listKey: 'id',
      listLabel: 'nickName',
      listLabel2: 'jobNumber',
      empty:'请先添加项目组成员',
      isDate: null,
      filterable: true,
      clearable: true,
      multiple: true,
      disabled: false,
    },
    reviewId: {
      value: [],
      label: '复核者',
      list: [],
      listKey: 'id',
      listLabel: 'nickName',
      listLabel2: 'jobNumber',
      empty:'请先添加项目组成员',
      isDate: null,
      filterable: true,
      clearable: true,
      multiple: true,
      disabled: false,
    },
    disDirector: {
      value: [],
      label: '配施负责人',
      list: [],
      listKey: 'id',
      listLabel: 'nickName',
      listLabel2: 'jobNumber',
      empty:'请先添加项目配施人员',
      isDate: null,
      filterable: true,
      clearable: true,
      multiple: true,
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
  bridgeEnumFormat: (state) => (key) => {
    for (let item of state.bridges) {
      if (item.id === key) {
        return item.bridgeTitle
      }
    }
    return null
  },
}
// 初始化
const actions = {
  initList ({ commit }, {id, action}) {
    bridgeApi.getById(id).then(re => {
      commit('setList', re.result)
      if (action !== undefined) {
        action()
      }
    })
  },
  initBridges ({ commit },{sectionId,action}) {
    bridgeApi.findBySectionId(sectionId).then(re => {
      commit('setAllBridges', re.result)
      if (action !== undefined) {
        action()
      }
    })
  },
  initBridgesByParam ({ commit },param) {
    bridgeApi.getByCondition(param).then(re => {
      commit('setBridges', re.result.content)
      commit('setBridgeTotal', re.result.totalElements)
    })
  },
  initAllBridges ({ commit },itemId) {
    bridgeApi.findByItemId(itemId).then(re => {
      commit('setAllBridges', re.result)
    })
  },
  initUsers ({ commit },itemId) {
    sysApi.findAllUser().then(res => {
      let users = res.result
      if (users) {
        projectApi.getUserListById(itemId).then(re => {
          let userlist
          if (re.result) {
            userlist = users.filter(user => {
              return re.result.indexOf(user.id)!==-1
            })
          }
          commit('setUsers', userlist)
        })
        if (itemId !== undefined) {
          projectApi.getDisDirectorsById(itemId).then(re => {
            let disDirectors
            if (re.result) {
              disDirectors = users.filter(user => {
                return re.result.indexOf(user.id)!==-1
              })
            }
            commit('setDisDirectors', disDirectors)
          })
        }
      }
    })
  },
  initSections ({ commit },itemId) {
    sectionApi.findByItemId(itemId).then(res => {
      commit('setSections', res.result)
    })
  },
}
// 取值
const mutations = {
  setList: (state, list) => {
    for (let i in state.list) {
      if (i==='designId'||i==='reviewId'||i==='disDirector') {
        if (typeof list[i] == 'string') state.list[i].value = list[i].split(',')
        else state.list[i].value = []
      } else state.list[i].value = list[i]
    }
  },
  setUsers: (state, users) => {
    if (users!==undefined) {
      state.list.designId.list = JSON.parse(JSON.stringify(users))
      state.list.reviewId.list = JSON.parse(JSON.stringify(users))
    } else {
      state.list.designId.list = []
      state.list.reviewId.list = []
    }
  },
  setDisDirectors: (state, users) => {
    if (users!==undefined) {
      state.list.disDirector.list = JSON.parse(JSON.stringify(users))
    } else {
      state.list.disDirector.list = []
    }
  },
  setSections: (state, sections) => {
    state.list.sectionId.list = JSON.parse(JSON.stringify(sections))
  },
  setAllBridges: (state, bridges) => {
    state.allBridges = bridges
  },
  setBridges: (state, bridges) => {
    state.bridges = bridges
  },
  setBridgeTotal: (state, total) => {
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
