<template>
  <view class="page bg-gray-50 min-h-screen">
    <view class="p-4 pb-20">
      <view class="font-bold text-lg mb-4 text-gray-700">我的预约记录</view>

      <!-- 筛选器 -->
      <view class="bg-white p-3 mb-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
         <view class="flex-1 mr-4">
             <text class="text-[10px] text-gray-400 block mb-1">按月筛选 / 日期筛选</text>
             <view class="flex space-x-2">
                <picker mode="date" fields="month" :value="queryParams.month" @change="bindMonthChange" class="border-b border-gray-200">
                    <view class="w-24 text-sm font-mono border-b border-gray-200 py-1 text-gray-700">
                        {{ queryParams.month || '选择月份' }}
                    </view>
                </picker>
                <picker mode="date" :value="queryParams.date" @change="bindDateChange" class="border-b border-gray-200">
                    <view class="w-28 text-sm font-mono border-b border-gray-200 py-1 text-gray-700">
                        {{ queryParams.date || '选择日期' }}
                    </view>
                </picker>
             </view>
         </view>
         <button @click="resetQuery" class="text-xs text-blue-600 bg-blue-50 px-3 py-1.5 rounded m-0 border-0">重置</button>
      </view>

      <!-- 列表 -->
      <view class="space-y-4">
        <view v-if="loading" class="text-center py-4 text-gray-400">加载中...</view>
        <view v-else-if="list.length === 0" class="flex flex-col items-center justify-center mt-12 text-gray-300">
            <i class="fa-regular fa-calendar-xmark text-4xl mb-2"></i>
            <text class="text-xs">暂无预约记录</text>
        </view>

        <view v-for="(item, index) in list" :key="index" class="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <view class="flex justify-between items-start mb-3">
                <view class="flex items-center">
                    <view class="w-2 h-2 rounded-full mr-2" 
                          :class="getStatusColor(item.status, 'dot')"></view>
                    <text class="font-bold text-gray-800 text-sm">{{ item.barberName }}</text>
                </view>
                <!-- 状态标签 -->
                <text class="text-xs px-2 py-0.5 rounded font-medium" 
                      :class="getStatusColor(item.status, 'badge')">
                      {{ getStatusText(item.status) }}
                </text>
            </view>
            <view class="text-xs text-gray-500 mb-3 space-y-1.5 pl-4 border-l-2 border-gray-50 ml-1">
                <view class="font-mono">
                    <i class="fa-regular fa-clock w-4 text-center"></i> 
                    {{ item.scheduleDate }} 
                    <text class="font-bold text-gray-800 ml-1">{{ item.startTime }}</text>
                </view>
                <view>
                    <i class="fa-solid fa-phone w-4 text-center"></i> 138****9999
                </view>
            </view>
            
            <!-- 操作栏 -->
            <view class="flex justify-end pt-2 border-t border-gray-50">
                <view v-if="item.status === 'booked'">
                    <text v-if="item.isLocked" class="text-[10px] text-orange-400 flex items-center bg-orange-50 px-2 py-1 rounded">
                        <i class="fa-solid fa-lock mr-1"></i>临近不可取消
                    </text>
                    <button v-else @click="handleCancel(item.id)" class="text-xs border border-gray-300 px-3 py-1 rounded text-gray-600 bg-white active:bg-gray-50 m-0">
                        取消预约
                    </button>
                </view>
                <!-- <button v-else-if="item.status === 'pending_eval'" @click="goRate(item)" class="bg-police text-white text-xs px-3 py-1 rounded shadow-sm m-0 hover:bg-police-dark">
                    立即评价
                </button> -->
                <!-- <view v-else-if="item.status === 'completed'" class="text-gray-400 text-xs flex items-center">
                    已完成 <text v-if="item.rating" class="text-yellow-400 ml-1">({{item.rating}}星)</text>
                </view> -->
				<button v-else-if="item.status === 'pending_eval'" @click="goRate(item.id)" class="bg-police text-white text-xs px-3 py-1 rounded shadow-sm m-0">立即评价</button>
				<view v-else-if="item.status === 'completed'" class="text-yellow-500 text-xs"><i class="fa-solid fa-star"></i> {{ item.rating }}分</view>
            </view>
        </view>
      </view>
    </view>
    
    <!-- 底部导航 -->
    <haircut-tabbar :current="1"></haircut-tabbar>
  </view>
</template>

<script>
import { listMyAppointments, cancelAppointment } from '@/api/haircut/haircut.js';
import HaircutTabbar from './components/haircut-tabbar.vue';

export default {
  components: { HaircutTabbar },
  data() {
    return {
      loading: false,
      list: [],
      queryParams: {
        month: '',
        date: ''
      }
    };
  },
  onShow() {
    // 每次进入页面刷新数据
    this.getList();
  },
  methods: {
    getList() {
      this.loading = true;
      listMyAppointments(this.queryParams).then(res => {
          // 模拟数据结构
          const mockData = [
              { id: 1, barberName: '张师傅', scheduleDate: '2026-01-25', startTime: '09:00', status: 'booked', isLocked: false },
              { id: 2, barberName: '李师傅', scheduleDate: '2025-12-24', startTime: '14:00', status: 'pending_eval' },
              { id: 3, barberName: '王师傅', scheduleDate: '2025-12-20', startTime: '10:00', status: 'completed', rating: 5 }
          ];
          this.list = res.rows || mockData; 
          this.loading = false;
      }).catch(() => {
          this.loading = false;
      });
    },
    bindMonthChange(e) {
        this.queryParams.month = e.detail.value;
        this.queryParams.date = '';
        this.getList();
    },
    bindDateChange(e) {
        this.queryParams.date = e.detail.value;
        this.queryParams.month = '';
        this.getList();
    },
    resetQuery() {
        this.queryParams = { month: '', date: '' };
        this.getList();
    },
    handleCancel(id) {
        uni.showModal({
            title: '提示',
            content: '确定要取消当前预约吗？',
            success: (res) => {
                if (res.confirm) {
                    cancelAppointment(id).then(() => {
                        uni.showToast({ title: '取消成功' });
                        this.getList();
                    });
                }
            }
        })
    },
    goRate(item) {
        uni.navigateTo({ url: `/pages/haircut/rate?id=${item.id}` });
    },
    // 样式辅助函数
    getStatusText(status) {
        const map = { booked: '待服务', pending_eval: '待评价', completed: '已完成', cancelled: '已取消' };
        return map[status] || status;
    },
    getStatusColor(status, type) {
        if (type === 'dot') {
            if (status === 'booked') return 'bg-green-500';
            if (status === 'pending_eval') return 'bg-yellow-400';
            return 'bg-gray-300';
        }
        if (type === 'badge') {
            if (status === 'booked') return 'bg-green-100 text-green-700';
            if (status === 'pending_eval') return 'bg-yellow-100 text-yellow-700';
            return 'text-gray-400';
        }
    }
  }
};
</script>

<style scoped>
@import "/static/css/haircut.css";
</style>