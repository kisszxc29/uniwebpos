<template>
  <view class="sun-header">
    <view style="height: 48rpx;"></view>
    <view class="nav">
      <view class="back" @click="back">
        <image src="/static/images/log/back.svg" mode="widthFix"></image>
      </view>
      <view class="title">
        {{$t(title)}}
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    name: "sun-header",
    props: {
      title: {
        default: 'History'
      }
    },
    data() {
      return {
        barheight: this.StatusBar
      };
    },
    mounted() {

    },
    methods: {
      back() {
        let pages = getCurrentPages();
        if (pages.length > 1) {
          uni.navigateBack({
            delta: 1
          })
        } else {
          uni.redirectTo({
            url: '/pages/pay/pay'
          })
        }
      },
    }
  }
</script>

<style lang="scss" scoped>
  .sun-header {
    position: fixed;
    top: 0;
    left: 0;
    box-sizing: border-box;
    width: 100%;
    height: 90px;
    background: #ffffffed;
    // filter: blur(20rpx);
    backdrop-filter: blur(20rpx);
    // box-sizing: content-box;
    z-index: 1000;

    .nav {
      display: flex;
      align-items: center;
      padding-left: 44rpx;
      box-sizing: border-box;
      height: 148rpx;

      .back {
        margin-right: 52rpx;
        width: 28rpx;
        height: 50rpx;

        image {
          width: 28rpx;
          height: 50rpx;
        }
      }

      .title {
        font-family: PingFangSC-SNaNrpxibold;
        font-weight: 600;
        font-size: 36rpx;
        color: #172432;
        letter-spacing: 0;
      }
    }
  }
</style>