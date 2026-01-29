<template>
  <view class="page bg-gray-50 min-h-screen">
    <!-- 顶部统计栏 (sticky) -->
    <view class="bg-white p-4 mb-3 shadow-sm grid grid-cols-3 gap-2 text-center sticky top-0 z-30">
      <view>
        <view class="flex items-center justify-center mb-1">
          <text class="text-xs text-gray-500 mr-1">综合评分</text>
          <i class="fa-solid fa-star text-yellow-400 text-10"></i>
        </view>
        <text class="text-lg font-bold text-yellow-400">{{ stats.avgRating || '0.0' }}</text>
      </view>

      <view class="border-l border-r border-l-solid border-r-solid border-gray-100">
        <view class="flex items-center justify-center mb-1">
          <text class="text-xs text-gray-500 mr-1">今日待服务</text>
          <i class="fa-solid fa-user-group text-police text-10"></i>
        </view>
        <text class="text-lg font-bold text-police">{{ stats.returningCount || 0 }}</text>
      </view>

      <view>
        <view class="flex items-center justify-center mb-1">
          <text class="text-xs text-gray-500 mr-1">累计服务</text>
          <i class="fa-solid fa-medal text-orange-400 text-10"></i>
        </view>
        <text class="text-lg font-bold text-orange-400">{{ stats.totalServed || 0 }}</text>
      </view>
    </view>

    <view class="px-4 pb-20">
      <view class="flex items-center justify-between mb-3 pl-1">
        <text class="font-bold text-gray-700 text-sm border-l-4 border-police pl-2">
          近期预约
        </text>
        <text class="text-10 text-gray-400">今日及未来</text>
      </view>

      <view class="space-y-3">
        <view v-if="loading" class="text-center py-10 text-gray-400 text-xs">加载中...</view>
        <view v-else-if="taskList.length === 0" class="text-center py-10 text-gray-400 text-xs">暂无记录</view>

        <view v-for="(item, index) in taskList" :key="index" @click="goDetail(item.id)"
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
              <text v-else class="text-blue-500 font-bold">{{ getStatusText(item.status) || '已完成' }}</text>
            </view>
            <i class="fa-solid fa-chevron-right text-gray-300 text-xs"></i>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部导航 -->
    <barber-tabbar :current="0"></barber-tabbar>
  </view>
</template>

<script>
import BarberTabbar from './components/barber-tabbar.vue';
import { getBarberDashboardStats, getBarberDashboardList } from '@/api/haircut/haircut.js';
import { getDicts } from '@/api/system/dict/data.js';

export default {
  components: { BarberTabbar },
  data() {
    return {
      stats: {
        avgRating: '0.0',
        returningCount: 0,
        totalServed: 0
      },
      taskList: [],
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
  onShow() {
    this.getDictsData();
    this.queryParams.pageNum = 1;
    this.isEnd = false;
    this.loadStats();
    this.loadList();
  },
  onPullDownRefresh() {
    this.queryParams.pageNum = 1;
    this.isEnd = false;
    this.loadStats();
    this.loadList();
  },
  onReachBottom() {
    if (!this.isEnd && !this.loading) {
      this.queryParams.pageNum++;
      this.loadList();
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
    loadStats() {
      getBarberDashboardStats().then(res => {
        const data = res.data || {};
        this.stats = {
          avgRating: data.avgRating || '0.0',
          returningCount: data.todayPending || 0,
          totalServed: data.totalServed || 0
        };
      });
    },
    loadList() {
      if (this.loading) return;
      this.loading = true;

      getBarberDashboardList(this.queryParams).then(res => {
        const rows = res.rows || [];
        this.total = res.total || 0;

        if (this.queryParams.pageNum === 1) {
          this.taskList = rows;
          uni.stopPullDownRefresh();
        } else {
          this.taskList = [...this.taskList, ...rows];
        }

        if (this.taskList.length >= this.total) {
          this.isEnd = true;
        } else {
          this.isEnd = false;
        }

        this.loading = false;
      }).catch(err => {
        this.loading = false;
        uni.stopPullDownRefresh();
      });
    },
    goDetail(id) {
      uni.navigateTo({
        url: `/pages/barber/detail?id=${id}&from=dashboard`
      });
    }
  }
};
</script>

<style scoped>
@import "/static/css/haircut.css";
</style>