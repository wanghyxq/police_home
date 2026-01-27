<template>
  <view class="page bg-gray-50 min-h-screen pt-4 px-4 pb-safe">
    <!-- 自定义导航栏（可选，如果需要统一风格） -->
    <view class="flex items-center mb-6">
      <view @click="cancel" class="p-2 -ml-2 text-gray-500">
        <i class="fa-solid fa-chevron-left"></i>
      </view>
      <text class="text-lg font-bold text-gray-800 ml-2">评价</text>
    </view>

    <!-- 主卡片 -->
    <view class="bg-white rounded-2xl shadow-sm p-6 mb-6">
      <view class="text-center mb-8">
        <view class="text-xl font-bold text-gray-800 mb-2">服务评价</view>
        <view class="text-sm text-gray-400">本次服务体验如何？</view>
      </view>

      <!-- 星级评分 -->
      <view class="flex justify-center space-x-3 mb-8">
        <view v-for="i in 5" :key="i" @click="setStar(i)" class="transition-transform active:scale-110">
          <i class="text-5xl cursor-pointer transition-colors duration-200"
            :class="[i <= form.star ? 'fa-solid text-yellow-400' : 'fa-regular text-gray-200', 'fa-star']"></i>
        </view>
      </view>

      <!-- 评价标签（可选扩展）
      <view class="flex flex-wrap justify-center gap-2 mb-6" v-if="form.star > 0">
        <text
          class="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600 border border-transparent transition-colors"
          :class="{ 'bg-police-light text-white': form.tags.includes('技术好') }" @click="toggleTag('技术好')">技术好</text>
        <text
          class="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600 border border-transparent transition-colors"
          :class="{ 'bg-police-light text-white': form.tags.includes('环境赞') }" @click="toggleTag('环境赞')">环境赞</text>
        <text
          class="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600 border border-transparent transition-colors"
          :class="{ 'bg-police-light text-white': form.tags.includes('态度佳') }" @click="toggleTag('态度佳')">态度佳</text>
      </view> -->

      <!-- 输入区域 -->
      <view class="relative mb-6">
        <textarea v-model="form.comment"
          class="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 text-sm focus:border-police focus:bg-white transition-colors"
          placeholder="说说哪里让您满意，或者我们哪里需要改进..." maxlength="200"
          style="height: 240rpx; width: 100%; box-sizing: border-box;"></textarea>
        <text class="absolute bottom-3 right-3 text-xs text-gray-400">{{ form.comment.length }}/200</text>
      </view>

      <!-- 图片上传 -->
      <view class="flex flex-wrap gap-3">
        <view v-for="(img, idx) in form.images" :key="idx"
          class="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
          <image :src="img" class="w-full h-full" mode="aspectFill"></image>
          <view
            class="absolute top-0 right-0 bg-black bg-opacity-50 text-white w-5 h-5 flex items-center justify-center rounded-bl-lg"
            @click="removeImage(idx)">
            <i class="fa-solid fa-xmark text-xs"></i>
          </view>
        </view>
        <view v-if="form.images.length < 3"
          class="w-20 h-20 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center text-gray-400 bg-gray-50 active:bg-gray-100 transition-colors"
          @click="handleUpload">
          <i class="fa-solid fa-camera text-xl mb-1"></i>
          <text class="text-[10px]">添加图片</text>
        </view>
      </view>
    </view>

    <!-- 操作按钮 -->
    <view class="mt-8">
      <button @click="submit"
        class="w-full bg-police text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-100 active:transform active:scale-95 transition-all mb-4 flex items-center justify-center text-base"
        hover-class="opacity-90">
        提交评价
      </button>
      <button @click="cancel" class="w-full text-gray-400 text-sm bg-transparent border-0 py-2">
        暂不评价
      </button>
    </view>
  </view>
</template>

<script>
import { submitRate } from '@/api/haircut/haircut.js';
import config from '@/config.js';
import { getToken } from '@/utils/auth';

