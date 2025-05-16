// import regeneratorRuntime from '../regenerator-runtime/runtime.js';
import config from 'utils/config.js'
import Request from 'utils/request.js'
const wxHttpHost = "/api"
let isurl = process.env.NODE_ENV === 'development' ? wxHttpHost + '/upload/index' : config.HOST + '/upload/index';

const formatTime = date => {
	const year = date.getFullYear()
	const month = date.getMonth() + 1
	const day = date.getDate()
	const hour = date.getHours()
	const minute = date.getMinutes()
	const second = date.getSeconds()
	return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}


let app = getApp({
	allowDefault: true
})
let http = new Request()

const formatNumber = n => {
	n = n.toString()
	return n[1] ? n : '0' + n
}
// Extend the default Number object with a formatMoney() method:
// usage: someVar.formatMoney(decimalPlaces, symbol, thousandsSeparator, decimalSeparator)
// defaults: (2, "$", ",", ".")
var formatMoney = function(number, places, symbol, thousand, decimal) {
	number = number || 0;
	places = !isNaN(places = Math.abs(places)) ? places : 2;
	symbol = symbol !== undefined ? symbol : "";
	thousand = thousand || ",";
	decimal = decimal || ".";
	var negative = number < 0 ? "-" : "",
		i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + "",
		j = (j = i.length) > 3 ? j % 3 : 0;
	return symbol + negative + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" +
		thousand) + (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : "");
}

// 手机号中间4位变为星号
var phone = function(phone) {
	return phone.replace(/^(\d{3})\d{4}(\d+)/, "$1****$2");
}

//弹出alert框    title标题  content内容   fun点击确定的回调函数
var alert1 = function(content = "内容", title = "提示", fun) {
	if (typeof title == "number" || title == "") {
		title = "温馨提示";
	}
	if (typeof content == "number" || content == "") {
		content = "请填写提示内容";
	}
	uni.showModal({
		title: title,
		content: content,
		showCancel: false,
		success(res) {
			if (res.confirm) {
				typeof fun == "function" && fun();
			}
		}
	})
}

//弹出对话框  title标题   content内容   fun点击确定的回调   fun1点击取消的回调
var confirm1 = function(content, title, fun, fun1) {
	if (typeof title == "number" || title == "") {
		title = "温馨提示";
	}
	if (typeof content == "number" || content == "") {
		content = "请填写提示内容";
	}
	uni.showModal({
		title: title,
		content: content,
		success(res) {
			if (res.confirm) {
				typeof fun == "function" && fun();
			} else {
				typeof fun1 == "function" && fun1();
			}
		}
	})
}

//多图片上传   arr需上传图片的数组     fun所有图片都上传成功后的回调函数
var uploadImgs1 = function(arr, fun, type) {
	let that = this;
	let num = arr.length;
	let imgBox = [];
	upload(arr, 0, imgBox, fun, type);
	uni.showLoading({
		title: '上传中...',
	})
}
var upload = function(arr, n, imgBox, fun, type) {
	let that = this;
	let str = arr[n];
	let flag = str.indexOf(config.HOST);
	uni.uploadFile({
		url: isurl,
		filePath: arr[n],
		fileType: 'image',
		name: 'file',
		success(res) {
			console.log(res, '图片上传回调')
			var data = res.data;
			data = JSON.parse(data);
			console.log(data);
			if (data) {
				imgBox.push(data.data);
				n++;
				if (n == arr.length) {
					uni.hideLoading();
					typeof fun == "function" && fun(imgBox);
					return;
				} else {
					upload(arr, n, imgBox, fun, type);
				}
			} else {
				uni.hideLoading();
				alert1("上传失败！");
				return;
			}

		},
		fail: function() {
			uni.hideLoading();
			alert1("上传失败！");
			return;
		}
	})
	// if (flag == -1) {
	// 	console.log(isurl,'上传图片接口')
	// } else {
	// 	imgBox.push(arr[n]);
	// 	n++;
	// 	if (n == arr.length) {
	// 		uni.hideLoading();
	// 		typeof fun == "function" && fun(imgBox);
	// 		return;
	// 	} else {
	// 		console.log(type, '222');
	// 		upload(arr, n, imgBox, fun, type);
	// 	}
	// }
}


//成功提示  txt提示文字     time提示时间
var showSuccess1 = function(txt = "提示", time = 2000) {
	uni.showToast({
		title: txt,
		icon: "success",
		duration: time,
	})
}


//文字提示  txt提示文字     time提示时间
var showText1 = function(txt = "提示", time = 2000, fun) {
	uni.showToast({
		title: txt,
		icon: "none",
		duration: time,
		success(res) {
			typeof fun == "function" && fun(res)
		}
	})
}

//显示loading
var showLoading1 = function(txt) {
	txt = txt || "加载中...";
	uni.showLoading({
		title: txt,
	})
}

