import * as projectApi from '@/module/project-manage/api/project'
import * as sysApi from '@/base/api/user'

const state = {
  allProjects: [],
  projects: [],
  total: 0,
  // 项目详情数据
  list:{
    itemTitle: {
      value: '',
      label: '项目名称',
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
    specialId: {
      value: [],
      label: '专册',
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
    engineerId: {
      value: [],
      label: '总工',
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
    disDirectors: {
      value: [],
      label: '配施人员',
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
    userList: {
      value: [],
      label: '项目组',
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
    buildUnit: {
      value: null,
      label: '建设单位',
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
  projectEnumFormat: (state) => (key) => {
    for (let item of state.projects) {
      if (item.id === key) {
        return item.itemTitle
      }
    }
    return null
  },
}
// 初始化
const actions = {
  // 项目表单
  initList ({ commit }, {id, action}) {
    projectApi.getById(id).then(re => {
      commit('setList', re.result)
      if (action !== undefined) {
        action()
      }
    })
  },
  // 所有项目
  initProjects ({ commit },action) {
    projectApi.getAll().then(re => {
      commit('setAllProjects', re.result)
      if (action !== undefined) {
        action()
      }
    })
  },
  // 分页查询
  initProjectsByParam ({ commit },param) {
    projectApi.getByCondition(param).then(re => {
      commit('setProjects', re.result.content)
      commit('setProjectTotal', re.result.totalElements)
    })
  },
  // 给菜单下拉框初始化
  initUsers ({ commit },itemId) {
    sysApi.findAllUser().then(res => {
      let users = res.result
      // 初始化全体成员给项目组选择
      commit('setUserList', users)
      if (users) {
        projectApi.findAllByUserType('1').then(re => {
          let engineer
          if (re.result) {
            engineer = users.filter(user => {
              return re.result.indexOf(user.id)!==-1
            })
          }
          // 初始化总工组成员
          commit('setEngineerUsers', engineer)
        })
        if (itemId !== undefined) {
          projectApi.getUserListById(itemId).then(re => {
            let userlist
            if (re.result) {
              userlist = users.filter(user => {
                return re.result.indexOf(user.id)!==-1
              })
            }
            // 初始化项目组成员
            commit('setUsers', userlist)
          })
        }
      }
    })
  },
}
// 赋值
const mutations = {
  setUsers: (state, users) => {
    if (users!==undefined) {
      state.list.specialId.list = JSON.parse(JSON.stringify(users))
      state.list.disDirectors.list = JSON.parse(JSON.stringify(users))
    } else {
      state.list.specialId.list = []
      state.list.disDirectors.list = []
    }
  },
  setUserList: (state, users) => {
    if (users!==undefined) {
      state.list.userList.list = JSON.parse(JSON.stringify(users))
    } else {
      state.list.userList.list = []
    }
  },
  setEngineerUsers: (state, users) => {
    if (users!==undefined) {
      state.list.engineerId.list = JSON.parse(JSON.stringify(users))
    } else {
      state.list.engineerId.list = []
    }
  },
  setAllProjects: (state, projects) => {
    state.allProjects = projects
  },
  setProjects: (state, projects) => {
    state.projects = projects
  },
  setList: (state, list) => {
    for (let i in state.list) {
      if (i==='specialId'||i==='engineerId'||i==='disDirectors' || i==='userList') {
        if (typeof list[i] == 'string') state.list[i].value = list[i].split(',')
        else state.list[i].value = []
      } else state.list[i].value = list[i]
    }
  },
  setProjectTotal: (state, total) => {
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
