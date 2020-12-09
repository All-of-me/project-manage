// 标段
import http from '@/base/api/public'
let manageConfig = require('@/config/manageConfig')
let manUrl = manageConfig.ApiUrlPre

// // 查找全部项目
// export const getAll = () => {
//   return http.requestQuickGet(manUrl + '/section_a/getAll')
// }
// 批量删除项目
export const delByIds = ids => {
  return http.requestQuickGet(manUrl + '/section_a/delByIds/{ids}?ids=' + ids)
}
// 获取指定项目表下所有的标段
export const findByItemId = itemId => {
  return http.requestQuickGet(manUrl + '/section_a/findByItemId?itemId=' + itemId)
}
// 根据id查找项目
export const getById = id => {
  return http.requestQuickGet(manUrl + '/section_a/getOne/' + id)
}
// 添加项目
export const add = param => {
  return http.requestPost(manUrl + '/section_a/add', param)
}
// 修改项目
export const edit = param => {
  return http.requestPost(manUrl + '/section_a/edit', param)
}
// 添加项目
export const getByCondition = param => {
  return http.requestPost(manUrl + '/section_a/getByCondition?pageNumber='+param.pageNumber+'&pageSize='+param.pageSize, param)
}
