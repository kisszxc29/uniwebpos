<template>
	<view class="bottom-logo">
		<image src="/static/images/login/bottom-logo.svg" mode=""></image>
	</view>
</template>

<script>
	export default {
		name:"footerLogo",
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss" scoped>
.bottom-logo{
	position: fixed;
	width: 100%;
	bottom: calc(40rpx + constant(safe-area-inset-bottom));
	bottom: calc(40rpx + env(safe-area-inset-bottom));
	
	display: flex;
	align-items: center;
	justify-content: center;
	image{
		width: 330rpx;
		height: 40rpx;
	}
}
</style>