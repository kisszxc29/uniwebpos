<template>
  <view class="payment">
    <sun-header :title="$t('log.headTitle')"></sun-header>
    <view class="top-bg" :style="'height:' + topHeight + 'px'">
      <image src="/static/images/log/bg.png" mode="aspectFill"></image>
    </view>
    <view>
      <view class="title">
        {{ $t('log.title') }}
      </view>
      <view class="date">
        <view class="item">
          <view class="lable" :style="type == 2 ? 'width:180rpx' : ''">
            <view class="img">
              <image src="/static/images/login/start.svg" mode=""></image>
            </view>
            <view class="">
              {{ type == 1 ? $t('log.start') : $t('log.s') }}
            </view>
          </view>
          <view class="value">
            <picker class="pick" :class="type == 2 ? 'pick2' : ''" mode="date" :value="start" :start="startDate"
              :end="endDate" @change="bindDateChange">
              <view class="uni-input">{{ start }}</view>
            </picker>
            <picker v-if="type == 2" class="pick" :class="type == 2 ? 'pick3' : ''" mode="time" :value="startTime"
              @change="bindTimeChange">
              <view class="uni-input">{{ startTime }}</view>
            </picker>
            <image v-if="type == 1" class="down" src="/static/images/login/arrow.svg" mode=""></image>
          </view>
        </view>
        <view class="item">
          <view class="lable" :style="type == 2 ? 'width:180rpx' : ''">
            <view class="img">
              <image src="/static/images/login/end.svg" mode=""></image>
            </view>
            <view class="">
              {{ type == 1 ? $t('log.end') : $t('log.e') }}
            </view>
          </view>
          <view class="value">
            <picker class="pick" :class="type == 2 ? 'pick2' : ''" mode="date" :value="end" :start="startDate"
              :end="endDate" @change="bindEndChange">
              <view class="uni-input">{{ end }}</view>
            </picker>
            <picker v-if="type == 2" class="pick" :class="type == 2 ? 'pick3' : ''" mode="time" :value="endTime"
              @change="bindEndTimeChange">
              <view class="uni-input">{{ endTime }}</view>
            </picker>
            <image v-if="type == 1" class="down" src="/static/images/login/arrow.svg" mode=""></image>
          </view>
        </view>
      </view>
      <!-- 提示 -->
      <view class="print-tip" v-if="type == 2">
        <view class="p-title">
          <view class="t">{{ $t('PrintTerminalTransactions') }}</view>
          <switch v-model="onlyTerminal" :checked="onlyTerminal" color="#0058FF" @change="switchChange"
            style="transform: scale(0.7)" />
        </view>
        <view class="p-content">
          {{ $t('PrintTerminalTransactionsText') }}
        </view>
      </view>
      <view v-if="type == 1" class="button" @click="findPaymentList">
        {{ $t('QueryTransactionHistory') }}
      </view>
      <view v-if="type == 2" class="button" @click="getPrintDetail">
        <image src="/static/images/login/print-white.svg" mode=""></image>
        {{ $t('log.print') }}
      </view>
      <footer-logo></footer-logo>
    </view>
  </view>
</template>

