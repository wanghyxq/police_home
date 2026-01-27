<template>
    <view class="page bg-gray-50 min-h-screen">
        <view class="p-4 pb-20">
            <view class="font-bold text-lg mb-4 text-gray-700">我的预约记录</view>

            <!-- 筛选器 -->
            <view
                class="bg-white p-3 mb-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                <view class="flex-1 mr-4">
                    <text class="text-10 text-gray-400 block mb-1">按月筛选 / 日期筛选</text>
                    <view class="flex space-x-2">
                        <picker mode="date" fields="month" :value="queryParams.month" @change="bindMonthChange"
                            class="border-b border-gray-200">
                            <view class="w-24 text-sm font-mono border-b border-gray-200 py-1 text-gray-700">
                                {{ queryParams.month || '选择月份' }}
                            </view>
                        </picker>
                        <picker mode="date" :value="queryParams.date" @change="bindDateChange"
                            class="border-b border-gray-200">
                            <view class="w-28 text-sm font-mono border-b border-gray-200 py-1 text-gray-700">
                                {{ queryParams.date || '选择日期' }}
                            </view>
                        </picker>
                    </view>
                </view>
                <button @click="resetQuery"
                    class="btn text-xs text-blue-600 bg-blue-50 px-3 py-1.5 rounded m-0 border-0">重置</button>
            </view>

            <!-- 列表 -->
            <view class="space-y-4">
                <view v-if="loading" class="text-center py-4 text-gray-400">加载中...</view>
                <view v-else-if="list.length === 0"
                    class="flex flex-col items-center justify-center mt-12 text-gray-300">
                    <i class="fa-regular fa-calendar-xmark text-4xl mb-2"></i>
                    <text class="text-xs">暂无预约记录</text>
                </view>

                <view v-for="(item, index) in list" :key="index"
                    class="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <view class="flex justify-between items-start mb-3">
                        <view class="flex items-center">
                            <view class="w-2 h-2 rounded-full mr-2" :class="getStatusColor(item.status, 'dot')"></view>
                            <text class="font-bold text-gray-800 text-sm">{{ item.barberName }}</text>
                        </view>
                        <!-- 状态标签 -->
                        <text class="text-xs px-2 py-0.5 rounded font-medium"
                            :class="getStatusColor(item.status, 'badge')">
                            {{ getStatusText(item.status) }}
                        </text>
                    </view>
                    <view
                        class="text-xs text-gray-500 mb-3 space-y-1.5 pl-4 border-l-solid border-l-2 border-gray-50 ml-1">
                        <view class="font-mono">
                            <i class="fa-regular fa-clock w-4 text-center"></i>
                            {{ item.scheduleDate }}
                            <text class="font-bold text-gray-800 ml-1">{{ item.startTime }}</text>
                        </view>
                        <view>
                            <i class="fa-solid fa-phone w-4 text-center"></i> {{ item.barberPhone }}
                        </view>
                    </view>

                    <!-- 操作栏 -->
                    <view class="flex justify-end pt-2 border-t-solid border-t border-gray-50">
                        <view v-if="item.status === '0'">
                            <text v-if="item.isLocked"
                                class="text-10 text-orange-400 flex items-center bg-orange-50 px-2 py-1 rounded">
                                <i class="fa-solid fa-lock mr-1"></i>临近不可取消
                            </text>
                            <view v-else class="flex">
                                <button @click="handleScan(item)"
                                    class="btn text-xs border shadow-sm border-police px-3 py-1 rounded text-police bg-white active:bg-blue-50 m-0 mr-2 flex items-center">
                                    <i class="fa-solid fa-qrcode mr-1"></i>扫码核销
                                </button>
                                <button @click="handleCancel(item.id)"
                                    class="btn text-xs border border-gray-300 px-3 py-1 rounded text-gray-600 bg-white active:bg-gray-50 m-0">
                                    <i class="fa-solid fa-xmark mr-1"></i>
                                    取消预约
                                </button>
                            </view>
                        </view>
                        <view v-else-if="item.status === '1'">
                            <button @click="goRate(item.id)"
                                class="bg-police text-white text-xs px-3 py-1 rounded shadow-sm m-0 active:opacity-80 transition-all flex items-center"><i
                                    class="fa-solid fa-star mr-1"></i>立即评价</button>
                        </view>
                        <view v-else-if="item.status === '2'" class="text-yellow-500 text-xs"><i
                                class="fa-solid fa-star"></i> {{ item.rating }}分</view>
                    </view>
                </view>
            </view>
        </view>

        <!-- 底部导航 -->
        <haircut-tabbar :current="1"></haircut-tabbar>
    </view>
