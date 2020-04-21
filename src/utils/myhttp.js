// 封装axios 对象
import axios from 'axios'
import store from '../store/index'
import { localSet } from '../utils/mylocal'
// 导入json-bigint
import JSONBigInt from 'json-bigint'
const instance = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/app/v1_0/',
  transformResponse: [
    function (data) {
      try {
        return JSONBigInt.parse(data)
      } catch (error) {
        return data
      }
    }
  ]
})
// 创建用于刷新token的实例
const instance2 = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/app/v1_0/'
})
// 请求拦截器
instance.interceptors.request.use(
  config => {
    // 判断store中是否存在token,如果不存在则不需要加Authorization
    var token = store.state.userinfo.token
    if (token) {
      // console.log('拦截器检查到token,用户已登录')
      config.headers = {
        Authorization: 'Bearer ' + token
      }
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)
// 响应拦截器
instance.interceptors.response.use(
  function (response) {
    console.log('响应内容', response)
    return response
  },
  async function (error) {
    // 请求失败返回的信息
    var status = error.request.status
    console.log('请求错误,错误码:', error.request.status)
    console.log('请求错误,请求配置:', error.config)
    if (status === 401) {
      // token过期了, 将refreshtoken发送给服务器,获得新的token,然后再保存到local和store中
      var refreshtoken = store.state.userinfo.refresh_token
      var res = await instance2({
        url: 'authorizations',
        method: 'PUT',
        headers: {
          Authorization: 'Bearer ' + refreshtoken
        }
      })
      // 获得最新的token
      var newtoken = res.data.data.token
      // 将最新的 token保存到local和store中
      store.state.userinfo.token = newtoken
      localSet('userinfo', store.state.userinfo)
      // 再次发送请求数据
      return instance(error.config)
    }
    return Promise.reject(error)
  }
)
// 导出instance
export default instance