<script>
  import sunHeader from '@/components/sun-header/sun-header.vue'
  import api from '@/utils/api/index.js'
  import utils from '@/utils/util.js'
  import newPrint from '@/utils/mixins/newPrint.js'
  export default {
    name: 'paymentHistory',
    components: {
      sunHeader,
    },
    mixins: [newPrint],
    data() {
      return {
        start: '',
        bluetoothStatus: false,
        end: '',
        count: 0,
        type: 1,
        startTime: '',
        endTime: '',
        onlyTerminal: true,
        topHeight: 0,
		dcs_base64:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAYAAAABPCAIAAABtbIU9AAAACXBIWXMAAAsTAAALEwEAmpwYAAAFu2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNy4yLWMwMDAgNzkuMWI2NWE3OSwgMjAyMi8wNi8xMy0xNzo0NjoxNCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIzLjUgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAyNC0xMC0wNVQxNjo1MzowNyswODowMCIgeG1wOk1vZGlmeURhdGU9IjIwMjQtMTAtMDVUMTg6MTQ6NDArMDg6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjQtMTAtMDVUMTg6MTQ6NDArMDg6MDAiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOmM1MDBhZmViLWFmMWMtNjc0MC05YzFlLTkxNzY4NTJkYTY3YiIgeG1wTU06RG9jdW1lbnRJRD0i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',
		
      }
    },
    computed: {
      startDate() {
        return this.getDate('start')
      },
      endDate() {
        console.log(this.getDate('end'), '')
        return this.getDate('end')
      },
    },
    mounted() {
      this.start = this.getDate('end')
      this.end = this.getDate('end')
      // 默认时分
      let date = new Date()
      let hour = date.getHours()
      let minute = date.getMinutes()
      hour = hour > 9 ? hour : '0' + hour
      minute = minute > 9 ? minute : '0' + minute
      this.startTime = '00:00'
      this.endTime = '23:59'

      // 动态计算高度
      uni.getSystemInfo({
        success: (res) => {
          this.topHeight = res.screenHeight - 450
        },
      })
    },
    onLoad(e) {
      this.type = e.type || 1
      this.onlyTerminal = uni.getStorageSync('onlyTerminal')
      console.log(this.onlyTerminal, 'onlyTerminal')
    },
    methods: {
      switchChange(e) {
        this.onlyTerminal = e.detail.value
        uni.setStorageSync('onlyTerminal', e.detail.value)
      },
      // 查看交易记录
      findPaymentList() {
        let start = this.start + ' ' + this.startTime + ':00'
        let end = this.end + ' ' + this.endTime + ':59'
        uni.navigateTo({
          url: '/pages/paymentHistory/list/list?start=' + start + '&end=' + end,
        })
      },
      async getPrintDetail() {
        console.log('getPrintDetail')
        uni.showModal({
          title: 'Warning',
          content: 'Do you want to print ?',
          cancelText: 'CANCEL',
          confirmText: 'YES',
          success: (res) => {
            if (res.confirm) {
              console.log('用户点击确定')
              this.handlePrint()
            } else if (res.cancel) {
              console.log('用户点击取消');
            }
          },
        })
      },
      async handlePrint() {
		let _this = this;
        let start = this.start + ' ' + this.startTime + ':00'
        let end = this.end + ' ' + this.endTime + ':59'
        let o = {
          creationTimeStart: start,
          creationTimeEnd: end,
          printTypeFlag: this.onlyTerminal ? 'terminal' : 'store',
        }
        console.log(o);
        _this.$global.addLog(JSON.stringify(o), "printReceiptSummaryByDateV2");
        let res = await api.printReceiptSummaryByDateV2(o)
        console.log(res)
        _this.$global.addLog(JSON.stringify(res), "printReceiptSummaryByDateV2_result");
        if (res.code == '000000') {
        	this.newPrintTextSummarySunmi(res.data,this.dcs_base64)
        } else {
          utils.showText(res.message)
        }
      },
      bindTimeChange(e) {
        this.startTime = e.detail.value
      },
      bindEndTimeChange(e) {
        this.endTime = e.detail.value
      },

      bindDateChange(e) {
        this.start = e.detail.value
      },
      bindEndChange(e) {
        this.end = e.detail.value
      },
      getDate(type) {
        const date = new Date()
        let year = date.getFullYear()
        let month = date.getMonth() + 1
        let day = date.getDate()
        month = month > 9 ? month : '0' + month
        day = day > 9 ? day : '0' + day

        if (type === 'start') {
          year = year - 60
        }
        return `${year}-${month}-${day}`
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import 'paymentHistory.scss';
</style>