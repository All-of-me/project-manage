const state = {
  fileGroup: [
    {key:'1',label:'勘察资料'},
    {key:'2',label:'地质资料'},
    {key:'3',label:'设计资料'},
    {key:'4',label:'程序文件'},
    {key:'5',label:'施工资料'},
    {key:'10',label:'项目文件'},
    {key:'20',label:'标段文件'},
  ],
}
// 格式化
const getters = {
  fileGroupEnumFormat: (state) => (key) => {
    for (let item of state.fileGroup) {
      if (item.key === key) {
        return item.label
      }
    }
    return null
  },
}
// 初始化
const actions = {
  initProject ({ commit }, action) {
    commit('setProjectList')
    if (action !== undefined) {
      action()
    }
  },
  initSection ({ commit }, action) {
    commit('setSectionList')
    if (action !== undefined) {
      action()
    }
  },
  initBridge ({ commit }, action) {
    commit('setBridgeList')
    if (action !== undefined) {
      action()
    }
  },
}
const mutations = {
  setBridgeList: state => {
    state.fileGroup.length = 0
    state.fileGroup.push(
      {key:'1',label:'勘察资料'},
      {key:'2',label:'地质资料'},
      {key:'3',label:'设计资料'},
      {key:'4',label:'程序文件'},
      {key:'5',label:'施工资料'},
    )
  },
  setSectionList: state => {
    state.fileGroup.length = 0
    state.fileGroup.push(
      {key:'20',label:'标段文件'},
    )
  },
  setProjectList: state => {
    state.fileGroup.length = 0
    state.fileGroup.push(
      {key:'10',label:'项目文件'},
    )
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
