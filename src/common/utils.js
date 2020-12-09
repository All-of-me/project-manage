/* eslint-disable */
import jwtDecode from "jwt-decode";
import { Message } from "element-ui";
let Base64 = require("js-base64").Base64;
let SIGN_REGEXP = /([yMdhsm])(\1*)/g;
let DEFAULT_PATTERN = "yyyy-MM-dd";

Date.prototype.format = function(fmt) {
	// author: meizz
	let o = {
		"M+": this.getMonth() + 1, // 月份
		"d+": this.getDate(), // 日
		"H+": this.getHours(), // 小时
		"m+": this.getMinutes(), // 分
		"s+": this.getSeconds(), // 秒
		"q+": Math.floor((this.getMonth() + 3) / 3), // 季度
		S: this.getMilliseconds() // 毫秒
	};
	if (/(y+)/.test(fmt))
		fmt = fmt.replace(
			RegExp.$1,
			(this.getFullYear() + "").substr(4 - RegExp.$1.length)
		);
	for (var k in o) {
		if (new RegExp("(" + k + ")").test(fmt))
			fmt = fmt.replace(
				RegExp.$1,
				RegExp.$1.length === 1
					? o[k]
					: ("00" + o[k]).substr(("" + o[k]).length)
			);
	}
	return fmt;
};

function padding(s, len) {
	len = len - (s + "").length;
	for (var i = 0; i < len; i++) {
		s = "0" + s;
	}
	return s;
}

