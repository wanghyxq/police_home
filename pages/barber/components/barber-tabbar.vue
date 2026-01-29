<template>
  <view
    class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-3 pb-safe z-40 shadow-lg">
    <view class="flex flex-col items-center" :class="current === 0 ? 'text-police' : 'text-gray-400'"
      @click="switchTab(0)">
      <i class="fa-solid fa-clipboard-list text-xl mb-1"></i>
      <text class="text-10">工作台</text>
    </view>
    <view class="flex flex-col items-center" :class="current === 1 ? 'text-police' : 'text-gray-400'"
      @click="switchTab(1)">
      <i class="fa-solid fa-clock-rotate-left text-xl mb-1"></i>
      <text class="text-10">历史预约</text>
    </view>
    <view class="flex flex-col items-center" :class="current === 2 ? 'text-police' : 'text-gray-400'"
      @click="switchTab(2)">
      <i class="fa-regular fa-user text-xl mb-1"></i>
      <text class="text-10">我的</text>
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
        uni.redirectTo({ url: '/pages/barber/dashboard' });
      } else if (index === 1) {
        uni.redirectTo({ url: '/pages/barber/history' });
      } else {
        uni.redirectTo({ url: '/pages/mine/index' });
      }
    }
  }
}
</script>

<style scoped>
@import "/static/css/haircut.css";
</style>