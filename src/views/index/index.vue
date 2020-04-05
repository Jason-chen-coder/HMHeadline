<template>
  <div>
    <!--van-nav-bar 有fixed属性 可以使用fixed属性将 van-nav-bar固定起来 -->
    <van-nav-bar fixed class="loginbar" title="首页" />
    <van-tabs>
      <van-tab title="文章 ">
        <div v-for="(item, index) in 40" :key="index">文章{{index}}</div>
        <br />
      </van-tab>
      <van-tab title="标签 2">内容 2</van-tab>
      <van-tab title="标签 3">内容 3</van-tab>
      <van-tab title="标签 4">内容 4</van-tab>
      <van-tab title="标签 5">内容 5</van-tab>
      <van-tab title="标签 6">内容 6</van-tab>
    </van-tabs>
  </div>
</template>

<script>
export default {}
</script>

<style lang='less'>
.loginbar.van-nav-bar {
  background-color: #3296fa;
  margin-bottom: 34px;
  .van-hairline--bottom::after {
    border-bottom-width: 0;
  }
  .van-nav-bar__title {
    color: white;
  }
}
.van-tabs--line .van-tabs__wrap {
  position: fixed;
}
.van-tabs__content {
  padding-top: 45px;
}
.van-tabs__wrap.van-tabs__wrap--scrollable.van-hairline--top-bottom {
  width: 100%;
}
</style>
