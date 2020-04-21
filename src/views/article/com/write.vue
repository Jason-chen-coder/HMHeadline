<template>
  <div class="write">
    <van-search
      v-model="value"
      background="#ffff"
      left-icon="edit"
      :placeholder="isReplycomment ?'写下对该评论的回复':'写下对文章的评论'"
    ></van-search>
    <div class="writeicon">
      <van-button size="mini" @click="upcommit" type="info">发送</van-button>
      <van-icon name="comment-o" badge="9" />
      <van-icon v-if="iscollected" @click="uncollect()" class="iscollect" name="star" badge="9" />
      <van-icon v-else name="star-o" @click="collect()" badge="9" />
      <i class="iconfont icon-zhuanfa" @click="share()"></i>
    </div>
  </div>
</template>

<script>
import { apiCollectArticle, apiCancelCollect } from '../../../api/article'
import { apiUpcommit, apiAnswerArticleComment } from '../../../api/commit'
export default {
  props: ['articleid', 'iscollected', 'isReplycomment', 'commitid'],
  data () {
    return {
      commentvalue: '',
      value: ''
    }
  },
  mounted () {
    // 创建这个评论面板时发起查询,查询收藏数
    console.log('现在是', this.isReplycomment)
  },
  methods: {
    // 分享功能
    share () {
      this.$emit('showshare', true)
    },
    // 提交评价
    async upcommit () {
      if (!this.isReplycomment) {
        console.log('发表文章评价')
        var artid = this.$route.query.id
        try {
          var res = await apiUpcommit({ targetid: artid, content: this.value })
          console.log(res)
          this.$toast.success('发表评论成功')
          // 将最新的评论信息传递给父组件
          var newcommit = res.data.data.new_obj
          this.$emit('newcommit', newcommit)
          this.value = ''
        } catch (error) {
          console.log(error)
        }
      } else {
        // 发表对文章评论的回复
        console.log('对文章的评论进行回复', this.$route.query.id, this.commitid)
        var res2 = await apiAnswerArticleComment({ targetid: this.commitid, content: this.value, artid: this.$route.query.id })
        console.log(res2)
        // 对文章评论回复成功
        this.$toast.success('回复成功')
        this.value = ''
        // 将评论列表的回复数量加一
        this.$emit('addcommentanswer', res2.data.data.new_obj)
      }
    },
    // 收藏文章
    async collect () {
      console.log('收藏文章的id', this.articleid)
      try {
        var res = await apiCollectArticle(this.articleid)
        console.log('收藏成功', res)
        this.$emit('collected', true)
        this.$toast({ message: '收藏成功', icon: 'star' })
      } catch (error) {

      }
    },
    // 取消文章收藏
    async uncollect () {
      console.log('取消收藏文章')
      try {
        var res = await apiCancelCollect(this.articleid)
        console.log('取消收藏文章成功', res)
        this.$emit('collected', false)
        this.$toast({ message: '取消收藏', icon: 'star-o' })
      } catch (error) {

      }
    }
  }
}
</script>

<style lang='less'>
.write {
  position: fixed;
  display: flex;
  line-height: 54px;
  bottom: 0;
  background-color: #fff;
  // height: 54px;
  width: 100%;
  box-shadow: 10px 16px 16px 10px;
  .van-cell.van-cell--borderless.van-field {
    border: 1px solid #ededed;
    border-radius: 50px;
    background-color: #fff;
    padding-left: 10px;
    .van-cell__value.van-cell__value--alone.van-field__value {
    }
  }
  .van-search__content.van-search__content--square {
    background-color: #ffff;
    overflow: hidden;
  }
  .writeicon {
    display: flex;
    width: 38%;
    justify-content: space-between;
    align-items: center;
    font-size: 20px;
    .iconfont.icon-zhuanfa {
      font-size: 20px;
    }
  }
  .iscollect {
    color: red;
  }
}
</style>
