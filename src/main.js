/* eslint-disable handle-callback-err */
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// import 'babel-polyfill'
import promise from 'es6-promise'
import cssVars from 'css-vars-ponyfill'
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import {Message} from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import VueRouter from 'vue-router'
import routes from './base/router'
import store from './store'
import Vuex from 'vuex'
import utilApi from './common/utils'
import * as systemApi from './base/api/system'
import './assets/icon/iconfont.css'
import FileSaver from 'file-saver'
import XLSX from 'xlsx'

cssVars({})
promise.polyfill()
Vue.config.productionTip = false
// 在Vue中全局使用mintui
Vue.use(ElementUI)
Vue.use(Vuex)
Vue.use(VueRouter)
let Base64 = require('js-base64').Base64
let sysConfig = require('@/config/sysConfig')
let openAuthenticate = sysConfig.openAuthenticate // 是否需要登陆
let openAuthorize = sysConfig.openAuthorize // 是否需要认证
let contextPath = sysConfig.contextPath
// Vue.use(vueResource)
/* eslint-disable no-new */
const router = new VueRouter({
  routes: routes,
})
// 全局加载loading
Vue.prototype.openLoading = function() {
  const loading = this.$loading({
    // 声明一个loading对象
    lock: true, // 是否锁屏
    text: '正在加载...', // 加载动画的文字
    spinner: 'el-icon-loading', // 引入的loading图标
    background: 'rgba(0, 0, 0, 0.7)', // 背景颜色
    /*
    target: '.sub-main',                    // 需要遮罩的区域
    body: true,
    customClass: 'mask' */ // 遮罩层新增类名
  })
  setTimeout(function() {
    loading.close()
  }, 3000)

  return loading
}
Vue.prototype.output = function(id,title) {
  let wb
  if (document.querySelector('.el-table__fixed-right'))
    wb = XLSX.utils.table_to_book(document.querySelector(id + ' .el-table .el-table__fixed-right'))
  else
    wb = XLSX.utils.table_to_book(document.querySelector(id + ' .el-table'))
  /* get binary string as output */
  var wbout = XLSX.write(wb, {
    bookType: 'xlsx',
    bookSST: true,
    type: 'array'
  })
  try {
    FileSaver.saveAs(
      new Blob([wbout], { type: 'application/octet-stream' }),
      new Date().format('yyyy-MM-dd') + title +  '.xlsx'
    )
  } catch (e) {
    // if (typeof console !== 'undefined') console.log(e, wbout)
  }
  return wbout
}
// 全局:获取登录用户
Vue.prototype.getActiveUser = function() {
  let user = utilApi.getActiveUser()
  return user
}
systemApi.getjwtSync().then((res) => {
  if (res.success) {
    let jwt = res.jwt
    let activeUser = utilApi.getUserInfoFromJwt(jwt)
    if (activeUser) {
      utilApi.setSession('permissions', JSON.stringify(activeUser.permissions))
      utilApi.setSession('activeUser', JSON.stringify(activeUser))
    }
  } else {
    // 跳转到统一登陆
    window.location =
      contextPath + '#/login?returnUrl=' + Base64.encode(window.location)
    // router.push({path: '/login'})
  }
})

router.beforeEach((to, from, next) => {
  if (openAuthenticate) {
    //* **********身份校验***************
    let activeUser
    let uid
    let uidexpires
    try {
      activeUser = utilApi.getActiveUser()
      uid = utilApi.getCookie('uid')
      uidexpires = utilApi.getCookie('uidexpires')
    } catch (e) {
      // alert(e)
    }
    try {
      activeUser = utilApi.getActiveUser()
      uid = utilApi.getCookie('uid')
      uidexpires = utilApi.getCookie('uidexpires')
    } catch (e) {
      // alert(e)
    }

    if (activeUser && uid && uidexpires && uid === activeUser.uid) {
      next()
    } else if (to.path === '/login' || to.path === '/logout') {
      next()
    } else if (uid && uidexpires) {
      // 请求获取jwt
      systemApi
        .getjwtSync()
        .then((res) => {
          if (res.success) {
            let jwt = res.jwt
            let activeUser = utilApi.getUserInfoFromJwt(jwt)
            if (activeUser) {
              utilApi.setSession('permissions', JSON.stringify(activeUser.permissions))
              utilApi.setSession('activeUser', JSON.stringify(activeUser))
              axios.defaults.headers['Authorization'] = 'Bearer ' + jwt
            }
            next()
          } else {
            // 跳转到统一登陆
            next({path: '/login', query: {returnUrl: Base64.encode(window.location)} })
          }
        })
        .catch(function(error) {
          // console.error(error)
          // 获取用户信息错误，后台登录状态
          Message.error('用户登录失效，请重新登录')
          // 跳转到统一登陆
          next({path: '/login', query: {returnUrl: Base64.encode(window.location)} })
        })
    } else {
      // 跳转到统一登陆
      next({path: '/login', query: {returnUrl: Base64.encode(window.location)} })
    }
  } else {
    next()
  }
})
// 授权
router.afterEach((to, from, next) => {
  if (openAuthorize) {
    let activeUser
    try {
      activeUser = utilApi.getActiveUser()
    } catch (e) {
      // alert(e)
    }
    if (activeUser) {
      // 权限校验
      let permission = to.meta.permission
      if (permission) {
        utilApi.checkAuthorities(router, permission)
      }
      // 每次跳转都会检查用户是否重新登录了
      utilApi.checkmenu(routes, activeUser.authorities)
    }
  }
})

// new Vue({
//   el: '#app',
//   router,
//   store,
//   render: (c) => c(App)
// })
//runtime
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app")

