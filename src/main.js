import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
// 导入store
import store from '../src/store/index'
// 导入vant框架
import Vant from 'vant'
import 'vant/lib/index.css'
// 导入登录页面的图标文件
import './style/index.css'

Vue.use(Vant)
Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
