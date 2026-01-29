<template>
  <view class="page bg-gray-50 min-h-screen">
    <!-- 顶部导航栏占位(如果使用了自定义导航栏) -->

    <view class="p-4 space-y-4 ">

      <!-- 标题 -->
      <view
        class="font-bold text-gray-700 text-lg border-police pl-3 flex justify-between border-l-solid border-l-4 items-center">
        选择理发师
      </view>

      <!-- 列表区域 -->
      <view class="space-y-4">
        <view v-if="loading && barberList.length === 0" class="text-center py-4 text-gray-400">加载中...</view>
        <view v-else-if="barberList.length === 0" class="text-center py-10 text-gray-400">暂无理发师</view>

        <view v-for="(item, index) in barberList" :key="index"
          class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between transition active:opacity-70"
          :style="{ cursor: 'pointer' }" @click="handleBook(item)">
          <view class="flex items-center">
            <!-- 头像 -->
            <view class="w-12 h-12 rounded-full mr-3 border border-gray-100 overflow-hidden">
              <image
                :src="item.avatar && item.avatar.startsWith('http') ? item.avatar : (baseUrl + (item.avatar || ''))"
                class="w-full h-full" mode="aspectFill" @error="handleImageError(index)"></image>
            </view>
            <view>
              <text class="font-bold text-gray-800 block text-base">{{ item.nickName || item.userName }}</text>
              <view class="text-gray-400 mt-2 flex flex-wrap gap-3 text-10">
                <text v-for="(tag, tIdx) in (item.tagList || [])" :key="tIdx"
                  class="bg-gray-100 rounded px-2 py-1 text-gray-500">{{ tag }}</text>
                <text v-if="!item.tagList || item.tagList.length === 0" class="text-gray-300">暂无标签</text>
              </view>
            </view>
          </view>
          <button class="bg-white border border-police text-police px-4 rounded-lg text-xs font-bold shadow-sm "
            style="padding-top: 6px; padding-bottom: 6px; margin-left: 0; margin-right: 0;">预约</button>
        </view>

        <view v-if="loading && barberList.length > 0" class="text-center py-2 text-gray-400 text-xs">加载更多...</view>
        <view v-if="!loading && isEnd && barberList.length > 0" class="text-center py-2 text-gray-300 text-xs">没有更多了
        </view>
      </view>
    </view>

    <!-- 底部导航组件 -->
    <haircut-tabbar :current="0"></haircut-tabbar>
  </view>
</template>

<script>
import { listBarbers } from '@/api/haircut/haircut.js';
import HaircutTabbar from './components/haircut-tabbar.vue';
import config from '@/config.js';

export default {
  components: { HaircutTabbar },
  data() {
    return {
      barberList: [],
      loading: false,
      baseUrl: config.baseUrl,
      queryParams: {
        pageNum: 1,
        pageSize: 10
      },
      total: 0,
      isEnd: false
    };
  },
  onLoad() {
    this.getList();
  },
  onPullDownRefresh() {
    this.queryParams.pageNum = 1;
    this.isEnd = false;
    this.getList();
  },
  onReachBottom() {
    if (!this.isEnd && !this.loading) {
      this.queryParams.pageNum++;
      this.getList();
    }
  },
  methods: {
    getList() {
      if (this.loading) return;
      this.loading = true;

      listBarbers(this.queryParams).then(response => {
        const rows = response.rows || [];
        this.total = response.total || 0;

        if (this.queryParams.pageNum === 1) {
          this.barberList = rows;
          uni.stopPullDownRefresh();
        } else {
          this.barberList = [...this.barberList, ...rows];
        }

        // 判断是否加载完毕
        if (this.barberList.length >= this.total) {
          this.isEnd = true;
        } else {
          this.isEnd = false;
        }

        this.loading = false;
      }).catch(err => {
        this.loading = false;
        uni.stopPullDownRefresh();
        uni.showToast({ title: '加载失败', icon: 'none' });
      });
    },
    handleBook(barber) {
      const name = barber.nickName || barber.userName;
      const timeInterval = barber.timeInterval || 15; // 默认15分钟
      const phone = barber.phone || '';
      uni.navigateTo({
        // 使用 encodeURIComponent 对中文参数进行编码
        url: `/pages/haircut/book?id=${barber.userId}&name=${encodeURIComponent(name)}&interval=${timeInterval}&phone=${encodeURIComponent(phone)}&avatar=${encodeURIComponent(barber.avatar || '')}`
      });
    },
    handleImageError(index) {
      // 图片加载失败时替换为默认图
      this.barberList[index].avatar = '/static/images/profile.jpg';
    }
  }
};
</script>

<style scoped>
@import "/static/css/haircut.css";
</style>