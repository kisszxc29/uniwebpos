<template>
  <view class="detail">
    <sun-header :title="$t('TransactionsDetails')" :style="getBackground+'backdrop-filter:blur(0px)'"></sun-header>
    <!-- 顶部样式 动态背景 -->
    <view class="top-bg" :style="getBackground">
      <view class="pay-text">
        {{ item.refundStatus ? $t('refunded') : $t(item.paymentStatus) }}
      </view>
    </view>

    <view class="top">
      <view class="unit" style="font-size: 0;" v-if="locale == 'en'">
        <image style="width: 90rpx;height: 90rpx;" src="/static/images/status/money_detail.png" mode="widthFix"></image>
      </view>
      <view class="text" v-if="status == 1 && item.amount"><text v-if="locale == 'zh'">$</text> {{ item.amount / 100 }}
      </view>
    </view>

    <view class="card" :style="'padding:' + cPading + 'px 13px'">
      <view class="lable">{{ $t('DateProcessed') }}</view>
      <view class="value">{{ item.capturedTime }}</view>
      <view class="pay-icon">
        <image v-if="item.paymentStatus == 'success' && !item.refundStatus" src="/static/images/status/success.svg"
          mode="widthFix"></image>
        <image v-if="item.paymentStatus == 'success' && item.refundStatus" src="/static/images/status/back.svg"
          mode="widthFix"></image>
        <image v-if="item.paymentStatus == 'fail'" src="/static/images/status/fail.svg" mode="widthFix"></image>
        <image v-if="
            item.paymentStatus == 'pending' || item.paymentStatus == 'PENDING'
          " src="/static/images/status/wait.svg" mode="widthFix"></image>
      </view>
    </view>
    <view class="card" :style="'padding:' + cPading + 'px 13px'">
      <view class="lable">{{ $t('PaymentChannel') }}</view>
      <view class="value">{{ getPaymentName }}</view>
      <view class="card-icon">
        <image :src="`/static/images/status/${getPaymentImg}.svg`" mode="widthFix"></image>
      </view>
    </view>

    <view class="bottom" :style="'padding:' + cPading + 'px 13px'">
      <view class="title">
        {{ $t('TranscationID') }}
      </view>
      <view class="name">
        {{ item.id }}
      </view>
    </view>
    <!--view v-if="type == 'pay'" class="button" @click="back">
      {{$t('status.btn')}}
    </view-->
	<view v-if="type == 'pay'">
	  <view style="display: flex;justify-content:space-between;padding:0rpx 28rpx;margin-top: 40rpx;margin-bottom: 40rpx;">
		  <view @click="back" class="new_button" :style="'width:'+new_button_width+'rpx;height:'+new_button_height+'rpx;border:4rpx solid #0044B4;background:#0052d9;'">
			  <view v-if="isSmallScreen == false" class="new_button_icon">
				  <image class="new_icon" src="/static/images/status/back_white.png" mode=""></image>
			  </view>
			  <view class="new_button_size">{{$t('button_left_size')}}</view>
		  </view>
		  <view @click="pause_three_seconds" class="new_button" :style="'width:'+new_button_width+'rpx;height:'+new_button_height+'rpx;opacity:'+right_button_opacity+';border:4rpx solid '+right_button_border_color+';background:'+right_button_background_color+';'">
			  <view v-if="isSmallScreen == false" class="new_button_icon">
				  <image class="new_icon" :src="'/static/images/status/'+two_paper_img+''" mode=""></image>
			  </view>
			  <view class="new_button_size" :style="'color:'+button_right_size_color+''">{{button_right_size}}</view>
		  </view>
	  </view>
	  <view class="detail_three_seconds" :style="'color:'+detail_three_seconds_color+''">
		  <view>{{detail_three_seconds_1}}</view>
		  <view>{{detail_three_seconds_2}}</view>
	  </view>
	</view>
    <view v-else>
      <view v-if="item.paymentStatus == 'success' && !item.refundStatus" class="button"
        style="background: #e34d59; margin-top: 30rpx" @click="issueRefund">
        <image src="/static/images/status/rufund.svg" mode="widthFix"></image>
        {{ $t('IssueRefund') }}
      </view>
      <!-- && !item.refundStatus 退款状态 -->
      <view v-if="item.paymentStatus == 'success'" class="button" @click="printCurrent">
        <image src="/static/images/status/printer.svg" mode="widthFix"></image>
        {{ $t('PrintReceipt') }}
      </view>
    </view>

    <!--view class="btn" @click="startRefund" style="color: rgb(227, 77, 89)">
      测试退款刷卡
    </view-->
    <footer-logo v-if="isSmallScreen == false"></footer-logo>

    <view class="dialog" v-if="showInputPwd">
      <view class="mask"></view>
      <view class="modal">
        <view class="d-top">
          <view class="d-title">{{ $t('PasswordIsRequired') }}</view>
          <input class="d-input" @input="getVal" type="safe-password" focus placeholder="" />
        </view>
        <view class="d-bottom">
          <view class="btn" @click="showInputPwd = false" style="color: rgb(0, 0, 0)">
            {{ $t('Cancel') }}
          </view>
          <view class="btn" @click="submit" style="color: rgb(227, 77, 89)">
            {{ $t('Refund') }}
          </view>
        </view>
      </view>
    </view>


    <view class="head-card" v-if="is_dcs_show">
      <!-- <sun-header :title="$t('log.headTitle')"></sun-header> -->
      <view class="img">
        <image v-for="(item,index) in 5" :key="index" class="svg" v-if="index == money_type_icon"
          :src="`/static/images/headCard/hand-card-${index + 1}.svg`" mode="">
        </image>
      </view>
      <view class="t1">{{$t('total_size')}}</view>
      <view class="t2">S${{ money | convertNum }}</view>
      <view class="t3">{{$t('tap_click')}}</view>
      <view class="footer-btn" @click="cancel_dcs">{{$t('tap_to_cancel')}}</view>
    </view>
	<uqrcode v-if="SOLANA_PAY_QR_URL" ref="SOLANA_PAY_uqrcode" canvas-id="SOLANA_PAY_qrcode" :value="SOLANA_PAY_QR_URL"
	  size="160" hide @complete="uqrcodeComplete"></uqrcode>
  </view>
