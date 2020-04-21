import Vue from 'vue'
import VueRouter from 'vue-router'
import index from '../views/index/index.vue'
import login from '../views/login/index.vue'
import my from '../views/my/index.vue'
import video from '../views/video/index.vue'
import search from '../views/search/index.vue'
import layout from '../views/layout/index.vue'
import searchresult from '../views/searchresult/index.vue'
import articleinfo from '../views/article/index.vue'
import personalinfo from '../views/my/com/personalinfo.vue'
import xiaozhi from '../views/xiaozhi/index.vue'
// import store from '../store/index'
import { localGet } from '../utils/mylocal'
Vue.use(VueRouter)
const routes = [
  {
    path: '/login',
    component: login
  },
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/checklogin',
    component: login
  },
  {
    path: '/articleinfo',
    component: articleinfo
  },
  {
    path: '/searchresult',
    component: searchresult
  },
  {
    path: '/layout',
    component: layout,
    children: [
      {
        // 首页的路由
        path: '/index', // 请求的路由为 /index  因为path里加了/
        component: index
      },
      {
        // 搜索页面的路由
        path: '/search', // 请求的路由为 /search  因为path里加了/
        component: search
      },
      {
        // 视频的路由
        path: '/video', // 请求的路由为 /video  因为path里加了/
        component: video
      },
      {
        // 我的页面的路由
        path: '/my', // 请求的路由为 /mine  因为path里加了/
        component: my
      }
    ]
  },
  {
    path: '/personalinfo',
    component: personalinfo
  },
  {
    path: '/xiaozhi',
    component: xiaozhi
  }
]
const router = new VueRouter({
  routes,
  // 将路由设置成history模式,这样就不会有#号在url上
  mode: 'history'
})

// 设置导航守卫
router.beforeEach((to, from, next) => {
  window.console.log(from, to.path)
  var usertoken = localGet('userinfo')
  console.log('token', usertoken)
  if (!usertoken) {
    // // 在'我的'页面中,只要用户不登录,就无法查询所有功能,直接跳转回登录页
    if (from.path === '/my' && (to.path === '/personalinfo' || to.path === '/xiaozhi')) {
      console.log('还未登录,要跳转至登录页')
      next('/login')
      return
    }
  }
  next()
})
export default router
