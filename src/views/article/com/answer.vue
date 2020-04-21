<template>
  <div class="answer">
    <van-popup
      :value="answershow"
      @input="v=>{this.$emit('input',v)}"
      position="bottom"
      :style="{ height: '70%' }"
    >
      <div class="allcommit">
        <van-cell-group>
          <van-cell>当前评论</van-cell>
          <comments :isReply="isReply" :commitList="commit" />
        </van-cell-group>
        <van-cell-group>
          <van-cell>评论回复</van-cell>
          <!-- 评论回复的列表 -->
          <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
            <comments
              :commitList="item"
              :isReply="isReply"
              v-for="(item,index) in answerList"
              :key="index"
              ref="comments"
            ></comments>
          </van-list>
        </van-cell-group>
        <write @addcommentanswer="addcommentanswer" :isReplycomment="isReply" :commitid="commitid" />
      </div>
    </van-popup>
  </div>
</template>

<script>
import bus from '../../../utils/bus'
import comments from './comments'
import write from './write'
import { apiGetCommentAnswer } from '../../../api/commit'
export default {
  props: ['answershow'],
  data () {
    return {
      commit: '',
      isReply: true,
      commitid: '',
      answerList: [],
      offset: null,
      limit: 10,
      finished: false,
      loading: false
    }
  },
  components: {
    comments,
    write
  },
  created () {
    // 把bus中的参数拿出来
    window.console.log('获取bus前的评论id', this.commitid)
    bus.$on('passItem', item => {
      this.reset()
      this.commit = item
      this.commitid = item.com_id.toString()
    })
  },
  methods: {
    addcommentanswer (obj) {
      // 对文章的评论回复成功
      this.answerList.unshift(obj)
      // eventBus上的数据是子组件之间双向通讯的,所以直接修改即可
      this.commit.reply_count++
    },
    reset () {
      // window.console.log('关闭评论回复展示')
      this.answerList = []
      this.finished = false
      this.loading = false
      this.offset = null
    },
    async  onLoad () {
      // 查询当前评论的回复列表
      var res = await apiGetCommentAnswer({ commentid: this.commitid, offset: this.offset, limit: this.limit })
      console.log('评论回复列表', res)
      this.answerList = [...this.answerList, ...res.data.data.results]
      this.offset = res.data.data.end_id
      this.loading = false
      if (res.data.data.results.length === 0) {
        console.log('加载完毕')
        this.finished = true
      }
    }
  }
}
</script>

<style lang='less'>
.answer {
  .allcommit {
    margin-top: 10px;
  }
}
</style>