</template>

<script>
  import sunHeader from '@/components/sun-header/sun-header.vue'
  import api from '@/utils/api/index.js'
  import utils from '@/utils/util.js'
  import newPrint from '@/utils/mixins/newPrint.js'
  import _ from 'loadsh'

  // #ifdef APP-PLUS
  const initSunmi = uni.requireNativePlugin('Hd-InitSunmiModule')
  const saleSmRefund = uni.requireNativePlugin('Hd-RefundModule')
  const saleSmSaleVoid = uni.requireNativePlugin('Hd-SaleVoidModule')
  const saleSm_quxiao = uni.requireNativePlugin('Hd-SaleSmModule')
  // #endif
  import {
    listMock
  } from '../list/listMock.js'
  import {
    mapGetters
  } from 'vuex'
  export default {
    name: 'status',
    components: {
      sunHeader,
    },
    computed: {
      ...mapGetters(['locale']),
      getBackground() {
        let background = 'background:'
        let str = this.item.paymentStatus && this.item.paymentStatus.toLowerCase(),
          color = '#ffffff'
        let refundStatus = this.item.refundStatus || false
        if (str == 'success') {
          color = refundStatus ? '#A000FF' : '#00C260'
        } else if (str == 'fail' || str == 'cancel' || str == 'canceled') {
          color = '#ED0006'
        } else if (str == 'pending' || str == 'PENDING' || str == 'Pending') {
          color = '#F9A000'
        } else {
          color = 'transparent'
        }
        return background + color + ';'
      },
      getPaymentImg() {
        let str = this.item.acquirerTypeAbbreviation && this.item.acquirerTypeAbbreviation.toLowerCase()
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
      getPaymentName() {
        let str = this.item.acquirerTypeAbbreviation && this.item.acquirerTypeAbbreviation.toLowerCase()
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
    mixins: [newPrint],
    data() {
      return {
		timeout_time:4000,
        id: 0,
        type: null, // type = pay 说明是从键盘页面来的
        item: {},
        // item: listMock[0],
        merchantParams: {},
        bluetoothStatus: false,
        currentItem: {},
        showInputPwd: false,
        password: '',
        status: 1, // 1 成功 2失败
        iconW: 100,
        cPading: 90,
        is_shangmi: 0,
        is_void: 0,
        is_today: 0,
        // 刷卡退款参数
        vMainData: {
          amount: 1, // 必传 订单金额（分）
          cardNo: '', // 刷卡后自动回显
          cardExpDate: '', // 卡片到期日期 可忽略
          cardCvv: '', // 卡片CVV签名 可忽略
          tips: 0, // 可忽略
          orderId: '', // 订单id 非必传
          oriReferenceNo: '', // 必传 取刷卡成功后的 referenceNo 406070000195
          oriVoucherNo: '', // 必传 取刷卡成功后的 stan 000271
        },
        dcs_base64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAYAAAABPCAIAAABtbIU9AAAACXBIWXMAAAsTAAALEwEAmpwYAAAFu2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNy4yLWMwMDAgNzkuMWI2NWE3OSwgMjAyMi8wNi8xMy0xNzo0NjoxNCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIzLjUgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAyNC0xMC0wNVQxNjo1MzowNyswODowMCIgeG1wOk1vZGlmeURhdGU9IjIwMjQtMTAtMDVUMTg6MTQ6NDArMDg6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjQtMTAtMDVUMTg6MTQ6NDArMDg6MDAiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOmM1MDBhZmViLWFmMWMtNjc0MC05YzFlLTkxNzY4NTJkYTY3YiIgeG1wTU06RG9jdW1lbnRJRD0i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',
        money_type_icon: 0, // 5个图片	
        is_dcs_show: false,
        yi_dcs: null,
        money: '0.00',
		button_right_size:'',
		//is_pause_three_seconds:0,
		two_paper_img:'two_paper_1.png',
		right_button_border_color:'#BF000F',
		right_button_background_color:'#E34D59',
		right_button_opacity:'1',
		button_right_size_color:'#ffffff',
		detail_three_seconds_1:'',
		detail_three_seconds_2:'',
		detail_three_seconds_color:'#E34D59',
		isSmallScreen:false,
		new_button_width:'',
		new_button_height:'',
		SOLANA_PAY_QR_URL: '',
		SOLANA_PAY_DATA: {},
		is_dcs:0,
      }
    },
    onShow() {
      uni.getSystemInfo({
        success: (res) => {
          let h = res.windowHeight
          if (h < 580) {
            this.iconW = 80
            this.cPading = 0
          } else if (h >= 580 && h < 620) {
            this.cPading = 5
            this.iconW = 90
          } else {
            this.cPading = 10
            this.iconW = 100
          }

          if (res.deviceBrand == 'sunmi') {
            this.is_shangmi = 1
          } else {
            this.is_shangmi = 0
          }
          // this.winH = res.windowHeight
        },
      })
    },
    onLoad(e) {
      let _this = this;
	  //e.id = "1339228574611537920";
	  //e.type = "pay";
	  _this.is_dcs = e.is_dcs;
      _this.id = e.id;
      _this.type = e.type || null;
	  _this.is_pause_three_seconds = 0;
	  _this.button_right_size = _this.$t('button_right_size_1');
	  _this.detail_three_seconds_1 = _this.$t('detail_three_seconds_1_1');
	  _this.detail_three_seconds_2 = _this.$t('detail_three_seconds_1_2');
	  uni.setStorageSync('is_cli_pause_three_seconds', 'no');
	  
	  let systemInfo = uni.getSystemInfoSync('systemInfo');
		if (systemInfo.deviceModel == "P2_SE") {
			_this.isSmallScreen = true;
			_this.new_button_width = '328';
			_this.new_button_height = '100';
		} else {
			_this.isSmallScreen = false;
			_this.new_button_width = '328';
			_this.new_button_height = '202';
		}
		if(e.is_dcs == 1){
			_this.item = JSON.parse(e.item);
			let dcsPaymentMethod =_this.item.dcsPaymentMethod;
			dcsPaymentMethod = dcsPaymentMethod.replace("_", "");
			_this.item.acquirerTypeAbbreviation = dcsPaymentMethod+"_international";
			_this.item.dcsCardPrintInfoDto = _this.item;
			
			let loginInfo = uni.getStorageSync('loginInfo');
			_this.item.storeAddress = loginInfo.storeAddress;
			
			let now = new Date();
			let year = now.getFullYear();
			let month = now.getMonth() + 1;
			let day = now.getDate();
			let hour = now.getHours();
			let minute = now.getMinutes();
			let second = now.getSeconds();		
		
			month = month.toString().padStart(2, '0');
			day = day.toString().padStart(2, '0');
			hour = hour.toString().padStart(2, '0');
			minute = minute.toString().padStart(2, '0');
			second = second.toString().padStart(2, '0');
			
			let capturedTime = year+"-"+month+"-"+day+" "+hour+":"+minute+":"+second;
			_this.item.capturedTime = capturedTime;
			let JsonBigstring = require('json-bigint')({
			  storeAsString: true,
			});
			
			_this.money = _this.item.amount / 100;
			_this.is_void = 0;
			_this.is_today = 1;
			_this.vMainData.amount = _this.item.amount;
			_this.vMainData.oriReferenceNo = _this.item.acquirerTransactionId;
			_this.vMainData.oriTransactionType = _this.item.transactionType;
			if(_this.item.stan){
				_this.vMainData.oriVoucherNo = _this.item.stan;
			}
			
			let storeInfo = uni.getStorageSync('storeInfo');
			 
			_this.merchantParams = {
				merchantId: storeInfo.dcsMerchantId, // 默认值  肯定DCS
				terminalId: storeInfo.dcsTerminalId, // 默认值  肯定DCS
				subMerchantCity: storeInfo.dcsSubMerchantCity,
				subMerchantId: storeInfo.dcsSubMerchantId,
				subTerminalId: storeInfo.dcsSubTerminalId,
				subMerchantName: storeInfo.dcsSubMerchantName,
				subMerchantCountryCode: storeInfo.dcsSubMerchantCountryCode
			};
			  
			if(_this.type == "pay"){
				_this.startPrintDcs(_this.item);
				setTimeout(() => {
					let is_cli_pause_three_seconds = uni.getStorageSync('is_cli_pause_three_seconds');
					if(is_cli_pause_three_seconds == 'no'){
						uni.setStorageSync('is_cli_pause_three_seconds','two_dayin');
						_this.right_button_opacity = '0.3';
						_this.detail_three_seconds_1 = _this.$t('detail_three_seconds_3_1');
						_this.detail_three_seconds_2 = _this.$t('detail_three_seconds_3_2');
						_this.detail_three_seconds_color = '#0052D9';
						setTimeout(() => {
							uni.navigateBack();
						}, _this.timeout_time);
					}
				}, _this.timeout_time); 

			}
		}else{
			let o = {id: e.id};
			api.selectTransactionDetailById(o).then((res) => {
			  if (res.code == '000000') {
			    let data = res.data;
			    console.log(data);
			    _this.item = data;
			    let JsonBigstring = require('json-bigint')({
			      storeAsString: true,
			    });
			    _this.money = _this.item.amount / 100;
			    if (data.refundStatus == "" || data.refundStatus == null) {
			      _this.is_void = 0;
			    } else {
			      _this.is_void = 1;
			    }
			    let is_today = _this.isToday(new Date(data.capturedTime));
			    if (is_today == true) { //当天
			      _this.is_today = 1;
			    } else {
			      _this.is_today = 0;
			    }
			    console.log("is_today: " + _this.is_today);
					  console.log(data);
			    _this.vMainData.amount = data.amount;
			    _this.vMainData.oriReferenceNo = data.acquirerTransactionId;
			    _this.vMainData.oriTransactionType = data.transactionType;
				if(data.dcsCardPrintInfoDto && data.dcsCardPrintInfoDto.stan){
					_this.vMainData.oriVoucherNo = data.dcsCardPrintInfoDto.stan;
				}
					  
			    let storeInfo = uni.getStorageSync('storeInfo');
				  if(storeInfo){
					  console.log("storeInfo");
					  _this.merchantParams = {
						merchantId: storeInfo.dcsMerchantId, // 默认值  肯定DCS
						terminalId: storeInfo.dcsTerminalId, // 默认值  肯定DCS
						subMerchantCity: storeInfo.dcsSubMerchantCity,
						subMerchantId: storeInfo.dcsSubMerchantId,
						subTerminalId: storeInfo.dcsSubTerminalId,
						subMerchantName: storeInfo.dcsSubMerchantName,
						subMerchantCountryCode: storeInfo.dcsSubMerchantCountryCode
					  };
				  }else{
					  console.log("storeInfo_empty");
				  }
				  if(_this.type == "pay"){
					  if(_this.item.acquirerType == "SOLANA_PAY"){
						  _this.SOLANA_PAY_QR_URL = data.upnetworkDownloadUrl;
						  _this.SOLANA_PAY_DATA = data;
						  console.log(_this.SOLANA_PAY_QR_URL)
						  console.log(_this.SOLANA_PAY_DATA)
						  _this.$refs.SOLANA_PAY_uqrcode.remake({
							success: () => {
								
							},
							fail: err => {
							}
						  });
					  }else{
						  _this.startPrint(_this.item);
						 setTimeout(() => {
							let is_cli_pause_three_seconds = uni.getStorageSync('is_cli_pause_three_seconds');
							if(is_cli_pause_three_seconds == 'no'){
								uni.setStorageSync('is_cli_pause_three_seconds','two_dayin');
								_this.right_button_opacity = '0.3';
								_this.detail_three_seconds_1 = _this.$t('detail_three_seconds_3_1');
								_this.detail_three_seconds_2 = _this.$t('detail_three_seconds_3_2');
								_this.detail_three_seconds_color = '#0052D9';
								setTimeout(() => {
								  uni.navigateBack();
								}, _this.timeout_time);
							}
						 }, _this.timeout_time); 
					  }
				  }
			  }
			});
		}
      
    },
    filters: {
      convertNum(num) {
        if (num == '0.00') {
          return num
        }
        // 正则转换为千分位 1,234.56
        let n = num.toString().replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
        return n
      },
    },
    methods: {
      // 判断是否开启蓝牙
      judgeBluetooth() {
        // 主机模式
        return new Promise((resolve, reject) => {
          // mode: 'central',
          uni.openBluetoothAdapter({
            success: (r) => {
              console.log('蓝牙初始化成功')
              // 获取蓝牙的匹配状态
              uni.getBluetoothAdapterState({
                success: function(row) {
                  console.log('蓝牙状态：', row.available)
                  if (row.available) {
                    resolve()
                  } else {
                    // 请开启蓝牙
                    this.remindOpenBluetooth()
                    reject()
                  }
                },
                fail: function(err) {
                  // 请开启蓝牙
                  this.remindOpenBluetooth()
                  reject()
                },
              })
            },
            fail: (err) => {
              // 请开启蓝牙
              console.log('蓝牙初始化失败' + JSON.stringify(err))
              this.remindOpenBluetooth()
              reject()
            },
          })
        })
      },
      // 提示用户需要开启蓝牙
      remindOpenBluetooth() {
        this.bluetoothStatus = true
        uni.onBluetoothAdapterStateChange((blu) => {
          if (blu.available) {
            this.bluetoothStatus = false
          }
        })
      },
      issueRefund() {
        this.showInputPwd = true;
      },
      async submit() {
        if (!this.password) {
          uni.showToast({
            icon: 'none',
            title: this.$t('PasswordIsRequired'),
          })
          return;
        }
        
        utils.showLoading()
		let oo = {voidPassword: this.password,transactionId:this.id};
		let res_check = await api.validateRefundPasswordCard(oo);
		console.log(res_check)
		if(res_check.code == "000000"){
			let o = {voidPassword: this.password};
			let res = await api.validateRefundPassword(o)
			uni.hideLoading()
			if (res.code == '000000') {
			  this.returnPayment()
			} else {
			  utils.showText(res.message)
			}
		}else{
			utils.showText(res_check.message)
		}
		
		
      },
      cancel_dcs() {
        clearInterval(this.yi_dcs);
        this.yi_dcs = null;
        this.is_dcs_show = false;
        saleSm_quxiao.cancelCheckCard();
      },
      // 发起退款
      async returnPayment() {
        let _this = this;
        if (_this.item.acquirerType == 'DCS_CARD_NOW_PAY') {
          _this.is_dcs_show = true;
          _this.yi_dcs = null;
          let i = 0
          _this.yi_dcs = setInterval(() => {
            _this.money_type_icon = i
            i++
            if (i > 4) {
              i = 0
            }
          }, 2000);
          _this.startRefund()
        } else {
          utils.showLoading()
          let o = {
            acquirerType: _this.item.acquirerType,
            paymentTerminalRequestVo: {
              transactionId: _this.item.id + '',
              amount: _this.item.amount,
              actionType: 'REFUND',
            },
          }
          let res = await api.paymentPay(o)
          uni.hideLoading()
          if (res.code == '000000') {
            utils.showSuccess('Success')
            _this.showInputPwd = false;
            _this.printCurrent();
          } else {
            utils.showText(res.message)
          }
        }
      },
      /**
       * startRefund
       */

      startRefund() {
        let _this = this;
        console.log(this.vMainData);
        console.log('走到的退款');
        if (this.is_today == 1) {
          _this.cli_void();
        } else {
          _this.cli_refund();
        }
      },
      cli_void() {
        let _this = this;
        saleSmSaleVoid.saleVoid(_this.vMainData, (result) => {
          console.log(result);
          console.log("==========================")
          if (result['code'] == -100002) {
            _this.$global.addLog(JSON.stringify(_this.merchantParams), "merchantParams");

            initSunmi.setConfig(_this.merchantParams, (config) => {
              console.log("config==========config");
              console.log(config);
              if (config.code == 200) {
                _this.$global.addLog(JSON.stringify(config), "config");
                initSunmi.signOn((sign) => {
                  console.log("signOn==========signOn");
                  console.log(sign);
                  _this.$global.addLog(JSON.stringify(sign), "signOn");
                  if (sign.code == 200) {
                    _this.cli_void();
                  } else {
                    _this.error_info(sign.data);
                  }
                });
              } else {
                _this.error_info(sign.data);
              }
            });
          } else if (result['code'] == -100003) {
            initSunmi.signOn((sign) => {
              console.log("signOn==========signOn");
              console.log(sign);
              _this.$global.addLog(JSON.stringify(sign), "signOn");
              if (sign.code == 200) {
                _this.cli_void();
              } else {
                _this.error_info(sign.data);
              }
            });
          } else {
            console.log(result)
            console.log('ssssssssssssssssss')
            let rdata = result['data']
            if (
              (result['code'] === 201 && rdata['cardNo']) ||
              (result['code'] === 201 && rdata['uuid'])
            ) {
              if (result['code'] === 201 && rdata['cardNo']) {
                _this.vMainData['cardNo'] = rdata['cardNo']
              }
              _this.setManualKeyVoid();
            } else {
              _this.$global.addLog(JSON.stringify(result))
              uni.showModal({
                title: '温馨提示',
                content: rdata.data,
                showCancel: false,
              })
            }
            _this.is_dcs_show = false;
            clearInterval(_this.yi_dcs);
            _this.yi_dcs = null;
          }
        });
      },
      setManualKeyVoid() {
        let _this = this;
        saleSmSaleVoid.setManualKey(_this.vMainData, (result) => {
          let rdata = result['data']
          console.log('!!!!!!!!!!!')
          console.log(result)
          if (rdata.sale) {
            _this.error_info(rdata.sale);
          } else {
            if (result.code == '204' && result.message == 'onAppFinalSelect') {
              saleSmSaleVoid.confirmAppFinalSelect(true);
            } else if (result.code == '204' && result.message == 'onConfirmCardNo') {
              saleSmSaleVoid.confirmCardNo(true);
            } else {
              if (result.code == '205' && rdata.status == 'success' && rdata.result.answerCode == '00') {
                console.log(444444444444)
				saleSmSaleVoid.cardOff();
                _this.paySuccess(rdata)
              } else {
                _this.$global.addLog(JSON.stringify(result))
                uni.showModal({
                  title: '温馨提示',
                  content: rdata,
                  showCancel: false,
                });
              }
            }
          }
        })
      },
      cli_refund() {
        let _this = this;
        initSunmi.setRefundAndPreAuthFlag(true, false, (res) => {
          if (res['code'] == 200) {
            saleSmRefund.startRefund(this.vMainData, (result) => {
              console.log(result);
              console.log("==========================")
              if (result['code'] == -100002) {
                _this.$global.addLog(JSON.stringify(this.merchantParams), "merchantParams");
                initSunmi.setConfig(this.merchantParams, (config) => {
                  console.log("config==========config");
                  console.log(config);
                  if (config.code == 200) {
                    _this.$global.addLog(JSON.stringify(config), "config");
                    initSunmi.signOn((sign) => {
                      console.log("signOn==========signOn");
                      console.log(sign);
                      _this.$global.addLog(JSON.stringify(sign), "signOn");
                      if (sign.code == 200) {
                        _this.startRefund();
                      } else {
                        _this.error_info(sign.data);
                      }
                    });
                  } else {
                    _this.error_info(sign.data);
                  }
                });
              } else if (result['code'] == -100003) {
                initSunmi.signOn((sign) => {
                  console.log("signOn==========signOn");
                  console.log(sign);
                  _this.$global.addLog(JSON.stringify(sign), "signOn");
                  if (sign.code == 200) {
                    _this.startRefund();
                  } else {
                    _this.error_info(sign.data);
                  }
                });
              } else {
                console.log(result)
                console.log('ssssssssssssssssss')
                let rdata = result['data']
                if (
                  (result['code'] === 201 && rdata['cardNo']) ||
                  (result['code'] === 201 && rdata['uuid'])
                ) {
                  if (result['code'] === 201 && rdata['cardNo']) {
                    _this.vMainData['cardNo'] = rdata['cardNo']
                  }
                  _this.setManualKeyRefund()
                } else {
                  _this.$global.addLog(JSON.stringify(result))
                  uni.showModal({
                    title: '温馨提示',
                    content: rdata.data,
                    showCancel: false,
                  })
                }
                _this.is_dcs_show = false;
                clearInterval(_this.yi_dcs);
                _this.yi_dcs = null;
              }
            });
          } else {
            _this.error_info(res.message);
          }
        });
      },
      setManualKeyRefund() {
        let _this = this;
        saleSmRefund.setManualKey(_this.vMainData, (result) => {
          let rdata = result['data']
          console.log('!!!!!!!!!!!')
          console.log(result)
          if (rdata.sale) {
            _this.error_info(rdata.sale);
          } else {
            if (result.code == '204' && result.message == 'onAppFinalSelect') {
              saleSmRefund.confirmAppFinalSelect(true);
            } else if (result.code == '204' && result.message == 'onConfirmCardNo') {
              saleSmRefund.confirmCardNo(true);
            } else {
              if (result.code == '205' && rdata.status == 'success' && rdata.result.answerCode == '00') {
                console.log(555555555555);
				saleSmRefund.cardOff();
                _this.paySuccess(rdata);
              } else {
                _this.$global.addLog(JSON.stringify(result))
                uni.showModal({
                  title: '温馨提示',
                  content: rdata,
                  showCancel: false,
                });
              }
            }
          }
        })
      },
      paySuccess(data) {
        let _this = this;
        console.log('@@@@@@@@@@@@@')
        console.log(data)
        let store = uni.getStorageSync('storeInfo') || {}

        let o = {
          acquirerType: this.item.acquirerType,
          paymentTerminalRequestVo: {
            transactionId: this.item.id + '',
            amount: this.item.amount,
            actionType: 'REFUND',
          },
        }

        api.paymentPay(o).then((res) => {
          console.log(res, '-------------------------')
          console.log(res.code, '-------------------------')
          if (res.code == '000000') {
            let refundId = res.data.refundId
            console.log(refundId)
            let oo = {
              refundId: refundId,
              refundStatus: 'success',
              errorMessage: 'sucess',
              acquirerRefundId: this.vMainData.oriReferenceNo, // 取什么值？
            }
            console.log('&&&&&&&&&&&&&&&&&')
            console.log(oo)

            api.updateDcsCardPayRefundTransaction(oo).then((rres) => {
              console.log(rres, '-------------------------')
              if (rres.code == '000000') {
                utils.showSuccess('Success')
                _this.showInputPwd = false;
                setTimeout(() => {
                  _this.printCurrent();
                }, 1000)
              } else {
                utils.showText(result.message)
              }
            })
          } else {
            utils.showText(result.message)
          }
        })
      },
      getVal(e) {
        console.log(e)
        this.password = e.detail.value
      },
      printCurrent() {
        //let item = _.cloneDeep(this.item)
        let _this = this;
        let o = {
          id: _this.id
        };
        console.log(o);
        api.selectTransactionById(o).then((res) => {
          if (res.code == '000000') {

            let data = res.data;
            _this.item = data;

            console.log(_this.item);
            let is_void = false;
            let times = 1;
            if (_this.item.refundStatus == "" || _this.item.refundStatus == null) {

            } else {
              is_void = true;
              times = 2;
            }
            if (_this.item.acquirerType == "DCS_CARD_NOW_PAY") {
              _this.newPrintTextDcs(_this.item, times, is_void, _this.dcs_base64);
            } else {
              _this.newPrintText(_this.item, times, true, is_void);
            }
          }


        });
      },
      error_info(data) {
        this.is_dcs_show = false;
        clearInterval(this.yi_dcs);
        this.yi_dcs = null;
        uni.showModal({
          title: '温馨提示',
          content: data,
          showCancel: false,
        });
      },
      back() {
        uni.navigateBack();
      },
      isToday(date) {
        const today = new Date();
        return date.getFullYear() === today.getFullYear() &&
          date.getMonth() === today.getMonth() &&
          date.getDate() === today.getDate();
      },
	  pause_three_seconds(){
		  let _this = this;
		  let is_cli_pause_three_seconds = uni.getStorageSync('is_cli_pause_three_seconds');
		  if(is_cli_pause_three_seconds == 'no'){
			  uni.setStorageSync('is_cli_pause_three_seconds', 'yes');
			  _this.button_right_size = _this.$t('button_right_size_2');
			  _this.two_paper_img = 'two_paper_2.png';
			  _this.right_button_border_color = '#9A9A9A';
			  _this.right_button_background_color = '#F1F1F1';
			  _this.button_right_size_color = '#6B6B6B';
			  _this.detail_three_seconds_1 = _this.$t('detail_three_seconds_2_1');
			  _this.detail_three_seconds_2 = _this.$t('detail_three_seconds_2_2');
			  _this.detail_three_seconds_color = '#E34D59';
			  setTimeout(() => {
			  	uni.navigateBack();
			  }, _this.timeout_time);
		  }
	  },
	  startPrintDcs(item) {
	    let _this = this;
	    _this.newPrintTextDcs(item, 2, false, _this.dcs_base64)
	  },
	  startPrint(item) {
	    let _this = this;
		console.log(item.acquirerType);
	    if (item.acquirerType == 'DCS_CARD_NOW_PAY') {
	      _this.newPrintTextDcs(item, 2, false, _this.dcs_base64)
	    } else {
	      if (item.acquirerType == "SOLANA_PAY") {
	        _this.$refs.SOLANA_PAY_uqrcode.toTempFilePath({
	          success: res => {
	            const path = plus.io.convertLocalFileSystemURL(res.tempFilePath)
	            const fileReader = new plus.io.FileReader()
	            fileReader.readAsDataURL(path)
	            fileReader.onloadend = (res) => {
	              //console.log(res.target.result,'base64图片流') //输出base64内容
	              _this.newPrintText(item, 2, false, false, '', res.target.result);
	            }
	    
	          }
	        });
	      } else {
	        _this.newPrintText(item, 2, '');
	      }
	    }
	  },
	  uqrcodeComplete(val) {
		let _this = this;
	    // 二维码生成完成 { success: true | false }
	    //console.log('二维码生成完成',val)
	    //console.log(this.SOLANA_PAY_DATA);
	    //this.success_url(this.SOLANA_PAY_DATA);
	    // 如果 val.success 为 true 则表示二维码生成成功 可以执行其他操作
		
		_this.startPrint(_this.SOLANA_PAY_DATA);
		setTimeout(() => {
			let is_cli_pause_three_seconds = uni.getStorageSync('is_cli_pause_three_seconds');
			if(is_cli_pause_three_seconds == 'no'){
				uni.setStorageSync('is_cli_pause_three_seconds','two_dayin');
				_this.right_button_opacity = '0.3';
				_this.detail_three_seconds_1 = _this.$t('detail_three_seconds_3_1');
				_this.detail_three_seconds_2 = _this.$t('detail_three_seconds_3_2');
				_this.detail_three_seconds_color = '#0052D9';
				setTimeout(() => {
				  uni.navigateBack();
				}, _this.timeout_time);
			}
		}, _this.timeout_time); 
	  },

    },
  }
</script>

<style lang="scss" scoped>
  @import 'detail.scss';

  .uni-modal__textarea {
    height: 70rpx;
    text-align: left;
    width: 100%;
    box-sizing: border-box;
    padding-left: 56rpx;
    background: transparent !important;
    margin-bottom: 20rpx;
    font-size: 40rpx;
  }
</style>