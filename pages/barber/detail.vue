<template>
  <view class="page bg-white min-h-screen">
    <view class="p-5">
      <!-- 顶部导航辅助 -->
      <!-- <view class="mb-4" @click="goBack">
        <text class="text-gray-500 text-sm bg-gray-100 px-3 py-1 rounded-full inline-flex items-center">
          <i class="fa-solid fa-chevron-left mr-1"></i> 返回
        </text>
      </view> -->

      <view class="flex items-center justify-between mb-6 pb-4 border-b border-b-solid border-gray-100">
        <text class="font-bold text-lg text-gray-800">预约详情</text>
        <view :class="['tag', statusClass]">{{ statusText }}</view>
      </view>

      <view class="space-y-4 mb-8">
        <view class="flex justify-between py-2">
          <text class="text-gray-500 text-sm">预约编号</text>
          <text class="text-gray-800 font-mono text-sm font-bold">{{ appointment.id }}</text>
        </view>
        <view class="flex justify-between py-2">
          <text class="text-gray-500 text-sm">预约时间</text>
          <text class="text-police font-bold font-mono text-lg">{{ appointment.date }} {{ appointment.time }}</text>
        </view>
        <view class="flex justify-between py-2">
          <text class="text-gray-500 text-sm">联系电话</text>
          <!-- 隐私处理：仅显示手机号 -->
          <text class="text-gray-800 text-sm font-bold font-mono">{{ userPhone }}</text>
        </view>
      </view>

      <!-- 评价内容展示区 -->
      <view v-if="appointment.status === '2' && appointment.rating"
        class="bg-gray-50 rounded-lg p-4 border border-gray-100 mb-20">
        <view class="font-bold text-sm mb-3 text-gray-700 flex items-center">
          <i class="fa-solid fa-comment-dots mr-2 text-police"></i>用户评价
        </view>
        <view class="flex items-center mb-2 text-yellow-500 text-sm">
          <i v-for="i in 5" :key="i" :class="['fa-star', i <= appointment.rating ? 'fa-solid' : 'fa-regular']"></i>
        </view>
        <text class="text-sm text-gray-600 bg-white p-3 rounded border border-gray-100 block">
          {{ appointment.comment || '暂无文字评价' }}
        </text>

        <!-- 图片展示区 -->
        <view v-if="appointment.imageList && appointment.imageList.length > 0" class="mt-3 flex flex-wrap -mx-1">
          <view v-for="(img, idx) in appointment.imageList" :key="idx" class="w-1/3 px-1 mb-2 relative"
            @click="previewImage(idx)">
            <image :src="img" mode="aspectFill" class="w-full h-24 rounded bg-gray-100 block"></image>
            <!-- 多图且超过9张时的指示器逻辑（按需）或简单的数量角标，这里暂不需要复杂逻辑，仅展示 -->
          </view>
        </view>
      </view>

      <!-- 底部操作按钮 -->
      <view
        class="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-t-solid border-gray-100 max-w-full mx-auto shadow-lg z-50">
        <button v-if="appointment.status === '0'" @click="handleComplete"
          class="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium py-3 rounded-full shadow-lg shadow-blue-100 active:opacity-90 transition-all mb-3 text-sm">
          确认完成服务
        </button>
        <button @click="goBack"
          class="w-full bg-white text-gray-500 font-medium py-3 rounded-full border border-gray-200 active:bg-gray-50 transition-all text-sm">
          返回列表
        </button>
      </view>
    </view>
  </view>
</template>

<script>
import { getAppointmentDetail, completeAppointment } from '@/api/haircut/haircut.js';
import { getDicts } from '@/api/system/dict/data.js';
import config from '@/config'

