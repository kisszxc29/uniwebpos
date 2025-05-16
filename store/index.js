import Vue from 'vue'
import Vuex from 'vuex'
import commonFun from "@/utils/common.js"
import statusBar from '@/store/modules/statusBar.js'


Vue.use(Vuex)
const state = {
	/* 主题 light dark */
	appTheme: commonFun.localStorage.get('appTheme') ? commonFun.localStorage.get('appTheme') : 'light',
	appThemeIndex: commonFun.localStorage.get('appThemeIndex') ? commonFun.localStorage.get('appThemeIndex') : 1,
	locale: 'zh'
}

// 同步加载
const mutations = {
	/* 设置token */
	setToken(state, data) {
		state.token = data;
		commonFun.localStorage.set("token", data);
	},
	setLocale(state, data) {
		state.locale = data;
		uni.setStorageSync('locale', data)
	},
	/* 主题 */
	setTheme(state, data) { //你可以传入一个颜色参数(需要上面公共css中含有,如果不传入默认)
		state.appTheme = data.color;
		state.appThemeIndex = data.index;
		state.theme = data;
		commonFun.localStorage.set('appTheme', data.color)
		commonFun.localStorage.set('appThemeIndex', data.index)
		commonFun.localStorage.set('theme', data)
	},
}

// 异步加载
const actions = {

}

// 计算属性
const getters = {
	appTheme(state) {
		return state.appTheme
	},
	locale(state) {
		return state.locale
	}
}

export default new Vuex.Store({
	state,
	mutations,
	getters,
	statusBar
})
