<template>
  <view class="pay">
    <!-- 顶部head -->
    <view class="sun-header" :style="isSmallScreen ? 'height:94px;padding-top:95rpx':'‘'">
      <view class="sidebar" @click="openSidebar"></view>
      <image class="side" src="/static/images/icon/sidebar.png" @click="openSidebar" mode=""></image>
      <image class="logo" src="/static/images/icon/logo.png" mode=""></image>
      <image style="opacity: 0;" class="scan" src="/static/images/icon/scan.png" mode=""></image>
    </view>
    <!-- 金额 -->
    <view class="pay-money" :style="isSmallScreen ? 'height:84px':'‘'">
      <view class="symbol">$ </view>
      <view>{{ money | convertNum }}</view>
    </view>
    <!-- 金额键盘 -->
    <view class="keyboard">
      <view class="keyboard-item" :class="item == 'C' ? 'red' : ''" :style="'height:' + keyHeight + 'px'"
        v-for="(item, index) in keyList" :key="index" @touchend="updateMoney(item)">
        <span v-if="item != 'del'">{{ item }}</span>
        <image v-else src="/static/images/icon/del.png" mode="" style="width: 64rpx; height: 54rpx"></image>
      </view>
    </view>
    <!-- 支付方式 小屏幕 -->

    <view class="pay-type-samll" v-if="isSmallScreen">
      <view class="item" @click="openScan(DCS_CARD_NOW_PAY)">
        <!-- 大的按钮 -->
        <image class="big-image"
          :src="IS_DCS_CARD_NOW_PAY == false ? '/static/images/new-icon-1/Visa-master-dark.png' : '/static/images/new-icon-1/Visa-master.png'"
          mode="scaleToFill"></image>
      </view>
      <view class="item small-right">
        <view class="card" @click="openScan(ALI_MERCHANT_SCAN_USER_QR_PAY)">
          <image
            :src="IS_ALI_MERCHANT_SCAN_USER_QR_PAY == false ? '/static/images/new-icon-1/AliPay+-dark.png' : '/static/images/new-icon-1/AliPay+.png'"
            mode="scaleToFill"></image>
        </view>
        <view class="card" @click="openScan(GRAB_MERCHANT_PRESENTED_QR_PAY_LATER)">
          <image
            :src="IS_GRAB_MERCHANT_PRESENTED_QR_PAY_LATER == false ? '/static/images/new-icon-1/Grab-pay-dark.png' : '/static/images/new-icon-1/Grab-pay.png'"
            mode="scaleToFill"></image>
        </view>
        <view class="card" @click="openScan(WECHAT_MERCHANT_SCAN_USER_QR_PAY)">
          <image
            :src="IS_WECHAT_MERCHANT_SCAN_USER_QR_PAY == false ? '/static/images/new-icon-1/wechat-dark.png' : '/static/images/new-icon-1/wechat.png'"
            mode="scaleToFill"></image>
        </view>
        <view class="card" @click="openScan(DBS_PAY_NOW_MERCHANT_PRESENTED_QR_PAY)">
          <image
            :src="IS_DBS_PAY_NOW_MERCHANT_PRESENTED_QR_PAY == false ? '/static/images/new-icon-1/Paynow-dark.png' : '/static/images/new-icon-1/Paynow.png'"
            mode="scaleToFill"></image>
        </view>
      </view>
    </view>
    <!-- 支付方式 大屏幕-->
    <view class="pay-type" v-if="!isSmallScreen">
      <view @click="openScan(DCS_CARD_NOW_PAY)" class="item">
        <!-- 大的按钮 -->
        <image
          :src="IS_DCS_CARD_NOW_PAY == false ? '/static/images/new-icon/card-disabled.png' : '/static/images/new-icon/card.png'"
          mode="scaleToFill"></image>
      </view>
      <!-- 右侧固定两个 -->
      <view class="item-right">
        <view @click="openScan(ALI_MERCHANT_SCAN_USER_QR_PAY)" class="item">
          <image
            :src="IS_ALI_MERCHANT_SCAN_USER_QR_PAY == false ? '/static/images/new-icon/AliPay+-dark.png' : '/static/images/new-icon/AliPay+.png'"
            mode="scaleToFill"></image>
        </view>
        <view @click="openScan(GRAB_MERCHANT_PRESENTED_QR_PAY_LATER)" class="item">
          <image
            :src="IS_GRAB_MERCHANT_PRESENTED_QR_PAY_LATER == false ? '/static/images/new-icon/Grab-pay-dark.png' : '/static/images/new-icon/Grab-pay.png'"
            mode="scaleToFill"></image>
        </view>
      </view>
      <view @click="openScan(DBS_PAY_NOW_MERCHANT_PRESENTED_QR_PAY)" class="item">
        <image
          :src="IS_DBS_PAY_NOW_MERCHANT_PRESENTED_QR_PAY == false ? '/static/images/new-icon/Paynow-dark.png' : '/static/images/new-icon/Paynow.png'"
          mode="scaleToFill"></image>
      </view>

      <view @click="openScan(WECHAT_MERCHANT_SCAN_USER_QR_PAY)" class="item">
        <image
          :src="IS_WECHAT_MERCHANT_SCAN_USER_QR_PAY == false ? '/static/images/new-icon/wechat-dark.png' : '/static/images/new-icon/wechat.png'"
          mode="scaleToFill"></image>
      </view>

      <!-- 测试按钮 这里改个判断 -->
      <view @click="openScanTest(SOLANA_PAY)" class="item">
        <image
          :src="IS_SOLANA_PAY == false ? '/static/images/new-icon/upnetwork-disabled.png' : '/static/images/new-icon/upnetwork-1.png'"
          mode="scaleToFill"></image>
      </view>
    </view>
    <!-- 支付中 -->
    <view class="paying" v-if="showPaying">
      <view class="pay-mask"></view>
      <view class="pay-img" v-if="payTimeout == false">
        <image v-if="locale == 'en'" src="/static/images/pay/paying-en.png" mode="widthFix"></image>
        <image v-else src="/static/images/pay/paying-zh.png" mode="widthFix"></image>
      </view>
      <view class="pay-img" v-else @click="cli_clo_showPaying()">
        <image v-if="locale == 'en'" src="/static/images/pay/close-en.png" mode="widthFix"></image>
        <image v-else src="/static/images/pay/close-zh.png" mode="widthFix"></image>
      </view>
    </view>

    <!-- 失败弹框 -->
    <view class="paying" v-if="showErrorPay">
      <view class="pay-mask"></view>
      <view class="pay-img pay-con">
        <view class="pay-icon">
          <image src="/static/images/pay/error.png" mode="widthFix"></image>
        </view>
        <view class="pay-title">{{ $t('Error') }}</view>
        <view class="pay-desc">{{ errorPayDesc }}</view>
        <view class="pay-btn" @click="showErrorPay = false">{{$t('ErrorBtn')}}</view>
      </view>
    </view>

    <view class="head-card" v-if="is_dcs_show">
      <!-- <sun-header :title="$t('log.headTitle')"></sun-header> -->
      <view class="img">
        <image v-for="(item, index) in 5" :key="index" class="svg" v-if="index == money_type_icon"
          :src="`/static/images/headCard/hand-card-${index + 1}.svg`" mode="">
        </image>
      </view>
      <view class="t1">{{$t('total_size')}}</view>
      <view class="t2"> S${{ money | convertNum }} </view>
      <view class="t3">{{$t('tap_click')}}</view>
      <view class="footer-btn" @click="cancel_dcs(1)">{{$t('tap_to_cancel')}}</view>
	  <view v-if="is_dcs_check_status == 1" class="t3">{{$t('tap_check_status_1')}}</view>
	  <view v-if="is_dcs_check_status == 1" class="t3">{{$t('tap_check_status_2')}}</view>
	  <view v-if="is_dcs_check_status == 1" class="footer-btn-two" @click="check_status_dcs">{{$t('check_status')}}</view>
    </view>

    <!-- GrabPay 支付 -->
    <view class="grabPay" :style="'padding-top:'+grabPayPaddingTop+'px;'" v-show="showGrabPay">
      <view class="" v-if="locale == 'zh'">
        <view class="g-title">请使用支持该支付渠道的应用</view>
        <view class="g-title">扫描下方二维码并完成支付</view>
      </view>
      <view class="" style="width: 90%;margin: 0 auto;" v-else>
        <view class="g-title">Please scan the QR code with the relevant app to make the payment</view>
      </view>

      <view class="g-qr">
        <!-- <image class="g-scan" src="/static/images/pay/scan.png" mode="widthFix"></image> -->
        <uqrcode v-if="
            payMentType == 'GrabPay' || 
            payMentType == 'BTC_PAY' || 
            payMentType == 'SOLANA_PAY' || 
            payMentType == 'ETHEREUM_PAY'
          " ref="uqrcode" canvas-id="qrcode" :value="qr_url" :size="qrSize" :options="{ margin: 10 }"></uqrcode>
        <image v-else :style="'width: '+qrSize+'px; height: '+qrSize+'px'" class="g-scan"
          :src="'data:image/jpeg;base64,' + qr_url" mode="widthFix"></image>
      </view>
      <view class="g-status-image" v-if="locale == 'zh'">
        <image :style="'width:'+note_image_width+'%;'" class="note-image" src="/static/images/pay/note-CN.svg"
          mode="widthFix"></image>
      </view>
      <view class="g-status-image" v-else>
        <image :style="'width:'+note_image_width+'%;'" class="note-image" src="/static/images/pay/note-EN.svg"
          mode="widthFix"></image>
      </view>
      <view class="g-button" @click="hideQrcode">{{ $t('grab.b') }}</view>

      <view v-if="!isSmallScreen" class="bottom-logo">
        <image src="/static/images/login/bottom-logo.svg" mode=""></image>
      </view>
    </view>

    <!-- 侧边栏 -->
    <sidebar v-show="showSidebar" :version="versionCode" :status="showSidebar" @close="closeSidebar"></sidebar>
  </view>
