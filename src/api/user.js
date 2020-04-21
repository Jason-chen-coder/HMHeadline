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
// 拉黑用户 拉黑文章作者
export function apiBlockauthor (target) {
  return myhttp({
    url: 'user/blacklists',
    method: 'POST',
    data: {
      target: target
    }
  })
}

// 关注作者
export function apiFollowAuthor (id) {
  return myhttp({
    url: 'user/followings',
    method: 'POST',
    data: {
      target: id
    }
  })
}

// 取消关注
export function apiUnFollowAuthor (id) {
  return myhttp({
    url: `user/followings/${id}`,
    method: 'DELETE'
  })
}

// 获取当前用户的信息
export function apiGetuserinfo () {
  return myhttp({
    url: 'user'
  })
}

// 获取当前用户的详细信息
export function apiGetuserprofileinfo () {
  return myhttp({
    url: 'user/profile'
  })
}

// 修改当前用户的信息(除头像)
export function apiSetUserinfo ({ username, usergender, userbirthday, userintro }) {
  return myhttp({
    url: 'user/profile',
    method: 'PATCH',
    data: {
      name: username,
      gender: usergender,
      birthday: userbirthday,
      intro: userintro
    }
  })
}

// 修改用户的头像
export function apiChangeUserimg (photo) {
  var fm = new FormData()
  fm.append('photo', photo)
  return myhttp({
    url: 'user/photo',
    method: 'PATCH',
    data: fm
  })
}
