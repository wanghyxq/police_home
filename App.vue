<script>
  import config from './config'
  import { getToken } from '@/utils/auth'

  export default {
    onLaunch: function() {
      this.initApp()
    },
    methods: {
      // 初始化应用
      initApp() {
        // 初始化应用配置
        this.initConfig()
        // 检查用户登录状态
        //#ifdef H5
        this.checkLogin()
        //#endif
      },
      initConfig() {
        this.globalData.config = config
      },
      checkLogin() {
        if (!getToken()) {
          uni.reLaunch({ url: '/pages/login' }) 
        }
      }
    }
  }
</script>

<style lang="scss">
  @import '/static/scss/index.scss';
  @import '/static/css/fontawesome-all.min.css';
  @import '/static/css/haircut.css';
</style>