//返回上一页
var back1 = function(num) {
	if (typeof num != "number" || num == "") {
		num = 1;
	}
	uni.navigateBack({
		delta: 1
	})
}

//navigate跳转
var reto1 = function(url, fun) {
	uni.navigateTo({
		url: url,
		success(res) {
			typeof fun == "function" && fun(res)
		}
	})
}
//redirectTo 跳转
var redi = function(url, fun) {
	uni.redirectTo({
		url: url,
		success(res) {
			typeof fun == "function" && fun(res)
		}
	})
}

// ajax请求
var ajax1 = function(type, isurl, data, fun, fun1) {
	let isArr = false;
	isArr = Array.isArray(data);
	let noWait = ""; // 是否关闭等待提示
	let flag = "";
	if (isArr) {
		flag = 1
	} else {
		noWait = data.noWait ? 1 : "";
		flag = data.header ? 1 : "";
		delete data.noWait;
		delete data.header;
	}
	if (!noWait) {
		uni.showLoading({
			title: "加载中..."
		});
	}
	uni.request({
		url: isurl,
		data: data,
		header: {
			'content-type': flag ? "application/json" : 'application/x-www-form-urlencoded'
		},
		method: type || "POST",
		success(res) {
			uni.hideLoading()
			typeof fun == "function" && fun(res)
		},
		fail(res1) {
			uni.hideLoading();
			typeof fun1 == "function" && fun1(res1)
		}
	})
}

// async ajax请求
const wxRequest = async (url, params = {}) => {
	Object.assign(params, {
		token: uni.getStorageSync('token')
	})
	// 所有的请求，header默认携带token
	let header = params.header || {
		'Content-Type': 'application/json',
		'token': params.token || ''
	}
	let data = params.data || {}
	let method = params.method || 'GET'
	// hideLoading可以控制是否显示加载状态
	if (!params.hideLoading) {
		uni.showLoading({
			title: '加载中...',
		})
	}
	let res = await new Promise((resolve, reject) => {
		uni.request({
			url: url,
			method: method,
			data: data,
			header: header,
			success: (res) => {
				if (res && res.statusCode == 200) {
					resolve(res.data)
				} else {
					reject(res)
				}
			},
			fail: (err) => {
				reject(err)
			},
			complete: (e) => {
				uni.hideLoading()
			}
		})
	})
	return res
}

// 判断json对象是否为空  true为空
var emptyJson1 = function(obj) {
	for (var key in obj) {
		if (key) {
			return false
		}
	}
	return true
}

//删除数组中的某一项 it为要删除的项，arr为目标数组
var arrRemove1 = function(it, arr) {
	if (!arr || arr.length == 0) {
		return "";
	}
	let flag = arr.indexOf(it);
	if (flag > -1) {
		arr.splice(flag, 1);
		return arr;
	} else {
		util.alert("未查找到该元素");
	}
}

//删除数组中的某一个对象 arr是目标数组，attr是目标数组中的属性名称，value是要删除的属性名称对应的值
var arrRemoveJson1 = function(arr, attr, value) {
	if (!arr || arr.length == 0) {
		return "";
	}
	let newArr = arr.filter(function(item, index) {
		return item[attr] != value
	})
	return newArr;
}


//浮点数相加
var add = function(a, b) {
	var c, d, e;
	try {
		c = a.toString().split(".")[1].length;
	} catch (f) {
		c = 0;
	}
	try {
		d = b.toString().split(".")[1].length;
	} catch (f) {
		d = 0;
	}
	return e = Math.pow(10, Math.max(c, d)), (mul(a, e) + mul(b, e)) / e;
}
//浮点数相减
var sub = function(a, b) {
	var c, d, e;
	try {
		c = a.toString().split(".")[1].length;
	} catch (f) {
		c = 0;
	}
	try {
		d = b.toString().split(".")[1].length;
	} catch (f) {
		d = 0;
	}
	return e = Math.pow(10, Math.max(c, d)), (mul(a, e) - mul(b, e)) / e;
}
//浮点数相乘
var mul = function(a, b) {
	var c = 0,
		d = a.toString(),
		e = b.toString();
	try {
		c += d.split(".")[1].length;
	} catch (f) {}
	try {
		c += e.split(".")[1].length;
	} catch (f) {}
	return Number(d.replace(".", "")) * Number(e.replace(".", "")) / Math.pow(10, c);
}
//浮点数相除
var div = function(a, b) {
	var c, d, e = 0,
		f = 0;
	try {
		e = a.toString().split(".")[1].length;
	} catch (g) {}
	try {
		f = b.toString().split(".")[1].length;
	} catch (g) {}
	return c = Number(a.toString().replace(".", "")), d = Number(b.toString().replace(".", "")), mul(c / d, Math
		.pow(10,
			f - e));
}


