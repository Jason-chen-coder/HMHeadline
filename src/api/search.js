import myhttp from '../utils/myhttp'

// 联想查询
export function apithinkResult (value) {
  return myhttp({
    url: 'suggestion',
    method: 'GET',
    params: {
      q: value
    }
  })
}
