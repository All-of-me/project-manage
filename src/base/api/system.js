import http from './public'

/*获取jwt令牌*/
export const getjwt = () => {
  return http.requestQuickGet('/openapi/auth/userjwt')
}

/*同步获取jwt令牌*/
export const getjwtSync = () => {
  return new Promise((resolve, reject) => {
    jQuery.ajax({
      type: 'Get',
      url: '/openapi/auth/userjwt',
      async: false,
      success: function (data) {
        resolve(data)
      },
      error: function (error) {
        reject(error)
      }
    })
  })
}
/*同步获取退出登录令牌*/
export const userlogout = () => {
  return new Promise((resolve, reject) => {
    jQuery.ajax({
      type: 'Get',
      url: '/openapi/auth/userlogout',
      async: false,
      success: function (data) {
        resolve(data)
      },
      error: function (error) {
        reject(error)
      }
    })
  })
}
