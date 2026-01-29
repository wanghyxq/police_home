<template>
  <view class="page bg-gray-50 min-h-screen">
    <view class="p-4">
      <view class="flex justify-between items-center mb-3">
        <text class="font-bold text-lg text-gray-700">历史预约记录</text>
      </view>

      <!-- 筛选器 -->
      <view class="bg-white p-3 mb-4 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between">
        <view class="flex-1 mr-4">
          <text class="text-xs text-gray-400 block mb-1">筛选方式</text>
          <view class="flex space-x-2 items-center">
            <picker :range="filterTypes" range-key="label" @change="onTypeChange" class="mr-2">
              <view class="text-xs border border-gray-200 rounded px-2 py-1 bg-white flex items-center">
                {{ currentFilterTypeLabel }}
                <i class="fa-solid fa-caret-down ml-1 text-gray-400"></i>
              </view>
            </picker>

            <!-- 月份选择 -->
            <picker v-if="filterType === 'month'" mode="date" fields="month" @change="onDateChange">
              <view class="text-sm font-mono border-b border-b-solid border-gray-200 text-gray-700 w-24">
                {{ filterValue || '选择月份' }}
              </view>
            </picker>

            <!-- 日期选择 (替代周选择，简化实现) -->
            <picker v-else mode="date" @change="onDateChange">
              <view class="text-sm font-mono border-b border-b-solid border-gray-200 text-gray-700 w-24">
                {{ filterValue || '选择日期' }}
              </view>
            </picker>
          </view>
        </view>
        <view @click="resetFilter" class="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
          重置
        </view>
      </view>

      <view class="space-y-3 pb-20">
        <view v-if="loading" class="text-center py-10 text-gray-400 text-xs">加载中...</view>
        <view v-else-if="historyList.length === 0" class="text-center py-10 text-gray-400 text-xs">暂无记录</view>

        <view v-for="(item, index) in historyList" :key="index" @click="goDetail(item.id)"
          class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center active:bg-gray-50 cursor-pointer">
          <view>
            <view class="font-mono text-xl font-bold text-police mb-1">{{ item.appointTime }}</view>
            <view class="text-xs text-gray-500 flex items-center">
              <i class="fa-regular fa-calendar mr-1"></i>{{ item.appointDate }}
            </view>
            <view class="text-xs text-gray-500 mt-1">
              {{ item.userPhone }}
            </view>
          </view>
          <view class="text-right flex items-center">
            <view class="text-xs mr-2">
              <text v-if="item.status == '0'" class="text-green-600 font-bold">{{ getStatusText(item.status) || '待服务'
                }}</text>
              <text v-else-if="item.status == '1'" class="text-yellow-500 font-bold">{{ getStatusText(item.status) ||
                '待评价'
                }}</text>
              <text v-else-if="item.status == '9'" class="text-gray-500 font-bold">{{ getStatusText(item.status) ||
                '已取消'
                }}</text>
              <text v-else class="text-blue-500 font-bold">{{ getStatusText(item.status) || '已完成' }}</text>
            </view>
            <i class="fa-solid fa-chevron-right text-gray-300 text-xs"></i>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部导航 -->
    <barber-tabbar :current="1"></barber-tabbar>
  </view>
</template>

<script>
import BarberTabbar from './components/barber-tabbar.vue';
import { getBarberHistoryList } from '@/api/haircut/haircut.js';
import { getDicts } from '@/api/system/dict/data.js';

export default {
  components: { BarberTabbar },
  data() {
    return {
      filterTypes: [
        { value: 'month', label: '按月' },
        { value: 'day', label: '按日' }
      ],
      filterType: 'month',
      filterValue: '',
      historyList: [],
      loading: false,
      statusOptions: [],
      queryParams: {
        pageNum: 1,
        pageSize: 10
      },
      total: 0,
      isEnd: false
    };
  },
  computed: {
    currentFilterTypeLabel() {
      const type = this.filterTypes.find(t => t.value === this.filterType);
      return type ? type.label : '按月';
    }
  },
  onShow() {
    this.getDictsData();
    this.queryParams.pageNum = 1;
    this.isEnd = false;
    this.loadData();
  },
  onReachBottom() {
    if (!this.isEnd && !this.loading) {
      this.queryParams.pageNum++;
      this.loadData();
    }
  },
  methods: {
    getDictsData() {
      getDicts("b_appoint_status").then(response => {
        this.statusOptions = response.data;
      });
    },
    getStatusText(val) {
      const dict = this.statusOptions.find(item => item.dictValue == val);
      return dict ? dict.dictLabel : '';
    },
    onTypeChange(e) {
      this.filterType = this.filterTypes[e.detail.value].value;
      this.filterValue = '';
      this.queryParams.pageNum = 1;
      this.isEnd = false;
      this.loadData();
    },
    onDateChange(e) {
      this.filterValue = e.detail.value;
      this.queryParams.pageNum = 1;
      this.isEnd = false;
      this.loadData();
    },
    resetFilter() {
      this.filterValue = '';
      this.queryParams.pageNum = 1;
      this.isEnd = false;
      this.loadData();
    },
    loadData() {
      if (this.loading) return;
      this.loading = true;

      const params = {
        pageNum: this.queryParams.pageNum,
        pageSize: this.queryParams.pageSize
      };

      if (this.filterValue) {
        if (this.filterType === 'day') {
          params.appointDate = this.filterValue;
        } else if (this.filterType === 'month') {
          params['params[month]'] = this.filterValue;
        }
      }

      getBarberHistoryList(params).then(res => {
        const rows = res.rows || [];
        this.total = res.total || 0;

        if (this.queryParams.pageNum === 1) {
          this.historyList = rows;
        } else {
          this.historyList = [...this.historyList, ...rows];
        }

        if (this.historyList.length >= this.total) {
          this.isEnd = true;
        } else {
          this.isEnd = false;
        }

        this.loading = false;
      }).catch(err => {
        this.loading = false;
      });
    },
    goDetail(id) {
      uni.navigateTo({
        url: `/pages/barber/detail?id=${id}&from=history`
      });
    }
  }
};
</script>

<style scoped>
@import "/static/css/haircut.css";
</style>