<script>
  import Vue from 'vue'
  export default {
    onLaunch: function() {
      uni.getSystemInfo({
        success: function(e) {
          console.log(JSON.stringify(e), '---')
          uni.setStorageSync('systemInfo', e)
        }
      })


      let lan = 'en'
      let locale = uni.getStorageSync('locale')
      try {
        const res = uni.getSystemInfoSync()
        // console.log(res, '设备信息')
        uni.setStorageSync('system', res)
        if (locale) {
          lan = locale
        } else {
          lan = 'zh'
        }
      } catch (e) {
        // console.log('error=' + e)
      }
      if (lan == 'en-US' || lan == 'en') {
        this._i18n.locale = 'en'
        lan = 'en'
      }
      if (lan == 'zh-CN' || lan == 'zh') {
        this._i18n.locale = 'zh'
        lan = 'zh'
      }
      this.$store.commit('setLocale', lan)
      uni.setStorageSync('locale', lan)
    },
    onShow: function() {
      console.log('App Show')
    },
    onHide: function() {
      console.log('App Hide')
    }
  }
</script>

<style>
  /*每个页面公共css */
</style>