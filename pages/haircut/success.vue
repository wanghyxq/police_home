<!-- <template>
  <view class="page bg-white h-full pt-12 px-6 flex flex-col items-center">
    <view class="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-4">
      <i class="fa-solid fa-check text-4xl text-green-500"></i>
    </view>
    <text class="text-2xl font-bold text-gray-800 mb-2">预约成功</text>
    <text class="text-gray-500 text-xs mb-8">请截屏或凭此页面按时前往</text>

    <view class="w-full bg-gray-50 border border-gray-200 rounded-2xl p-6 mb-8 relative overflow-hidden">
      <view class="absolute -right-4 -top-4 w-20 h-20 bg-green-500 rounded-full opacity-10"></view>
      <text class="text-xs text-gray-400 mb-1 block">预约人手机</text>
      <text class="font-bold text-lg mb-4 font-mono tracking-wide block">{{ maskPhone(user.phone) }}</text>
      <view class="border-t border-dashed border-gray-200 my-3"></view>
      <text class="text-xs text-gray-400 mb-1 block">理发师</text>
      <text class="font-bold text-gray-800 mb-4 block">{{ bname }}</text>
      <text class="text-xs text-gray-400 mb-1 block">预约时间</text>
      <text class="font-bold text-2xl text-police font-mono block">{{ datetime }}</text>
    </view>

    <button class="w-full border border-gray-300 text-gray-700 font-bold py-3 rounded-lg hover:bg-gray-50 text-sm bg-white" @click="goList">查看我的预约</button>
  </view>
</template>

<script>
import DB from '@/common/haircut_data.js';
export default {
  data() { return { user: DB.currentUser, bname: '', datetime: '' }; },
  onLoad(opt) { this.bname = opt.name; this.datetime = `${opt.date} ${opt.time}`; },
  methods: {
    maskPhone(p) { return p.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2"); },
    goList() { uni.redirectTo({ url: '/pages/haircut/list' }); }
  }
};
</script><template>
  <view class="page bg-white h-full pt-12 px-6 flex flex-col items-center">
    <view class="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-4">
      <i class="fa-solid fa-check text-4xl text-green-500"></i>
    </view>
    <text class="text-2xl font-bold text-gray-800 mb-2">预约成功</text>
    <text class="text-gray-500 text-xs mb-8">请截屏或凭此页面按时前往</text>

    <view class="w-full bg-gray-50 border border-gray-200 rounded-2xl p-6 mb-8 relative overflow-hidden">
      <view class="absolute -right-4 -top-4 w-20 h-20 bg-green-500 rounded-full opacity-10"></view>
      <text class="text-xs text-gray-400 mb-1 block">预约人手机</text>
      <text class="font-bold text-lg mb-4 font-mono tracking-wide block">{{ maskPhone(user.phone) }}</text>
      <view class="border-t border-dashed border-gray-200 my-3"></view>
      <text class="text-xs text-gray-400 mb-1 block">理发师</text>
      <text class="font-bold text-gray-800 mb-4 block">{{ bname }}</text>
      <text class="text-xs text-gray-400 mb-1 block">预约时间</text>
      <text class="font-bold text-2xl text-police font-mono block">{{ datetime }}</text>
    </view>

    <button class="w-full border border-gray-300 text-gray-700 font-bold py-3 rounded-lg hover:bg-gray-50 text-sm bg-white" @click="goList">查看我的预约</button>
  </view>
</template>

<script>
import DB from '@/common/haircut_data.js';
export default {
  data() { return { user: DB.currentUser, bname: '', datetime: '' }; },
  onLoad(opt) { this.bname = opt.name; this.datetime = `${opt.date} ${opt.time}`; },
  methods: {
    maskPhone(p) { return p.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2"); },
    goList() { uni.redirectTo({ url: '/pages/haircut/book' }); }
  }
};
</script> -->
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

    <button @click="goList" class="w-full border border-gray-300 text-gray-700 font-bold py-3 rounded-lg hover:bg-gray-50 text-sm bg-white">
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