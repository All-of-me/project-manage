import http from '@/base/api/public'
// import querystring from 'querystring'
let systConfig = require('@/config/systConfig')
let apiUrl = systConfig.ApiUrlPre
let sysUrl = systConfig.SysUrlPre
// ----------------user-用户模块--------------
// 页面查询
export const getUserList = (page, size, user) => {
  // let username = ''
  // if (user && user.name) {
  //   username = 'username=' + user.name + '&'
  // }
  // return http.requestQuickGet(apiUrl + '/user/getByCondition?' + username + 'pageNumber=' + page + '&pageSize=' + size)
  let param = { pageVo: {} }
  param.pageVo.pageNumber = page
  param.pageVo.pageSize = size
  param.user = user
  return http.requestPost(apiUrl + '/user/getByCondition', param)
  // return http.requestGet(apiUrl + '/user/getByCondition', user, {}, {'pageSize': size, 'pageNumber': page})

  // return http.requestGet(apiUrl + '/user/getByCondition', {'username': 'test', 'pageNumber': 1, 'pageSize': 2})
  // return http.requestGet(apiUrl + '/user/getByCondition', {'username': 'test', 'pageNumber': 1, 'pageSize': 2}, {}, {'username': 'test', 'pageNumber': page, 'pageSize': 2})
}

// 根据id查询用户
export const findAllUser = () => {
  return http.requestQuickGet(apiUrl + '/user/getAll')
}

// 根据id查询用户
export const findUserById = (id) => {
  return http.requestQuickGet(apiUrl + '/user/getById/' + id)
}

// 修改用户
export const updateUser = (params) => {
  return http.requestPost(apiUrl + '/user/edit', params)
}

// 根据id删除用户
export const deleteById = (id) => {
  return http.requestDelete(apiUrl + '/user/deleteUser/' + id, null)
}

// 添加用户
export const insertUser = (param) => {
  return http.requestPost(apiUrl + '/user/add', param)
}
// ===============user-用户==============================
// --------------dict-数据字典------------------------
// dict全查
export const getAllDictList = () => {
  return http.requestQuickGet(apiUrl + '/dict/getAllAndSon')
}

// 通过id查询一个权限
export const findChildDictById = (id) => {
  return http.requestQuickGet(apiUrl + '/dictData/getById/' + id)
}

// 通过id查询一个权限
export const findDictById = (id) => {
  return http.requestQuickGet(apiUrl + '/dict/getById/' + id)
}

// 更新父级节点
export const updateDict = (param) => {
  return http.requestPost(apiUrl + '/dict/edit/', param)
}

// 更新子级节点
export const updateChildrenDict = (param) => {
  return http.requestPost(apiUrl + '/dictData/edit/', param)
}

// 删除数据字典
export const deleteDictByIds = (ids) => {
  return http.requestDelete(apiUrl + '/dict/delByIds/' + ids)
}

// 删除子数据字典
export const deleteChildrenDictByIds = (param) => {
  return http.requestDelete(apiUrl + '/dictData/delByIds/' + param)
}

// 添加字典
export const insertDict = (param) => {
  // let add = '?'
  // for (let i in param) {
  //   if (param[i] !== '' && param[i] !== undefined && param[i] !== 'undefined' && param[i] !== null && param[i] !== []) {
  //     add += i + '=' + param[i] + '&'
  //   }
  // }
  // add = add.slice(0, add.length - 1)
  // return http.requestPost(apiUrl + '/dict/add' + add)
  return http.requestPost(apiUrl + '/dict/add/', param)
}

// 添加子级字典
export const insertChildrenDict = (param) => {
  return http.requestPost(apiUrl + '/dictData/add/', param)
}
// =========================dict-数据字典==============================
// --------------------------role-角色------------------------
// 查找所有的角色
export const findRoles = () => {
  return http.requestQuickGet(apiUrl + '/role/getByCondition')
}

// 删除角色
export const deleteRoleByIds = (ids) => {
  return http.requestDelete(apiUrl + '/role/delByIds/' + ids)
}

// 通过id查找角色
export const findRoleById = (id) => {
  return http.requestQuickGet(apiUrl + '/role/getById/' + id)
}
// 修改角色
export const updateRole = (param) => {
  // let role = '?'
  // for (let i in param) {
  //   if (param[i] !== '' && param[i] !== undefined && param[i] !== 'undefined' && param[i] !== null && param[i] !== []) {
  //     // if (i !== 'permissions') {
  //       role += i + '=' + param[i] + '&'
  //     // }
  //   } else {
  //     role += i + '=' + 'null&'
  //   }
  // }
  // role = role.slice(0, role.length - 1)
  // role += '&permissions=' + 1
  // return http.requestPost(apiUrl + '/role/edit' + role)
  return http.requestPost(apiUrl + '/role/edit', param)
}

