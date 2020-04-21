// 封装关于频道的所有接口
import myhttp from '../utils/myhttp'
// 获取频道列表
export function apiGetChannel () {
  return myhttp({
    url: 'user/channels',
    method: 'GET'
  })
}
// 获取所有频道列表
export function apiGetAllChannel () {
  return myhttp({
    url: 'channels',
    method: 'GET'
  })
}

// 重置频道列表
export function apiResetChannelList (channels) {
  return myhttp({
    url: 'user/channels',
    method: 'PUT',
    data: {
      channels: channels
    }
  })
}
