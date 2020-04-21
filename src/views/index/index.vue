<template>
  <div class="indexpage">
    <!--van-nav-bar 有fixed属性 可以使用fixed属性将 van-nav-bar固定起来 -->
    <van-nav-bar fixed class="loginbar" title="首页" />
    <!-- 频道标签 -->
    <!-- active为选中的标签号 -->
    <van-tabs v-model="active">
      <!-- 频道标签的按钮部分 -->
      <div size="small" @click="tagpage" class="tagbtn">
        <i class="iconfont icon-line"></i>
      </div>
      <van-tab v-for="(item, index) in channelList" :key="index" :title="item.name">
        <van-pull-refresh v-model="item.isLoading" @refresh="onRefresh">
          <!-- 上拉加载新内容 -->
          <van-list
            v-model="item.loading"
            :finished="item.finished"
            finished-text="没有更多了"
            @load="onLoad"
          >
            <!-- 单条文章的展示结构 -->
            <van-cell
              @click="articleinfo(subitem.art_id)"
              v-for="(subitem, subindex) in item.articleList"
              :key="subindex"
            >
              <template #title>
                <h4>{{subitem.title}}</h4>

                <!-- 文章图片 -->
                <van-grid :border="false" :column-num="3">
                  <van-grid-item
                    v-for="(imgitem, imgindex) in subitem.cover.images"
                    :key="imgindex"
                  >
                    <van-image :show-error="false" :show-loading="false" lazy-load :src="imgitem" />
                  </van-grid-item>
                  <!-- 文章信息区域 -->
                  <div class="articlemsg">
                    <div class="left">
                      <span>{{subitem.aut_name}}</span>
                      <span>{{subitem.comm_count}} 条</span>
                      <span>{{subitem.pubdate|timefilter}}</span>
                    </div>
                    <div class="right">
                      <van-icon @click="showmore(subitem)" name="close" />
                    </div>
                  </div>
                </van-grid>
              </template>
            </van-cell>
          </van-list>
        </van-pull-refresh>
      </van-tab>
    </van-tabs>
    <!-- 引入频道选择组件 -->
    <!--  :active="active"  @update:active="v=>{active = v}"  可以简写为 :active.sync='active-->
    <!-- <channel :mychannel="channelList" @update:active="v=>{active = v}"  ref="channel"></channel>-->
    <channel :mychannel="channelList" :active.sync="active" ref="channel"></channel>
    <more ref="more" :articleid="articleid" :authorid="authorid" @uninterest="removearticle" />
  </div>
