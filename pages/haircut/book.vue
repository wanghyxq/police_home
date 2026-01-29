<template>
  <view class="page bg-white min-h-screen pb-safe">
    <view class="p-4">
      <!-- 顶部导航辅助 (如果非自定义导航栏可隐藏) -->
      <!-- <view class="mb-4" @click="goBack">
        <text class="text-gray-500 text-sm bg-gray-100 px-3 py-1 rounded-full inline-flex items-center">
          <i class="fa-solid fa-chevron-left mr-1"></i> 返回上一步
        </text>
      </view> -->

      <!-- 理发师信息卡片 -->
      <view class="flex items-center mb-6 mt-2 bg-gray-50 p-4 rounded-xl border border-gray-100">
        <view
          class="w-14 h-14 rounded-full flex-shrink-0 flex items-center justify-center mr-4 shadow-sm border border-gray-100 overflow-hidden bg-white">
          <image v-if="barberAvatar"
            :src="barberAvatar && barberAvatar.startsWith('http') ? barberAvatar : (baseUrl + (barberAvatar || ''))"
            class="w-full h-full" mode="aspectFill"></image>
          <i v-else class="fa-solid fa-user-tie text-2xl text-police"></i>
        </view>
        <view>
          <text class="text-lg font-bold block">{{ barberName }}</text>
          <!-- <text class="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full inline-block mt-1">空闲中</text> -->
          <text class="text-xs text-gray-500 mt-1 block">
            <i class="fa-solid fa-phone mr-1"></i>{{ barberPhone || '暂无联系方式' }}
          </text>
        </view>
      </view>

      <!-- 日期选择 -->
      <view class="font-bold text-gray-700 mb-3 text-sm">
        <!-- 1. 选择日期 <text class="text-xs font-normal text-gray-400">(仅限工作日)</text> -->
        1. 选择日期
      </view>

      <scroll-view scroll-x class="whitespace-nowrap mb-6 w-full">
        <view class="flex space-x-3 pb-2">
          <view v-for="(item, index) in dateList" :key="index" @click="selectDate(item)"
            class="flex-shrink-0 w-20 h-16 rounded-xl border flex flex-col items-center justify-center cursor-pointer transition mr-2"
            :class="selectedDate === item.fullDate ? 'bg-police text-white border-police shadow-md' : 'bg-gray-50 text-gray-500 border-gray-200'">
            <text class="text-xs font-bold mb-1">{{ item.displayWeek }}</text>
            <text class="text-xs font-mono">{{ item.displayDate }}</text>
          </view>
        </view>
      </scroll-view>

      <!-- 时段选择 -->
      <view class="font-bold text-gray-700 mb-3 text-sm">
        2. 选择时段 <text class="text-xs font-normal text-gray-400">({{ timeInterval }}分钟/号)</text>
      </view>

      <view v-if="loading" class="text-center py-4 text-gray-400 text-xs">加载排班中...</view>

      <view v-else class="grid grid-cols-4 gap-3 mb-24">
        <view v-for="(slot, index) in timeSlots" :key="index" @click="selectTime(slot)"
          class="py-2.5 rounded-lg border text-center text-xs font-mono cursor-pointer transition select-none"
          :class="getTimeSlotClass(slot)">
          {{ slot.time }}
        </view>
      </view>
    </view>

    <!-- 底部确认栏 (固定) -->
    <view
      class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-3 px-4 shadow-lg z-50 flex justify-between items-center pb-safe">
      <view class="mb-3">
        <text class="text-10 text-gray-500 block">已选时间</text>
        <text class="font-bold text-police text-lg font-mono">{{ selectedTime || '--:--' }}</text>
      </view>
      <button @click="submit" :disabled="!selectedTime || submitting" :class="[
        'bg-police text-white px-6 py-2.5 rounded-lg font-bold text-sm shadow-md transition mb-3 m-0',
        (!selectedTime || submitting) ? 'bg-gray-300 shadow-none' : ''
      ]">
        立即预约
      </button>
    </view>
  </view>
</template>

<script>
import { getBarberCalendar, getAppointmentSlots, submitAppointment } from '@/api/haircut/haircut.js';
import config from '@/config.js';

