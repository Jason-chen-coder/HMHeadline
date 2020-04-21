import Vue from 'vue'
// 导入dayjs
import dayjs from 'dayjs'
// 导入dayjs的相对时间插件
import relativeTime from 'dayjs/plugin/relativeTime'
// 导入dayjs的语言包
import 'dayjs/locale/zh-cn'
dayjs.extend(relativeTime)
dayjs.locale('zh-cn')
// 写一个全局过滤器
Vue.filter('timefilter', (value) => {
  return dayjs().from(dayjs(value))
})
