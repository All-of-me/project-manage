let courseURL = 'http://localhost:3000/mock/11';
let BannerURL = 'http://localhost:3003';
module.exports = {
    proxyList: {
        '/banner/*': {
            target: BannerURL/*,
            changeOrigin: true,
            pathRewrite:{
                '^/banner':''
            }*/
        }
    }
}
