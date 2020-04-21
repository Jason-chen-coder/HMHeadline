<template>
  <div>
    <router-view></router-view>
    <van-tabbar v-model="active" route bind:change="onChange">
      <van-tabbar-item to="/index" icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item to="/search" icon="search">搜索</van-tabbar-item>
      <van-tabbar-item to="/video" icon="video-o">视频</van-tabbar-item>
      <van-tabbar-item to="/my" icon="user-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  data () {
    return {
      active: 0
    }
  },
  methods: {
    onChange (event) {
      // event.detail 的值为当前选中项的索引
      console.log(event)
      this.setData({ active: event.detail })
    }
  }
}
</script>
<style></style>
