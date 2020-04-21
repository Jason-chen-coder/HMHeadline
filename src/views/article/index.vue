<template>
  <div class="articleinfo">
    <!-- 头部导航栏 -->
    <van-nav-bar
      :title="articleinfo.title"
      background="#3194ff"
      left-arrow
      @click-left="onClickLeft"
    >
      <template #right>
        <van-icon name="ellipsis" @click="showShare=true" />
      </template>
    </van-nav-bar>
    <!-- 文章标题 -->
    <h2 class="articletitle">{{articleinfo.title}}</h2>
    <!-- 文章作者信息 -->
    <van-sticky :offset-top="0">
      <div class="authorinfo">
        <div class="authorimg">
          <van-image round width="3.5rem" height="3.5rem" :src="articleinfo.aut_photo" />
        </div>
        <div class="authormsg">
          <span>{{articleinfo.aut_name}}</span>
          <br />
          <span>{{articleinfo.pubdate|timefilter}}</span>
        </div>
        <div class="noticebtn">
          <van-button type="info" @click="follow()" v-if="!articleinfo.is_followed">+ 关注</van-button>
          <van-button type="info" @click="unfollow()" v-else>取消关注</van-button>
        </div>
      </div>
    </van-sticky>
    <!-- 文章内容 -->
    <div class="article">
      <div v-html="articleinfo.content"></div>
      <!-- 点赞/不喜欢 -->
      <div class="islike">
        <van-button
          icon="like-o"
          type="default"
          class="like"
          :class="{'isunlike':articleinfo.attitude===1}"
          @click="like"
        >点赞</van-button>
        <van-button
          icon="delete"
          class="unlike"
          @click="unlike"
          :class="{'isunlike':articleinfo.attitude===0}"
        >不喜欢</van-button>
      </div>
    </div>
    <!-- 评论区 -->
    <van-list
      class="commentslist"
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <comments
        @isanswer="v=>{answershow=v}"
        :commitList="item"
        :isReply="isReply"
        v-for="(item,index) in commitList"
        :key="index"
        ref="comments"
        :articleid="articleid"
      ></comments>
    </van-list>
    <!-- 输入评论模块 -->
    <write
      :isReplycomment="false"
      class="write"
      :articleid="articleid"
      :iscollected="articleinfo.is_collected"
      @collected="v=>{articleinfo.is_collected=v}"
      @newcommit="newcommit"
      @showshare="v=>{showShare=v}"
    ></write>
    <!-- 分享面板 -->
    <van-share-sheet v-model="showShare" title="立即分享给好友" :options="options" @select="onSelect" />
    <!-- 评论回复弹出框 -->
    <answer :answershow="answershow" @input="v=>{answershow=v}" />
  </div>
</template>

<script>
import { apiArticleInfo, apiLikeArticle, apiUnLikeArticle, apiGetComments } from '../../api/article'
import { apiFollowAuthor, apiUnFollowAuthor } from '../../api/user'
import comments from './com/comments'
import answer from './com/answer'
import write from './com/write'
export default {
  data () {
    return {
      articleid: this.$route.query.id,
      articleinfo: '',
      showShare: false,
      commitList: [],
      finished: false,
      loading: false,
      offset: null,
      limit: 10,
      isReply: false,
      answershow: false,
      options: [
        [
          { name: '微信(开发中)', icon: 'wechat' },
          { name: '微博(开发中)', icon: 'weibo' },
          { name: 'QQ(开发中)', icon: 'qq' }
        ],
        [
          { name: '复制链接(开发中)', icon: 'link' },
          { name: '分享海报(开发中)', icon: 'poster' },
          { name: '二维码(开发中)', icon: 'qrcode' }
        ]
      ]
    }
  },
  components: {
    comments,
    write,
    answer
  },
  methods: {
    // 上拉加载新评论
    async onLoad () {
      try {
        var res = await apiGetComments({ id: this.articleid, typeid: 'a', offset: this.offset, limit: this.limit })
        console.log('评论列表', res)
        if (res.data.data.results.length === 0) {
          this.finished = true
          // console.log('已经没有评论了')
          return
        }
        // 将最后一个评论id给offset
        this.offset = res.data.data.end_id
        this.commitList = [...this.commitList, ...res.data.data.results]
        this.loading = false
        if (res.data.data.results.length === 0) {
          this.finished = true
        }
      } catch (error) {
        // console.log('获取评论列表失败')
      }
      // }
    },
    // 获取最新的评论
    newcommit (obj) {
      // 把最新的评论给评论列表
      this.commitList.unshift(obj)
    },
    // 分享选中那个方式
    onSelect (option) {
      this.$toast(option.name)
      this.showShare = true
    },
    // 不喜欢文章
    async unlike () {
      try {
        var res = apiUnLikeArticle(this.articleinfo.art_id)
        console.log(res)
        this.articleinfo.attitude = 0
        this.$toast.success('不喜欢成功')
      } catch (error) {
        console.log(error)
      }
    },
    // 喜欢文章
    async like () {
      try {
        var res = apiLikeArticle(this.articleinfo.art_id)
        console.log(res)
        this.articleinfo.attitude = 1
        this.$toast.success('喜欢成功')
      } catch (error) {
        console.log(error)
      }
    },
    // 取消关注
    async unfollow () {
      try {
        await apiUnFollowAuthor(this.articleinfo.aut_id)
        this.$toast.success('取消关注成功')
        this.articleinfo.is_followed = 0
      } catch (error) {
        console.log('取消关注失败')
      }
    },
    // 关注作者
    async follow () {
      try {
        await apiFollowAuthor(this.articleinfo.aut_id)
        this.$toast.success('关注成功')
        this.articleinfo.is_followed = 1
      } catch (error) {
        console.log('关注失败')
      }
    },
    onClickLeft () {
      this.$router.back()
    }
  },
  async mounted () {
    var res = await apiArticleInfo(this.articleid)
    console.log('文章详情', res)
    this.articleinfo = res.data.data
  }
}
</script>

<style lang='less'>
.articleinfo {
  .van-nav-bar.van-hairline--bottom {
    background-color: #3194ff;
    .van-nav-bar__title.van-ellipsis {
      color: white;
    }
    .van-nav-bar__left {
      .van-icon.van-icon-arrow-left.van-nav-bar__arrow {
        color: white;
      }
    }
    .van-icon.van-icon-ellipsis {
      color: white;
      font-size: 20px;
    }
  }
  .articletitle {
    text-align: center;
  }
  .article {
    padding: 0 20px;
  }
  .authorinfo {
    background-color: #fff;
    height: 64px;
    display: flex;
    padding: 10px 20px;
    .authormsg {
      span {
        line-height: 25px;
      }
      flex: 1;
      margin-left: 20px;
    }
    .noticebtn {
      margin-top: 10px;
    }
  }
  .article {
    .islike {
      display: flex;
      justify-content: space-around;
      margin-top: 40px;
      .like,
      .unlike {
        padding: 10px;
        width: 100px;
        // border: 1px solid #ededed;
        border-radius: 20px;
        line-height: 20px;
        font-size: 14px;
        .van-icon {
          font-size: 20px;
        }
      }
    }
    .isunlike {
      color: red;
      border: 1px solid red;
    }
  }
  .commentslist {
    margin-top: 50px;
  }
}
</style>
