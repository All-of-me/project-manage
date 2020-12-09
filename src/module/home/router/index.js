/*
 * @Descripttion: 
 * @Author: mqp
 * @Date: 2020-06-23 08:14:47
 * @LastEditors: mqp
 * @LastEditTime: 2020-07-28 11:36:28
 */
// import Home from '@/module/home/page/home.vue'
import Home from '@/module/home/page/index.vue'
import Login from '@/module/home/page/loginpage.vue'
import Logout from '@/module/home/page/logout.vue'
import Editpassword from '@/base/components/editPassword.vue'

export default [
  {
    path: '/',
    name: '首页',
    redirect: '/home',
    hidden: true
  },
  {
    path: '/home',
    component: Home,
    hidden: true,
    first: true,
    children: [
      {
        path: '/editpassword',
        component: Editpassword,
        name: '修改密码',
        hidden: true
      }
    ]
  }, {
    path: '/login',
    component: Login,
    name: 'Login',
    hidden: true
  },
  {
    path: '/logout',
    component: Logout,
    name: 'Logout',
    hidden: true
  }
]