</template>
<script>
import Vue from 'vue'
import more from '../../views/index/com/more'
import { Lazyload } from 'vant'
import { apiGetArticleList } from '../../api/article'
import { localGet } from '../../utils/mylocal'
import { apiGetChannel } from '../../api/channel'
import channel from './com/channel'
Vue.use(Lazyload)
export default {
  mounted () {
    // 进入页面,调用获取频道列表方法
    this.getChannels()
  },
  components: {
    channel,
    more
  },
  data () {
    return {
      channelList: [],
      active: 0,
      articleid: 0,
      authorid: 0
    }
  },
  methods: {
    // 点击文章
    articleinfo (id) {
      console.log(id)
      // 页面跳转至文章详情页面
      this.$router.push(`/articleinfo?id=${id}`)
    },
    removearticle (value) {
      // 移出不感兴趣的文章
      console.log(value)
      this.channelList[this.active].articleList.forEach((item, index) => {
        if (item.art_id === value) {
          this.channelList[this.active].articleList.splice(index, 1)
        }
      })
    },
    // 点击单条文章上的叉叉按钮
    showmore (item) {
      console.log(item)
      this.$refs.more.show = true
      this.articleid = item.art_id
      this.authorid = item.aut_id
      // 让更多页面的举报开关关掉
      this.$refs.more.isResport = false
    },
    // 点击了标签按钮,拉起标签管理界面
    tagpage () {
      // 将首页的频道数据传给标签管理页面
      this.$refs.channel.show = true
    },
    onRefresh () {
      // 刷新时将数组所有内容清空
      // 先获取当前频道
      var currentChannel = this.channelList[this.active]
      // 将当前频道的内容恢复默认(清空)
      currentChannel.articleList = []
      currentChannel.finished = false
      currentChannel.loading = false
      currentChannel.isLoading = false
      // 清空后,手动执行下拉加载新数据函数,
      // 由于我们默认的频道文章列表单个文章的高度较低,所以一次加载的内容无法撑开整个屏幕,所以上拉刷新之后只请求一次的话就没有滚动条了,然后onLoad()方法就无法再次触发了
      //    解决办法:1.手动执行两次onload()函数,请求足够多的内容去填充整个可视区域(推荐)
      //            2.或者我们可以手动去修改每个频道文章的显示高度,让他请求一次的内容所有的高度能撑满可视区域
      this.onLoad()
      this.onLoad()
    },
    async onLoad () {
      // 刚进入页面时由于列表为空会触发,下拉触底时触发
      // 1.先得到当前用户点击的频道
      // window.console.log('加载新数据', this.channelList)
      var currentChannel = this.channelList[this.active]
      console.log(currentChannel)
      var id = currentChannel.id
      // window.console.log('当前频道id为:', id)
      // 2.根据当前频道id 得到当前的频道数据列表
      var res = await apiGetArticleList({
        channelid: id,
        timestamp: Date.now()
      })
      // console.log('查询到的当前频道的文章结果', res)
      // 当查询到的额当前频道的文章为0时,停止加载新数据的操作
      if (res.data.data.results.length === 0) {
        currentChannel.finished = true
      }
      // 3.将查询的结果赋值给当前频道的文章列表,因为'this.channelList[this.active]'是对象,所以直接把结果给currentChannel变量就会成功修改channelList[active]的值
      currentChannel.articleList = [...currentChannel.articleList, ...res.data.data.results]
      currentChannel.loading = false
      // 4.点击新标签时,获得的新内容,this.$set来刷新页面,让页面显示最新的信息
    },
    // 获得频道数据
    async getChannels () {
      // 判断用户是否登录
      var token = this.$store.state.userinfo.token
      try {
        if (token) {
          // window.console.log('用户登陆了')
          // 如果用户登陆了,频道数据就从服务器获取
          var res = await apiGetChannel()
          this.channelList = res.data.data.channels
        } else {
          var localchannellist = localGet('channellist')
          // 如果用户没登录,检查localstorage是否有保存好的频道数据
          if (localchannellist) {
            // 如果本地有频道数据就直接渲染
            this.channelList = localchannellist
          } else {
            // 如果本地没有频道数据就去服务器获取默认的频道列表
            var deafultres = await apiGetChannel()
            this.channelList = deafultres.data.data.channels
          }
        }
      } catch (error) {
        window.console.log('申请频道列表数据出错')
      }
      // 给频道列表中的每一个频道都添加属性
      this.getArticleList()
    },
    getArticleList () {
      this.channelList.forEach(item => {
        // 这里给每一个频道都增加 文章列表,下拉属性,上拉属性,数据加载完毕属性;我们给每个频道都加专属的属性保证不会与其他频道弄混
        // var strname = '我是' + item.name + '中的articlelist'
        // 由于这里的articlestlist是动态加上去的,所以数据不具备响应式的特点,我们可以使用this.$set()来添加属性和值
        // item.articleList = []
        // item.finished = false
        // item.loading = false
        // item.isLoading = false
        this.$set(item, 'articleList', [])
        this.$set(item, 'finished', false)
        this.$set(item, 'loading', false)
        this.$set(item, 'isLoading', false)
      })
      // window.console.log(this.channelList)
    }
  }
}
</script>

<style lang="less">
.indexpage {
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
    .van-tabs__nav.van-tabs__nav--line {
      // width: 90%;
    }
  }
  .van-tabs__content {
    padding-top: 45px;
  }
  .van-tabs__wrap.van-tabs__wrap--scrollable.van-hairline--top-bottom {
    width: 90%;
    z-index: 888;
    margin-top: 46px;
  }
  .van-tabs__wrap.van-hairline--top-bottom {
    margin-top: 46px;
    width: 100%;
    z-index: 1200;
  }
  .van-list {
    margin-bottom: 50px;
  }
  .van-tabs__nav.van-tabs__nav--line {
    z-index: 1200;
  }
  .van-tab__pane {
    padding-top: 45px;
  }
  .tagbtn {
    text-align: center;
    line-height: 35px;
    // position: fix;
    position: fixed;
    right: 0;
    font-size: 14px;
    top: 47px;
    height: 45px;
    line-height: 45px;
    display: inline-block;
    width: 10%;
    padding: 0;
    z-index: 1200;
    background-color: #fff;
  }
  .articlemsg {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    .left {
      span {
        margin: 0 5px;
      }
    }
  }
}
</style>