export default {
  data() {
    return {
      barberId: null,
      barberName: '',
      barberPhone: '',
      barberAvatar: '',
      baseUrl: config.baseUrl,
      timeInterval: 15, // 默认15分钟
      dateList: [],
      timeSlots: [],
      selectedDate: '',
      selectedTime: '',
      loading: false
    };
  },
  onLoad(options) {
    this.barberId = options.id;
    this.barberName = options.name;
    this.barberPhone = options.phone || '';
    if (options.interval) {
      this.timeInterval = options.interval;
    }
    if (options.avatar) {
      this.barberAvatar = options.avatar;
    }

    this.initCalendar();
  },
  methods: {
    goBack() {
      uni.navigateTo({
        url: `/pages/haircut/barber-list`
      });
    },
    initCalendar() {
      // 从后端获取可预约日期
      getBarberCalendar(this.barberId).then(response => {
        const list = response.data || [];
        this.dateList = list.map(item => ({
          fullDate: item.date,
          displayWeek: item.displayWeek,
          displayDate: item.displayDate
        }));

        // 默认选中第一天
        if (this.dateList.length > 0) {
          this.selectDate(this.dateList[0]);
        }
      }).catch(err => {
        uni.showToast({ title: '获取日历失败', icon: 'none' });
      });
    },
    selectDate(item) {
      this.selectedDate = item.fullDate;
      this.selectedTime = '';
      this.fetchSlots();
    },
    fetchSlots() {
      this.loading = true;
      this.timeSlots = [];
      this.selectedTime = '';

      getAppointmentSlots(this.barberId, this.selectedDate).then(response => {
        const slots = response.data || [];
        this.timeSlots = slots;

        if (this.timeSlots.length === 0) {
          // 暂无号源
        }
      }).catch(err => {
        uni.showToast({ title: '获取号源失败', icon: 'none' });
      }).finally(() => {
        this.loading = false;
      });
    },
    selectTime(slot) {
      if (slot.status !== 'available') return;
      this.selectedTime = slot.time;
    },
    getTimeSlotClass(slot) {
      if (slot.status !== 'available') {
        return 'slot-disabled bg-gray-100 text-gray-300 border-transparent cursor-not-allowed';
      }
      if (this.selectedTime === slot.time) {
        return 'slot-selected shadow-md'; // haircut.css 中定义的类
      }
      return 'bg-white text-gray-600 border-gray-200 hover:border-police hover:text-police';
    },
    submit() {
      // 1. 参数校验
      if (!this.barberId || !this.selectedDate || !this.selectedTime) {
        uni.showToast({ title: '请选择完整的预约信息', icon: 'none' });
        return;
      }

      // 2. 状态控制
      if (this.submitting) return;
      this.submitting = true;

      const data = {
        barberId: this.barberId,
        scheduleDate: this.selectedDate,
        startTime: this.selectedTime
      };

      uni.showLoading({ title: '预约中...' });

      // 3. 调用接口
      submitAppointment(data).then(response => {
        // 成功处理
        uni.hideLoading();
        this.submitting = false;

        // 成功提示
        uni.showToast({ title: '操作成功', icon: 'success' });

        // 延迟跳转以便显示提示
        setTimeout(() => {
          uni.redirectTo({
            url: `/pages/haircut/success?date=${this.selectedDate}&time=${this.selectedTime}&name=${this.barberName}`
          });
        }, 1000);

      }).catch(err => {
        // 失败处理
        uni.hideLoading();
        this.submitting = false;

        const msg = err.msg || '预约失败';

        // 特定错误信息处理
        if (msg.includes('该时段已被预约')) {
          uni.showModal({
            title: '提示',
            content: '该时段已被预约，请重新选择',
            showCancel: false,
            success: () => {
              // 刷新排班
              this.fetchSlots();
            }
          });
        } else if (msg.includes('已有预约')) {
          uni.showModal({
            title: '提示',
            content: '您在此时段已有预约，请勿重复提交',
            showCancel: false
          });
        } else {
          uni.showToast({ title: msg, icon: 'none' });
        }
      });
    }
  }
};
</script>

<style scoped>
@import "/static/css/haircut.css";
</style>