import http from './public'
/* 登陆 */
export const login = params => {
  // let loginRequest = querystring.stringify(params)
  let loginRequest = params
  return http.requestPost('/openapi/auth/userlogin', loginRequest)
}
/* 退出 */
export const logout = params => {
  return http.requestGet('/openapi/auth/userlogout')
}
/* 修改密码 */
export const modifyPassword = params => {
  return http.requestPost('/systapi/user/modifyPassword?oldPassword=' + params.oldPassword + '&newPassword=' + params.newPassword)
}
