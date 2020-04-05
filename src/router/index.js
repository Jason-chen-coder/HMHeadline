import Vue from 'vue'
import VueRouter from 'vue-router'
import index from '../views/index/index.vue'
import login from '../views/login/index.vue'
import layout from '../views/layout/index.vue'
Vue.use(VueRouter)
const routes = [
  {
    path: '/login',
    component: login
  },
  {
    path: '/layout',
    component: layout,
    children: [
      {
        // 首页的路由
        path: '/index', // 请求的路由为 /index  因为path里加了/
        component: index
      }
    ]
  }
]
const router = new VueRouter({
  routes
})
export default router
