<template>
  <div class="searchpage">
    <form action="/">
      <van-search
        v-model="inputvalue"
        @input="onInput()"
        show-action
        placeholder="请输入搜索关键词"
        background="#3296fa"
        @search="onSearch"
        @cancel="onCancel"
        style="color:white"
      />
      <!-- 联想区域 -->
      <van-cell-group v-if="thinkList.length!==0">
        <van-cell title="联想区域" />
        <van-cell
          @click="onSearch(item.olditem)"
          v-for="(item, index) in thinkList"
          :key="index"
          icon="search"
        >
          <template #title>
            <div v-html="item.newitem"></div>
          </template>
        </van-cell>
      </van-cell-group>
      <!-- 历史记录 -->
      <van-cell-group v-else>
        <van-cell title="历史记录">
          <template #default>
            <van-icon name="delete" @click="delall()"></van-icon>
          </template>
        </van-cell>
        <van-cell
          @click="onSearch(item)"
          v-for="(item, index) in historyList"
          :key="index"
          icon="clock-o"
        >
          {{item}}
          <template #right-icon>
            <div @click.stop="delhistory(index)">
              <van-icon name="cross" />
            </div>
          </template>
        </van-cell>
      </van-cell-group>
    </form>
  </div>
</template>

<script>
import { apithinkResult } from '../../api/search'
import { localSet, localGet, localRemove } from '../../utils/mylocal'
export default {
  methods: {
    delhistory (index) {
      // 删除单条搜索记录
      this.historyList.splice(index, 1)
      localSet('historyList', this.historyList)
    },
    delall () {
      this.$dialog.confirm({
        title: '清除搜索记录',
        message: '您确定要清空搜索记录吗?'
      }).then(() => {
        // on confirm
        // 清除搜索记录
        this.historyList = []
        localRemove('historyList')
      }).catch(() => {
        // on cancel
      })
    },
    onInput () {
      // 使用定时器方式清除js抖动
      clearTimeout(this.timer)
      this.timer = setTimeout(async () => {
        // 输入的过程中执行的代码
        if (this.inputvalue.trim().length !== 0) {
          var res = await apithinkResult(this.inputvalue)
          console.log(res)
          this.thinkList = res.data.data.options.map(item => {
            return { newitem: item.replace(this.inputvalue, `<span style="color:red">${this.inputvalue}</span>`), olditem: item }
          })
        } else {
          this.thinkList = []
        }
      }, 200)
    },
    // 点击回车后的回调函数
    onSearch (item) {
      console.log(item)
      // 输入完搜索内容后点击回车带上输入内容进行页面跳转
      this.$router.push('/searchresult?key=' + item)
      // 开始搜索后将搜索内容保存起来
      this.historyList.unshift(item)
      var history = new Set(this.historyList)
      this.historyList = [...history]
      localSet('historyList', this.historyList)
    },
    onCancel () {
      console.log('取消搜索')
    }
  },
  data () {
    return {
      inputvalue: '',
      thinkList: [],
      timer: '',
      historyList: localGet('historyList') || []
    }
  }
}
</script>

<style lang='less'>
.searchpage {
  .van-search__action {
    color: white !important;
  }
  .van-search__action:active {
    background-color: '#3296fa' !important;
  }
}
</style>