//中国标准时间转年月日
var toDate1 = function(time) {
	let datetime = new Date(time);
	let year = datetime.getFullYear();
	let month = datetime.getMonth();
	let date = datetime.getDate();
	let hour = datetime.getHours();
	let minute = datetime.getMinutes();
	let second = datetime.getSeconds();

	let result1 = year +
		'-' +
		((month + 1) >= 10 ? (month + 1) : '0' + (month + 1)) +
		'-' +
		((date + 1) < 10 ? '0' + date : date) +
		' ' +
		((hour + 1) < 10 ? '0' + hour : hour) +
		':' +
		((minute + 1) < 10 ? '0' + minute : minute) +
		':' +
		((second + 1) < 10 ? '0' + second : second);

	let result2 = year +
		'-' +
		((month + 1) >= 10 ? (month + 1) : '0' + (month + 1)) +
		'-' +
		((date + 1) < 10 ? '0' + date : date);

	let result = {
		hasTime: result1, //精确到时分秒
		noTime: result2 //精确到年月日
	};

	return result;
}

// 深拷贝
var deepCopy1 = function(json) {
	if (json) {
		let json1 = JSON.stringify(json);
		let json2 = JSON.parse(json1);
		return json2
	} else {
		return ""
	}

}

// 地址查询 type：0 省 1 市 2区  code：地域码  fun回调函数
var addressLoad1 = function(type, code, fun) {
	let isurl = config.lookUpAddress;
	let o = {
		code: code,
		type: type,
		noWait: 1
	}
	ajax1(isurl, o, function(res) {
		if (res.data.code == 1) {
			typeof fun == "function" && fun(res)
		} else {
			alert1(res.data.data)
		}
	})
}

//蒙版引导查询
var markLoad1 = function(storeId, fun) {
	let isurl = config.lookUpMarkGuide;
	let o = {
		storeId: storeId
	}
	ajax1(isurl, o, function(res) {
		if (res.data.code == 1) {
			typeof fun == "function" && fun(res)
		} else {
			alert1(res.data.data)
		}
	})
}

//关闭当前功能模块蒙版
var closeMark1 = function(id, fun) {
	let isurl = config.closeMarkGuide;
	let o = {
		maskId: id
	}
	ajax1(isurl, o, function(res) {
		if (res.data.code == 1) {
			typeof fun == "function" && fun(res)
		} else {
			alert1(res.data.data)
		}
	})
}

// 去除数组中重复的项
var noRepeatList = function(arr) {
	{
		var newArr = [];
		for (var i = 0; i < arr.length; i++) {
			if (newArr.indexOf(arr[i]) == -1) {
				newArr.push(arr[i]);
			}
		}
		return newArr;
	}
}


/**
 * 校验图片是否存在
 * @param {String} url 图片URL
 */
function validImage(url) {
	if (url && url.includes('https://')) {
		return true
	}
}
/**
 * 数字格式化金钱展示
 * @param {*} num 串数字
 * @returns
 */
const numFormat = (num) => {
	if (typeof(num) != 'number') {
		num = Number(num)
	}
	num = num.toFixed(2);
	num = parseFloat(num)
	num = num.toLocaleString();
	let floatPart = '' // 预定义小数部分
	let numArry = num.split('.')
	// =2表示数据有小数位
	if (numArry.length === 2) {
		floatPart = numArry[1].toString() // 拿到小数部分
		if (floatPart.length === 1) { // 补0,实际上用不着
			return numArry[0] + '.' + floatPart + '0'
		} else {
			return numArry[0] + '.' + floatPart
		}
	} else {
		return num + floatPart
	}
}

/**
 *
 * 金钱格式化数字
 * @param {*} 传字符串或者数字
 * @returns
 */
const number = (value) => {
	if (typeof(value) == 'number') {
		return value
	} else {
		if (value.indexOf(',') != -1) {
			return Number(value)
		} else {
			return Number(value.replace(',', ''))
		}
	}
}
/**
 * 添加埋点接口 一期
 * banner 埋点
 * 我的账单埋点
 */
/* {
  "buryingPointInfo": {  // 埋点数据
	"bannerId": "string", // banner Id
	"pageName": "string", // 页面名称
	"pageType": "string" // 页面类型
  },
  "channel": "string", // 渠道id
  "platform": "string", // 平台
  "type": "BANNER_CLICK", // 事件类型 = ['BANNER_CLICK', 'BILL_RETURN', 'BILL_PAGE_VIEW'] stringEnum:"BANNER_CLICK", "BILL_RETURN", "BILL_PAGE_VIEW",
  "viewTime": 0 // 访问时长
} */
function addBuryingPoint(data) {
	let platform = ''
	let o = {
		// #ifdef MP-WEIXIN
		"channel": "app",
		"platform": "wechat",
		// #endif
		// #ifndef MP-WEIXIN
		"channel": "wm",
		"platform": 'h5',
		// #endif
		...data
	}
	let url = config.addWmPortalInfo;
	console.log(o);
	http.post(url, o).then(res => {
		console.log(res)
		if (res.statusCode == 200) {

		}
	}).catch(err => {
		console.log(err)
	});
}




