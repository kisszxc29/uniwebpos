<template>
  <view class="login">
    <view class="logo">
      <image src="/static/images/login/logo.png" mode="widthFix"></image>
    </view>
    <view class="form">
      <view class="title">
        <image src="/static/images/login/title.svg" mode="widthFix"></image>
      </view>

      <view class="item">
        <input class="input" :value="outlet" @input="getInput($event,'outlet')" :disabled="disOutlet != ''" type="text"
          placeholder-class="pla" placeholder="Enter your outlet">
      </view>
      <view class="item">
        <input class="input" @input="getInput($event,'password') " :password="!plaintext" type="text"
          placeholder-class="pla" placeholder="Enter your password">
        <image class="eye" v-if="!plaintext" src="/static/images/login/eye-n.svg" mode="" @click="changeEye"></image>
        <image class="eye" v-else src="/static/images/login/eye-y.svg" mode="" @click="changeEye"></image>
      </view>
      <!-- <view class="item">aaab</view> -->
      <button class="submit" :style="disabled ? 'opacity:0.6':''" @click="login">Login</button>
    </view>

    <!-- 设备信息 -->
    <!--view class="sys">
		
      aaaa：{{ info.deviceModel }} <br />
      bbbb：{{ info.model }}<br />
    </view-->
  </view>
</template>

<script>
  import api from '@/utils/api/index.js'
  import utils from '@/utils/util.js'
  //const HceSunmi = uni.requireNativePlugin('HL-HceSunmiModule');
  export default {
    data() {
      return {
        plaintext: false,
        password: '', // token
        outlet: '', // 设备号
        disOutlet: '', // 如果有值 则禁止输入
        // disabled:true
        info: ''
      }
    },
    computed: {
      disabled() {
        return !this.password || !this.outlet
      }
    },
    mounted() {
      console.log(uni.getStorageSync('MOT-SUNMISN'), 'MOT-SUNMISN')
      this.disOutlet = uni.getStorageSync('MOT-SUNMISN') || ''
      this.outlet = uni.getStorageSync('MOT-SUNMISN') || ''
      this.info = uni.getSystemInfoSync()
    },
    methods: {

      changeEye() {
        this.plaintext = !this.plaintext
      },
      getInput(e, type) {
        let val = e.detail.value
        if (type == 'outlet') {
          this.outlet = val
        } else {
          this.password = val
        }
      },
      async login() {
        if (!this.outlet) {
          utils.showText('设备序列号不能为空')
          return
        }
        if (!this.password) {
          utils.showText('Token不能为空')
          return
        }

        utils.showLoading()
        let o = {
          token: this.password,
          deviceSerialNumber: this.outlet
        }
        uni.setStorageSync('MOT-SUNMISN', this.outlet)
        let res = await api.terminalLogin(o)
        uni.hideLoading()
        if (res.code == '000000') {
          uni.setStorageSync('loginInfo', res.data)
          uni.setStorageSync('terminalId', res.data.terminalId)
          uni.setStorageSync('Authorization', res.data.jwtToken)
          uni.setStorageSync('storeName', res.data.storeName)
          uni.setStorageSync('token', this.password)
          try {
            this.getStoreName()
          } catch (e) {
            //TODO handle the exception
          }

          uni.reLaunch({
            url: '/pages/pay/pay'
          })
        } else {
          utils.showText(res.message)
        }

      },
      async getStoreName() {
        let p = {
          token: this.password
        }
        let res = await api.selectStoreDtoByDeviceToken(p)
        console.log(res, '-----')
        let data = res.data
        if (res.code == '000000') {
          uni.setStorageSync('storeName', data.name)
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import 'login.scss';

  .sys {
    position: absolute;
    bottom: 100rpx;
    padding: 20px;
  }
</style>