export default {
  data() {
    return {
      appointment: {},
      userPhone: '--',
      statusOptions: [],
      fromPage: '' // 记录来源页面
    };
  },
  onLoad(options) {
    this.getDictsData();
    if (options.id) {
      this.loadDetail(options.id);
    }
    // 记录来源，用于返回逻辑
    if (options.from) {
      this.fromPage = options.from;
    }
  },
  computed: {
    statusText() {
      const s = this.appointment.status;
      const dict = this.statusOptions.find(item => item.dictValue == s);
      return dict ? dict.dictLabel : '未知状态';
    },
    statusClass() {
      const s = this.appointment.status;
      if (s === '0') return 'bg-green-100 text-green-700';
      if (s === '1') return 'bg-yellow-100 text-yellow-700';
      if (s === '2') return 'bg-blue-100 text-blue-600';
      if (s === '9') return 'bg-gray-100 text-gray-500';
      return 'bg-gray-100 text-gray-400';
    }
  },
  methods: {
    getDictsData() {
      getDicts("b_appoint_status").then(response => {
        this.statusOptions = response.data;
      });
    },
    loadDetail(id) {
      uni.showLoading({ title: '加载中...' });
      getAppointmentDetail(id).then(res => {
        uni.hideLoading();
        const data = res.data || {};

        // 处理图片列表
        let images = [];
        if (data.imageList) {
          if (Array.isArray(data.imageList)) {
            images = data.imageList;
          } else if (typeof data.imageList === 'string') {
            images = data.imageList.split(',');
          }
        }

        // 处理图片URL前缀
        images = images.map(img => {
          if (!img) return '';
          if (img.startsWith('http://') || img.startsWith('https://')) {
            return img;
          }
          return config.baseUrl + img;
        }).filter(img => img);

        this.appointment = {
          id: data.id,
          date: data.appointDate,
          time: data.appointTime,
          status: data.status,
          rating: data.rating,
          comment: data.comment,
          imageList: images
        };
        this.userPhone = data.userPhone || '--';
      }).catch(err => {
        uni.hideLoading();
        uni.showToast({ title: '获取详情失败', icon: 'none' });
      });
    },
    goBack() {
      // 获取当前页面栈
      const pages = getCurrentPages();

      // 如果页面栈大于1，说明是从内部跳转过来的，可以直接返回
      if (pages.length > 1) {
        uni.navigateBack();
        return;
      }

      // 如果页面栈只有1个（如用户直接刷新了页面，或者扫码进入），
      // 则根据 fromPage 参数判断返回到哪里
      if (this.fromPage === 'history') {
        uni.reLaunch({
          url: '/pages/barber/history'
        });
      } else {
        // 默认为工作台
        uni.reLaunch({
          url: '/pages/barber/dashboard'
        });
      }
    },
    handleComplete() {
      uni.showModal({
        title: '确认',
        content: '确认理发已完成？',
        success: (res) => {
          if (res.confirm) {
            uni.showLoading({ title: '提交中...' });
            completeAppointment(this.appointment.id).then(res => {
              uni.hideLoading();
              uni.showToast({ title: '操作成功', icon: 'success' });
              // 更新状态为待评价
              this.appointment.status = '1';
              // 也可以重新加载详情
              // this.loadDetail(this.appointment.id);
            }).catch(err => {
              uni.hideLoading();
              // 错误处理通常由拦截器统一处理，这里可加额外提示
            });
          }
        }
      });
    },
    previewImage(current) {
      if (!this.appointment.imageList || !this.appointment.imageList.length) return;
      uni.previewImage({
        current: current,
        urls: this.appointment.imageList,
        indicator: 'number',
        loop: true
      });
    }
  }
};
</script>

<style scoped>
@import "/static/css/haircut.css";

.tag {
  padding: 2px 4px;
  border-radius: 4px;
  font-size: 11px;
}

/* 补充缺失的 Tailwind/Windi CSS 样式 */
.text-white {
  color: #ffffff;
}

.bg-gradient-to-r {
  background-image: linear-gradient(to right, var(--tw-gradient-stops));
}

.from-blue-600 {
  --tw-gradient-from: #2563eb;
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgba(37, 99, 235, 0));
}

.to-blue-500 {
  --tw-gradient-to: #3b82f6;
}

.shadow-blue-100 {
  box-shadow: 0 10px 15px -3px rgba(219, 234, 254, 1), 0 4px 6px -2px rgba(219, 234, 254, 1) !important;
}

.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.active\:opacity-90:active {
  opacity: 0.9;
}

.active\:bg-gray-50:active {
  background-color: #f9fafb;
}

/* 图片网格相关样式 */
.-mx-1 {
  margin-left: -0.25rem;
  margin-right: -0.25rem;
}

.px-1 {
  padding-left: 0.25rem;
  padding-right: 0.25rem;
}

.w-1\/3 {
  width: 33.333333%;
}

.h-24 {
  height: 6rem;
}

.flex-wrap {
  flex-wrap: wrap;
}

.block {
  display: block;
}

.aspect-fill {
  object-fit: cover;
}
</style>