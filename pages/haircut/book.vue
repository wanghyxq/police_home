<!-- <template>
  <view class="page bg-white h-full">
    <view class="p-4"> 
      <view class="flex items-center mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100 mt-4">
        <view class="w-14 h-14 bg-white rounded-full flex items-center justify-center mr-4 shadow-sm text-police border border-gray-100">
          <i class="fa-solid fa-user-tie text-2xl"></i>
        </view>
        <view>
          <text class="text-lg font-bold block">{{ barberName }}</text>
          <text class="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full mt-1 inline-block">空闲中</text>
        </view>
      </view>

      <view class="font-bold text-gray-700 mb-3 text-sm">1. 选择日期 <text class="text-xs font-normal text-gray-400">(仅限工作日)</text></view>
      <scroll-view scroll-x class="whitespace-nowrap mb-6" style="width: 100%;">
        <view class="flex space-x-3 pb-2" style="display: flex;">
          <view v-for="(d, i) in dates" :key="i" 
            :class="['flex-shrink-0 w-20 h-16 rounded-xl border flex flex-col items-center justify-center transition mr-3', selectedDate===d.val ? 'bg-police text-white border-police shadow-md' : 'bg-gray-50 text-gray-500 border-gray-200']"
            @click="selectDate(d.val)">
            <text class="text-xs font-bold mb-1">{{ d.week }}</text>
            <text class="text-xs font-mono">{{ d.display }}</text>
          </view>
        </view>
      </scroll-view>

      <view class="font-bold text-gray-700 mb-3 text-sm">2. 选择时段 <text class="text-xs font-normal text-gray-400">(20分钟/号)</text></view>
      <view class="grid grid-cols-4 gap-3 mb-24">
        <view v-for="(t, i) in timeSlots" :key="i"
          :class="['py-2 rounded-lg border text-center text-xs font-mono', isBooked(t) ? 'bg-gray-100 text-gray-300 border-transparent' : selectedTime===t ? 'bg-police text-white border-police shadow-md' : 'bg-white text-gray-600 border-gray-200']"
          @click="!isBooked(t) && selectTime(t)">
          {{ t }}
        </view>
      </view>
    </view>

    <view class="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg z-50 flex justify-between items-center">
      <view>
        <text class="text-10px text-gray-500 block">已选时间</text>
        <text class="font-bold text-police text-lg font-mono">{{ selectedTime || '--:--' }}</text>
      </view>
      <button class="bg-police text-white px-6 py-2 rounded-lg font-bold text-sm shadow-md m-0" :disabled="!selectedTime" @click="confirm">立即预约</button>
    </view>
  </view>
</template>

<script>
import DB from '@/common/haircut_data.js';

export default {
  data() {
    return { barberId:'', barberName:'', dates:[], selectedDate:'', selectedTime:'', bookedList:[] };
  },
  onLoad(opt) {
    this.barberId = opt.id;
    this.barberName = opt.name;
    this.initDates();
    this.updateBooked();
  },
  computed: {
    timeSlots() {
      const slots = [];
      const addRange = (sh, sm, eh, em) => {
        let curr = new Date(); curr.setHours(sh, sm, 0, 0);
        const end = new Date(); end.setHours(eh, em, 0, 0);
        while(curr < end) {
          slots.push(`${String(curr.getHours()).padStart(2,'0')}:${String(curr.getMinutes()).padStart(2,'0')}`);
          curr.setMinutes(curr.getMinutes()+20);
        }
      };
      addRange(8,30,11,30); addRange(13,30,17,30);
      return slots;
    }
  },
  methods: {
    back() { uni.navigateBack(); },
    initDates() {
      let c = new Date(); let count = 0;
      while(count < 5) {
        if([1,3,5].includes(c.getDay())) {
          const val = c.toISOString().split('T')[0];
          this.dates.push({ val, week: ['日','一','二','三','四','五','六'][c.getDay()], display: `${c.getMonth()+1}-${c.getDate()}` });
          count++;
        }
        c.setDate(c.getDate()+1);
      }
      this.selectedDate = this.dates[0].val;
    },
    updateBooked() {
      this.bookedList = DB.appointments.filter(a => a.barberId===this.barberId && a.date===this.selectedDate && a.status!=='cancelled').map(a => a.time);
    },
    selectDate(d) { this.selectedDate = d; this.selectedTime = ''; this.updateBooked(); },
    selectTime(t) { this.selectedTime = t; },
    isBooked(t) { return this.bookedList.includes(t); },
    confirm() {
      DB.addAppt({ id: 'A'+Date.now(), userId: DB.currentUser.id, barberId: this.barberId, date: this.selectedDate, time: this.selectedTime, status: 'booked' });
      uni.navigateTo({ url: `/pages/haircut/success?date=${this.selectedDate}&time=${this.selectedTime}&name=${this.barberName}` });
    }
  }
};
</script> -->
<template>
  <view class="page bg-white min-h-screen pb-safe">
    <view class="p-4">
      <!-- 顶部导航辅助 (如果非自定义导航栏可隐藏) -->
      <view class="mb-4" @click="goBack">
          <text class="text-gray-500 text-sm bg-gray-100 px-3 py-1 rounded-full inline-flex items-center">
             <i class="fa-solid fa-chevron-left mr-1"></i> 返回上一步
          </text>
      </view>
      
      <!-- 理发师信息卡片 -->
      <view class="flex items-center mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
        <view class="w-14 h-14 bg-white rounded-full flex-shrink-0 flex items-center justify-center mr-4 shadow-sm text-police border border-gray-100">
          <i class="fa-solid fa-user-tie text-2xl"></i>
        </view>
        <view>
          <text class="text-lg font-bold block">{{ barberName }}</text>
          <text class="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full inline-block mt-1">空闲中</text>
        </view>
      </view>

      <!-- 日期选择 -->
      <view class="font-bold text-gray-700 mb-3 text-sm">
        1. 选择日期 <text class="text-xs font-normal text-gray-400">(仅限工作日)</text>
      </view>
      
      <scroll-view scroll-x class="whitespace-nowrap mb-6 w-full">
        <view class="flex space-x-3 pb-2">
          <view v-for="(item, index) in dateList" :key="index" 
               @click="selectDate(item)"
               class="flex-shrink-0 w-20 h-16 rounded-xl border flex flex-col items-center justify-center cursor-pointer transition mr-2"
               :class="selectedDate === item.fullDate ? 'bg-police text-white border-police shadow-md' : 'bg-gray-50 text-gray-500 border-gray-200'">
            <text class="text-xs font-bold mb-1">{{ item.week }}</text>
            <text class="text-xs font-mono">{{ item.date }}</text>
          </view>
        </view>
      </scroll-view>

      <!-- 时段选择 -->
      <view class="font-bold text-gray-700 mb-3 text-sm">
        2. 选择时段 <text class="text-xs font-normal text-gray-400">(20分钟/号)</text>
      </view>
      
      <view v-if="loading" class="text-center py-4 text-gray-400 text-xs">加载排班中...</view>
      
      <view v-else class="grid grid-cols-4 gap-3 mb-24">
        <view v-for="(slot, index) in timeSlots" :key="index"
              @click="selectTime(slot)"
              class="py-2.5 rounded-lg border text-center text-xs font-mono cursor-pointer transition select-none"
              :class="getTimeSlotClass(slot)">
          {{ slot.time }}
        </view>
      </view>
    </view>
    
    <!-- 底部确认栏 (固定) -->
    <view class="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg z-50 flex justify-between items-center pb-safe">
        <view>
            <text class="text-[10px] text-gray-500 block">已选时间</text>
            <text class="font-bold text-police text-lg font-mono">{{ selectedTime || '--:--' }}</text>
        </view>
        <button 
            @click="submit"
            :disabled="!selectedTime"
            class="bg-police text-white px-6 py-2.5 rounded-lg font-bold text-sm shadow-md disabled:bg-gray-300 disabled:shadow-none transition m-0">
            立即预约
        </button>
    </view>
  </view>
