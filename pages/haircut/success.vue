<template>
  <view class="page bg-white min-h-screen pt-12 px-6 text-center">
    <view class="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
      <i class="fa-solid fa-check text-4xl text-green-500"></i>
    </view>
    <view class="text-2xl font-bold text-gray-800 mb-2 block">预约成功</view>
    <view class="text-gray-500 text-xs mb-8 block">请截屏或凭此页面按时前往</view>

    <view class="bg-white border border-gray-200 rounded-2xl p-6 mb-8 text-left shadow-lg relative overflow-hidden">
      <!-- 装饰圆圈 -->
      <view class="absolute -right-4 -top-4 w-20 h-20 bg-green-500 opacity-10 rounded-full"></view>

      <view class="text-xs text-gray-400 mb-1">预约人手机</view>
      <view class="font-bold text-lg mb-4 font-mono tracking-wide">{{ info.phone }}</view>

      <view class="border-t border-dashed border-gray-200 my-3"></view>

      <view class="text-xs text-gray-400 mb-1">理发师</view>
      <view class="font-bold text-gray-800 mb-4">{{ info.barberName }}</view>

      <view class="text-xs text-gray-400 mb-1">预约时间</view>
      <view class="font-bold text-2xl text-police font-mono">{{ info.fullTime }}</view>
    </view>

    <button @click="goList"
      class="w-full border border-gray-300 text-gray-700 font-bold py-3 rounded-lg hover:bg-gray-50 text-sm bg-white">
      查看我的预约
    </button>
  </view>
</template>

<script>
export default {
  data() {
    return {
      info: {
        phone: '138****0000', // 实际应从 User Store 获取
        barberName: '',
        fullTime: ''
      }
    }
  },
  onLoad(options) {
    this.info.barberName = options.name;
    this.info.fullTime = `${options.date} ${options.time}`;
    // 这里应该获取当前用户信息
    // this.info.phone = this.$store.getters.name ... 
  },
  methods: {
    goList() {
      uni.redirectTo({ url: '/pages/haircut/appointments' });
    }
  }
};
</script>

<style scoped>
@import "/static/css/haircut.css";
</style>