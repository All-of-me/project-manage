import Vue from 'vue'
import Router from 'vue-router'
// // 导入路由规则
import HomeRouter from '@/module/home/router'
import ProjectRouter from '@/module/project-manage/router'
// import SystRouter from '@/module/syst/router'
// import firstPageRouter from '@/module/firstPage/router'
const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}
Vue.use(Router)
// 定义路由配置
let routes = []
let concat = (router) => {
  routes = routes.concat(router)
}
// 合并路由规则

concat(HomeRouter)// 加入home模块的路由
concat(ProjectRouter)
// concat(SystRouter)
export default routes
