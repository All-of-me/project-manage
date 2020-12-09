import routes from '@/base/router/index'

let state = {
  routes: routes
}

const mutations = {
  initRoutes: (state) => {
    state.routes = routes
  }
}

const actions = {
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
