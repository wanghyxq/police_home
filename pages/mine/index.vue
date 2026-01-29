<template>
  <view class="page bg-gray-50 min-h-screen">
    <!-- 顶部个人信息栏 -->
    <view class="bg-white p-6 mb-3 flex items-center border-b border-gray-100" @click="handleToInfo">
      <view class="relative mr-4">
        <!-- 未登录/无头像 -->
        <view v-if="!avatar"
          class="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center border-2 border-gray-100">
          <i class="iconfont icon-people text-gray-400 text-3xl"></i>
        </view>
        <!-- 已登录头像 -->
        <image v-else :src="avatar" class="w-16 h-16 rounded-full border-2 border-gray-100" mode="aspectFill"></image>

        <!-- 编辑头像图标 -->
        <view
          class="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow border border-gray-100 w-6 h-6 flex items-center justify-center"
          @click.stop="handleToAvatar">
          <i class="fa-solid fa-camera text-gray-400 text-10"></i>
        </view>
      </view>

      <view class="flex-1">
        <!-- 未登录 -->
        <view v-if="!name" @click.stop="handleToLogin" class="text-lg font-bold text-gray-800 mb-1">
          点击登录
        </view>
        <!-- 已登录 -->
        <view v-else>
          <view class="flex items-center mb-1">
            <text class="text-lg font-bold text-gray-800 mr-2">{{ name }}</text>
            <text class="bg-blue-50 text-police text-10 px-2 py-0.5 rounded border border-blue-100">{{ roleName
            }}</text>
          </view>
          <text class="text-gray-500 text-xs">个人信息 ></text>
        </view>
      </view>
      <i class="fa-solid fa-chevron-right text-gray-300"></i>
    </view>

    <!-- 菜单列表组 1 -->
    <view class="bg-white mb-3 border-y border-gray-100">
      <view class="flex items-center p-4 border-b border-gray-100" hover-class="bg-gray-50" @click="handleToEditInfo">
        <i class="iconfont icon-user text-police opacity-80 w-6 text-lg"></i>
        <text class="text-sm flex-1 text-gray-700">编辑资料</text>
        <i class="fa-solid fa-chevron-right text-gray-300 text-xs"></i>
      </view>
      <view class="flex items-center p-4 border-b border-gray-100" hover-class="bg-gray-50" @click="handleToAvatar">
        <i class="fa-solid fa-image-portrait text-green-500 opacity-80 w-6 text-lg"></i>
        <text class="text-sm flex-1 text-gray-700">修改头像</text>
        <i class="fa-solid fa-chevron-right text-gray-300 text-xs"></i>
      </view>
	  <view class="flex items-center p-4 border-b border-gray-100" hover-class="bg-gray-50" @click="handleToSetting">
	    <i class="iconfont icon-setting text-purple-500 opacity-80 w-6 text-lg"></i>
	    <text class="text-sm flex-1 text-gray-700">应用设置</text>
	    <i class="fa-solid fa-chevron-right text-gray-300 text-xs"></i>
	  </view>
    </view>

    <!-- 菜单列表组 2 -->
<!--    <view class="bg-white mb-6 border-y border-gray-100">
      
    </view> -->

    <!-- 退出登录按钮 -->
    <view class="mt-6" v-if="name">
      <button @click="handleLogout"
        class="logout-btn bg-white text-red-500 py-4 px-6 rounded-lg text-sm font-bold border border-gray-100 mx-4">退出登录</button>
    </view>

    <!-- 底部导航 (固定) -->
    <view v-if="!isBarber"
      class="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-3 pb-safe z-40 shadow-lg">
      <view class="flex flex-col items-center text-gray-400" @click="goHome">
        <i class="fa-solid fa-house text-xl mb-1"></i>
        <text class="text-10">首页</text>
      </view>
      <view class="flex flex-col items-center text-police">
        <i class="fa-regular fa-user text-xl mb-1"></i>
        <text class="text-10">我的</text>
      </view>
    </view>

    <!-- 理发师端底部导航 -->
    <barber-tabbar v-if="isBarber" :current="2"></barber-tabbar>
  </view>
</template>

<script>
import BarberTabbar from '@/pages/barber/components/barber-tabbar.vue';

export default {
  components: { BarberTabbar },
  data() {
    return {
    }
  },
  computed: {
    name() {
      return this.$store.state.user.name
    },
    avatar() {
      return this.$store.state.user.avatar
    },
    windowHeight() {
      return uni.getSystemInfoSync().windowHeight - 50
    },
    roleName() {
      const roles = this.$store.state.user.roles || [];
      if (roles.includes('admin')) return '管理员';
      if (roles.includes('barber')) return '理发师';
      return '民警';
    },
    isBarber() {
      const roles = this.$store.state.user.roles || [];
      return roles.includes('barber');
    }
  },
  methods: {
    handleToInfo() {
      uni.navigateTo({ url: '/pages/mine/info/index' })
    },
    handleToEditInfo() {
      uni.navigateTo({ url: '/pages/mine/info/edit' })
    },
    handleToSetting() {
      uni.navigateTo({ url: '/pages/mine/setting/index' })
    },
    handleToLogin() {
      uni.reLaunch({ url: '/pages/login' })
    },
    handleToAvatar() {
      uni.navigateTo({ url: '/pages/mine/avatar/index' })
    },
    handleBuilding() {
      this.$modal.showToast('模块建设中~')
    },
    handleLogout() {
      this.$modal.confirm('确定注销并退出系统吗？').then(() => {
        this.$store.dispatch('LogOut').then(() => {
          uni.reLaunch({ url: '/pages/index' })
        })
      })
    },
    goHome() {
      // 跳转回门户首页 (根据之前的路由规划，这里应该是 /pages/index 或 /pages/haircut/portal)
      // 假设您的门户首页是 /pages/index
      uni.reLaunch({ url: '/pages/index' })
    }
  }
}
</script>

<style scoped>
/* 引入全局样式垫片 */
@import "@/static/css/haircut.css";

/* 局部微调 */
.page {
  padding-bottom: 180rpx;
  /* 为底部导航留出空间 */
}

/* 修复按钮边框被::after遮挡的问题 */
.logout-btn::after {
  border: none;
}
</style>
