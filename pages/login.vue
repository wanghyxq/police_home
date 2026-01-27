<template>
  <view class="page bg-white h-full flex flex-col justify-center px-8 min-h-screen">
    <!-- 头部 Logo 区域 -->
    <view class="flex flex-col items-center justify-center mb-6" style="margin-top: -100rpx;">
      <view class="w-24 h-24 bg-police-light rounded-full flex items-center justify-center mb-6 shadow-inner"
        style="background-color: rgba(0,47,167,0.05); width: 180rpx; height: 180rpx; border-radius: 50%;">
        <!-- 使用 text-police 类或直接内联颜色 -->
        <i class="fa-solid fa-building-shield text-5xl text-police"></i>
      </view>
      <text class="text-2xl font-bold text-gray-800 mb-1">民警之家</text>
      <text class="text-gray-400 mb-10 text-sm tracking-wide">内部综合服务门户</text>
    </view>

    <!-- 表单区域 -->
    <view class="w-full">
      <!-- 账号输入框 -->
      <view class="relative mb-5">
        <view class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <i class="fa-solid fa-user text-gray-400"></i>
        </view>
        <!-- 绑定 loginForm.username -->
        <input v-model="loginForm.username" type="text"
          class="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 bg-gray-50" placeholder="请输入账号"
          style="height: 90rpx;" />
      </view>

      <!-- 密码输入框 -->
      <view class="relative mb-5">
        <view class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <i class="fa-solid fa-lock text-gray-400"></i>
        </view>
        <!-- 绑定 loginForm.password -->
        <input v-model="loginForm.password" type="password"
          class="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 bg-gray-50" placeholder="请输入密码"
          style="height: 90rpx;" />
      </view>

      <!-- 验证码输入框 -->
      <view class="relative mb-5 flex items-center" v-if="captchaEnabled">
        <view class="flex-1 relative">
          <view class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <i class="fa-solid fa-shield-cat text-gray-400"></i>
          </view>
          <!-- 绑定 loginForm.code -->
          <input v-model="loginForm.code" type="number"
            class="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 bg-gray-50" placeholder="验证码" maxlength="4"
            style="height: 90rpx;" />
        </view>
        <!-- 验证码图片 -->
        <image :src="codeUrl" @click="getCode" class="ml-2 rounded-lg" style="width: 200rpx; height: 90rpx;"
          mode="aspectFit"></image>
      </view>

      <!-- 登录按钮 -->
      <button @click="handleLogin"
        class="w-full bg-police text-white flex items-center justify-center font-bold rounded-lg shadow-lg mt-2 transition text-lg"
        style="height: 90rpx;" hover-class="opacity-90">
        登 录
      </button>
    </view>

    <!-- 底部版权 -->
    <view class="mt-auto mb-6 text-center absolute bottom-0 w-full left-0 pb-12">
      <text class="text-gray-300 text-10">仅限内部人员使用 | 这里的安全由我们守护</text>
    </view>
  </view>
</template>

<script>
import { getCodeImg } from '@/api/login'
import { getToken } from '@/utils/auth'

export default {
  data() {
    return {
      codeUrl: "",
      captchaEnabled: true,
      // 用户注册开关
      register: false,
      globalConfig: getApp().globalData.config,
      loginForm: {
        username: "why",
        password: "admin123",
        code: "",
        uuid: ""
      }
    }
  },
  created() {
    this.getCode()
  },
  onLoad() {
    //#ifdef H5
    if (getToken()) {
      uni.reLaunch({ url: '/pages/index' })
    }
    //#endif
  },
  methods: {
    // 获取图形验证码
    getCode() {
      getCodeImg().then(res => {
        this.captchaEnabled = res.captchaEnabled === undefined ? true : res.captchaEnabled
        if (this.captchaEnabled) {
          this.codeUrl = 'data:image/gif;base64,' + res.img
          this.loginForm.uuid = res.uuid
        }
      })
    },
    // 登录方法
    async handleLogin() {
      if (this.loginForm.username === "") {
        this.$modal.msgError("请输入账号")
      } else if (this.loginForm.password === "") {
        this.$modal.msgError("请输入密码")
      } else if (this.loginForm.code === "" && this.captchaEnabled) {
        this.$modal.msgError("请输入验证码")
      } else {
        this.$modal.loading("登录中，请耐心等待...")
        this.pwdLogin()
      }
    },
    // 密码登录
    async pwdLogin() {
      this.$store.dispatch('Login', this.loginForm).then(() => {
        this.$modal.closeLoading()
        this.loginSuccess()
      }).catch(() => {
        if (this.captchaEnabled) {
          this.getCode()
        }
      })
    },
    // 登录成功后，处理函数
    loginSuccess(result) {
      // 设置用户信息
      this.$store.dispatch('GetInfo').then(res => {
        uni.reLaunch({ url: '/pages/index' })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
/* 页面基础样式 */
.page {
  background-color: #ffffff;
  height: 100%;
}

/* 为了保证样式独立，这里复写了一些关键样式，防止未引入全局css时样式崩坏 */
.bg-police {
  background-color: #002FA7;
}

.text-police {
  color: #002FA7;
}
</style>