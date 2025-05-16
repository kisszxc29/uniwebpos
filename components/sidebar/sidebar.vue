<template>
	<view class="sidebar">
		<view class="shadow" @click="close"></view>
		<view class="content" :class="status ? '' :'hide'">
			<image class="close-icon"  @click="close" src="/static/images/login/close.png" ></image>
			
			
			<view class="" style="overflow-y: auto;height: 100vh;">
				<view class="logo">
					<image src="/static/images/login/s-logo.png" mode="widthFix"></image>
				</view>
				<view class="card" v-if="storeName" style="padding-bottom: 18rpx;">
					<view class="store-name">
						<view class="">
							{{storeName}}
						</view>
					</view>
				</view>
				<view class="card">
					<view class="title">{{$t('History')}}</view>
					<view class="item" @click="goToUrl('/pages/paymentHistory/paymentHistory')">
						<view class="left">
							<image src="/static/images/login/calendar.svg" mode="" style="width: 40rpx;height: 38rpx;"></image>
						</view>
						<view class="right">{{$t('Payment')}}</view>
					</view>
					<!-- <view class="item">
						<view class="left">
							<image src="/static/images/login/code.svg" mode="" style="width: 40rpx;height: 40rpx;"></image>
						</view>
						<view class="right">{{$t('Redemption')}}</view>
					</view> -->
					<view class="item" @click="goToUrl('/pages/paymentHistory/paymentHistory?type=2')">
						<view class="left">
							<!-- <image src="/static/images/login/code.svg" mode="" style="width: 40rpx;height: 40rpx;"></image> -->
							<image src="/static/images/login/printer.dotmatrix.fill.svg" style="width: 40rpx;height: 40rpx;"></image>
						</view>
						<view class="right">{{$t('PrintSummaryReceipt')}}</view>
					</view>
					
				</view>
				
				<view class="card">
					<view class="title">{{$t('Setting')}}</view>
					<view class="item">
						<view class="left">
							Aa
						</view>
						<view class="right" @click="changeLocale">{{$t('locale')}}</view>
					</view>
					<view class="item">
						<view class="left">
							<image src="/static/images/login/print.svg" mode="" style="width: 40rpx;height: 40rpx;"></image>
						</view>
						<view class="right">
							<view class="">
								{{$t('Print')}}
							</view>
							<switch v-model="printStatus" :checked="printStatus" color="#0058FF" @change="switchChange" style="transform:scale(0.7);"/>
						</view>
					</view>
					<view class="item">
						<view class="left">
							<image src="/static/images/login/Receipt.svg" mode="" style="width: 35rpx;height: 40rpx;margin-left: 3rpx;"></image>
						</view>
						<view class="right">
							<view class="">
								{{$t('SingleReceipt')}}
							</view>
							<switch v-model="printTimes" :checked="printTimes" color="#0058FF" @change="switchTimesChange" style="transform:scale(0.7);"/>
						</view>
					</view>
				</view>
				
				<view class="card">
					<view class="title">{{$t('Support')}}</view>
					<view class="item">
						<view class="left">
							<image src="/static/images/login/phone.svg" mode="" style="width: 40rpx;height: 40rpx;"></image>
						</view>
						<view class="right">83853698 (WhatsApp)</view>
					</view>
					<view class="item">
						<view class="left">
							<image src="/static/images/login/mail.svg" mode="" style="width: 40rpx;height: 35rpx;"></image>
						</view>
						<view class="right">
							<view class="">
								support@uniwebpay.com
							</view>
						</view>
					</view>
					<view class="item">
						<view class="right" style="color: #0059FF;font-size: 30rpx;">
							APP Version: {{version}}
						</view>
					</view>
					<view class="item">
						<view class="g-button" @click="logout">{{ $t('logout') }}</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { mapGetters } from 'vuex'
	export default {
		name:"sidebar",
		props:{
			version:{
				default: '100'
			}
		},
		data() {
			return {
				status:true,
				printStatus:true,
				printTimes:false,
				// storeName:''
			};
		},
		computed: {
		  ...mapGetters(['locale']),
			storeName(){
				return this.status ? uni.getStorageSync('storeName') : ''
			}
		},
		
		mounted(){
			let printStatus = uni.getStorageSync('printStatus') || true
			this.printStatus = printStatus == 1 ? true : false
			this.printTimes = uni.getStorageSync('printTimes') || false
		},
		methods:{
			
			close(){
				this.status = false
				setTimeout(()=>{
					this.status = true
					this.$emit('close')
				},250)
			},
			changeLocale(){
				let locale = this.locale
				console.log(this.locale,'this.locale')
				if (locale == 'zh') {
				  uni.setStorageSync('locale', 'en')
				  this.$store.commit('setLocale', 'en')
				  this._i18n.locale = 'en'
				} else {
				  uni.setStorageSync('locale', 'zh')
				  this.$store.commit('setLocale', 'zh')
				  this._i18n.locale = 'zh'
				}
			},
			switchChange(e){
				let status = e.detail.value ? 1 : 2
				uni.setStorageSync('printStatus',status)
				console.log(status,'sss',uni.getStorageSync('printStatus'))
			},
			switchTimesChange(e){
				let status = e.detail.value
				console.log(status,'---')
				uni.setStorageSync('printTimes',status)
			},
			goToUrl(url){
				uni.navigateTo({
					url:url
				})
			},
			logout(){
				uni.showModal({
				  title: this.locale == 'zh' ? '警告':'Warning',
				  content: this.locale == 'zh' ? '你确定要登出吗?': 'Are you sure you want to log out？',
				  cancelText: this.locale == 'zh' ? '取消' : 'CANCEL',
				  confirmText: this.locale == 'zh' ? '确定':'YES',
				  success: (res) => {
				    if (res.confirm) {
							uni.removeStorageSync('terminalId')
							uni.removeStorageSync('Authorization')
							uni.reLaunch({
								url:'/pages/pay/pay'
							})
				    } else if (res.cancel) {
				    }
				  },
				})
				
			},
		}
	}
</script>

<style lang="scss" scoped>
 @import 'sidebar.scss';
 
 .g-button{
 	width: 100%;
 	height: 34px;
 	border-radius: 10rpx;
 	background: #E34D59;
 	margin: 32px auto;
 	font-weight: 400;
 	font-size: 32rpx;
 	color: #FFFFFF;
 	text-align: center;
 	line-height: 34px;
 	
 }
</style>