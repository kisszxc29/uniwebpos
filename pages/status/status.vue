<template>
	<view class="status">
		<view class="top">
			<view class="icon">
				<image v-if="status == 1" src="/static/images/status/success.svg" mode=""></image>
				<image v-else src="/static/images/status/fail.svg" mode=""></image>
			</view>
			<view class="text" :class="status == 1 ? 's':'f'">
				{{status == 1 ? $t('status.success'):$t('status.fail')}}
			</view>
			<view class="money" v-if="status == 1">
				${{num}}
			</view>
			<view class="ercode" v-if="status == 1">
				<image src="/static/images/login/t-code.png" mode="aspectFill"></image>
			</view>
		</view>
		<view class="bottom">
			<view class="title">
				TXN  REF
			</view>
			<view class="name">
				{{id}}
			</view>
		</view>
		<view class="button" @click="back">
			{{$t('status.btn')}}
		</view>
		<footer-logo></footer-logo>
	</view>
</template>

<script>
	import music from '@/utils/music/music.js'
	export default {
		name:'status',
		data() {
			return {
				status: 1, // 1 成功 2失败
				num:'',
				id:'',
			}
		},
		onShow() {
			
		},
		onLoad(e){
			console.log(e)
			this.status = e.type || 1
			if(e.type == 1){
				music.success()
			}else{
				music.error()
			}
			this.num = e.num
			this.id = e.id
		},
		methods: {
			back(){
				uni.navigateBack()
			},
		}
	}
</script>

<style lang="scss" scoped>
@import 'status.scss';
</style>
