import * as sectionApi from '@/module/project-manage/api/section'
import * as sysApi from '@/base/api/user'

const state = {
  allSections: [],
  sections: [],
  total:0,
  // 标段详情数据
  list:{
    id: {
      value: '',
      label: 'id',
      hidden: true
    },
    delFlag: {
      value: '',
      label: '其他标段',
      hidden: true
    },
    itemId : {
      value: '',
      label: '所属项目',
      hidden: true
    },
    sectionTitle: {
      value: '',
      label: '标段名称',
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
    disDirectors: {
      value: [],
      label: '配施人员',
      list: [],
      listKey: 'id',
      listLabel: 'nickName',
      listLabel2: 'jobNumber',
      isDate: null,
      filterable: true,
      clearable: true,
      multiple: true,
      disabled: false,
    },
    constructionUnit: {
      value: null,
      label: '施工单位',
      disabled: false,
      list: null,
      isDate: null
    },
    supervisorUnit: {
      value: null,
      label: '监理单位',
      disabled: false,
      list: null,
      isDate: null
    },
    startTime: {
      value: null,
      label: '开工日期',
      format: 'yyyy-MM-dd HH:mm:ss',
      disabled: false,
      list: null,
      isDate: true,
      type: 'date'
    },
    endTime: {
      value: null,
      label: '竣工日期',
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
  sectionEnumFormat: (state) => (key) => {
    for (let item of state.allSections) {
      if (item.id === key) {
        return item.sectionTitle
      }
    }
    return null
  },
}
// 初始化
const actions = {
  initList ({ commit }, {id, action}) {
    sectionApi.getById(id).then(re => {
      commit('setList', re.result)
      if (action !== undefined) {
        action()
      }
    })
  },
  initSections ({ commit },itemId) {
    sectionApi.findByItemId(itemId).then(re => {
      commit('setAllSections', re.result)
    })
  },
  initSectionsByParam ({ commit },param) {
    sectionApi.getByCondition(param).then(re => {
      commit('setSections', re.result.content)
      commit('setSectionTotal', re.result.totalElements)
    })
  },
  // 给菜单下拉框初始化
  initUsers ({ commit }) {
    sysApi.findAllUser().then(res => {
      commit('setUsers', res.result)
    })
  },
}
// 取值
const mutations = {
  setList: (state, list) => {
    for (let i in state.list) {
      if (i==='disDirectors') {
        if (typeof list[i] == 'string') state.list[i].value = list[i].split(',')
        else state.list[i].value = []
      } else state.list[i].value = list[i]
    }
  },
  setUsers: (state, users) => {
    state.list.disDirectors.list = JSON.parse(JSON.stringify(users))
  },
  setAllSections: (state, sections) => {
    state.allSections = sections
  },
  setSections: (state, sections) => {
    state.sections = sections
  },
  setSectionTotal: (state, total) => {
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
