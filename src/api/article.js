import myhttp from '../utils/myhttp'
// 获取文章列表
export function apiGetArticleList ({ channelid, timestamp }) {
  return myhttp({
    url: 'http://ttapi.research.itcast.cn/app/v1_1/articles',
    method: 'GET',
    params: {
      channel_id: channelid,
      timestamp: timestamp,
      with_top: 0 // 请求时不包含置顶数据
    }
  })
}
// 对文章不感兴趣
export function apiUninterest (id) {
  return myhttp({
    url: 'article/dislikes',
    method: 'POST',
    data: {
      target: id
    }
  })
}

// 举报文章
export function apiResportArticle ({ target, type }) {
  return myhttp({
    url: 'article/reports',
    method: 'POST',
    data: {
      target: target,
      type: type
    }
  })
}

// 根据关键词查询文章
export function apiSearchResult ({ page, perpage, key }) {
  return myhttp({
    url: 'search',
    method: 'GET',
    params: {
      page: page,
      per_page: perpage,
      q: key
    }
  })
}
// 根据文章id查询文章详情
export function apiArticleInfo (id) {
  return myhttp({
    url: `articles/${id}`
  })
}

// 对文章喜欢
export function apiLikeArticle (id) {
  return myhttp({
    url: 'article/likings',
    method: 'POST',
    data: {
      target: id
    }
  })
}

// 对文章不喜欢
export function apiUnLikeArticle (id) {
  return myhttp({
    url: 'article/dislikes',
    method: 'POST',
    data: {
      target: id
    }
  })
}

// 查询文章的评论
export function apiGetComments ({ id, typeid, offset, limit }) {
  return myhttp({
    url: 'comments',
    method: 'GET',
    params: {
      type: typeid,
      source: id,
      offset: offset,
      limit: limit
    }
  })
}

// 对文章收藏
export function apiCollectArticle (id) {
  return myhttp({
    url: 'article/collections',
    method: 'POST',
    data: {
      target: id
    }
  })
}

// 取消对文章收藏
export function apiCancelCollect (id) {
  return myhttp({
    url: `article/collections/${id}`,
    method: 'DELETE'
  })
}
