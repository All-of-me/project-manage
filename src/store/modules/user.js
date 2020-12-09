import * as sysApi from '@/base/api/user'

const state = {
  users: [],
}

const getters = {
  usersEnumFormat: (state) => (key) => {
    for (let item of state.users) {
      if (item.id === key) {
        return item.nickName
      }
    }
    return null
  },
}

// actions
const actions = {
  initUsers ({ commit }) {
    sysApi.findAllUser().then(res => {
      commit('setUsers', res.result)
    })
  },
}

// mutations
const mutations = {
  setUsers: (state, users) => {
    state.users = users
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
