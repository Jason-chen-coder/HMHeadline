import Vue from 'vue'
import { Toast } from 'vant'
import store from '../store/index'
import router from '../router/index'
var myplugin = {}
myplugin.install = function (vue) {
  // 封装全局函数,用来检查用户是否已经登录
  Vue.prototype.$isLogin = function () {
    // 检查是否有token
    // console.log('检查用户是否登录')
    // console.log(store.state.userinfo)
    if (store.state.userinfo.token) {
      // 用户已登录
      console.log('用户已登录')
      return true
    } else {
      // 用户还未登录
      console.log('用户还未登录')
      Toast.fail('请先登录')
      router.push('/checklogin')
    }
  }
}

export default myplugin
