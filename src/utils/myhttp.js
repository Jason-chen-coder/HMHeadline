// 封装axios 对象
import axios from 'axios'
const instance = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/app/v1_0/'
})
// 请求拦截器
instance.interceptors.request.use(
  config => {
    return config
  },
  error => {
    return Promise.reject(error)
  }
)
// 响应拦截器
instance.interceptors.response.use(
  function (response) {
    return response
  },
  function (error) {
    return Promise.reject(error)
  }
)
// 导出instance
export default instance
