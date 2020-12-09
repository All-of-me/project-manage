// 桥梁
import http from '@/base/api/public'
let manageConfig = require('@/config/manageConfig')
let manUrl = manageConfig.ApiUrlPre

// 查找全部项目
// export const getAll = () => {
//   return http.requestQuickGet(manUrl + '/bridge_a/getAll')
// }
// 批量删除项目
export const delByIds = ids => {
  return http.requestQuickGet(manUrl + '/bridge_a/delByIds/{ids}?ids=' + ids)
}
// 获取指定标段下所有的桥梁表
export const findBySectionId = sectionId => {
  return http.requestQuickGet(manUrl + '/bridge_a/findBySectionId?sectionId=' + sectionId)
}
// 获取指定项目下所有的桥梁表
export const findByItemId = itemId => {
  return http.requestQuickGet(manUrl + '/bridge_a/findByItemAId?itemAId=' + itemId)
}
// 根据id查找项目
export const getById = id => {
  return http.requestQuickGet(manUrl + '/bridge_a/getOne/' + id)
}
// 添加项目
export const add = param => {
  return http.requestPost(manUrl + '/bridge_a/add', param)
}
// 修改项目
export const edit = param => {
  return http.requestPost(manUrl + '/bridge_a/edit', param)
}
// 添加项目
export const getByCondition = param => {
  return http.requestPost(manUrl + '/bridge_a/getByCondition?pageNumber='+param.pageNumber+'&pageSize='+param.pageSize, param)
}
