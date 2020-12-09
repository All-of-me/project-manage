import Home from '@/module/home/page/index.vue'

export default [
  {
    path: '/project-manage',
    name: '项目管理系统',
    component: Home,
    hidden: false,
    children: [
      {
        path: '/project',
        component: () => import('@/module/project-manage/page/project'),
        name: '项目详情',
        hidden: false
      },
      {
        path: '/project/list',
        component: () => import('@/module/project-manage/page/project/list'),
        name: '项目列表',
        hidden: false
      },
      {
        path: '/project/input',
        component: () => import('@/module/project-manage/page/project/input'),
        name: 'excel表导入',
        hidden: false
      },
      {
        path: '/project/edit',
        component: () => import('@/module/project-manage/page/project/edit'),
        name: '编辑项目',
        hidden: false
      },
      {
        path: '/project/file',
        component: () => import('@/module/project-manage/page/project/addFile'),
        name: '上传项目资料',
        hidden: true
      },
      {
        path: '/section',
        component: () => import('@/module/project-manage/page/section'),
        name: '标段详情',
        hidden: false
      },
      {
        path: '/section/edit',
        component: () => import('@/module/project-manage/page/section/edit'),
        name: '编辑标段',
        hidden: false
      },
      {
        path: '/section/file',
        component: () => import('@/module/project-manage/page/section/addFile'),
        name: '上传标段资料',
        hidden: true
      },
      {
        path: '/bridge',
        component: () => import('@/module/project-manage/page/bridge'),
        name: '桥梁详情',
        hidden: false
      },
      {
        path: '/bridge/edit',
        component: () => import('@/module/project-manage/page/bridge/edit'),
        name: '编辑桥梁',
        hidden: false
      },
      {
        path: '/bridge/file',
        component: () => import('@/module/project-manage/page/bridge/addFile'),
        name: '上传桥梁资料',
        hidden: true
      },
      {
        path: '/pier/edit',
        component: () => import('@/module/project-manage/page/pier/edit'),
        name: '编辑墩',
        hidden: false
      },
      {
        path: '/beam/edit',
        component: () => import('@/module/project-manage/page/beam/edit'),
        name: '编辑梁',
        hidden: false
      },
      {
        path: '/engineer',
        component: () => import('@/module/project-manage/page/engineer'),
        name: '设置总工',
        hidden: false
      },
      // {
      //   path: '/project',
      //   component: () => import('@/module/project-manage/page/project'),
      //   name: '项目详情',
      //   hidden: false
      // },
    ]
  }
]