</template>

<script>
import { listMyAppointments, cancelAppointment, verifyAppointment } from '@/api/haircut/haircut.js';
// 1. 引入获取字典的方法
import { getDicts } from '@/api/system/dict/data.js';
import HaircutTabbar from './components/haircut-tabbar.vue';

export default {
    components: { HaircutTabbar },
    data() {
        return {
            loading: false,
            list: [],
            statusOptions: [],
            queryParams: {
                month: '',
                date: ''
            }
        };
    },
    onLoad() {
        // 页面加载时获取字典数据
        this.getDictsData();
    },
    onShow() {
        // 每次进入页面刷新数据
        this.getList();
    },
    methods: {
        // 获取字典
        getDictsData() {
            getDicts("b_appoint_status").then(response => {
                this.statusOptions = response.data;
            });
        },
        getList() {
            this.loading = true;
            listMyAppointments(this.queryParams).then(res => {
                this.list = res.rows || [];
                this.loading = false;
            }).catch(() => {
                this.loading = false;
            });
        },
        // 根据字典值(0,1,2,9)翻译成中文
        getStatusText(statusValue) {
            // 在 statusOptions 数组中查找 dictValue 等于 statusValue 的项
            const dict = this.statusOptions.find(item => item.dictValue == statusValue);
            return dict ? dict.dictLabel : statusValue; // 没找到则显示原值
        },
        // 根据字典值返回颜色
        // 你可以利用字典的 listClass 字段，也可以在这里写简单的映射
        getStatusColor(statusValue, type) {
            // 这里 statusValue 是 "0", "1", "2", "9"
            if (type === 'dot') {
                if (statusValue === '0') return 'bg-green-500'; // 待服务
                if (statusValue === '1') return 'bg-yellow-400'; // 待评价
                if (statusValue === '2') return 'bg-blue-500'; // 已完成
                if (statusValue === '9') return 'bg-gray-400'; // 已取消
                return 'bg-gray-300';
            }
            if (type === 'badge') {
                if (statusValue === '0') return 'bg-green-100 text-green-700';
                if (statusValue === '1') return 'bg-yellow-100 text-yellow-700';
                if (statusValue === '2') return 'bg-blue-50 text-blue-600'; // 已完成
                if (statusValue === '9') return 'bg-gray-100 text-gray-500'; // 已取消
                return 'text-gray-400';
            }
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
                        uni.showLoading({ title: '处理中...' });
                        cancelAppointment(id).then(response => {
                            uni.hideLoading();
                            if (response.code === 200) {
                                uni.showToast({ title: '预约已取消', icon: 'success' });
                                this.getList();
                            } else {
                                uni.showToast({ title: response.msg || '取消失败', icon: 'none' });
                            }
                        }).catch(() => {
                            uni.hideLoading();
                            // request 拦截器通常会处理通用错误，这里作为兜底
                        });
                    }
                }
            })
        },
        goRate(id) {
            uni.navigateTo({ url: `/pages/haircut/rate?id=${id}` });
        },
        handleScan(item) {
            uni.scanCode({
                success: (res) => {
                    uni.showLoading({ title: '核销中...' });
                    // 假设扫码结果是验证码或者包含验证信息的字符串
                    // 这里根据实际后端需求，可能只需要传 code，或者 id + code
                    verifyAppointment({ id: item.id, code: res.result }).then(() => {
                        uni.hideLoading();
                        uni.showToast({ title: '核销成功', icon: 'success' });
                        // 更新列表或手动修改当前项状态
                        item.status = '2'; // 2 代表已完成
                        // 也可以选择重新获取列表 this.getList();
                    }).catch(err => {
                        uni.hideLoading();
                        // 错误已经在 request 拦截器中处理提示了，这里可视情况补充
                    });
                },
                fail: (err) => {
                    // 用户取消扫码或扫码失败
                    if (err.errMsg && err.errMsg.indexOf('cancel') === -1) {
                        uni.showToast({ title: '扫码失败，请重试', icon: 'none' });
                    }
                }
            });
        },
    }
};
</script>

<style scoped>
@import "/static/css/haircut.css";

.btn::after {
    border: none;
}

.transition-all {
    transition: all 0.3s ease-in-out;
}
</style>