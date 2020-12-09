/*
 * @Descripttion: 
 * @version: 
 * @Author: mqp
 * @Date: 2020-06-23 08:14:47
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-08-20 09:50:34
 */
const path = require("path");
const webpack = require("webpack");
function resolve (dir) {
	return path.join(__dirname, dir);
}
const api = require('./src/config/hostConfig.js').javaurl
const host = require('./src/config/hostConfig.js').host
// const api = 'http://192.10.16.87:'
// const host = '192.168.1.103'

module.exports = {
	// 在exports中添加，这里很关键，不配置不行
	transpileDependencies: ['element-ui', 'xlsx','static', '_pdfjs-dist@2.4.456@pdfjs-dist',
	'pdfjs-dist'],
	chainWebpack: config => {
		config.entry('main').add('babel-polyfill') // main是入口js文件
		config.resolve.alias
			.set("@", resolve("src"))
			.set("jquery", "jquery")
			.set("vue$", "vue/dist/vue.esm.js")
	},
	configureWebpack: {
		plugins: [
			new webpack.ProvidePlugin({
				jQuery: 'jquery',
				$: 'jquery'
			})
		]
	},
	publicPath: './',
	outputDir: 'dist',
	assetsDir: 'static',
	// cli3 代理是从指定的target后面开始匹配的，不是任意位置；配置pathRewrite可以做替换
	devServer: {
		proxy: {
			'/systapi': {
				//转发至zuul路由
				target: api + '40300/',
				changeOrigin: true,
				pathRewrite: {
					// 将api开头的替换成无*!/
					'^/systapi': ''
				}
			},
			'/manage': {
				target: api + '40600/',
				changeOrigin: true,
				pathRewrite: {
					'^/manage': ''
				}
			},
			'/openapi': {
				target: api + '40400',
				headers: { 'X-Real-IP': host },
				changeOrigin: true,
				pathRewrite: {
					'^/openapi': ''
				}
			}
		},
		// Various Dev Server settings
		host: host, // can be overwritten by process.env.HOST
		// host: '0.0.0.0', // can be overwritten by process.env.HOST
		port: 80, //
	}
}