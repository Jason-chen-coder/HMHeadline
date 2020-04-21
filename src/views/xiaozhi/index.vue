<template>
  <div class="roobot">
    <!-- 导航栏 -->
    <van-nav-bar title="小智同学" left-arrow @click-left="onClickLeft" />
    <!-- 聊天框 -->
    <div ref="wordspace" class="wordspace">
      <div v-for="(item, index) in arrList" :key="index">
        <!-- 机器人聊天部分 -->
        <div class="word roobotword" v-if="item.isroobot">
          <img src="../../assets/timg.jpg" alt />
          <span class="words">{{item.content}}</span>
        </div>
        <!-- 人的部分 -->
        <div class="word manword" v-else>
          <span class="words">{{item.content}}</span>
          <img :src="userimage|| 'http://toutiao.meiduo.site/Fkj6tQi3xJwVXi1u2swCElotfdCi'" alt />
        </div>
      </div>
    </div>
    <!-- 输入框 -->
    <van-search
      v-model="value"
      left-icon="edit"
      show-action
      background="#3296fa"
      placeholder="请输入"
      @search="send"
    >
      <template #action>
        <div @click="send">
          <i class="iconfont icon-send"></i>
        </div>
      </template>
    </van-search>
  </div>
</template>

<script>
import { localGet } from '../../utils/mylocal'
import io from 'socket.io-client'
export default {
  methods: {
    send () {
      // 将人输入的内容放进数据列表中
      this.arrList.push({
        isroobot: false,
        content: this.value
      })
      // 发起聊天请求
      this.socket.emit('message', {
        msg: this.value,
        timestamp: new Date()
      })
      // 清除输入框内容
      this.value = ''
    },
    // 返回上一页
    onClickLeft () {
      this.$router.back()
    }
  },
  data () {
    return {
      arrList: [{ isroobot: true, content: 'Hello! 我是小智机器人' }],
      value: '',
      socket: null,
      userimage: ''
    }
  },
  mounted () {
    this.userimage = localGet('userimage')
    // 得到token
    var token = this.$store.state.userinfo.token
    // 与服务器建立连接
    this.socket = io(`http://ttapi.research.itcast.cn?token=${token}`)
    // 接受服务器的反馈
    this.socket.on('message', (res) => {
      // 将服务器返回的信息放进数据列表中
      this.arrList.push({
        isroobot: true,
        content: res.msg
      })
      // 当聊天记录超出视窗时,要自动到达聊天区域底部
      this.$nextTick(() => {
        this.$refs.wordspace.scrollTop = this.$refs.wordspace.scrollHeight
      })
    })
  }
}
</script>

<style lang='less'>
.roobot {
  .van-nav-bar.van-hairline--bottom {
    background-color: #3296fa;
    .van-nav-bar__title.van-ellipsis {
      color: #fff;
    }
    i.van-icon.van-icon-arrow-left.van-nav-bar__arrow {
      color: #fff;
    }
  }
  .van-search.van-search--show-action {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 9px 0 9px 20px;
    .van-search__action {
      color: #fff;
      width: 10%;
      text-align: center;
      .iconfont.icon-send {
        font-size: 20px;
      }
    }
    .van-search__action:active {
      background-color: #3296fa;
    }
  }
  .wordspace {
    position: fixed;
    width: 100%;
    top: 46px;
    bottom: 54px;
    background-color: #e7e7e7;
    padding-top: 10px;
    overflow: auto;
    .word {
      padding: 10px 20px;
      // height: 50px;
      // line-height: 50px;
      display: flex;
      align-items: flex-start;
      img {
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }
      span {
        padding: 5px;
        line-height: 30px;
        font-size: 16px;
        border-radius: 8px;
        // height: 30px;
        background-color: #fff;
        box-shadow: 6px 2px 15px -7px;
      }
    }
    .roobotword {
      justify-content: flex-start;
      span {
        margin-left: 10px;
      }
    }
    .manword {
      justify-content: flex-end;
      span {
        margin-right: 10px;
      }
    }
  }
}
</style>
