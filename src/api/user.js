import myhttp from '../utils/myhttp'

// 封装一个登录方法
export function Apilogin ({ phone, code }) {
  return myhttp({
    url: 'authorizations',
    method: 'POST',
    data: {
      mobile: phone,
      code: code
    }
  })
}
