<template>
  <div class="searchresult">
    <van-nav-bar fixed title="搜索结果" left-arrow @click-left="onBack" />
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <van-cell v-for="(item, index) in articles" :key="index">
        <template #title>
          <h4>{{item.title}}</h4>
          <!-- 文章区域 -->
          <van-grid :border="false" :column-num="3">
            <van-grid-item
              class="imagegroup"
              v-for="(imgitem, imgindex) in item.cover.images"
              :key="imgindex"
            >
              <!-- 文章图片 -->
              <van-image
                v-if="imgitem"
                :show-error="false"
                :show-loading="false"
                lazy-load
                :src="imgitem"
              />
            </van-grid-item>
          </van-grid>
          <!-- 文章信息区域 -->
          <div class="articlemsg">
            <div class="left">
              <span>{{item.aut_name}}</span>
              <span>{{item.comm_count}} 条</span>
              <span>{{item.pubdate|timefilter}}</span>
            </div>
          </div>
          <van-grid class="articlegrid">
            <van-grid-item icon="comment-o" :text="item.comm_count||'评论'" />
            <van-grid-item icon="good-job-o" @click="like()" :text="item.like_count||'点赞'" />
            <van-grid-item icon="certificate" :text="item.collect_count||'分享'" />
          </van-grid>
        </template>
      </van-cell>
    </van-list>
  </div>
</template>

<script>
import { apiSearchResult } from '../../api/article'
export default {
  data () {
    return {
      key: '',
      loading: false,
      finished: false,
      // 每页的文章数量
      perpage: 10,
      // 第几页
      page: 1,
      articles: []
    }
  },
  mounted () {
    this.key = this.$route.query.key
  },
  methods: {
    // 点赞
    like () {
      var islogin = this.$isLogin()
      if (islogin) {
        // 用户已经登录
        console.log('执行点赞操作')
      }
    },
    // 返回上一页
    onBack () {
      this.$router.back()
    },
    // 加载新内容
    async  onLoad () {
      console.log('加载新内容')
      // 向服务器查搜索文章
      try {
        var res = await apiSearchResult({
          page: this.page,
          perpage: this.perpage,
          key: this.key
        })
      } catch (error) {
        console.log('搜素文章失败')
      }
      if (res.data.data.results.length === 0) {
        // 查询的文章结果为0
        this.finished = true
        return
      }
      this.articles = [...this.articles, ...res.data.data.results]
      this.loading = false
      this.page++
    }
  }
}
</script>

<style lang='less'>
.searchresult {
  .van-list {
    margin-top: 46px;
    .van-cell__title {
      h4 {
        margin: 0;
      }
      .articlegrid.van-grid.van-hairline--top {
        display: flex;
        justify-content: space-between;
        .van-grid-item {
          flex: 1;
          .van-grid-item__content.van-grid-item__content--center.van-hairline {
            flex-direction: row;
            i {
              margin-right: 7px;
              font-size: 16px;
            }
            .van-grid-item__text {
              line-height: 32px;
              margin-top: 0;
              font-size: 14px;
            }
          }
        }
      }
    }
  }
  .imagegroup.van-grid-item {
    width: 100%;
    .van-grid-item__content.van-grid-item__content--center {
      flex: 1;
    }
  }
  .van-nav-bar__title.van-ellipsis {
    color: white;
  }
  .van-nav-bar.van-hairline--bottom {
    background-color: #3296fa;
  }
  .van-icon.van-icon-arrow-left.van-nav-bar__arrow {
    color: white;
  }
  .left {
    span {
      margin: 0 5px;
    }
  }
}
</style>