// 添加角色
export const insertRole = (param) => {
  return http.requestPost(apiUrl + '/role/add', param)
}

// 用户授权角色
export const assignUserRole = (roleId, userList) => {
  return http.requestPost(apiUrl + '/role/assignUserRole?roleId=' + roleId + '&userList=' + userList)
}

// 获取角色下面的用户
export const getRoleUser = (id) => {
  return http.requestQuickGet(apiUrl + '/role/getRoleUser/?roleId=' + id)
}
// =========================role-角色==============================
// --------------------------company-公司------------------------

// 查找所有的公司
export const findCompanies = () => {
  return http.requestQuickGet(sysUrl + '/company/findCompanies')
}

// 通过id查找所以的单位管理
export const findCompanyById = (id) => {
  return http.requestQuickGet(sysUrl + '/company/findCompanyById/' + id)
}
// 通过id删除
export const deleteCompanyById = (id) => {
  return http.requestDelete(sysUrl + '/company/deleteCompanyById/' + id)
}

// 查询所以的单位管理
export const findCompaniesList = (page, size) => {
  return http.requestQuickGet(
    sysUrl + '/company/findCompanyByPage/' + page + '/' + size
  )
}
export const updateCompany = (params) => {
  return http.requestPost(sysUrl + '/company/updateCompany', params)
}
// 添加单位
export const addCompany = (param) => {
  return http.requestPut(sysUrl + '/company/insertCompany', param)
}
// 添加单位
export const findUserByCompanyId = (param) => {
  return http.requestQuickGet(apiUrl + '/user/findUserByCompanyId/' + param)
}

// =========================****-**==============================
// --------------------------menu-菜单权限------------------------

// 查找所有的权限
export const findPermissions = () => {
  return http.requestQuickGet(apiUrl + '/permission/getAll')
}

// 通过id查找权限
export const findPermissionById = (id) => {
  return http.requestQuickGet(apiUrl + '/permission/getById/' + id)
}

// 添加权限
export const insertPermission = (param) => {
  return http.requestPost(apiUrl + '/permission/add', param)
}

// 更新
export const updatePermission = (param) => {
  return http.requestPost(apiUrl + '/permission/edit', param)
}

// 删除权限
export const deletePermissionByIds = (ids) => {
  return http.requestDelete(apiUrl + '/permission/delByIds/' + ids)
}

// =========================menu-菜单权限==============================
// --------------------------department-部门------------------------

// 查找所有的权限
export const findDepartments = () => {
  return http.requestQuickGet(apiUrl + '/department/getAll')
}

// 通过id查找权限
export const findDepartmentById = (id) => {
  return http.requestQuickGet(apiUrl + '/department/getById/' + id)
}

// 添加权限
export const insertDepartment = (param) => {
  return http.requestPost(apiUrl + '/department/add', param)
}

// 更新
export const updateDepartment = (param) => {
  return http.requestPost(apiUrl + '/department/edit', param)
}

// 删除权限
export const deleteDepartmentByIds = (ids) => {
  return http.requestDelete(apiUrl + '/department/delByIds/' + ids)
}

// =========================department-部门==============================
// --------------------------******-**------------------------

// // 部门管理信息
// // 通过单位名称查询部门列表分页
// export const findDepartmentListByCompanyId = (params, page, size) => {
//   return http.requestQuickGet(apiUrl + '/department/findDepartmentListByCompanyId/' + params + '/' + page + '/' + size)
// }
// // 通过单位名称查询所有的部门列表
export const findAllDepartmentByCompanyId = (params) => {
  return http.requestQuickGet(
    apiUrl + '/department/findAllDepartmentByCompanyId/' + params
  )
}
// // 通过id差找部门信息
// export const findDepartmentById = param => {
//   return http.requestQuickGet(apiUrl + '/department/findDepartmentById/' + param)
// }
// // 添加部门信息
// export const addDepartment = param => {
//   return http.requestPut(apiUrl + '/department/addDepartment', param)
// }
// // 修改部门信息
// export const updateDepartment = param => {
//   return http.requestPost(apiUrl + '/department/updateDepartment', param)
// }
// // 删除部门信息
// export const deleteDepartmentById = param => {
//   return http.requestDelete(apiUrl + '/department/deleteDepartmentById/' + param)
// }
// export const findUByCompanyId = param => {
//   return http.requestQuickGet(apiUrl + '//user/findUserByCompanyId/' + param)
// }
