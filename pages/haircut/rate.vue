<!-- <template>
  <view class="page bg-white h-full pt-6 px-6">
    <text class="text-lg font-bold mb-2 text-center block">评价本次服务</text>
    <text class="text-xs text-gray-500 mb-6 text-center block">您的评价将帮助我们提升服务质量</text>

    <view class="flex justify-center space-x-3 mb-6">
      <view v-for="i in 5" :key="i" @click="rate = i" class="mr-2">
        <i :class="['text-4xl', i <= rate ? 'fa-solid text-yellow-400' : 'fa-regular text-gray-300', 'fa-star']"></i>
      </view>
    </view>

    <view class="mb-4">
      <textarea v-model="comment" class="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm" placeholder="说说理发师的手艺如何... (选填)" style="height: 200rpx; width: 100%; box-sizing: border-box;" />
    </view>
    
    <view class="mb-8 flex items-center space-x-2">
      <view class="w-16 h-16 border border-dashed border-gray-300 rounded bg-gray-50 flex flex-col items-center justify-center text-gray-400" @click="upload">
        <i class="fa-solid fa-camera mb-1"></i>
        <text class="text-10px">添加图片</text>
      </view>
    </view>

    <button @click="submit" class="w-full bg-police text-white font-bold py-3 rounded-lg shadow-md">提交评价</button>
    <button @click="back" class="w-full mt-4 text-gray-400 text-sm bg-white" style="border: none;">暂不评价</button>
  </view>
</template>

<script>
import DB from '@/common/haircut_data.js';
export default {
  data() { return { id: '', rate: 0, comment: '' }; },
  onLoad(opt) { this.id = opt.id; },
  methods: {
    upload() { uni.showToast({ title: '模拟上传', icon: 'none' }); },
    submit() {
      if(!this.rate) return uni.showToast({ title: '请先打分', icon: 'none' });
      DB.updateAppt(this.id, { status: 'completed', rating: this.rate, comment: this.comment });
      uni.showToast({ title: '评价成功' });
      setTimeout(() => uni.navigateBack(), 800);
    },
    back() { uni.navigateBack(); }
  }
};
</script> -->

<template>
  <view class="page bg-white min-h-screen pt-10 px-6 text-center">
     <view class="text-xl font-bold mb-2 block">服务评价</view>
     <view class="text-sm text-gray-500 mb-8 block">本次服务体验如何？</view>
     
     <view class="flex justify-center space-x-3 mb-8">
         <view v-for="i in 5" :key="i" @click="form.star = i">
             <i class="text-4xl cursor-pointer transition" 
                :class="[i <= form.star ? 'fa-solid text-yellow-400' : 'fa-regular text-gray-300', 'fa-star']"></i>
         </view>
     </view>
     
     <!-- 文本域 -->
     <textarea v-model="form.comment" 
               class="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:border-police mb-4 text-left" 
               placeholder="写点什么吧..." 
               style="height: 200rpx; width: 100%; box-sizing: border-box;"></textarea>
     
     <!-- 模拟上传 -->
     <view class="mb-8 flex items-center justify-start">
         <view class="w-20 h-20 border border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 bg-gray-50" @click="handleUpload">
             <i class="fa-solid fa-camera mb-1"></i>
             <text class="text-[10px]">添加图片</text>
         </view>
     </view>

     <button @click="submit" class="w-full bg-police text-white font-bold py-3 rounded-lg shadow-md hover:bg-police-dark">提交评价</button>
     <button @click="cancel" class="w-full mt-4 text-gray-400 text-sm bg-transparent border-0">暂不评价</button>
  </view>
</template>

<script>
import { submitRate } from '@/api/haircut/haircut.js';

export default {
  data() {
    return {
      form: {
        appointmentId: null,
        star: 0,
        comment: ''
      }
    };
  },
  onLoad(options) {
      this.form.appointmentId = options.id;
  },
  methods: {
    handleUpload() {
        uni.showToast({ title: '点击了上传图片', icon: 'none' });
    },
    submit() {
        if (this.form.star === 0) {
            return uni.showToast({ title: '请先点亮星星评分', icon: 'none' });
        }
        submitRate(this.form).then(() => {
            uni.showToast({ title: '评价成功' });
            setTimeout(() => uni.navigateBack(), 1000);
        });
    },
    cancel() {
        uni.navigateBack();
    }
  }
};
</script>

<style scoped>
@import "/static/css/haircut.css";
</style> 