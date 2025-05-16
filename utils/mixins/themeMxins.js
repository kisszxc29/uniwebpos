import Store from '@/store/index.js' //vuex 
import Vue from 'vue'
import {
	mapGetters
} from 'vuex';
module.exports = {
	data() {
		return {
			navColor: {
				color: '#fff'
			}
		}
	},
	methods: {
		toggleAppTheme(color, index) {
			var data = {
				color: color,
				index: index
			};
			// Vue.$navColor = Vue.prototype.$navColor = {
			// 	color: '#fff'
			// };
			Store.commit('setTheme', data);
			uni.hideLoading();
			if (color == "light") {
				// #ifdef APP-PLUS
				plus.navigator.setStatusBarStyle('dark'); //只支持dark和light
				// #endif
				return "1"
			} else if (color == "dark") {
				// #ifdef APP-PLUS
				plus.navigator.setStatusBarStyle('light'); //只支持dark和light
				// #endif
				return "2"
			} else {
				return "1"
			}
		}
	},
	computed: {
		...mapGetters(['appTheme'])
	},
}
