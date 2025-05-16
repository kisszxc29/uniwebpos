<template>
  <view class="head-card">
    <!-- <sun-header :title="$t('log.headTitle')"></sun-header> -->
    <view class="img">
      <image v-for="(item,index) in 5" :key="index" class="svg" v-if="index == type"
        :src="`/static/images/headCard/hand-card-${index + 1}.svg`" mode="">
      </image>
    </view>
    <view class="t1">Total</view>
    <view class="t2">
      S$1,000
    </view>
    <view class="t3">
      Tap, Insert, or Swipe to pay
    </view>
    <view class="footer-btn" @click="cancel">
      Tap to cancel
    </view>
  </view>
</template>

<script>
  import sunHeader from '@/components/sun-header/sun-header.vue'
  export default {
    name: 'headCard',
    components: {
      sunHeader
    },
    data() {
      return {
        type: 0, // 5个图片
      }
    },
    onShow() {

    },
    onLoad(e) {
      // 循环切换图片
      let i = 0
      setInterval(() => {
        this.type = i
        i++
        if (i > 4) {
          i = 0
        }
      }, 2000)
    },
    methods: {
      back() {
        uni.navigateBack()
      },
      cancel() {
        uni.showToast({
          title: '点击了'
        })
      },
    }
  }
</script>

<style lang="scss" scoped>
  @import 'headCard.scss';
</style>