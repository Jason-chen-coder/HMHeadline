<template>
  <div class="comments">
    <van-cell class="commentinfo">
      <div class="commenterimg">
        <van-image round width="3.5rem" height="3.5rem" :src="commitList.aut_photo" />
      </div>
      <div class="commentermsg">
        <span>{{commitList.aut_name}}</span>
        <div class="commitinfo">{{commitList.content}}</div>
        <div class="timeinfo">
          {{commitList.pubdate|timefilter}}
          <van-button
            v-if="!isReply"
            size="small"
            class="answer"
            @click="answer()"
            round
            color="#eff7f8"
          >回复{{commitList.reply_count}}</van-button>
        </div>
      </div>
      <div class="noticebtn">
        <span>
          <van-icon
            @click="likecommit(commitList.com_id)"
            :class="{'likecommit':commitList.is_liking}"
            name="like"
          />
          {{commitList.like_count}}
        </span>
      </div>
    </van-cell>
  </div>
</template>

<script>
import bus from '../../../utils/bus'
import { apiLikeCommit, apiUnlikeCommit } from '../../../api/commit'
export default {
  props: ['articleid', 'commitList', 'isReply'],
  data () {
    return {
      newobj: ''
    }
  },
  methods: {
    // 点击回复评论
    answer () {
      // console.log('回复评论')
      // 将值传递给父组件
      this.$emit('isanswer', true)
      // 通过eventbus传递obj(当前评论的信息),把参数传入bus中
      bus.$emit('passItem', this.commitList)
    },
    // 喜欢评论
    async likecommit (id) {
      // 判断是否已是喜欢的了
      if (this.commitList.is_liking) {
        // 已经喜欢,则取消喜欢
        var unlikeres = await apiUnlikeCommit(id)
        console.log('取消评论点赞', unlikeres)
        this.commitList.is_liking = false
        this.commitList.like_count--
        this.$toast({
          message: '取消喜欢',
          icon: 'like-o'
        })
      } else {
        // 还未喜欢,则进行喜欢
        var res = await apiLikeCommit(id)
        this.commitList.like_count++
        console.log('喜欢评论', res)
        this.commitList.is_liking = true
        this.$toast({
          message: '喜欢成功',
          icon: 'like'
        })
      }
    }
  }
}
</script>

<style lang='less'>
.comments {
  margin-top: 20px;
  margin-bottom: 20px;
  .commentinfo {
    .van-cell__value.van-cell__value--alone {
      display: flex;
      padding: 0 10px;
      // margin: 10px 0;
      .commentermsg {
        flex: 1;
        margin-left: 15px;
        .commitinfo {
          margin-top: 10px !important;
        }
        .timeinfo {
          margin-top: 10px;
          .answer {
            color: black !important;
            margin-left: 10px;
          }
        }
      }
      .noticebtn {
        line-height: 30px;
        font-size: 20px;
        margin-right: 10px;
        .van-icon.van-icon-like {
          margin-right: 5px;
        }
        .likecommit {
          color: red;
        }
      }
    }
  }
}
</style>
