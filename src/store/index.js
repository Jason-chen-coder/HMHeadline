import Vue from 'vue'
import Vuex from 'vuex'
import { localSet, localGet } from '../utils/mylocal'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 默认打开页面时,先从localstorage获取token,如果有就直接取出,没有就设置为一个空对象
    userinfo: localGet('userinfo') || {}
  },
  mutations: {
    setuserinfo: function (state, obj) {
      state.userinfo = obj
      // 将服务器返回的用户信息保存到本地种
      localSet('userinfo', obj)
    }
  },
  actions: {},
  modules: {}
})
