<template>
  <view class="page bg-gray-50 min-h-screen">
    <!-- 顶部导航栏占位(如果使用了自定义导航栏) -->
    
    <view class="p-4 space-y-4 ">

      <!-- 标题 -->
      <view class="font-bold text-gray-700 text-lg border-police pl-3 flex justify-between items-center" style="border-left-width: 4px;">
        选择理发师
      </view>

      <!-- 列表区域 -->
      <view class="space-y-4">
        <view v-for="(item, index) in barberList" :key="index" 
              class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between transition active:opacity-70"
			  :style="{ cursor: 'pointer' }"
              @click="handleBook(item)">
          <view class="flex items-center">
            <!-- 头像 -->
            <view class="w-12 h-12 rounded-full mr-3 border border-gray-100 overflow-hidden">
               <image :src="item.avatar || '/static/images/profile.jpg'" class="w-full h-full" mode="aspectFill"></image>
            </view>
            <view>
              <text class="font-bold text-gray-800 block text-base">{{ item.nickName || item.userName }}</text>
              <view class="text-gray-400 mt-1 flex space-x-2" style="font-size: 10px;">
                <text class="bg-gray-100 rounded" style="padding: 2px 6px;">男士快剪</text>
              </view>
            </view>
          </view>
          <button class="bg-white border border-police text-police px-4 rounded-lg text-xs font-bold shadow-sm " 
		  style="padding-top: 6px; padding-bottom: 6px; margin-left: 0; margin-right: 0;">预约</button>
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

export default {
  components: { HaircutTabbar },
  data() {
    return {
      barberList: []
    };
  },
  onLoad() {
    this.getList();
  },
  methods: {
    getList() {
      // 对接后端接口
      listBarbers().then(response => {
         // 如果后端没数据，这里为了演示保留一个mock fallback，实际开发请删除
         this.barberList = response.rows || [
             { userId: 1, nickName: '张师傅', avatar: '/static/images/profile.jpg' }, 
             { userId: 2, nickName: '李师傅', avatar: '/static/images/profile.jpg' }
         ];
      });
    },
    handleBook(barber) {
      uni.navigateTo({
        url: `/pages/haircut/book?id=${barber.userId}&name=${barber.nickName || barber.userName}`
      });
    }
  }
};
</script>

<style scoped>
@import "/static/css/haircut.css";
</style>