export default {
  data() {
    return {
      form: {
        appointmentId: null,
        star: 0,
        comment: '',
        images: [], // 本地图片路径数组
        tags: []    // 标签数组
      }
    };
  },
  onLoad(options) {
    this.form.appointmentId = options.id;
  },
  methods: {
    setStar(i) {
      this.form.star = i;
    },
    toggleTag(tag) {
      const idx = this.form.tags.indexOf(tag);
      if (idx > -1) {
        this.form.tags.splice(idx, 1);
      } else {
        this.form.tags.push(tag);
      }
    },
    handleUpload() {
      if (this.form.images.length >= 3) return;
      uni.chooseImage({
        count: 3 - this.form.images.length,
        success: (res) => {
          this.form.images = [...this.form.images, ...res.tempFilePaths];
        }
      });
    },
    removeImage(idx) {
      this.form.images.splice(idx, 1);
    },
    submit() {
      if (this.form.star === 0) {
        return uni.showToast({ title: '请先点亮星星评分', icon: 'none' });
      }

      uni.showLoading({ title: '提交中...' });

      // 1. 如果没有图片，直接使用 JSON 提交
      if (this.form.images.length === 0) {
        const data = {
          appointmentId: this.form.appointmentId,
          rating: this.form.star,
          comment: this.form.comment + (this.form.tags.length > 0 ? ` [${this.form.tags.join(',')}]` : '')
        };
        submitRate(data).then(() => {
          uni.hideLoading();
          uni.showToast({ title: '评价成功', icon: 'success' });
          setTimeout(() => uni.navigateBack(), 1500);
        }).catch(() => {
          uni.hideLoading();
        });
        return;
      }

      // 2. 如果有图片，使用 uni.uploadFile 提交
      // 注意：uni.uploadFile 标准行为是一次传一个文件。
      // 在 H5 端可以通过 files 参数传多图，但在小程序端通常需要循环上传或后端支持单次接收。
      // 鉴于后端代码 iterate imageFiles，我们尝试构建兼容的上传逻辑。

      // 这里的逻辑假设运行在 H5 环境，利用 files 参数
      const formData = {
        appointmentId: this.form.appointmentId,
        rating: this.form.star,
        comment: this.form.comment + (this.form.tags.length > 0 ? ` [${this.form.tags.join(',')}]` : '')
      };

      // 构建文件数组 (仅 H5 支持 files)
      const files = this.form.images.map((path, index) => {
        return { name: 'imageFiles', uri: path };
      });

      // #ifdef H5
      uni.uploadFile({
        url: config.baseUrl + '/api/haircut/appointment/rate',
        files: files, // H5 专用
        formData: formData,
        header: {
          Authorization: 'Bearer ' + getToken()
        },
        success: (uploadFileRes) => {
          uni.hideLoading();
          // uni.uploadFile 返回的是字符串，需要 parse
          let data;
          try {
            data = JSON.parse(uploadFileRes.data);
          } catch (e) {
            data = { code: 500, msg: '解析响应失败' };
          }

          if (data.code === 200) {
            uni.showToast({ title: '评价成功', icon: 'success' });
            setTimeout(() => uni.navigateBack(), 1500);
          } else {
            uni.showToast({ title: data.msg || '评价失败', icon: 'none' });
          }
        },
        fail: (err) => {
          uni.hideLoading();
          uni.showToast({ title: '网络请求失败', icon: 'none' });
          console.error(err);
        }
      });
      // #endif

      // #ifndef H5
      // 非 H5 端（如小程序），uni.uploadFile 不支持 files 参数，通常只能单图上传。
      // 针对此后端接口（一次性接收多图），在小程序端可能需要修改策略：
      // 1. 循环调用单图上传接口（如果后端支持多次追加）。
      // 2. 或者只上传第一张图。
      // 这里为了演示完整性，我们暂时只上传第一张图作为兜底。
      uni.uploadFile({
        url: config.baseUrl + '/api/haircut/appointment/rate',
        filePath: this.form.images[0],
        name: 'imageFiles',
        formData: formData,
        header: {
          Authorization: 'Bearer ' + getToken()
        },
        success: (uploadFileRes) => {
          uni.hideLoading();
          let data;
          try {
            data = JSON.parse(uploadFileRes.data);
          } catch (e) {
            data = { code: 500, msg: '解析响应失败' };
          }

          if (data.code === 200) {
            uni.showToast({ title: '评价成功', icon: 'success' });
            setTimeout(() => uni.navigateBack(), 1500);
          } else {
            uni.showToast({ title: data.msg || '评价失败', icon: 'none' });
          }
        },
        fail: (err) => {
          uni.hideLoading();
          uni.showToast({ title: '网络请求失败', icon: 'none' });
        }
      });
      // #endif
    },
    cancel() {
      uni.navigateBack();
    }
  }
};
</script>

<style scoped>
@import "/static/css/haircut.css";

/* 补充一些特定动画效果 */
.active\:scale-110:active {
  transform: scale(1.1);
}

.active\:scale-95:active {
  transform: scale(0.98);
}

.duration-200 {
  transition-duration: 200ms;
}

.active\:bg-gray-100:active {
  background-color: #f3f4f6;
}

.shadow-blue-100 {
  box-shadow: 0 10px 15px -3px rgba(219, 234, 254, 0.5);
}

.text-\[10px\] {
  font-size: 10px;
}

.gap-2 {
  gap: 0.5rem;
}

.gap-3 {
  gap: 0.75rem;
}
</style>