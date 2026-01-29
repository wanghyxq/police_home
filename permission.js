import { getToken } from '@/utils/auth'
import store from '@/store'

// 登录页面
const loginPage = "/pages/login"
  
// 页面白名单
const whiteList = [
  '/pages/login', '/pages/register', '/pages/common/webview/index'
]

// 检查地址白名单
function checkWhite(url) {
  const path = url.split('?')[0]
  return whiteList.indexOf(path) !== -1
}

// 检查是否为理发师端页面
function isBarberPage(url) {
  return url.startsWith('/pages/barber/')
}

// 检查是否为民警端核心页面 (首页及其他非理发师页面)
function isPolicePage(url) {
  // 简单逻辑：不是白名单、不是登录页、不是理发师页面，即视为民警端页面
  // 或者明确指定首页
  // 注意：/pages/mine/ 下的页面现在理发师和民警共用，所以不应列入民警独占
  return url === '/pages/index' || url.startsWith('/pages/haircut/')
}

// 应用初始加载时的登录检查
function checkInitialLogin() {
  const pages = getCurrentPages()
  if (pages.length > 0) {
    const currentPage = pages[0]
    const currentPath = `/${currentPage.route}`
    if (!getToken() && !checkWhite(currentPath)) {
      uni.reLaunch({ url: loginPage })
    }
  }
}

// 页面跳转验证拦截器
let list = ["navigateTo", "redirectTo", "reLaunch", "switchTab"]
list.forEach(item => {
  uni.addInterceptor(item, {
    invoke(to) {
      if (getToken()) {
        if (to.url === loginPage) {
          uni.reLaunch({ url: "/" })
          return false
        }
        
        // 角色鉴权逻辑
        const roles = store.getters.roles || []
        const isBarber = roles.includes('barber')
        
        // 如果是理发师，访问了民警端页面 -> 重定向到工作台
        if (isBarber && isPolicePage(to.url)) {
           // 防止循环重定向
           if (to.url !== '/pages/barber/dashboard') {
             uni.reLaunch({ url: '/pages/barber/dashboard' })
             return false
           }
        }
        
        // 如果是民警(非理发师)，访问了理发师页面 -> 重定向到首页
        if (!isBarber && isBarberPage(to.url)) {
           if (to.url !== '/pages/index') {
             uni.reLaunch({ url: '/pages/index' })
             return false
           }
        }

        return true
      } else {
        if (checkWhite(to.url)) {
          return true
        }
        uni.reLaunch({ url: loginPage })
        return false
      }
    },
    fail(err) {
      console.log(err)
    }
  })
})

// 调用初始登录检查
checkInitialLogin()
