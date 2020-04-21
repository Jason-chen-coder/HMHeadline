import myhttp from '../utils/myhttp'
// 对评论点赞
export function apiLikeCommit (id) {
  return myhttp({
    url: 'comment/likings',
    method: 'POST',
    data: {
      target: id
    }
  })
}

// 取消对评论点赞
export function apiUnlikeCommit (id) {
  return myhttp({
    url: `comment/likings/${id}`,
    method: 'DELETE'
  })
}

// 发表评论
export function apiUpcommit ({ targetid, content, artid }) {
  return myhttp({
    url: 'comments',
    method: 'POST',
    data: {
      target: targetid,
      content: content,
      art_id: artid
    }
  })
}

// 获取评论的回复列表
export function apiGetCommentAnswer ({ commentid, offset, limit }) {
  return myhttp({
    url: 'comments',
    method: 'GET',
    params: {
      type: 'c',
      source: commentid,
      offset: offset,
      limit: limit
    }
  })
}
// 回复文章的评论
export function apiAnswerArticleComment ({ targetid, content, artid }) {
  return myhttp({
    url: 'comments',
    method: 'POST',
    data: {
      target: targetid,
      content: content,
      art_id: artid
    }
  })
}