export default {
	// 深拷贝
	cloneLoop(x) {
		const root = {};
		// 栈
		const loopList = [
			{
				parent: root,
				key: undefined,
				data: x
			}
		];
		while (loopList.length) {
			// 深度优先
			const node = loopList.pop();
			const parent = node.parent;
			const key = node.key;
			const data = node.data;
			// 初始化赋值目标，key为undefined则拷贝到父元素，否则拷贝到子元素
			let res = parent;
			if (typeof key !== "undefined") {
				res = parent[key] = {};
			}
			for (let k in data) {
				if (data.hasOwnProperty(k)) {
					if (typeof data[k] === "object") {
						// 下一次循环
						loopList.push({
							parent: res,
							key: k,
							data: data[k]
						});
					} else {
						res[k] = data[k];
					}
				}
			}
		}
		return root;
	},
	// getActiveUser:function(){
	//   let activeUserStr = this.getSession("activeUser");
	//   return JSON.parse(activeUserStr);
	// },
	getActiveUser: function() {
		let uid = this.getCookie("uid")
		if (uid) {
			let activeUserStr = this.getSession("activeUser")
			if (activeUserStr) {
				return JSON.parse(activeUserStr)
			}
		} else {
			this.delSession("activeUser");
		}
	},
	// 获取jwt令牌
	getJwt: function() {
		let activeUser = this.getActiveUser();
		if (activeUser) {
			return activeUser.jwt;
		}
	},
	checkActiveUser: function() {
		// var jwt = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1MjEyNjMzNjUsInVzZXJfbmFtZSI6IjEyMyIsImF1dGhvcml0aWVzIjpbIlJPTEVfQURNSU4iLCJnZXRSZXNvdXJjZSJdLCJqdGkiOiI3NmIxOTgzMi01MDk3LTQyMDMtYjhjMS1kOGI1N2ZmMmZhOTAiLCJjbGllbnRfaWQiOiJtYW5hZ2VyIiwic2NvcGUiOlsibWFuYWdlciJdfQ.MzycLCC9cR-905ilrd1bWH52nqto4MDYbbMSXgcRdVkUGlv2A2JrlIvbvxNc2BVug1L59AV_7hUa_SHZQgrOdHnyoMdcu5KoHHXsJi1O5wUXkuahc-K3KoBhwkyWY9O-DvwZhrmzsYN2gb_3qmU2xbHu6U1pwwscXGHjbKJDoWGdrmMkRc1cpxuqvH-0eusR1GLQ4gTBSyVNW4XVO7jMt9ATBubos7GhtbAMXnCQVO9pui2zvPvKVxlvwMjJowjdCc_5hvXjyUvWgbU1qUrdtXeskeT-HoVUtsol6OnFHnq7o9bIin1493ZwjDck_0R1R8mkGRGKylQtZdzESeQpYA';
		var jwt_base64 = this.getCookie("juid");
		if (jwt_base64) {
			let jwt = Base64.decode(jwt_base64);
			var jwtDecodeVal = jwtDecode(jwt);
			//    var user = sessionStorage.getItem('user');
			if (jwtDecodeVal) {
				//      user = JSON.parse(user);
				let activeUser = {};
				activeUser.utype = jwtDecodeVal.utype || "";
				activeUser.username = jwtDecodeVal.user_name || "";
				activeUser.userpic = jwtDecodeVal.userpic || "";
				activeUser.id = jwtDecodeVal.id || "";
				activeUser.permissions = jwtDecodeVal.permissions || "";
				activeUser.authorities = jwtDecodeVal.authorities || "";
				activeUser.menus = jwtDecodeVal.menus || "";
				this.setSession("activeUser", JSON.stringify(activeUser));
				return this.getSession("activeUser");
			}
		}
		return null;
	},
	checkAuthorities: function(router, permission) {
		if (permission !== "Login" && permission !== "Logout") {
			// 校验权限
			let activeUser = this.getActiveUser();
			let authorities = activeUser.authorities;
			if (!authorities) {
				Message.error('对不起您没有此操作权限！')
        // 跳转到统一授权失败页面
        router.push('/login')
			}
			var ret1 = authorities.find((value, index, arr) => {
				return value === permission;
			});
			if (!ret1) {
				Message.error('对不起您没有此权限！请与管理员联系')
        // 跳转到统一授权失败页面
        router.go(-1)
			}
		}
	},
	// 获取侧边栏
	checkmenu(routes, authorities) {
		var fun = routes => {
			for (var i in routes) {
				if (
					routes[i].children !== undefined &&
					routes[i].children.length !== 0
				) {
					var children = routes[i].children;
					fun(children);
				}
				if (
					routes[i].meta &&
					routes[i].meta.permission &&
					authorities.indexOf(routes[i].meta.permission) === -1
				) {
					routes[i].hidden = true;
				}
			}
		};
		fun(routes);
		// for (var i in routes) {
		//   if (routes[i].children !== undefined && routes[i].children.length !== 0) {
		//     var children = routes[i].children
		//     for (var j in children) {
		//       if (children[j].meta && authorities.indexOf(children[j].meta.permission) === -1) {
		//         children[j].hidden = true
		//       }
		//     }
		//   }
		//   if (routes[i].meta && authorities.indexOf(routes[i].meta.permission) === -1) {
		//     routes[i].hidden = true
		//   }
		// }
	},

	getCookie: function(name) {
		// 登录过
		var arr
		var uidexp
		var reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
		// 获取登录时间
		if (
			(uidexp = document.cookie.match(
				new RegExp("(^| )uidexpires=([^;]*)(;|$)")
			))
		) {
			let uidexp1 = uidexp[2];
			uidexp1 = Base64.decode(uidexp1);
			let parseDate = this.parserToDate(uidexp1, "yyyy-MM-dd_HH:mm:ss");
			// 如果登录时间超过了1800秒的一半即900秒（15分钟），则发送请求刷新数据库的登录信息日期
			let date = new Date();
			if (date.getTime() - parseDate.getTime() > 900000) {
				// 发送请求,刷新后台token
				/* 同步获取jwt令牌 */
				jQuery.ajax({
					type: "Get",
					url: "/openapi/auth/refreshUser",
					async: true,
					success: function(data) {
						// console.log(data);
					},
					error: function(error) {
						// console.log(error);
					}
				});
			}
		}
		if ((arr = document.cookie.match(reg))) {
			return arr[2];
		} else {
			return null;
		}
	},

	setCookie: function(c_name, value, expiredays) {
		var exdate = new Date();
		exdate.setDate(exdate.getDate() + expiredays);
		document.cookie =
			c_name +
			"=" +
			escape(value) +
			(expiredays == null ? "" : ";expires=" + exdate.toGMTString());
	},
	delCookie: function(name) {
		var exp = new Date();
		exp.setTime(exp.getTime() - 1);
		document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
	},
	setSession: function(key, value) {
		return sessionStorage.setItem(key, value);
	},
	getSession: function(key) {
		return sessionStorage.getItem(key);
	},
	delSession: function(key) {
		var session = this.getSession(key)
		if (session !== undefined && session !== null) {
			return sessionStorage.removeItem(key)
		}
	},
	getQueryStringByName: function(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
		var r = window.location.search.substr(1).match(reg);
		var context = "";
		if (r != null) {
			context = r[2];
		}
		reg = null;
		r = null;
		return context == null || context == "" || context == "undefined"
			? ""
			: context;
	},
	formatDate: function(date, pattern) {
		pattern = pattern || DEFAULT_PATTERN;
		return pattern.replace(SIGN_REGEXP, function($0) {
			switch ($0.charAt(0)) {
				case "y":
					return padding(date.getFullYear(), $0.length);
				case "M":
					return padding(date.getMonth() + 1, $0.length);
				case "d":
					return padding(date.getDate(), $0.length);
				case "w":
					return date.getDay() + 1;
				case "H":
					return padding(date.getHours(), $0.length);
				case "m":
					return padding(date.getMinutes(), $0.length);
				case "s":
					return padding(date.getSeconds(), $0.length);
			}
		});
	},

	parseDate: function(dateString, pattern) {
		var matchs1 = pattern.match(SIGN_REGEXP);
		var matchs2 = dateString.match(/(\d)+/g);
		if (matchs1.length == matchs2.length) {
			var _date = new Date(1970, 0, 1);
			for (var i = 0; i < matchs1.length; i++) {
				var _int = parseInt(matchs2[i]);
				var sign = matchs1[i];
				switch (sign.charAt(0)) {
					case "y":
						_date.setFullYear(_int);
						break;
					case "M":
						_date.setMonth(_int - 1);
						break;
					case "d":
						_date.setDate(_int);
						break;
					case "h":
						_date.setHours(_int);
						break;
					case "m":
						_date.setMinutes(_int);
						break;
					case "s":
						_date.setSeconds(_int);
						break;
				}
			}
			return _date;
		}
		return null;
	},

	/* 获取到年月日，时分秒，毫秒几个值，然后生成日期
第一个参数为格式化的日期字符串，格式化的字符串
测试代码
var data=new Date();
var  format ="yyyy-MM-dd HH:mm:ss";
var text=data.format(format);
alert(text);
var data2=parserToDate(text,format);
alert(data2.format(format));
 */
	parserToDate: function(dateText, format) {
		if (!dateText) {
			// 空值
			return new Date();
		}
		// 定义默认值，默认值根据当前时间生成
		var defaultVal = new Date();
		var year = defaultVal.getFullYear();
		var month = defaultVal.getMonth() + 1;
		var day = defaultVal.getDate();
		var hours = defaultVal.getHours();
		var minutes = defaultVal.getMinutes();
		var seconds = defaultVal.getSeconds();
		var milliseconds = defaultVal.getMilliseconds();
		// 定义正则
		var o = [
			{
				reg: "y+"
			}, // 年份
			{
				reg: "M+"
			}, // 月份
			{
				reg: "d+"
			}, // 日
			{
				reg: "H+"
			}, // 小时
			{
				reg: "m+"
			}, // 分
			{
				reg: "s+"
			}, // 秒
			{
				reg: "S"
			} // 毫秒
		];
		// 获取到年月日，时分秒，毫秒几个值在字符串中的先后位置
		var index = 1;
		for (var j = 0; j < format.length; j++) {
			var onechar = format[j];
			for (var i = 0; i < o.length; i++) {
				var onepart = o[i];
				var onepartReg = onepart.reg;
				if (onepartReg[0] == onechar) {
					if (!onepart.index) {
						onepart.index = index; // 获取到年月日，时分秒，毫秒几个值在字符串中的先后位置
						index++;
					}
					break;
				}
			}
		}
		// 生成匹配的正则表达式
		for (var i = 0; i < o.length; i++) {
			var onepart = o[i];
			var onepartReg = onepart.reg;
			var re = new RegExp("(" + onepartReg + ")");
			var res = re.exec(format);
			if (res) {
				var formatPart = res[0]; // 匹配到的格式化字符
				var replaceVal = "([0-9]{" + formatPart.length + "})"; // 不能使用/d匹配,会和日期的d冲突
				format = format.replace(formatPart, replaceVal);
			}
		}
		// 保存获取到的各个部分和位置
		var dataInfo = {};
		var re = new RegExp(format);
		var res = re.exec(dateText);
		// 去掉第一个匹配，记录匹配到的数据
		if (res) {
			for (var i = 1; i < res.length; i++) {
				dataInfo[i] = res[i]; // 记录年月日，时分秒，毫秒几个值在字符串中的位置和对应的值
			}
		} else {
			alert(dateText + "格式不匹配" + oldformat);
		}
		if (o[0].index) {
			// 年份存在
			var index = o[0].index;
			year = dataInfo[index];
		}
		if (o[1].index) {
			// 月份存在
			var index = o[1].index;
			month = dataInfo[index];
		}
		if (o[2].index) {
			// 日存在
			var index = o[2].index;
			day = dataInfo[index];
		}
		if (o[3].index) {
			// 小时存在
			var index = o[3].index;
			hours = dataInfo[index];
		}
		if (o[4].index) {
			// 分存在
			var index = o[4].index;
			minutes = dataInfo[index];
		}
		if (o[5].index) {
			// 秒存在
			var index = o[5].index;
			seconds = dataInfo[index];
		}
		if (o[6].index) {
			// 毫秒存在
			var index = o[6].index;
			milliseconds = dataInfo[index];
		}
		// 月份是从0开始的
		return new Date(
			year,
			month - 1,
			day,
			hours,
			minutes,
			seconds,
			milliseconds
		);
	},

	// 解析jwt令牌，获取用户信息
	getUserInfoFromJwt: function(jwt) {
		if (!jwt) {
			return;
		}
		var jwtDecodeVal = jwtDecode(jwt);
		if (!jwtDecodeVal) {
			return;
		}
		let activeUser = {};
		activeUser.utype = jwtDecodeVal.utype || "";
		activeUser.username = jwtDecodeVal.name || "";
		activeUser.userpic = jwtDecodeVal.userpic || "";
		activeUser.id = jwtDecodeVal.id || "";
		activeUser.nature = jwtDecodeVal.nature || "";
		activeUser.company = jwtDecodeVal.companyId || "";
		activeUser.permissions = jwtDecodeVal.permissions || "";
		activeUser.authorities = jwtDecodeVal.authorities || "";
		activeUser.uid = jwtDecodeVal.jti || "";
		activeUser.jwt = jwt;
		return activeUser;
	},
	getOrder: function(bs) {
		var now = new Date();
		var year = now.getFullYear(); // 年
		var yy = year.toString().substr(2, 2);
		var month = now.getMonth() + 1; // 月
		var day = now.getDate(); // 日
		var rnd = bs + yy + month + day;
		for (var i = 0; i < 6; i++) {
			rnd += Math.floor(Math.random() * 10);
		}
		return rnd;
	},
	/**
	 * 判断是否有权限
	 * @return
	 * @author ykd
	 * @date
	 */

	/**
	 *判断字符是否为空的方法
	 * @param obj
	 * @returns {boolean}
	 */
	isEmpty: function(obj) {
		if (typeof obj === "undefined" || obj == null || obj == "") {
			return true;
		} else {
			return false;
		}
	},

	/* 判断两个对象是否相等 */
	objIsEquals: function(x, y) {
		let f1 = x instanceof Object;
		let f2 = y instanceof Object;
		if (!f1 || !f2) {
			return x === y;
		}
		if (Object.keys(x).length !== Object.keys(y).length) {
			return false;
		}
		let newX = Object.keys(x);
		for (let p in newX) {
			p = newX[p];
			let a = x[p] instanceof Object;
			let b = y[p] instanceof Object;
			if (a && b) {
				let equal = equals(x[p], y[p]);
				if (!equal) {
					return equal;
				}
			} else if (x[p] != y[p]) {
				return false;
			}
		}
		return true;
	}
};
