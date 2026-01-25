<template>
  <view class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-3 pb-safe z-40 shadow-lg">
    <view class="flex flex-col items-center" :class="current === 0 ? 'text-police' : 'text-gray-400'" @click="switchTab(0)">
      <i class="fa-solid fa-scissors text-xl mb-1"></i>
      <text class="text-[10px]">理发预约</text>
    </view>
    <view class="flex flex-col items-center" :class="current === 1 ? 'text-police' : 'text-gray-400'" @click="switchTab(1)">
      <i class="fa-solid fa-clock-rotate-left text-xl mb-1"></i>
      <text class="text-[10px]">我的预约</text>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    current: {
      type: Number,
      default: 0
    }
  },
  methods: {
    switchTab(index) {
      if (this.current === index) return;
      if (index === 0) {
        uni.redirectTo({ url: '/pages/haircut/barber-list' });
      } else {
        uni.redirectTo({ url: '/pages/haircut/appointments' });
      }
    }
  }
}
</script>

<style scoped>
/* 引入全局兼容样式 */
@import "/static/css/haircut.css";
</style>