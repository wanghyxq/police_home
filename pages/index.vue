<template>
  <view class="page bg-gray-100 min-h-screen">
    <!-- Header -->
    <view class="bg-police text-white p-4 sticky top-0 z-50 flex justify-between items-center shadow-md">
      <view class="flex items-center space-x-2">
        <i class="fa-solid fa-shield-halved text-xl"></i>
        <text class="font-bold text-lg ml-2">民警之家</text>
      </view>
      <view class="text-xs opacity-90">
        <text class=" text-white px-2 py-1 rounded text-10" v-if="user">
          {{ maskPhone(user.phone) }}
        </text>
      </view>
    </view>

    <!-- Banner -->
    <view class="bg-police pb-12 pt-2 px-4 rounded-b-2rem shadow-lg relative overflow-hidden">
      <view class="absolute top-0 right-0 opacity-10" style="right: -40rpx; top: -40rpx;">
        <i class="fa-solid fa-shield-cat text-9xl text-white"></i>
      </view>
      <text class="text-blue-200 text-xs block mb-1">Welcome Back</text>
      <text class="text-white text-2xl font-bold block">欢迎回来，战友</text>
      <view class="mt-4 bg-white rounded-full flex items-center px-4 py-2 text-white text-sm"
        style="background-color: rgba(255,255,255,0.2);">
        <i class="fa-solid fa-magnifying-glass mr-2"></i>
        <text class="opacity-70">搜索内部通知、服务...</text>
      </view>
    </view>

    <!-- Apps -->
    <view class="px-4 mt-8 relative z-10">
      <view class="bg-white rounded-xl shadow-sm p-4 grid grid-cols-4 gap-y-6">
        <view @click="goBarber" class="flex flex-col items-center">
          <view
            class="w-12 h-12 bg-blue-50 text-police rounded-2xl flex items-center justify-center mb-2 border border-blue-100">
            <i class="fa-solid fa-scissors text-xl"></i>
          </view>
          <text class="text-xs text-gray-600 font-medium">理发预约</text>
        </view>
        <view class="flex flex-col items-center" style="opacity: 50%;">
          <view
            class="w-12 h-12 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center mb-2 border border-orange-100">
            <i class="fa-solid fa-utensils text-xl"></i></view>
          <text class="text-xs text-gray-600">智慧食堂</text>
        </view>
        <view class="flex flex-col items-center" style="opacity: 50%;">
          <view
            class="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-2 border border-green-100">
            <i class="fa-solid fa-cake text-xl"></i></view>
          <text class="text-xs text-gray-600">智慧烘培</text>
        </view>
        <view class="flex flex-col items-center" style="opacity: 50%;">
          <view
            class="w-12 h-12 bg-yellow-50 text-yellow-600 rounded-2xl flex items-center justify-center mb-2 border border-yellow-100">
            <i class="fa-solid fa-hand-holding-medical text-xl"></i></view>
          <text class="text-xs text-gray-600">中医理疗</text>
        </view>
        <view class="flex flex-col items-center" style="opacity: 50%;">
          <view
            class="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-2 border border-purple-100">
            <i class="fa-solid fa-person-dress-burst text-xl"></i></view>
          <text class="text-xs text-gray-600">洗衣预约</text>
        </view>
      </view>
    </view>

    <!-- Notice -->
    <view class="px-4 mt-4">
      <view class="font-bold text-gray-700 text-sm mb-2 px-1 flex items-center">
        <view class="w-1 h-4 bg-police rounded mr-2"></view>最新通知
      </view>
      <view class="bg-white rounded-xl shadow-sm p-4 space-y-3">
        <view class="flex items-start border-b border-gray-50 pb-2">
          <text class="bg-red-100 text-red-500 text-10 px-2 py-1 rounded mr-2 mt-1 font-bold">重要</text>
          <text class="text-sm text-gray-700 flex-1"
            style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">关于开展2025年全警实战大练兵的通知</text>
          <i class="fa-solid fa-chevron-right text-gray-300 text-xs mt-1 ml-2"></i>
        </view>
        <view class="flex items-start">
          <text class="bg-blue-100 text-blue-500 text-10 px-2 py-1 rounded mr-2 mt-1 font-bold">生活</text>
          <text class="text-sm text-gray-700 flex-1"
            style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">本周五理发室因设备检修暂停服务半天</text>
          <i class="fa-solid fa-chevron-right text-gray-300 text-xs mt-1 ml-2"></i>
        </view>
      </view>
    </view>

    <!-- Tabbar -->
    <view class="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-3 pb-safe z-40 shadow-lg">
      <view class="flex flex-col items-center text-police">
        <i class="fa-solid fa-house text-xl mb-1"></i>
        <text class="text-10">首页</text>
      </view>
      <view class="flex flex-col items-center text-gray-400" @click="goProfile">
        <i class="fa-regular fa-user text-xl mb-1"></i>
        <text class="text-10">我的</text>
      </view>
    </view>
  </view>
</template>

<script>
import DB from '@/common/haircut_data.js';

export default {
  data() { return { user: DB.currentUser }; },
  methods: {
    maskPhone(p) { return p ? p.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2") : ""; },
    goBarber() { uni.navigateTo({ url: '/pages/haircut/barber-list' }); },
    goProfile() { uni.redirectTo({ url: '/pages/mine/index' }); }
  }
};
</script>