</template>

<script>
  import sidebar from '@/components/sidebar/sidebar.vue'
  import api from '@/utils/api/index.js'
  import {
    refreshToken
  } from '@/config/config.js'
  import utils from '@/utils/util.js'
  import music from '@/utils/music/music.js'
  import sunHeader from '@/components/sun-header/sun-header.vue'
  const initSunmi = uni.requireNativePlugin('Hd-InitSunmiModule');
  const saleSm = uni.requireNativePlugin('Hd-SaleSmModule');
  const scanner = uni.requireNativePlugin('Ba-Scanner');
  const HceSunmi = uni.requireNativePlugin('HL-HceSunmiModule');
  
  export default {
    name: 'pay',
    components: {
      sidebar,
      sunHeader,
    },
    data() {
      return {
		is_click_keyboard:1,
		timeout_time:800,
        bluetoothStatus: false,
        payStatusTimer: null,
        money: '0.00',
		money_check:'0.00',
		money_success:0,
        // payTypeHeight: 80,
        keyHeight: 70,
        inputMoney: [],
        keyList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 'C', 0, 'del'],
        // 'GrabPay', 'AliPay+', 'wechat'
        payTypeList: [],
        showSidebar: false,

        systemInfo: '',
        showPaying: false,
        payTimeoutTemp: null, // 支付超时 定时器
        payTimeout: false,
        showErrorPay: false,
        errorPayDesc: '',

        iconRootPath: '/static/sj',
        wgtConfig: {}, // 升级配置
        locale: 'zh',
        description: '',
        isShowupgrade: false,
        pushClientid: '',

        versionCode: '100',
        showGrabPay: false,

        showOtherPay: false,
        //二维码相关参数
        modal_qr: false,
        qr_url_test: 'https://www.baidu.com/', // 要生成的二维码值
        qr_url: '', // 要生成的二维码值
        onlyContentId: '',

        payMentType: '',
        grabPayPaddingTop: 65,
        qrMb: 20,
        grabMb: 0,
        qrSize: 280,
        note_image_width: 100,

        transactionArr: [],
        windowWidth: 0,
        is_lunxun: 0,
        manual_key_btn: 'Manual Key',
        money_type_icon: 0, // 5个图片
        is_dcs_show: false,
        yi_dcs: null,
        uniWebOrderId: '',
        vMainData: {
          amount: 0,
          tips: 0,
          orderId: '',
          cardNo: '',
          cardExpDate: '',
          cardCvv: '',
        },
        
        dcs_base64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAYAAAABPCAIAAABtbIU9AAAACXBIWXMAAAsTAAALEwEAmpwYAAAFu2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNy4yLWMwMDAgNzkuMWI2NWE3OSwgMjAyMi8wNi8xMy0xNzo0NjoxNCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIzLjUgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAyNC0xMC0wNVQxNjo1MzowNyswODowMCIgeG1wOk1vZGlmeURhdGU9IjIwMjQtMTAtMDVUMTg6MTQ6NDArMDg6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjQtMTAtMDVUMTg6MTQ6NDArMDg6MDAiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOmM1MDBhZmViLWFmMWMtNjc0MC05YzFlLTkxNzY4NTJkYTY3YiIgeG1wTU06RG9jdW1lbnRJRD0i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',
        cryptoBtcAddress: '',
        cryptoSolanaAddress: '',
        cryptoEthereumAddress: '',
        DBS_PAY_NOW_MERCHANT_PRESENTED_QR_PAY: {},
        WECHAT_MERCHANT_SCAN_USER_QR_PAY: {},
        ALI_MERCHANT_SCAN_USER_QR_PAY: {},
        GRAB_MERCHANT_PRESENTED_QR_PAY_LATER: {},
        DCS_CARD_NOW_PAY: {},
        SOLANA_PAY: {},
        IS_DBS_PAY_NOW_MERCHANT_PRESENTED_QR_PAY: false,
        IS_WECHAT_MERCHANT_SCAN_USER_QR_PAY: false,
        IS_ALI_MERCHANT_SCAN_USER_QR_PAY: false,
        IS_GRAB_MERCHANT_PRESENTED_QR_PAY_LATER: false,
        IS_DCS_CARD_NOW_PAY: false,
        IS_SOLANA_PAY: false,

        ETHEREUM_PAY: {
          acquirerType: 'ETHEREUM_PAY'
        },
        SOLANA_PAY: {
          acquirerType: 'SOLANA_PAY'
        },
        BTC_PAY: {
          acquirerType: 'BTC_PAY'
        },

        // 是否小屏幕
        isSmallScreen: false,
        is_nfc: 0,
		is_nfc_write_success:0,
		cli_pay_time:'',
		is_dcs_check_status:0,
		yi_dcs_check_status:null,
		dcs_check_status_icon:0,
		startPayTimeout:null,
		startPay:0,
		pushId:0,
      }
    },
    filters: {
      convertNum(num) {
        if (num == '0.00') {
          return num
        }
        // 正则转换为千分位 1,234.56
        let n = num.replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
        return n
      },
    },
    onShow() {
		let _this = this;
		_this.onInstall();
		let token = uni.getStorageSync('Authorization');
		let terminalId = uni.getStorageSync('terminalId');		
		if (!token || !terminalId) {
		  
		}else{
			_this.startPayTimeout = setInterval(() => {
				if(_this.startPay == 0){
					_this.startPay = 1;
					_this.selectLoginTerminalDtoBySerialNumber();
				}
			}, 2000);
		}
		
    },
	onHide(){
		let _this = this;
		clearInterval(_this.startPayTimeout);
		_this.startPayTimeout = null;
		console.log("xxxxxxxxxxxxxxx");
	},
    mounted() {
      let _this = this;
	  initSunmi.getSn((res) => {
		  if (res.code === 200) {
			let shebei = res.data;  
			  uni.setStorageSync('MOT-SUNMISN', shebei)
		  }else{
			  uni.setStorageSync('MOT-SUNMISN', '')
		  }
	  });
	  
      let systemInfo = uni.getSystemInfoSync('systemInfo');
      //systemInfo.deviceModel = "P3";
      if (systemInfo.deviceModel == "P2_SE") {
        _this.isSmallScreen = true;
        _this.qrSize = 200;
        _this.grabPayPaddingTop = 20;
        _this.note_image_width = 80;
      } else {
        _this.qrSize = 300;
        _this.grabPayPaddingTop = 65;
        _this.note_image_width = 100;
        _this.isSmallScreen = false;
      }

		let o = {terminalId:uni.getStorageSync('terminalId'),detail:JSON.stringify(uni.getSystemInfoSync('systemInfo'))};
		_this.$global.addLog(JSON.stringify(o), 'addSystemLog');
      // 测试
      /*
      let a =
        `eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJQMzAyUDQxTDEwMDc4IiwidGVybWluYWxEdG8iOiJ7XCJjcmVhdGlvblRpbWVcIjpcIjIwMjQtMDQtMDQgMTE6MTk6MzRcIixcImRlbGV0ZWRTdGF0dXNcIjpcIk5PXCIsXCJpZFwiOjEyMjU0MDQzOTE3MDA2OTI5OTIsXCJsYXN0QWN0aXZlVGltZVwiOlwiMjAyNC0wNC0wNCAxMToxOTozM1wiLFwibGFzdFVwZGF0ZVRpbWVcIjpcIjIwMjQtMTAtMjEgMDk6NDE6MjlcIixcIm93bmVyc2hpcFwiOlwiVGFuZ3MgVFBcIixcInNlcmlhbE51bWJlclwiOlwiUDMwMlA0MUwxMDA3OFwiLFwic3RvcmVJZFwiOjEwODAxNzIyODM2MzA1ODM4MDh9IiwibmJmIjoxNzI5NTA2MTA1LCJkZXZpY2VUb2tlbkR0byI6IntcImNyZWF0aW9uVGltZVwiOlwiMjAyNC0xMC0yMSAxODoxMzoxNFwiLFwiZGVsZXRlZFN0YXR1c1wiOlwiTk9cIixcImlkXCI6MTI5Nzk4NjA2OTkyNDU0NDUxMixcImxhc3RVcGRhdGVUaW1lXCI6XCIyMDI0LTEwLTIxIDE4OjEzOjE0XCIsXCJzdGF0dXNcIjpcIm5ld1wiLFwic3RvcmVJZFwiOjEwODAxNzIyODM2MzA1ODM4MDgsXCJ0b2tlblwiOlwiOVVFOTFBSkZFUFwifSIsInRlcm1pbmFsSWQiOiIxMjI1NDA0MzkxNzAwNjkyOTkyIiwiZXhwIjoyMDQ0ODY2MTA1fQ.nEj8KzINk9isERbm0NroE146XjxZ4Wz45THPCyQvivCSO9E1KXjIwczY7nfa2CUZbUkCPJ1Tzz2no9lUy6PTMQIjZLOZVI0YkPsQFGBAtNMGLCeB5Ghe59kdTTrspybqL1nOpiF9L7VRbPUcyC2IoJudKvwIygZmeuaA74i1u54DyBc5Fu2bEunzU40ug9fCHKbYuUj5VjOu59uQRowCjBWUDYw1DA47lM0r3bta0vjS-gtAwP_lo5lGxDe7GsVXKaw_-IbeuB6CHciJzRXHRjVkVxEmLdxoU8NkdhyrBNx2i_vXdwQCiI3DLb9ORfOTWVlLyIuoyvKqJ-MsB-Y_sQ`
      uni.setStorageSync('Authorization', a)
      uni.setStorageSync('terminalId', '1225404391700692992')
      //uni.setStorageSync('MOT-SUNMISN', 'P302P41L10078')
	  */
      let token = uni.getStorageSync('Authorization');
      let terminalId = uni.getStorageSync('terminalId');
      console.log(terminalId, 'terminalId');
      console.log(token);
      if (!token || !terminalId) {
        uni.reLaunch({
          url: '/pages/login/login',
        });
      } else {
        _this.getStoreName();
        _this.selectAcquirerStoreDtoWithAcquirer();
		_this.getCryptoData();
		
		HceSunmi.iniPaySDK();
		setTimeout(function() {
			HceSunmi.getSysParam("NFC", (result) => {
				console.log("is_nfc");
				console.log(result)
				if(result.data){
					if(result.data == "11"){
						_this.is_nfc = 1;
						_this.$global.addLog("is_nfc_success", 'is_nfc');
					}else{
						_this.$global.addLog("is_nfc_error_1", 'is_nfc');
					}
				}else{
					_this.$global.addLog("is_nfc_error_1", 'is_nfc');
				}
				//{"data": "11","message": "success","code": 200}
			});
		},1000);
		
      }
    },
    methods: {
		async getStoreName() {
			let res = await api.storeInfo({})
			if (res.code == '000000') {
				let data = res.data;
				uni.setStorageSync('storeName', data.name)
			}
		},
		async selectLoginTerminalDtoBySerialNumber() {
			let _this = this;
			let o = {serialNumber: uni.getStorageSync('MOT-SUNMISN')};
			let res = await api.selectLoginTerminalDtoBySerialNumber(o);
			if (res.code == '000000') {
				let data = res.data;
				console.log(data);
				//_this.$global.addLog(JSON.stringify(data),"push_init");
				if(data.terminalName == "POS"){
					_this.selectTerminalPushTransactionDto(data.storeId);
				}else{
					_this.startPay = 0;
				}
			}
		},
		async selectTerminalPushTransactionDto(storeId){
			let _this = this;
			let o = {serialNumber: uni.getStorageSync('MOT-SUNMISN'),storeId:storeId};
			let res = await api.selectTerminalPushTransactionDto(o);	
			if (res.code == '000000') {
				if(res.data){
					let data = res.data;
					if(data.acquirerType && data.pushId){
						console.log(data);
						console.log("wwwwwwwwwwwwwwwwwwww");
						//_this.$global.addLog(JSON.stringify(data),"push");
						if(data.acquirerType == "DCS_CARD_NOW_PAY" || 
						data.acquirerType == "ALI_MERCHANT_SCAN_USER_QR_PAY" || 
						data.acquirerType == "WECHAT_MERCHANT_SCAN_USER_QR_PAY" || 
						data.acquirerType == "GRAB_MERCHANT_PRESENTED_QR_PAY_LATER" || 
						data.acquirerType == "DBS_PAY_NOW_MERCHANT_PRESENTED_QR_PAY" || 
						data.acquirerType == "SOLANA_PAY"){
							_this.pushId = data.pushId;
							data.storeCurrency = data.currency;
							let amount = parseInt(data.amount);
							_this.inputMoney = _this.numberToArray(amount);
							_this.updateMoneyAgain();
							_this.money_check = amount;						
						}
						if(data.acquirerType == "DCS_CARD_NOW_PAY"){
							_this.DCS_CARD_NOW_PAY = data;
							_this.IS_DCS_CARD_NOW_PAY = true;
							_this.openScan(_this.DCS_CARD_NOW_PAY,1);
							
						}else if(data.acquirerType == "ALI_MERCHANT_SCAN_USER_QR_PAY"){
							_this.ALI_MERCHANT_SCAN_USER_QR_PAY = data;
							_this.IS_ALI_MERCHANT_SCAN_USER_QR_PAY = true;
							_this.openScan(_this.ALI_MERCHANT_SCAN_USER_QR_PAY,1);
							
						}else if(data.acquirerType == "WECHAT_MERCHANT_SCAN_USER_QR_PAY"){
							_this.WECHAT_MERCHANT_SCAN_USER_QR_PAY = data;
							_this.IS_WECHAT_MERCHANT_SCAN_USER_QR_PAY = true;
							_this.openScan(_this.WECHAT_MERCHANT_SCAN_USER_QR_PAY,1);
							
						}else if(data.acquirerType == "GRAB_MERCHANT_PRESENTED_QR_PAY_LATER"){
							_this.GRAB_MERCHANT_PRESENTED_QR_PAY_LATER = data;
							_this.IS_GRAB_MERCHANT_PRESENTED_QR_PAY_LATER = true;
							_this.openScan(_this.GRAB_MERCHANT_PRESENTED_QR_PAY_LATER,1);
							
						}else if(data.acquirerType == "DBS_PAY_NOW_MERCHANT_PRESENTED_QR_PAY"){
							_this.DBS_PAY_NOW_MERCHANT_PRESENTED_QR_PAY = data;
							_this.IS_DBS_PAY_NOW_MERCHANT_PRESENTED_QR_PAY = true;
							_this.openScan(_this.DBS_PAY_NOW_MERCHANT_PRESENTED_QR_PAY,1);
							
						}else if(data.acquirerType == "SOLANA_PAY"){
							_this.SOLANA_PAY = data;
							_this.IS_SOLANA_PAY = true;
							_this.openScanTest(_this.SOLANA_PAY,1);
							
						}else{
							_this.pushId = 0;
							_this.startPay = 0;
						}
						
					}else{
						_this.pushId = 0;
						_this.startPay = 0;
					}
				}else{
					_this.pushId = 0;
					_this.startPay = 0;
				}
			}else{
				_this.pushId = 0;
				_this.startPay = 0;	
			}
		},
		async getCryptoData() {
			let _this = this;
			let res = await api.getCryptoData({});
			if (res.code == '000000') {
				_this.cryptoBtcAddress = res.data.cryptoBtcAddress;
				_this.cryptoSolanaAddress = res.data.cryptoSolanaAddress;
				_this.cryptoEthereumAddress = res.data.cryptoEthereumAddress;
			}
		},
      selectStoreDcsConfigurationList() {
        let _this = this;
        let o = {serialNumber: uni.getStorageSync('MOT-SUNMISN')};
        _this.$global.addLog(JSON.stringify(o));
        console.log(o);
        api.selectStoreDcsConfigurationList(o).then((store) => {
          _this.$global.addLog(JSON.stringify(store),'selectStoreDcsConfigurationList');
          console.log(store);
          console.log('***************');

          if (store.code == '000000') {
            _this.storeInfo = store.data
            uni.setStorageSync('storeInfo', store.data)
            initSunmi.initSdk('702', '702', (result) => {
              console.log('init==========init');
              console.log(result);
              console.log('init==========init');
              _this.$global.addLog(JSON.stringify(result), 'shangmi_init');
            });
          } else {
            if (store.code == 500002) {
              uni.removeStorageSync('terminalId')
              uni.removeStorageSync('Authorization')
              uni.reLaunch({
                url: '/pages/login/login',
              })
            } else {
              uni.showModal({
                title: _this.$t('tips'),
                content: store.message,
                showCancel: false,
              })
            }
          }
        });
      },
      // 刷卡功能实现
      async paymentCard() {
        let _this = this;
        _this.vMainData.amount = 0
        _this.vMainData.tips = 0
        _this.vMainData.orderId = ''
        _this.vMainData.cardNo = ''
        _this.vMainData.cardExpDate = ''
        _this.vMainData.cardCvv = ''
        _this.uniWebOrderId = ''
		
        saleSm.cancelCheckCard();
        _this.acquirerType = 'DCS_CARD_NOW_PAY';
        _this.is_dcs_show = true;
        _this.yi_dcs = null;
        let i = 0;
        //图片轮播
        _this.yi_dcs = setInterval(() => {
          _this.money_type_icon = i;
          i++;
          if (i > 4) {i = 0;}
        }, 2000);
		
        let o = {
          acquirerType: 'DCS_CARD_NOW_PAY',
          paymentTerminalRequestVo: {
            amount: _this.money_check,
            currency: 'SGD',
            actionType: 'PAY',
          },
        }
		
		if(_this.pushId != 0){
			o.paymentTerminalRequestVo.pushId = _this.pushId;
		}
		
		_this.$global.addLog(JSON.stringify(o), 'paymentPayInit')
        let res = await api.paymentPay(o)
        _this.$global.addLog(JSON.stringify(res), 'paymentPay');
        if (res.code == '000000') {
		  _this.money_success = res.data.dcsCardNowPaymentDto.amount;	
          //this.vMainData.orderId = res.data.transactionId
          _this.uniWebOrderId = res.data.transactionId;
          _this.vMainData.amount = _this.money_check;
		  
		  const date = new Date();
			const year = date.getFullYear();
			const month = date.getMonth() + 1;

			const day = date.getDate();
			const hour = date.getHours();
			const minute = date.getMinutes();
			const second = date.getSeconds();
			var timestamp = new Date(year+"-"+month+"-"+day+" "+hour+":"+minute+":"+second).getTime();
			_this.cli_pay_time = timestamp;
          _this.startSale();
        } else {
          _this.cancel_dcs();
        }
      },
      /**
       * startSale
       */
      startSale() {
        let _this = this;
        //let storeInfo = uni.getStorageSync('storeInfo');
        try {
			console.log(this.vMainData);
          saleSm.startSale(this.vMainData, (result) => {
            _this.$global.addLog(JSON.stringify(result), 'startSale')
            if (result['code'] == -100002) {
              const merchantParams = {
                merchantId: this.storeInfo.dcsMerchantId, // 默认值  肯定DCS
                terminalId: this.storeInfo.dcsTerminalId, // 默认值  肯定DCS
                subMerchantCity: this.storeInfo.dcsSubMerchantCity,
                subMerchantId: this.storeInfo.dcsSubMerchantId,
                subTerminalId: this.storeInfo.dcsSubTerminalId,
                subMerchantName: this.storeInfo.dcsSubMerchantName,
                subMerchantCountryCode: this.storeInfo.dcsSubMerchantCountryCode,
              }
              _this.$global.addLog(JSON.stringify(merchantParams), 'merchantParams');
              initSunmi.setConfig(merchantParams, (config) => {
                console.log('config==========config')
                console.log(config)
                if (config.code == 200) {
                  _this.$global.addLog(JSON.stringify(config), 'config')
                  initSunmi.signOn((sign) => {
                    console.log('signOn==========signOn')
                    console.log(sign)
                    _this.$global.addLog(JSON.stringify(sign), 'signOn')
                    if (sign.code == 200) {
                      _this.startSale()
                    } else {
                      //initSunmi.clearAllDBData();
                      _this.cancel_dcs();
                      uni.showModal({
                        title: _this.$t('tips'),
                        content: sign.data,
                        showCancel: false,
                      })
                    }
                  })
                } else {
                  _this.cancel_dcs();
                  uni.showModal({
                    title: _this.$t('tips'),
                    content: sign.data,
                    showCancel: false,
                  })
                }
              })
            } else if (result['code'] == -100003) {
              initSunmi.signOn((sign) => {
                console.log('signOn==========signOn')
                console.log(sign)
                _this.$global.addLog(JSON.stringify(sign), 'signOn')
                if (sign.code == 200) {
                  _this.startSale()
                } else {
                  //initSunmi.clearAllDBData();
                  _this.cancel_dcs();
                  uni.showModal({
                    title: _this.$t('tips'),
                    content: sign.data,
                    showCancel: false,
                  })
                }
              })
            } else {
              console.log(JSON.stringify(result) + 'startSale')
              console.log('~~~~~~~~~~~~~')
              let rdata = result['data']
              if (
                (result['code'] === 201 && rdata.cardNo) ||
                (result['code'] === 202 && rdata.uuid) ||
                (result['code'] === 203 && rdata.uuid)
              ) {
                _this.setManualKey()
              } else {
                uni.showModal({
                  title: _this.$t('tips'),
                  content: rdata,
                  showCancel: false,
                })
              }
            }
          })
        } catch (e) {
          this.cancel_dcs();
        }
      },
      /**
       * setManualKey
       */
      setManualKey() {
        let _this = this;
		
        try {
          saleSm.setManualKey(_this.vMainData, (result) => {
            _this.$global.addLog(JSON.stringify(result), 'setManualKey');
            console.log(JSON.stringify(result) + 'setManualKey');
            let rdata = result['data'];
			
            if (result.code == '204' && result.message == 'onAppFinalSelect') {
              saleSm.confirmAppFinalSelect(true);
            } else if (result.code == '204' && result.message == 'onConfirmCardNo') {
              saleSm.confirmCardNo(true);
				_this.yi_dcs_check_status = null;
				_this.yi_dcs_check_status = setInterval(() => {
				  _this.dcs_check_status_icon = _this.dcs_check_status_icon + 1;
				  if (_this.dcs_check_status_icon >= 10) {
					clearInterval(_this.yi_dcs_check_status);
					_this.yi_dcs_check_status = null;
					_this.dcs_check_status_icon = 0;
					_this.is_dcs_check_status = 1;
				  }
				},1000);
            } else {
              if (result.code == '201' && result.message == 'handle') { //wait or error
				
              } else if (result.code == '205' && result.message == 'trasnactionResult') {
				  
                if (result.code == '205' && rdata.status == 'success' && rdata.result && rdata.result.answerCode ==
                  '00') {
                  setTimeout(function() {
                    utils.showLoading();
					saleSm.cardOff();
                    _this.paySuccess(rdata);
                  }, 500);
                } else {
                  _this.$global.addLog(JSON.stringify(result), 'setManualKey_error');
                  _this.cancel_dcs();
                  _this.shibao_tiao(rdata.sale);
                }
              } else {
                _this.$global.addLog(JSON.stringify(result), 'setManualKey_error');
                _this.cancel_dcs();
                let d_str = JSON.stringify(rdata);
                if (d_str.indexOf("4:") >= 0) {
                  _this.shibao_tiao(
                    'Please place the card in the designated area until the transaction is completed.');
                } else {
                  _this.shibao_tiao(rdata);
                }
              }

            }

          });
        } catch (e) {
          _this.cancel_dcs();
        }
      },

      paySuccess(data) {
        let _this = this
        try {
          _this.$global.addLog(JSON.stringify(data), 'paySuccess')
          let store = uni.getStorageSync('storeInfo') || {}
          if (data.sale) {
            uni.hideLoading()
            _this.$global.addLog(JSON.stringify(data))
            uni.showModal({
              title: _this.$t('tips'),
              content: data.sale,
              showCancel: false,
            })
          } else {
            if (data.result.referenceNo) {
				if(data.result.amount != _this.money_success){
					_this.$global.addLog(data.result.amount+":"+_this.money_success, 'amount_error')
					uni.showModal({
					  title: _this.$t('tips'),
					  content: 'Amount error',
					  showCancel: false,
					});
					return false;
				}
              let stan = data.result.stan;
              let referenceNo = data.result.referenceNo;
              let paymentMethodNext = data.paymentMethodNext;
              let paymentMethod = data.result.paymentMethod; //10501
              let paymentMethod_zhuan = paymentMethodNext.toUpperCase() + '_CARD';
              if (paymentMethod_zhuan == 'MASTERCARD_CARD') {
                paymentMethod_zhuan = 'MASTER_CARD';
              } else if (paymentMethod_zhuan == 'UNIONPAY_CARD') {
                paymentMethod_zhuan = 'UNION_PAY_CARD';
              }
              console.log(paymentMethod_zhuan + '============');

              let cardType = '';
              if (data.result.cardType == 1) {
                cardType = 'chip_swipe';
              } else if (data.result.cardType == 2) {
                cardType = 'stripe_insert';
              } else if (data.result.cardType == 3) {
                cardType = 'contactless_nfc';
              } else {
                cardType = 'manual';
              }
              let o = {
                cardPayWay: cardType,
                transactionId: _this.uniWebOrderId,
                transactionType: data.result.transactionType,
                cardNumber: data.result.cardNo,
                dcsPaymentMethod: paymentMethod_zhuan,
                paymentStatus: 'success',
                errorMessage: '',
                terminalStan: stan,
                acquirerTransactionId: referenceNo,
                cardCountry: data.result.issuerCode,
                mid: data.result.mid,
                tid: data.result.tid,
                stan: data.result.stan,
                exp: data.result.expDate,
                rrn: data.result.referenceNo,
                batch: data.result.batchNo,
                invoice: data.result.traceNo,
                trace: data.result.traceNo,
                apprCode: data.result.authNo,
                aid: data.result.aid,
                app: data.result.appName,
                tc: data.result.tc,
              }
              if (data.result.isLocal) {
                o.cardBelong = data.result.isLocal
              }

              _this.$global.addLog(JSON.stringify(o),'updateDcsCardPayTransaction');
              console.log(o);
              console.log('============');
			  //uni.hideLoading()
			  _this.getPayStatusByDcs(o);
              api.updateDcsCardPayTransaction(o).then((res) => {
				  console.log("updateDcsCardPayTransaction======");
                _this.$global.addLog(JSON.stringify(res),'updateDcsCardPayTransaction_res');
				/*
                if (res.code == '000000') {
                  _this.getPayStatusByWx(_this.uniWebOrderId);
                } else {
                  uni.hideLoading()
                  uni.showModal({
                    title: _this.$t('tips'),
                    content: 'error',
                    showCancel: false,
                  })
                }
				*/
              });
			  
            } else {
              uni.hideLoading()
              uni.showModal({
                title: _this.$t('tips'),
                content: '交易失败',
                showCancel: false,
              })
            }
          }
        } catch (e) {
          //TODO handle the exception
          uni.hideLoading()
        }
      },
	  getPayStatusByDcs(item) {
	  	let _this = this;
		_this.success_url_dcs(item);
		_this.cancel_dcs();
	  },
      cancel_dcs(is_close = 0) {
		let _this = this;
		_this.cli_clo_luxun();
        clearInterval(_this.yi_dcs);
        _this.yi_dcs = null;
        _this.is_dcs_show = false;
		
		clearInterval(_this.yi_dcs_check_status);
		_this.yi_dcs_check_status = null;
		_this.dcs_check_status_icon = 0;
		_this.is_dcs_check_status = 0;
		_this.is_click_keyboard = 1;
		_this.startPay = 0;
        saleSm.cancelCheckCard();
		console.log("cancel_dcs");
		if(is_close == 1){
			if(_this.pushId != 0){
				_this.cancelPosPayment();
			}
		}
		
      },
	  check_status_dcs(){
		  let _this = this;
		  
			initSunmi.querySaleTransactionList(1,1,result=>{
				if(result.code == 200){
					if(result.data){
						let data = result.data;
						let date = new Date();
						let year = date.getFullYear();
						var jsonObject = JSON.parse(data);
						let amount = jsonObject[0].amount;
						let transDate = jsonObject[0].transDate;
						let transDateFirst = transDate.substr(0,2);
						let transDateNext = transDate.substr(2);
						
						let transTime = jsonObject[0].transTime;
						let transTimeFirst = transTime.substr(0,2);
						let transTimeTwo = transTime.substr(2,2);
						let transTimeNext = transTime.substr(4,2);
						var jilu_time = year+"-"+transDateFirst+"-"+transDateNext+" "+transTimeFirst+":"+transTimeTwo+":"+transTimeNext;
						var jilu_time_time = new Date(jilu_time).getTime();
						let cli_money = _this.money_check;
						/*
						uni.showModal({
						  title: 'Warning',
						  content: 'Do you want to check status ?',
						  cancelText: 'CANCEL',
						  confirmText: 'YES',
						  success: (res) => {
						    if (res.confirm) {
						      console.log('用户点击确定')
						      _this.check_status_dcs_success(jsonObject[0]);
						    } else if (res.cancel) {
						      console.log('用户点击取消');
						    }
						  },
						})
						return false;
						*/
						if(cli_money == amount){
							if(jilu_time_time > _this.cli_pay_time){
								uni.showModal({
								  title: 'Warning',
								  content: 'Do you want to check status ?',
								  cancelText: 'CANCEL',
								  confirmText: 'YES',
								  success: (res) => {
								    if (res.confirm) {
								      console.log('用户点击确定')
								      _this.check_status_dcs_success(jsonObject[0]);
								    } else if (res.cancel) {
								      console.log('用户点击取消');
								    }
								  },
								})
							}else{
								_this.cancel_dcs();
								_this.shibao_tiao(_this.$t('no_transaction_record_found'));
							}
						}else{
							_this.cancel_dcs();
							_this.shibao_tiao(_this.$t('no_transaction_record_found'));
						}
					}else{
						_this.cancel_dcs();
						_this.shibao_tiao(_this.$t('no_transaction_record_found'));
					}
				}else{
					_this.cancel_dcs();
					_this.shibao_tiao(_this.$t('no_transaction_record_found'));
				}
			});
	  },
	  check_status_dcs_success(data){
		  let _this = this;
		  let stan = data.stan;
			let referenceNo = data.referenceNo
			let paymentMethodNext = data.appName
			let paymentMethod = data.paymentMethod //10501
			let paymentMethod_zhuan = paymentMethodNext.toUpperCase() + '_CARD'
			if (paymentMethod_zhuan == 'MASTERCARD_CARD') {
			  paymentMethod_zhuan = 'MASTER_CARD'
			} else if (paymentMethod_zhuan == 'UNIONPAY_CARD') {
			  paymentMethod_zhuan = 'UNION_PAY_CARD'
			}
			
		    let cardType = ''
		    if (data.cardType == 1) {
		      cardType = 'chip_swipe'
		    } else if (data.cardType == 2) {
		      cardType = 'stripe_insert'
		    } else if (data.cardType == 3) {
		      cardType = 'contactless_nfc'
		    } else {
		      cardType = 'manual'
		    }
		    let o = {
		      cardPayWay: cardType,
		      transactionId: _this.uniWebOrderId,
		      transactionType: data.transactionType,
		      cardNumber: data.cardNo,
		      dcsPaymentMethod: paymentMethod_zhuan,
		      paymentStatus: 'success',
		      errorMessage: '',
		      terminalStan: stan,
		      acquirerTransactionId: referenceNo,
		      cardCountry: data.issuerCode,
		      mid: data.mid,
		      tid: data.tid,
		      stan: data.stan,
		      exp: data.expDate,
		      rrn: data.referenceNo,
		      batch: data.batchNo,
		      invoice: data.traceNo,
		      trace: data.traceNo,
		      apprCode: data.authNo,
		      aid: data.aid,
		      app: data.appName,
		      tc: data.tc,
		    }
		    if (data.isLocal) {
		      o.cardBelong = data.isLocal
		    }

		    _this.$global.addLog(
		      JSON.stringify(o),
		      'updateDcsCardPayTransaction'
		    )
		    console.log('============')
		    console.log(o)
		    console.log('============')
		    api.updateDcsCardPayTransaction(o).then((res) => {
		      _this.$global.addLog(
		        JSON.stringify(res),
		        'updateDcsCardPayTransaction_res'
		      )
		      if (res.code == '000000') {
		        _this.getPayStatusByWx(_this.uniWebOrderId);
		      } else {
		        uni.hideLoading()
		        uni.showModal({
		          title: _this.$t('tips'),
		          content: 'error',
		          showCancel: false,
		        })
		      }
		    })
		  
		  
		  
		  
	  },
		onInstall() {
        let _this = this

        plus.runtime.setBadgeNumber(0)
        plus.runtime.getProperty(plus.runtime.appid, function(widgetInfo) {
          console.log(widgetInfo, '设备信息', _this.pushClientid)
          uni.setStorageSync('version', widgetInfo.version)
          let versionCode = widgetInfo.versionCode
          _this.versionCode = versionCode
        })
      },
      hideQrcode() {
		  let _this = this;
        _this.showGrabPay = false;
		_this.cli_clo_luxun();
        //clearInterval(this.payStatusTimer);
        //this.payStatusTimer = null;
        //this.is_lunxun = 0;
        _this.qr_url = '';
		_this.is_click_keyboard = 1;
		_this.startPay = 0;
		if(_this.is_nfc == 1 && _this.is_nfc_write_success == 1){
			HceSunmi.writeNdefData("empty", (rr) => {
			   if(rr.message == "success" && rr.code == 200){
				   _this.is_nfc_write_success = 0;
					HceSunmi.closeHce();
			   }
			});
		}
		
		if(_this.pushId != 0){
			_this.cancelPosPayment();
		}
      },
	  
      async selectAcquirerStoreDtoWithAcquirer() {
        let _this = this
        let res = await api.selectAcquirerStoreDtoWithAcquirer()
        console.log(res)
        console.log('zzzzzzzzzzzzzz')
        if (res.code == '000000') {
          _this.$global.addLog(
            JSON.stringify(res),
            'selectAcquirerStoreDtoWithAcquirer'
          )
          // GRAB_MERCHANT_PRESENTED_QR_GRAB_PAY GRAB_MERCHANT_PRESENTED_QR_PAY_LATER
          // 进行数据处理；如果 acquirerType == GRAB_MERCHANT_PRESENTED_QR_PAY_LATER 或者 acquirerType == GRAB_MERCHANT_PRESENTED_QR_GRAB_PAY 只显示 GrabPay
          // 1、重新赋值acquirerType
		  let list = res.data.map((a) => {
		    if (a.acquirerType == 'DBS_PAY_NOW_MERCHANT_PRESENTED_QR_PAY') {
		      _this.DBS_PAY_NOW_MERCHANT_PRESENTED_QR_PAY = a;
		      _this.IS_DBS_PAY_NOW_MERCHANT_PRESENTED_QR_PAY = true;
		    } else if (a.acquirerType == 'WECHAT_MERCHANT_SCAN_USER_QR_PAY') {
		      _this.WECHAT_MERCHANT_SCAN_USER_QR_PAY = a;
		      _this.IS_WECHAT_MERCHANT_SCAN_USER_QR_PAY = true;
		    } else if (a.acquirerType == 'ALI_MERCHANT_SCAN_USER_QR_PAY') {
		      _this.ALI_MERCHANT_SCAN_USER_QR_PAY = a;
		      _this.IS_ALI_MERCHANT_SCAN_USER_QR_PAY = true;
		    } else if (a.acquirerType == 'GRAB_MERCHANT_PRESENTED_QR_PAY_LATER' || a.acquirerType == 'GRAB_MERCHANT_PRESENTED_QR_GRAB_PAY') {
		      _this.GRAB_MERCHANT_PRESENTED_QR_PAY_LATER = a;
		      _this.IS_GRAB_MERCHANT_PRESENTED_QR_PAY_LATER = true;
		    } else if (a.acquirerType == 'DCS_CARD_NOW_PAY') {
				if(_this.IS_DCS_CARD_NOW_PAY == false){
					_this.selectStoreDcsConfigurationList();			  
				}
				
		      _this.DCS_CARD_NOW_PAY = a;
		      _this.IS_DCS_CARD_NOW_PAY = true;
			  
		    } else if (a.acquirerType == 'SOLANA_PAY') {
		      _this.SOLANA_PAY = a;
		      _this.IS_SOLANA_PAY = true;
		    }
		    return a;
		  });
          setTimeout(() => {
            this.handleStyle(5)
          }, 0)
        }
      },
      // 处理样式
      handleStyle(len) {
        uni.getSystemInfo({
          success: (res) => {
            // 获取 .pay-type 的高度
            if (this.isSmallScreen) {
              const query = uni.createSelectorQuery().in(this)
              query
                .select('.pay-type-samll')
                .boundingClientRect((data) => {
                  if (data) {
                    // data.height 就是元素的高度
                    console.log('元素高度:', data.height)
                    // 109 + 95
                    let _h = 190 + data.height
                    let winH = res.screenHeight
                    this.keyHeight = (winH - _h) / 4
                  }
                })
                .exec()
            } else {
              const query = uni.createSelectorQuery().in(this)
              query
                .select('.pay-type')
                .boundingClientRect((data) => {
                  if (data) {
                    // data.height 就是元素的高度
                    console.log('元素高度:', data.height)
                    // 109 + 95
                    let _h = 240 + data.height
                    let winH = res.screenHeight
                    this.keyHeight = (winH - _h) / 4
                  }
                })
                .exec()
            }
          },
        })
      },
      updateMoney(item) {
		  if(this.is_click_keyboard == 0){
			  return false;
		  }
        // console.log(this.replayAcquireType('DBS_PAY_NOW_MERCHANT_PRESENTED_QR_PAY'),'123')
        // 例如依次输入123：输入1 == 0.01，继续输入2 == 0.12 ，随后输入3应该进位变为 3 == 1.23 。
        // console.log(this.inputMoney)
        if (item == 'del') {
          music.click()
          // 删除的时候，逆向删除
          this.inputMoney.pop()
          this.money = this.inputMoney.join('')
          if (this.money.length == 0) {
            this.money = '0.00'
          } else if (this.money.length == 1) {
            this.money = '0.0' + this.money
          } else if (this.money.length == 2) {
            this.money = '0.' + this.money
          } else {
            this.money = this.money.slice(0, -2) + '.' + this.money.slice(-2)
          }
        } else if (item == 'C') {
          music.click()
          this.money = '0.00'
          this.inputMoney = []
        } else {
          //console.log(this.inputMoney.length, 'inputMoney')
          if (item == '0' && this.inputMoney.length == 0) {
            return
          }
          if (this.inputMoney.length > 7) {
            return
          }
          music.click()
          this.inputMoney.push(item)
          this.money = this.inputMoney.join('')
          if (this.money.length == 1) {
            this.money = '0.0' + this.money
          } else if (this.money.length == 2) {
            this.money = '0.' + this.money
          } else {
            this.money = this.money.slice(0, -2) + '.' + this.money.slice(-2)
          }
        }
      },
	  updateMoneyAgain(){
		  let _this = this;
		  if (_this.inputMoney.length == 0) {
			return
		  }
		  if (_this.inputMoney.length > 7) {
			return
		  }
		  _this.money = _this.inputMoney.join('')
		  if (_this.money.length == 1) {
			_this.money = '0.0' + _this.money
		  } else if (_this.money.length == 2) {
			_this.money = '0.' + _this.money
		  } else {
			_this.money = _this.money.slice(0, -2) + '.' + _this.money.slice(-2)
		  }
			
	  },
	  
      async openScanTest(item,model=0) {
        let _this = this;
		if(model == 0){
			if(_this.startPay == 1){
				return false;
			}
			_this.startPay = 1;
		}
        if (_this.IS_SOLANA_PAY == false) {
			_this.startPay = 0;
          return;
        }
        if (_this.money == '0.00') {
			_this.startPay = 0;
          utils.showText('金额不能为零');
          return;
        }
		_this.is_click_keyboard = 0;
		_this.locale = uni.getStorageSync('locale');	
        utils.showLoading();
		let money = (_this.money * 100).toFixed(0);
		_this.money_check = money;
        let o = {
          acquirerType: item.acquirerType,
          paymentTerminalRequestVo: {
            amount: _this.money_check,
            currency: 'SGD',
            actionType: 'PAY',
            qrCodeNumber: ''
          }
        }
		
		if(_this.pushId != 0){
			o.paymentTerminalRequestVo.pushId = _this.pushId;
		}
		
        console.log(o);
		_this.$global.addLog(JSON.stringify(o), 'paymentPay');
        let res = await api.paymentPay(o);
        if (res.code == '000000') {
          let data = res.data;
          _this.qr_url = data.transactionId;
          _this.payMentType = item.acquirerType;
          _this.showGrabPay = true;
          _this.getPayStatusByWx(data.transactionId);
		  console.log(_this.is_nfc+"===="+data.transactionId);
		  if(_this.is_nfc == 1){
			HceSunmi.openHce("Type4", (r) => {
				console.log("nfc is open");
				console.log(r);
			  if(r.message == "success" && r.code == 200){
				
				_this.$global.addLog("is_nfc_open_success", 'is_nfc');
				setTimeout(function() {
					HceSunmi.writeNdefData(data.transactionId, (rr) => {
					   console.log(rr);
					   if(rr.message == "success" && rr.code == 200){
							_this.is_nfc_write_success = 1;
					   }
					});
				},1000);
			  }else{
				_this.$global.addLog("is_nfc_open_error", 'is_nfc');
			  }
			});
		   
		  }
        }
        uni.hideLoading();
      },
      async openScan(item,model=0) {
		let _this = this;
		if(model == 0){
			if(_this.startPay == 1){
				return false;
			}
			_this.startPay = 1;
		}
        if (!item.acquirerType) {
			_this.startPay = 0;
          return false;
        }
        _this.acquirerType = item.acquirerType;
        if (_this.acquirerType == 'RED_DOT_PAY') {
			_this.startPay = 0;
          return;
        }
		
		if (_this.money == '0.00') {
			_this.startPay = 0;
		  utils.showText('金额不能为零');
		  return;
		}
		_this.is_click_keyboard = 0;
        _this.locale = uni.getStorageSync('locale');
		let money = (_this.money * 100).toFixed(0);
		_this.money_check = money;
        if (_this.acquirerType == 'ETHEREUM_PAY' || _this.acquirerType == 'SOLANA_PAY' || _this.acquirerType ==
          'BTC_PAY') {

        } else {
			if (_this.acquirerType == 'DCS_CARD_NOW_PAY') {
			  _this.paymentCard();
			} else {
			  let arr = [
				'GRAB_MERCHANT_PRESENTED_QR_GRAB_PAY',
				'GRAB_MERCHANT_PRESENTED_QR_PAY_LATER',
				'DBS_PAY_NOW_MERCHANT_PRESENTED_QR_PAY',
			  ];
			  if (arr.includes(this.acquirerType)) {
				_this.sendPayment('', item);
				return;
			  }
			  
				scanner.onScan({
					isShowBeep: true,
					hintText: '请对准二扫码',
					isShowToast: false,
					barcodeFormats: ['QR Code'],
					},(ret) => {
						if (ret.result) {
						  _this.sendPayment(ret.result, item);
						  scanner.onClose();
						}else{
							if(_this.pushId != 0){
								_this.cancelPosPayment();
							}else{
								_this.is_click_keyboard = 1;
								_this.startPay = 0;
								_this.pushId = 0;
							}
							
						}
				  }
				)
			  
			}
          
        }
      },
	  
      // 发起支付
      async sendPayment(code, item) {
		let _this = this;
        utils.showLoading();
        let acquirerType = item.acquirerType
        let arr = [
          'GRAB_MERCHANT_PRESENTED_QR_GRAB_PAY',
          'GRAB_MERCHANT_PRESENTED_QR_PAY_LATER',
        ]
        if (arr.includes(acquirerType)) {
          acquirerType = 'GRAB_MERCHANT_PRESENTED_QR_PAY_LATER'
        }
		
		if (code) {//wechat or ali_pay
			_this.showPaying = true;
			_this.payTimeout = false;
			
			_this.payTimeoutTemp = setInterval(() => {
			  if(_this.showPaying == true){
			  	console.log("hhhhhhhhh")
			  	_this.payTimeout = true;
			  }else{
				  clearInterval(_this.payTimeoutTemp);
				  _this.payTimeoutTemp = null;
			  }
			}, 15000);
			
		}
        console.log(acquirerType, '支付方式')
        let o = {
          acquirerType: acquirerType,
          paymentTerminalRequestVo: {
            amount: _this.money_check,
            currency: item.storeCurrency,
            actionType: 'PAY',
            qrCodeNumber: code,
          },
        }
		
		if(_this.pushId != 0){
			o.paymentTerminalRequestVo.pushId = _this.pushId;
		}
		
        console.log('uuuuuuuuu')
        console.log(o)

        let res = await api.paymentPay(o)
        console.log(res, 'sss')
        if (res.code == '000000' || res.code == 'PAYMENT_IN_PROCESS') {
          let data = res.data;
          if (acquirerType == 'GRAB_MERCHANT_PRESENTED_QR_PAY_LATER') {
            _this.qr_url = data.grabPayLaterPaymentDto.qrcode
            _this.payMentType = 'GrabPay'
            _this.showGrabPay = true
            _this.getPayStatusByWx(data.transactionId)
            return
          } else if (acquirerType == 'DBS_PAY_NOW_MERCHANT_PRESENTED_QR_PAY') {
            _this.qr_url = data.dbsPayNowPaymentDto.base64Image
            _this.payMentType = 'PayNow'
            _this.showGrabPay = true
            _this.getPayStatusByWx(data.transactionId)
            return
          }

          _this.getPayStatusByWx(data.transactionId)
        } else if (res.code == 'PAYMENT_IN_PROCESS') {
          // 等待
        } else { //失败
          _this.shibao_tiao(res.message);
        }
        uni.hideLoading()
      },
	  cli_clo_showPaying(){
		  let _this = this;
		  _this.is_lunxun = 0;
		  _this.showPaying = false;
		  _this.payTimeout = false;
		  clearInterval(_this.payTimeoutTemp);
		  _this.payTimeoutTemp = null;
		  _this.is_click_keyboard = 1;
		  _this.startPay = 0;
		  if(_this.pushId != 0){
			  _this.cancelPosPayment();
		  }
		  
	  },
      // 每隔n秒请求一次接口api.selectTransactionById
      getPayStatusByWx(id) {
        let _this = this;
		_this.is_lunxun = 1;
	    _this.get_selectTransactionById(id);
      },
	  get_selectTransactionById(id) {
	    let _this = this;
		if(_this.is_lunxun == 0){
			return false;
		}
	    api.selectTransactionById({id:id}).then((res) => {
	      if (res.code == '000000') {
	        let data = res.data;
	        if (data.paymentStatus == "success") {
	          //clearInterval(_this.payStatusTimer);
	          _this.$global.addLog(JSON.stringify(res), 'startPrint');
	          if (data.acquirerType == "SOLANA_PAY") {
				
				_this.cli_clo_luxun();
	            _this.success_url(data);
	          } else if (data.acquirerType == "DCS_CARD_NOW_PAY") {
	            _this.success_url(data);
	            _this.cancel_dcs();
	          } else {
				_this.cli_clo_luxun();
	            _this.success_url(data);
	  
	          }
	        } else {
	          _this.$global.addLog(JSON.stringify(res), 'startPrint_wait');
			  _this.payStatusTimer = setTimeout(() => {
			    _this.get_selectTransactionById(id);
			  }, _this.timeout_time);
	        }
	      } else {
	        _this.$global.addLog(JSON.stringify(res), 'startPrint_wait');
			_this.payStatusTimer = setTimeout(() => {
			  _this.get_selectTransactionById(id);
			}, _this.timeout_time);
	      }
	      //_this.is_lunxun = 0
	      console.log('接口返回成功！！！');
		  
	    }).catch(() => {
	      console.log('接口异常重置成功！！！');
	      //_this.is_lunxun = 0;
	      _this.$global.addLog("yichang_error", 'startPrint_error');
		  _this.payStatusTimer = setTimeout(() => {
		    _this.get_selectTransactionById(id);
		  }, _this.timeout_time);
		  
	    });
	  },
		cli_clo_luxun(){
			let _this = this;
			_this.payStatusTimer = null;
			clearTimeout(_this.payStatusTimer);
			_this.is_lunxun = 0;
		},
		cancelPosPayment(){
		  let _this = this;
		  console.log(_this.pushId);
		  console.log("cancelPosPayment===================");
		  let o = {pushId:_this.pushId};
		  _this.$global.addLog(JSON.stringify(o),'cancelPosPayment_init');
		  api.cancelPosPayment(o).then((res) => {
			_this.$global.addLog(JSON.stringify(res),'cancelPosPayment_success');
			if(res.code == "success"){
				_this.is_click_keyboard = 1;
				_this.startPay = 0;
				_this.pushId = 0;
			}
		  });
		},
		init_success_url(){
			let _this = this;
			//_this.payStatusTimer = null;
			_this.is_click_keyboard = 1;
			_this.startPay = 0;
			_this.pushId = 0;
			_this.showPaying = false;
			_this.showGrabPay = false;
			_this.payTimeout = false;
			_this.qr_url = '';
			clearInterval(_this.payTimeoutTemp);
			_this.payTimeoutTemp = null;
			_this.money = '0.00';
			_this.money_check = '0.00';
			_this.money_success = 0;
			_this.inputMoney = [];
			music.success();
			
			if(_this.is_nfc == 1 && _this.is_nfc_write_success == 1){
				console.log("is_nfc_go_write");
				HceSunmi.writeNdefData("empty", (rr) => {
					console.log(rr);
				   if(rr.message == "success" && rr.code == 200){
					   _this.is_nfc_write_success = 0;
						HceSunmi.closeHce();
				   }
				});
			}
		},
		success_url_dcs(item) {
		  let _this = this;
		  item.amount = _this.money_check;
		  _this.init_success_url();
		  uni.navigateTo({
		    url: '/pages/paymentHistory/detail/detail?type=pay&is_dcs=1&item='+JSON.stringify(item),
		  });
		    
		},
      success_url(data) {
        let _this = this;
        _this.init_success_url();
        uni.navigateTo({
          url: '/pages/paymentHistory/detail/detail?type=pay&is_dcs=0&id=' + data.id,
        });
      },
      shibao_tiao(msg) {
		let _this = this;
        _this.showPaying = false;
        _this.showErrorPay = false;
		_this.is_click_keyboard = 1;
		_this.startPay = 0;
		
		if(_this.pushId != 0){
			_this.cancelPosPayment();
		}
        uni.navigateTo({
          url: '/pages/status/status?type=2&num=0&id=' + msg,
        });
      },
      // 打开侧边个人中心
      openSidebar() {
        this.showSidebar = true
      },
      closeSidebar() {
        this.showSidebar = false
      },
	  
	  numberToArray(num) {
	      let array = [];
	      while (num > 0) {
	          array.unshift(num % 10); // 取余数得到最后一位，然后添加到数组的开头
	          num = Math.floor(num / 10); // 整除10，去掉最后一位
	      }
	      return array;
	  }
    },
  }
</script>

<style lang="scss" scoped>
  @import 'pay.scss';
</style>