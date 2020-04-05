// 封装localstorage的方法

// 存储数据的方法
export function localSet (key, value) {
  window.localStorage.setItem(key, JSON.stringify(value))
}
// 删除数据的方法
export function localRemove (key) {
  window.localStorage.removeItem(key)
}
// 取出数据的方法
export function localGet (key) {
  return JSON.parse(window.localStorage.getItem(key))
}
