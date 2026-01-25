<!-- <template>
  <view class="page bg-gray-50 min-h-screen">
    <view class="p-4 pb-20">
      <view class="flex justify-between items-center mb-3">
        <text class="font-bold text-lg text-gray-700">我的预约记录</text>
      </view>

      <!-- 筛选 -->
      <view class="bg-white p-3 mb-4 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between">
         <view class="flex-1 mr-4">
             <text class="text-10px text-gray-400 block mb-1">按月筛选 / 日期筛选</text>
             <view class="flex space-x-2">
                <picker mode="date" fields="month" :value="filterMonth" @change="e => changeFilter('month', e.detail.value)">
                    <view class="text-sm font-mono border-b border-gray-200 py-1">{{ filterMonth || '选择月份' }}</view>
                </picker>
                <picker mode="date" :value="filterDate" @change="e => changeFilter('date', e.detail.value)">
                    <view class="text-sm font-mono border-b border-gray-200 py-1">{{ filterDate || '选择日期' }}</view>
                </picker>
             </view>
         </view>
         <text @click="resetFilter" class="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">重置</text>
      </view>

      <!-- 列表 -->
      <view class="space-y-4">
        <view v-if="list.length === 0" class="text-center text-gray-400 py-10 text-xs">暂无数据</view>
        <view v-for="a in list" :key="a.id" class="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <view class="flex justify-between items-start mb-3">
                <view class="flex items-center">
                    <view :class="['w-2 h-2 rounded-full mr-2', a.status==='booked'?'bg-green-500':'bg-gray-300']"></view>
                    <text class="font-bold text-gray-800 text-sm">{{ getBName(a.barberId) }}</text>
                </view>
                <text v-if="a.status==='booked'" class="bg-green-100 text-green-700 text-xs px-2 py-1 rounded font-medium">待服务</text>
                <text v-if="a.status==='pending_eval'" class="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded font-medium">待评价</text>
                <text v-if="a.status==='completed'" class="text-gray-400 text-xs">已完成</text>
                <text v-if="a.status==='cancelled'" class="text-gray-300 text-xs">已取消</text>
            </view>
            <view class="text-xs text-gray-500 mb-3 space-y-1.5 pl-4 border-l-2 border-gray-50 ml-1">
                <view class="font-mono"><i class="fa-regular fa-clock w-4 text-center mr-1"></i>{{ a.date }} <text class="font-bold text-gray-800">{{ a.time }}</text></view>
                <view><i class="fa-solid fa-phone w-4 text-center mr-1"></i>138****9999</view>
            </view>
            <view class="flex justify-end pt-2 border-t border-gray-50">
                <view v-if="a.status==='booked'">
                    <text v-if="isLocked(a.date, a.time)" class="text-10px text-orange-400 flex items-center bg-orange-50 px-2 py-1 rounded"><i class="fa-solid fa-lock mr-1"></i>临近不可取消</text>
                    <button v-else @click="cancel(a.id)" class="text-xs border border-gray-300 px-3 py-1 rounded text-gray-600 bg-white m-0">取消预约</button>
                </view>
                <button v-if="a.status==='pending_eval'" @click="goRate(a.id)" class="bg-police text-white text-xs px-3 py-1 rounded shadow-sm m-0">立即评价</button>
                <view v-if="a.status==='completed'" class="text-yellow-400 text-xs"><i class="fa-solid fa-star"></i> {{ a.rating }}分</view>
            </view>
        </view>
      </view>
    </view>
    
    <view class="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-3 pb-safe z-40">
       <view class="flex flex-col items-center text-gray-400" @click="goHome"><i class="fa-solid fa-scissors text-xl mb-1"></i><text class="text-10px">理发预约</text></view>
       <view class="flex flex-col items-center text-police"><i class="fa-solid fa-clock-rotate-left text-xl mb-1"></i><text class="text-10px">我的预约</text></view>
    </view>
  </view>
</template>

<script>
import DB from '@/common/haircut_data.js';

