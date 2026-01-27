<template>
  <view class="bottom-nav-container">
    <view class="nav-content bg-white border-t flex justify-around py-3">
      <view v-for="(nav, index) in navs" :key="index" @click="handleNavClick(nav)" class="flex flex-col items-center"
        :class="current === index ? 'text-police' : 'text-gray-400'">
        <text class="text-xl mb-1">{{ nav.icon }}</text>
        <text class="text-10">{{ nav.name }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { defineProps } from 'vue'
import { useRouter } from 'uni-mini-router'

const props = defineProps({
  current: {
    type: Number,
    default: 0
  },
  navs: {
    type: Array,
    default: () => []
  }
})

const router = useRouter()

const handleNavClick = (nav) => {
  if (nav.page.startsWith('/')) {
    router.push(nav.page)
  } else {
    uni.navigateTo({
      url: nav.page
    })
  }
}
</script>

<style lang="scss" scoped>
.bottom-nav-container {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 40;
  max-width: 420px;
  margin: 0 auto;

  .nav-content {
    background-color: #ffffff;
    border-top: 1px solid #e5e7eb;
    box-shadow: 0 -5px 15px rgba(0, 0, 0, 0.02);

    .text-police {
      color: #002FA7;
    }

    .text-gray-400 {
      color: #9ca3af;
    }
  }
}
</style>