/**
 * 检测并调起微信授权
 */
function checkWxAuth(authName) {
	return new Promise((resolve, reject) => {
		uni.getSetting({
			success(res1) {
				// 已授权
				if (res1.authSetting[authName]) {
					return resolve(true)
				}
				// 已拒绝授权
				if (res1.authSetting[authName] === false) {
					uni.openSetting();
				}
				// 还没有授过权
				return resolve(true)
			}
		});
	})
}

/**
 * 获取URL参数
 * @param {Object} variable 参数名
 */
function getQueryVariable(variable) {
	var query = window.location.search.substring(1);
	var vars = query.split("&");
	for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split("=");
		if (pair[0] == variable) {
			return pair[1];
		}
	}
	return '';
}

/**
 * 截取指定字符后的内容
 * @param url 路径
 * @param parameter 字符
 */
function getCaption(url, parameter) {
	var index = url.lastIndexOf(parameter);
	url = url.substring(index + 1, url.length);
	return url;
}


/*
 * JSON数组去重
 * @param: [array] json Array
 * @param: [string] 唯一的key名，根据此键名进行去重
 */

function uniqueArray(array, key) {
	var result = [array[0]];
	for (var i = 1; i < array.length; i++) {
		var item = array[i];
		var repeat = false;
		for (var j = 0; j < result.length; j++) {
			if (item[key] == result[j][key]) {
				repeat = true;
				break;
			}
		}
		if (!repeat) {
			result.push(item);
		}
	}
	return result;
}

// 将百度地图经纬度转换为腾讯/高德地图经纬度
function bMapTransQQMap(lng, lat) {
	let x_pi = 3.14159265358979324 * 3000.0 / 180.0;
	let x = lng - 0.0065;
	let y = lat - 0.006;
	let z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
	let theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
	let lngs = z * Math.cos(theta);
	let lats = z * Math.sin(theta);

	return {
		lng: lngs,
		lat: lats
	}
}

function setStatusBarStyle() {
	// #ifdef APP-PLUS || APP
	let theme = uni.getStorageSync('appTheme') || 'light'
	console.log(theme, 'uni.getStorageSync()')
	if (theme == 'dark') {
		plus.navigator.setStatusBarStyle('light'); //只支持dark和light
	} else {
		plus.navigator.setStatusBarStyle('dark'); //只支持dark和light
	}
	// #endif

}

function getDate(type) {
	const date = new Date();
	let year = date.getFullYear();
	let month = date.getMonth() + 1;
	let day = date.getDate();
	month = month > 9 ? month : '0' + month;
	day = day > 9 ? day : '0' + day;

	if (type === 'start') {
		year = year - 60;
	}
	return `${year}-${month}-${day}`;
}

// 判断两个时间戳是否是同一天
function isSameDay(time1,time2 = new Date().getTime() ){
	let date1 = new Date(time1);
	let date2 = new Date(time2);
	return date1.getFullYear() == date2.getFullYear() && date1.getMonth() == date2.getMonth() && date1.getDate() == date2.getDate();
}



module.exports = {
	formatTime: formatTime,
	alert: alert1, //alert弹窗
	confirm: confirm1, //对话框
	uploadImgs: uploadImgs1, //上传多图
	showSuccess: showSuccess1, //成功提示
	showText: showText1, //文字提示
	showLoading: showLoading1, //加载提示
	back: back1, //返回上一页
	reto: reto1, //navigate跳转
	redi: redi,
	ajax: ajax1, //ajax请求
	emptyJson: emptyJson1, //判断json是否为空
	arrRemove: arrRemove1, //删除数组中的某个元素
	arrRemoveJson: arrRemoveJson1, //删除数组中的某个对象
	wxRequest: wxRequest, // 异步调用Request
	add: add, //加
	sub: sub, //减
	mul: mul, //乘
	div: div, //除
	toDate: toDate1, //中国标准时间转成年月日
	miPhone: phone,
	formatMoney: formatMoney,
	deepCopy: deepCopy1,
	addressLoad: addressLoad1,
	noRepeatList: noRepeatList,
	markLoad: markLoad1,
	closeMark: closeMark1,
	validImage,
	numFormat,
	number,
	addBuryingPoint,
	checkWxAuth,
	getQueryVariable,
	getCaption,
	uniqueArray,
	bMapTransQQMap,
	setStatusBarStyle,
	getDate,
	isSameDay
}