export default {
  data() { return { list: [], filterDate: '', filterMonth: '' }; },
  onShow() { this.load(); },
  methods: {
    load() {
        let arr = DB.appointments.filter(a => a.userId === DB.currentUser.id);
        if(this.filterDate) arr = arr.filter(a => a.date === this.filterDate);
        else if(this.filterMonth) arr = arr.filter(a => a.date.startsWith(this.filterMonth));
        this.list = arr.sort((a,b) => b.date.localeCompare(a.date));
    },
    getBName(id) { const b = DB.getUserById(id); return b ? b.name : ''; },
    isLocked(d, t) { return (new Date(`${d}T${t}:00`) - new Date()) / 60000 < 30; },
    changeFilter(type, val) { 
        if(type==='month') { this.filterMonth=val; this.filterDate=''; }
        else { this.filterDate=val; this.filterMonth=''; }
        this.load();
    },
    resetFilter() { this.filterDate = ''; this.filterMonth = ''; this.load(); },
    cancel(id) {
        uni.showModal({ content: '确认取消？', success: (res) => {
            if(res.confirm) { DB.updateAppt(id, { status: 'cancelled' }); this.load(); }
        }});
    },
    goRate(id) { uni.navigateTo({ url: `/pages/haircut/rate?id=${id}` }); },
    goHome() { uni.redirectTo({ url: '/pages/haircut/barber' }); }
  }
};
</script> -->
<template>
  <view class="page bg-gray-50 min-h-screen">
    <view class="p-4 pb-20">
      <view class="flex justify-between items-center mb-3">
        <text class="font-bold text-lg text-gray-700">我的预约记录</text>
      </view>

      <!-- Filter -->
      <view class="bg-white p-3 mb-4 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between">
         <view class="flex-1 mr-4">
             <text class="text-[10px] text-gray-400 block mb-1">按月筛选 / 日期筛选</text>
             <view class="flex space-x-2">
                <!-- uni-app picker 替代原生 input type=month -->
                <picker mode="date" fields="month" :value="filterMonth" @change="bindMonthChange" class="border-b border-gray-200">
                    <view class="w-24 text-sm font-mono py-1">{{ filterMonth || '选择月份' }}</view>
                </picker>
                <picker mode="date" :value="filterDate" @change="bindDateChange" class="border-b border-gray-200">
                    <view class="w-32 text-sm font-mono py-1">{{ filterDate || '选择日期' }}</view>
                </picker>
             </view>
         </view>
         <text @click="resetFilter" class="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">重置</text>
      </view>

      <!-- List -->
      <view class="space-y-4">
        <view v-if="appointments.length === 0" class="text-center text-gray-400 py-10 text-xs">暂无数据</view>
        
        <view v-for="a in appointments" :key="a.id" class="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <view class="flex justify-between items-start mb-3">
                <view class="flex items-center">
                    <view :class="['w-2 h-2 rounded-full mr-2', a.status === 'booked' ? 'bg-green-500' : 'bg-gray-300']"></view>
                    <text class="font-bold text-gray-800 text-sm">{{ getBarberName(a.barberId) }}</text>
                </view>
                <!-- Status Tags -->
                <text v-if="a.status === 'booked'" class="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded font-medium">待服务</text>
                <text v-else-if="a.status === 'pending_eval'" class="bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded font-medium">待评价</text>
                <text v-else-if="a.status === 'completed'" class="text-gray-400 text-xs">已完成</text>
                <text v-else class="text-gray-300 text-xs">已取消</text>
            </view>
            
            <view class="text-xs text-gray-500 mb-3 space-y-1.5 pl-4 border-l-2 border-gray-50 ml-1">
                <view class="font-mono"><i class="fa-regular fa-clock w-4 text-center"></i> {{ a.date }} <text class="font-bold text-gray-800">{{ a.time }}</text></view>
                <view><i class="fa-solid fa-phone w-4 text-center"></i> 138****9999</view>
            </view>

            <view class="flex justify-end pt-2 border-t border-gray-50">
                <view v-if="a.status === 'booked'">
                    <text v-if="isLocked(a.date, a.time)" class="text-[10px] text-orange-400 flex items-center bg-orange-50 px-2 py-1 rounded"><i class="fa-solid fa-lock mr-1"></i>临近不可取消</text>
                    <button v-else @click="cancelAppt(a.id)" class="text-xs border border-gray-300 px-3 py-1 rounded text-gray-600 bg-white m-0">取消预约</button>
                </view>
                <button v-else-if="a.status === 'pending_eval'" @click="goRate(a.id)" class="bg-police text-white text-xs px-3 py-1 rounded shadow-sm m-0">立即评价</button>
                <view v-else-if="a.status === 'completed'" class="text-yellow-500 text-xs"><i class="fa-solid fa-star"></i> {{ a.rating }}分</view>
            </view>
        </view>
      </view>
    </view>

    <!-- 底部导航 -->
    <view class="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-3 pb-safe z-40">
       <view class="flex flex-col items-center text-gray-400" @click="goHome">
         <i class="fa-solid fa-scissors text-xl mb-1"></i>
         <text class="text-[10px]">理发预约</text>
       </view>
       <view class="flex flex-col items-center text-police">
         <i class="fa-solid fa-clock-rotate-left text-xl mb-1"></i>
         <text class="text-[10px]">我的预约</text>
       </view>
    </view>
  </view>
</template>

<script>
import DB from '@/common/haircut_data.js';

export default {
  data() {
    return {
      appointments: [],
      filterDate: '',
      filterMonth: ''
    };
  },
  onShow() {
    // 默认当月
    const now = new Date();
    this.filterMonth = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`;
    this.loadData();
  },
  methods: {
    loadData() {
      let list = DB.appointments.filter(a => a.userId === DB.currentUser.id);
      
      if (this.filterDate) {
        list = list.filter(a => a.date === this.filterDate);
      } else if (this.filterMonth) {
        list = list.filter(a => a.date.startsWith(this.filterMonth));
      }
      
      this.appointments = list.sort((a, b) => b.date.localeCompare(a.date));
    },
    getBarberName(id) {
      const b = DB.getUserById(id);
      return b ? b.name : '未知';
    },
    isLocked(d, t) {
      return (new Date(`${d}T${t}:00`) - new Date()) / 60000 < 30;
    },
    bindMonthChange(e) {
      this.filterMonth = e.detail.value;
      this.filterDate = '';
      this.loadData();
    },
    bindDateChange(e) {
      this.filterDate = e.detail.value;
      this.filterMonth = '';
      this.loadData();
    },
    resetFilter() {
      this.filterDate = '';
      this.filterMonth = '';
      this.loadData();
    },
    cancelAppt(id) {
      uni.showModal({
        title: '提示',
        content: '确定要取消预约吗？',
        success: (res) => {
          if (res.confirm) {
            DB.updateAppointment(id, { status: 'cancelled' });
            uni.showToast({ title: '已取消', icon: 'none' });
            this.loadData();
          }
        }
      });
    },
    goRate(id) {
      uni.navigateTo({ url: `/pages/haircut/rate?id=${id}` });
    },
    goHome() {
      uni.redirectTo({ url: '/pages/haircut/barber-list' });
    }
  }
};
</script>