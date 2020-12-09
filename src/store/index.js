import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'

Vue.use(Vuex)

// 应用初始状态
const state = {
  activeRoute: '/',
  routeInfo: '主页',
  mainColor: 'rgb(60, 141, 181)',
  asideColor: 'rgb(34, 45, 50)',
}

// 定义所需的 mutations
const mutations = {
  // 页面标题
  changeRouteInfo: (state, value) => {
    state.routeInfo = value
  },
  changeColor: (state, value) => {
    state.mainColor = value
  },
}
// https://webpack.js.org/guides/dependency-management/#requirecontext
const modulesFiles = require.context('./modules', true, /\.js$/)
// you do not need `import app from './modules/app'`
// it will auto require all vuex module from modules file
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  // set './app.js' => 'app'
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = modulesFiles(modulePath)
  modules[moduleName] = value.default
  return modules
}, {})

const store = new Vuex.Store({
  state,
  mutations,
  modules,
  getters
})

export default store
