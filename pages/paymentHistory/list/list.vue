<template>
  <view class="list">
    <sun-header :title="$t('log.transactions')"></sun-header>


    <view class="card">
      <view class="item" v-for="(item, index) in list" :key="index" @click="goToDetail(item)">
        <view class="l">
          <view class="r-l" style="flex: 1; align-items: flex-start;">
            <view class="card-img">
              <image :src="`/static/images/status/${getPaymentImg(item)}.svg`" mode="widthFix"></image>
            </view>
            <view class="m" style="font-size: 50rpx;display: flex;align-items: center;">
              <image style="width: 46rpx;height: 46rpx;margin-right: 4rpx;" src="/static/images/status/money.png"
                mode="widthFix"></image>
              {{ item.amount / 100 }}
            </view>
          </view>
        </view>
        <view class="r" style="justify-content: flex-end;height: 100%;">
          <view class="" style="display: flex;flex-direction: column;justify-content: space-between;height: 100%;">
            <view class="" style="height: 85rpx;">
              <view class="time" style="justify-content: flex-end;">
                <view class="t"> {{ item.capturedTime | dateFormat}}</view>
              </view>
              <view class="time" style="justify-content: flex-end;">
                <view class="t"> {{getPaymentName(item)}}</view>
              </view>
            </view>

            <view class="flex center" style="justify-content: flex-end;">
              <view class="s">
                <image v-if="item.paymentStatus == 'success' && !item.refundStatus"
                  src="/static/images/status/success.svg" mode="widthFix"></image>
                <image v-if="item.paymentStatus == 'success' && item.refundStatus"
                  src="/static/images/status/rufund-new.svg" mode="widthFix"></image>
                <image
                  v-if="item.paymentStatus.toLowerCase() == 'fail' || item.paymentStatus.toLowerCase() == 'cancel' || item.paymentStatus.toLowerCase() == 'canceled'"
                  src="/static/images/status/fail.svg" mode="widthFix"></image>
                <image
                  v-if="item.paymentStatus == 'pending' || item.paymentStatus == 'PENDING' || item.paymentStatus == 'Pending'"
                  src="/static/images/status/wait.svg" mode="widthFix"></image>
              </view>
              <view class="flex center" style="line-height: 60rpx;">
                <!-- <view class="payment">
                  {{ item.acquirerTypeAbbreviation }}
                </view> -->
                <view class="n" style="font-size: 42rpx;" v-if="!item.refundStatus"
                  :style="'color:'+getPaymentColor(item)">
                  {{ $t(item.paymentStatus) }}
                </view>
                <view class="n" style="font-size: 42rpx;" v-if="item.refundStatus"
                  :style="'color:'+getPaymentColor(item)">
                  {{ $t('refunded') }}
                </view>
              </view>
            </view>

          </view>


          <view class="i">
            <image src="/static/images/status/icon.svg" mode="heightFix"></image>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  import sunHeader from '@/components/sun-header/sun-header.vue'
  import api from '@/utils/api/index.js'
  import utils from '@/utils/util.js'
  import {
    listMock
  } from './listMock.js'
  import {
    mapGetters
  } from 'vuex'
  export default {
    name: 'list',
    components: {
      sunHeader,
    },
    data() {
      return {
        creationTimeStart: '',
        creationTimeEnd: '',
        list: [],
        page: 1,
        pageSize: 20,
        isEnd: false
      }
    },
    filters: {
      dateFormat(val) {
        // 格式化成 DD/MM/YYYY HH:mm:ss
        return utils.formatTime(new Date(val)).slice(2)
      }
    },
    computed: {
      ...mapGetters(['locale']),
    },
    onLoad(e) {
      console.log(e, 'ee')
      this.creationTimeStart = e.start || utils.getDate() + ' 00:00:00'
      this.creationTimeEnd = e.end || utils.getDate() + ' 23:59:59'
    },
    mounted() {
      // this.getList()
    },
    onShow() {
      this.getList(true)
      // this.list = listMock
    },

    onReachBottom() {
      if (!this.isEnd) {
        this.page = this.page + 1
        this.getList()
      }
    },
    methods: {
      async getList(type) {
        if (type) {
          this.page = 1
          this.isEnd = false
          this.list = []
        }
        utils.showLoading()
        let o = {
          creationTimeStart: this.creationTimeStart,
          creationTimeEnd: this.creationTimeEnd,
          index: this.page,
          pageSize: this.pageSize,
        }
		
        let res = await api.pageTransactionAndTransactionMetadata(o)
        let {
          data,
          code
        } = res
        if (code === '000000') {
          let list = data.records;
          console.log("=============");
          console.log(list);
          if (list.length < this.pageSize) {
            this.isEnd = true
          }
          this.list = this.list.concat(list)
          if (this.list.length == 0) {
            utils.showText('暂无数据')
          }
        } else {
          utils.showText(res.message)
        }
      },

      goToDetail(item) {
        console.log("================")
        console.log(item);
        let obj = {
          paymentStatus: item.paymentStatus,
          refundStatus: item.refundStatus,
          acquirerTypeAbbreviation: item.acquirerTypeAbbreviation,
          acquirerTransactionId: item.acquirerTransactionId,
          acquirerType: item.acquirerType,
          storeName: item.storeName,
          amount: item.amount,
          id: item.id,
          lastUpdateTime: item.lastUpdateTime,
          acquirerTransactionId: item.acquirerTransactionId,
          terminalStan: item.terminalStan
        }
        uni.navigateTo({
          url: '/pages/paymentHistory/detail/detail?is_dcs=0&id=' + item.id
        })
      },
      getPaymentColor(item) {
        let str = item.paymentStatus.toLowerCase()
        let refundStatus = item.refundStatus
        //console.log(item, refundStatus)
        if (str == 'success') {
          return refundStatus ? '#A000FF' : '#00C260'
        } else if (str == 'fail' || str == 'cancel' || str == 'canceled') {
          return '#ED0006'
        } else if (str == 'pending' || str == 'PENDING' || str == 'Pending') {
          return '#F9A000'
        } else {
          return '#000'
        }
      },
      getPaymentImg(item) {
        let str = item.acquirerTypeAbbreviation.toLowerCase()
        //console.log(this.locale+"=======")
        if (str == 'wechat') {
          return 'wechatpay'
        } else if (str == 'alipay') {
          return 'alipay'
        } else if (str == 'mastercard_domestic') {
          return 'Mastercard'
        } else if (str == 'mastercard_international') {
          return 'Mastercard'
        } else if (str == 'dinersclubcard_domestic') {
          return 'DinersClub'
        } else if (str == 'dinersclubcard_international') {
          return 'DinersClub'
        } else if (str == 'amexcard_domestic') {
          return ''
        } else if (str == 'amexcard_international') {
          return ''
        } else if (str == 'visacard_domestic') {
          return 'Visa'
        } else if (str == 'visacard_international') {
          return 'Visa'
        } else if (str == 'unionpay_domestic') {
          return 'UnionPay'
        } else if (str == 'unionpay_international') {
          return 'UnionPay'
        } else if (str == 'jcbcard_domestic') {
          return ''
        } else if (str == 'jcbcard_international') {
          return ''
        } else if (str == 'grab_pay_later') {
          return 'Grabpay'
        } else if (str == 'grab_pay') {
          return 'Grabpay'
        } else if (str == 'paynow') {
          return 'Paynow'
        } else if (str == 'pinelablater') {
          return ''
        } else if (str == 'solana_pay') {
          return 'UpNetwork'
        }
      },
      getPaymentName(item) {
        let str = item.acquirerTypeAbbreviation.toLowerCase();
        if (this.locale == "zh") {
          if (str == 'wechat') {
            return '微信支付'
          } else if (str == 'alipay') {
            return '支付宝'
          } else if (str == 'mastercard_domestic') {
            return '万事达 本地卡'
          } else if (str == 'mastercard_international') {
            return '万事达 外卡'
          } else if (str == 'dinersclubcard_domestic') {
            return 'DinersClub 本地卡'
          } else if (str == 'dinersclubcard_international') {
            return 'DinersClub 外卡'
          } else if (str == 'amexcard_domestic') {
            return 'AmexCard 本地卡'
          } else if (str == 'amexcard_international') {
            return 'AmexCard 外卡'
          } else if (str == 'visacard_domestic') {
            return 'VISA 本地卡'
          } else if (str == 'visacard_international') {
            return 'VISA 外卡'
          } else if (str == 'unionpay_domestic') {
            return '银联国际 本地卡'
          } else if (str == 'unionpay_international') {
            return '银联国际 外卡'
          } else if (str == 'jcbcard_domestic') {
            return 'JCBCard 本地卡'
          } else if (str == 'jcbcard_international') {
            return 'JCBCard 外卡'
          } else if (str == 'grab_pay_later') {
            return 'GrabPay'
          } else if (str == 'grab_pay') {
            return 'GrabPay'
          } else if (str == 'paynow') {
            return 'PayNow'
          } else if (str == 'pinelablater') {
            return ''
          } else if (str == 'solana_pay') {
            return 'UP NETWORK '
          }
        } else {
          if (str == 'wechat') {
            return 'WeChat Pay'
          } else if (str == 'alipay') {
            return 'Alipay+'
          } else if (str == 'mastercard_domestic') {
            return 'Matercard Domestic'
          } else if (str == 'mastercard_international') {
            return 'Matercard International'
          } else if (str == 'dinersclubcard_domestic') {
            return 'DinersClub Domestic'
          } else if (str == 'dinersclubcard_international') {
            return 'DinersClub International'
          } else if (str == 'amexcard_domestic') {
            return 'AmexCard Domestic'
          } else if (str == 'amexcard_international') {
            return 'AmexCard International'
          } else if (str == 'visacard_domestic') {
            return 'VISA Domestic'
          } else if (str == 'visacard_international') {
            return 'VISA International'
          } else if (str == 'unionpay_domestic') {
            return 'UnionPay Domestic'
          } else if (str == 'unionpay_international') {
            return 'UnionPay International'
          } else if (str == 'jcbcard_domestic') {
            return 'JCBCard Domestic'
          } else if (str == 'jcbcard_international') {
            return 'JCBCard International'
          } else if (str == 'grab_pay_later') {
            return 'GrabPay'
          } else if (str == 'grab_pay') {
            return 'GrabPay'
          } else if (str == 'paynow') {
            return 'PayNow'
          } else if (str == 'pinelablater') {

          } else if (str == 'solana_pay') {
            return 'UP NETWORK '
          }
        }

      }
    },
  }
</script>

<style lang="scss" scoped>
  @import 'list.scss';
</style>