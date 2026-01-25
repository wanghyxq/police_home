<template>
  <view class="page bg-gray-50 min-h-screen">
    <view class="bg-white p-6 mb-3 flex items-center border-b border-gray-100">
      <view class="relative mr-4">
        <image :src="user.avatar" class="w-16 h-16 rounded-full border-2 border-gray-100" mode="aspectFill"></image>
        <view class="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow border border-gray-100 w-6 h-6 flex items-center justify-center">
          <i class="fa-solid fa-camera text-gray-400 text-10px"></i>
        </view>
      </view>
      <view class="flex-1">
        <view class="flex items-center mb-1">
          <text class="text-lg font-bold text-gray-800 mr-2">{{ user.name }}</text>
          <text class="bg-blue-50 text-police text-10px px-2 py-0.5 rounded border border-blue-100">民警</text>
        </view>
        <text class="text-gray-500 text-xs">{{ mask(user.phone) }}</text>
      </view>
      <i class="fa-solid fa-chevron-right text-gray-300"></i>
    </view>

    <view class="bg-white mb-6 border-y border-gray-100">
      <view class="flex items-center p-4 border-b border-gray-100">
        <i class="fa-solid fa-shield-halved text-purple-500 w-6 opacity-80"></i>
        <text class="text-sm flex-1 text-gray-700">账号安全</text>
        <i class="fa-solid fa-chevron-right text-gray-300 text-xs"></i>
      </view>
      <view class="flex items-center p-4">
        <i class="fa-regular fa-circle-question text-orange-500 w-6 opacity-80"></i>
        <text class="text-sm flex-1 text-gray-700">帮助中心</text>
        <i class="fa-solid fa-chevron-right text-gray-300 text-xs"></i>
      </view>
    </view>

    <view class="px-4">
      <button @click="logout" class="w-full bg-white text-red-500 py-3 rounded-lg shadow-sm text-sm font-bold border border-gray-200">退出登录</button>
    </view>

    <view class="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-3 pb-safe z-40 shadow-lg">
      <view class="flex flex-col items-center text-gray-400" @click="goHome"><i class="fa-solid fa-house text-xl mb-1"></i><text class="text-10px">首页</text></view>
      <view class="flex flex-col items-center text-police"><i class="fa-solid fa-user text-xl mb-1"></i><text class="text-10px">我的</text></view>
    </view>
  </view>
</template>

<script>
import DB from '@/common/haircut_data.js';
export default {
  data() { return { user: DB.currentUser || {} }; },
  methods: {
    mask(p) { return p ? p.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2") : ""; },
    goHome() { uni.redirectTo({ url: '/pages/haircut/portal' }); },
    logout() { uni.reLaunch({ url: '/pages/haircut/login' }); }
  }
};
</script>