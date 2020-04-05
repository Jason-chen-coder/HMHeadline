<template>
  <div>
    <h1>我是 layout</h1>
    <router-view></router-view>
    <van-tabbar bind:change="onChange">
      <van-tabbar-item icon="home-o">标签</van-tabbar-item>
      <van-tabbar-item icon="search">标签</van-tabbar-item>
      <van-tabbar-item icon="friends-o">标签</van-tabbar-item>
      <van-tabbar-item icon="setting-o">标签</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  methods: {
    onChange (event) {
      // event.detail 的值为当前选中项的索引
      this.setData({ active: event.detail })
    }
  }
}
</script>
<style></style>
