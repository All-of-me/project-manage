import {Loading} from 'element-ui'

let loadingCount = 0
let loading
//开始加载
const startLoading = () => {
  loading = Loading.service({
    lock: true,
    text: '加载中……',
    background: 'rgba(0, 0, 0, 0.7)'
  })
}
//加载结束
const endLoading = () => {
  loading.close()
}
// 每一个请求都增加一个loadingCount
export const showLoading = () => {
  if (loadingCount === 0) {
    startLoading()
  }
  loadingCount += 1
}
// 只有当每个请求都完结，遮罩层才会隐藏
export const hideLoading = () => {
  if (loadingCount <= 0) {
    return
  }
  loadingCount -= 1
  if (loadingCount === 0) {
    endLoading()
  }
}
