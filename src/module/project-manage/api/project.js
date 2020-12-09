// 项目
import http from '@/base/api/public'
let manageConfig = require('@/config/manageConfig')
let manUrl = manageConfig.ApiUrlPre

// 查找全部项目
export const getAll = () => {
  return http.requestQuickGet(manUrl + '/item_a/getAll')
}
// 批量删除项目
export const delByIds = ids => {
  return http.requestQuickGet(manUrl + '/item_a/delByIds/{ids}?ids=' + ids)
}
// 根据id查找项目
export const getById = id => {
  return http.requestQuickGet(manUrl + '/item_a/getOne/' + id)
}
// 添加项目
export const add = param => {
  return http.requestPost(manUrl + '/item_a/add', param)
}
// 修改项目
export const edit = param => {
  return http.requestPost(manUrl + '/item_a/edit', param)
}
// 添加项目
export const getByCondition = param => {
  return http.requestPost(manUrl + '/item_a/getByCondition?pageNumber='+param.pageNumber+'&pageSize='+param.pageSize, param)
}


// 修改总工：userType是1为总工
export const editAssignUser = (users,userType) => {
  let param = {
    userStrings:users,
    userType
  }
  return http.requestPost(manUrl + '/item_a/editAssignUser', param)
}

// 查找角色，1为总工
export const findAllByUserType = userType => {
  return http.requestQuickGet(manUrl + '/item_a/findAllByUserType?userType=' + userType)
}

// 查找项目组
export const getUserListById = itemId => {
  return http.requestQuickGet(manUrl + '/item_a/getUserListById/' + itemId)
}

// 查找配施人员
export const getDisDirectorsById = itemId => {
  return http.requestQuickGet(manUrl + '/item_a/getDisDirectorsById/' + itemId)
}
