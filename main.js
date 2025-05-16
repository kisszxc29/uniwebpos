import App from './App'
import Vue from 'vue'
import Store from './store' //vuex 
import i18n from './i18n/index.js' // 国际化

import {
  global
} from './utils/global.js'
Vue.prototype.$global = global


Vue.$store = Vue.prototype.$store = Store;
Vue.prototype._i18n = i18n

import footerLogo from './components/footerLogo'
Vue.component('footer-logo', footerLogo)

import './uni.promisify.adaptor'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
  i18n,
  ...App
})
app.$mount()