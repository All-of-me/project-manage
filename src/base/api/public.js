import axios from 'axios'
import { Message } from 'element-ui'
import utils from '@/common/utils'
import { showLoading, hideLoading } from '../../common/loading.js'
// 解决axios在ie浏览器中的兼容问题
require('es6-promise').polyfill()

axios.defaults.withCredentials = true // 跨域
axios.defaults.timeout = 10000
axios.defaults.headers.post['Content-Type'] =
  'application/x-www=form-urlencoded'

// let sysConfig = require('@/config/sysConfig')
// let contextPath = sysConfig.contextPath
let contextPath = ''
if (utils.getJwt()) {
  axios.defaults.headers['Authorization'] = 'Bearer ' + utils.getJwt()
}

/* 请求拦截器（请求之前的操作） */
axios.interceptors.request.use(
  (req) => {
    showLoading()
    return req
  },
  (err) => Promise.reject(err)
)

// 响应拦截
axios.interceptors.response.use(
  (data) => {
    hideLoading()
    if (data && data.data) {
      if (data.data.code && data.data.code === '10001') {
        Message.error('登陆失效，请重新登陆')
        // 跳转到统一登陆
        // eslint-disable-next-line no-undef
        window.location =
          contextPath + '#/login'
          // contextPath + '#/login?returnUrl=' + Base64.encode(window.location)
      } else if (data.data.code && data.data.code === '10002') {
        Message.error('您没有此操作的权限，请与管理员联系！')
      } else if (data.data.code && data.data.code === '10003') {
        Message.error('认证被拒绝，请重新登录重试！')
      }
    }
    return data
  },
  (err) => {
    hideLoading()
    if (err.response && err.response.status === 403) {
      Message.error('您没有此操作的权限，请联系管理员！')
    }
    return Promise.reject(err)
  }
)

export default {
  // get请求
  requestGet(url, params = {}) {
    return new Promise((resolve, reject) => {
      axios
        .get(url, params)
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  // get请求不带参数
  requestQuickGet(url) {
    return new Promise((resolve, reject) => {
      axios
        .get(url)
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  // get请求不带参数
  requestExportGet(url) {
    return new Promise((resolve, reject) => {
      axios
        .get(url, {
          headers: {
            'Content-Type': 'application/vnd.ms-excel',
          },
        })
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  // post请求
  requestPost(url, params = {}) {
    return new Promise((resolve, reject) => {
      axios
        .post(url, params)
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  // 用于下载的post请求
  requestDownloadPost(url, params = {}) {
    return axios.post(url, params, {
      responseType: 'blob',
      headers: {
        'Content-Type': 'application/json; application/octet-stream',
      },
    })
  },
  getAxios() {
    return axios
  },

  // post请求
  requestPostForm(url, params = {}) {
    return new Promise((resolve, reject) => {
      axios
        .post(url, params, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        })
        .then((res) => {
          resolve(res.data) // 注意res是axios封装的对象，res.data才是服务端返回的信息
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  // 发送html格式
  // post请求
  requestPostHtml(url, params = {}) {
    return new Promise((resolve, reject) => {
      axios
        .post(url, params, {
          headers: {
            'Content-Type': 'text/xml',
          },
        })
        .then((res) => {
          resolve(res.data) // 注意res是axios封装的对象，res.data才是服务端返回的信息
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  // put请求
  requestPut(url, params = {}) {
    return new Promise((resolve, reject) => {
      axios
        .put(url, params)
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  // delete请求
  requestDelete(url, params = {}) {
    return new Promise((resolve, reject) => {
      axios
        .delete(url, params)
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
}