</template>

<script>
import { getBarberSchedule, submitAppointment } from '@/api/haircut/haircut.js';

export default {
  data() {
    return {
      barberId: null,
      barberName: '',
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
    this.initCalendar();
    // 默认选中第一天
    if(this.dateList.length > 0) {
        this.selectDate(this.dateList[0]);
    }
  },
  methods: {
    goBack() {
        uni.navigateTo({
			url: `/pages/haircut/barber-list`
		});
    },
    initCalendar() {
       // 生成未来7天的工作日(周一、三、五)
       const arr = [];
       let d = new Date();
       for(let i=0; i<14; i++) {
           const day = d.getDay();
           if(day === 1 || day === 3 || day === 5) { // 周一三五
               const mon = d.getMonth() + 1;
               const date = d.getDate();
               const fullDate = d.toISOString().split('T')[0];
               const weeks = ['日','一','二','三','四','五','六'];
               arr.push({
                   fullDate: fullDate,
                   week: '周' + weeks[day],
                   date: `${mon}-${date}`
               });
           }
           d.setDate(d.getDate() + 1);
           if(arr.length >= 5) break;
       }
       this.dateList = arr;
    },
    selectDate(item) {
        this.selectedDate = item.fullDate;
        this.selectedTime = '';
        this.fetchSlots();
    },
    fetchSlots() {
        this.loading = true;
        // 模拟生成时段，实际应调用 getBarberSchedule(this.barberId, this.selectedDate)
        // getBarberSchedule...
        setTimeout(() => {
            this.generateMockSlots();
            this.loading = false;
        }, 300);
    },
    generateMockSlots() {
        // 生成 8:30-11:30, 13:30-17:30 间隔20分
        const slots = [];
        const create = (h, m) => {
             slots.push({
                 time: `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}`,
                 status: Math.random() > 0.7 ? 'booked' : 'available' // 随机模拟占用
             });
        }
        for(let h=8; h<11; h++) for(let m=30; m<60; m+=20) create(h, m); // 简化逻辑
        for(let h=13; h<17; h++) for(let m=30; m<60; m+=20) create(h, m);
        // 手动修正一些边界
        slots.push({time:'09:10', status:'available'}, {time:'09:30', status:'available'}, {time:'09:50', status:'available'});
        this.timeSlots = slots;
    },
    selectTime(slot) {
        if(slot.status !== 'available') return;
        this.selectedTime = slot.time;
    },
    getTimeSlotClass(slot) {
        if (slot.status === 'booked') {
            return 'slot-disabled bg-gray-100 text-gray-300 border-transparent';
        }
        if (this.selectedTime === slot.time) {
            return 'slot-selected shadow-md'; // haircut.css 中定义的类
        }
        return 'bg-white text-gray-600 border-gray-200 hover:border-police hover:text-police';
    },
    submit() {
        const data = {
            barberId: this.barberId,
            scheduleDate: this.selectedDate,
            startTime: this.selectedTime
        };
        // submitAppointment(data).then(...)
        
        // 演示跳转
        uni.navigateTo({
            url: `/pages/haircut/success?date=${this.selectedDate}&time=${this.selectedTime}&name=${this.barberName}`
        });
    }
  }
};
</script>

<style scoped>
@import "/static/css/haircut.css";
</style>