<template>
  <view class="page bg-gray-50 min-h-screen">
    <!-- 顶部个人信息栏 -->
    <view class="bg-white p-6 mb-3 flex items-center border-b border-gray-100">
      <view class="relative mr-4" @click="handleToAvatar">
        <image v-if="user.avatar" :src="user.avatar" class="w-16 h-16 rounded-full border-2 border-gray-100" mode="aspectFill"></image>
        <view v-else class="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center border-2 border-gray-100">
           <i class="fa-solid fa-user text-gray-400 text-3xl"></i>
        </view>
        <view class="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow border border-gray-100 w-6 h-6 flex items-center justify-center">
          <i class="fa-solid fa-camera text-gray-400 text-10px"></i>
        </view>
      </view>

      <view class="flex-1">
        <view class="flex items-center mb-1">
          <text class="text-lg font-bold text-gray-800 mr-2">{{ user.realName || user.name }}</text>
          <text class="bg-green-100 text-green-700 text-10px px-2 py-0.5 rounded border border-green-200">理发师</text>
        </view>
        <text class="text-gray-500 text-xs">{{ maskPhone(user.phone) }}</text>
      </view>
      <i class="fa-solid fa-chevron-right text-gray-300"></i>
    </view>

    <!-- 菜单列表 -->
    <view class="bg-white mb-3 border-y border-gray-100">
      <view class="flex items-center p-4 border-b border-gray-100" hover-class="bg-gray-50" @click="handleToInfo">
        <i class="fa-regular fa-address-card text-police opacity-80 w-6 text-lg"></i>
        <text class="text-sm flex-1 text-gray-700">个人信息</text>
        <i class="fa-solid fa-chevron-right text-gray-300 text-xs"></i>
      </view>
      <view class="flex items-center p-4" hover-class="bg-gray-50" @click="handleSchedule">
        <i class="fa-solid fa-calendar-check text-green-500 opacity-80 w-6 text-lg"></i>
        <text class="text-sm flex-1 text-gray-700">排班查询</text>
        <i class="fa-solid fa-chevron-right text-gray-300 text-xs"></i>
      </view>
    </view>

    <view class="bg-white mb-6 border-y border-gray-100">
      <view class="flex items-center p-4 border-b border-gray-100" hover-class="bg-gray-50" @click="handleSecurity">
        <i class="fa-solid fa-shield-halved text-purple-500 opacity-80 w-6 text-lg"></i>
        <text class="text-sm flex-1 text-gray-700">账号安全</text>
        <i class="fa-solid fa-chevron-right text-gray-300 text-xs"></i>
      </view>
    </view>

    <!-- 退出登录按钮 -->
    <view class="px-4">
      <button @click="handleLogout"
        class="bg-white text-red-500 py-3 rounded-lg shadow-sm text-sm font-bold border border-gray-200">退出登录</button>
    </view>

    <!-- 底部导航 -->
    <barber-tabbar :current="2"></barber-tabbar>
  </view>
</template>

<script>
import BarberTabbar from './components/barber-tabbar.vue';
import DB from '@/common/haircut_data.js';

export default {
  components: { BarberTabbar },
  data() {
    return {
      user: {}
    };
  },
  onShow() {
    this.user = DB.currentUser || { name: '未登录', phone: '' };
  },
  methods: {
    maskPhone(p) { return p ? p.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2") : "--"; },
    handleToAvatar() {
      uni.showToast({ title: '更换头像功能开发中', icon: 'none' });
    },
    handleToInfo() {
      uni.showToast({ title: '个人信息功能开发中', icon: 'none' });
    },
    handleSchedule() {
      uni.showToast({ title: '排班查询功能开发中', icon: 'none' });
    },
    handleSecurity() {
      uni.showToast({ title: '账号安全功能开发中', icon: 'none' });
    },
    handleLogout() {
      uni.showModal({
        title: '提示',
        content: '确定退出登录吗？',
        success: (res) => {
          if (res.confirm) {
            DB.currentUser = null;
            uni.reLaunch({ url: '/pages/login' });
          }
        }
      });
    }
  }
};
</script>

<style scoped>
@import "/static/css/haircut.css";
</style>