'use strict';
// 查用户
import http from '@/base/api/public'
let systConfig = require('@/config/systConfig')
let sysUrl = systConfig.ApiUrlPre

// 查询用户
export const findAllUser = () => {
  return http.requestQuickGet(sysUrl + '/user/getAll')
}

// 根据id查询用户
export const findUserById = (id) => {
  return http.requestQuickGet(sysUrl + '/user/getById/' + id)
}

export const users = () => {
  return http.requestQuickGet(sysUrl + '/user/getAll').then(res=>{
    return res.result
  })
}