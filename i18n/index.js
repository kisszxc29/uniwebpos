import VueI18n from 'vue-i18n' 
import store from '../store/index.js'
import Vue from 'vue' 
import zh from './common/zh.js' 
import en from './common/en.js' 
Vue.use(VueI18n) 

export default new VueI18n({ 
    locale: store.getters.locale,
    messages:{ 
        'en':en, 
        'zh':zh 
   }
})
