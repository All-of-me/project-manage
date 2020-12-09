import Home from '@/module/home/page/index.vue'

import Dict from '@/module/syst/page/dict/dictList.vue'
import AddDict from '@/module/syst/page/dict/addDict.vue'

import MenuManage from '@/module/syst/page/menu-manage/menu-manage.vue'
import AddMenu from '@/module/syst/page/menu-manage/addMenu.vue'

import RoleManage from '@/module/syst/page/role-manage/role-manage.vue'
import AddRole from '@/module/syst/page/role-manage/addRole.vue'
import EditRole from '@/module/syst/page/role-manage/edit-role.vue'

import DepartmentManage from '@/module/syst/page/department-manage/department-manage.vue'
import AddDepa from '@/module/syst/page/department-manage/addDepa.vue'

import UserManage from '@/module/syst/page/user-manage/user-manage.vue'
import AddUser from '@/module/syst/page/user-manage/addUser.vue'
import EditUser from '@/module/syst/page/user-manage/editUser.vue'
import UserDetails from '@/module/syst/page/user-manage/userDetails.vue'

export default [{
  path: '/sys',
  component: Home,
  name: '系统管理',
  hidden: false,
  iconCls: 'el-icon-qualityziyuan',
  meta: { permission: '/sys' },
  children: [
    { path: '/dict', name: '数据字典管理', component: Dict, hidden: false },
    { path: '/add-dict', name: '添加数据字典', component: AddDict, hidden: true },

    { path: '/menu-manage', name: '菜单权限管理', component: MenuManage, hidden: false },
    { path: '/add-menu', name: '添加菜单', component: AddMenu, hidden: true },

    { path: '/role-manage', name: '角色权限管理', component: RoleManage, hidden: false },
    { path: '/add-role', name: '添加角色', component: AddRole, hidden: true },
    { path: '/edit-role', name: '编辑用户角色', component: EditRole, hidden: true },

    { path: '/department-manage', name: '部门管理', component: DepartmentManage, hidden: false },
    { path: '/add-depa', name: '添加部门', component: AddDepa, hidden: true },

    { path: '/user-manage', name: '用户管理', component: UserManage, hidden: false },
    { path: '/add-user', name: '添加用户', component: AddUser, hidden: true },
    { path: '/edit-user', name: '修改用户', component: EditUser, hidden: true },
    { path: '/user-details', name: '用户详情', component: UserDetails, hidden: true }
  ]
}
]
