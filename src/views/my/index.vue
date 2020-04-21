<template>
  <div class="mypage">
    <!-- 用户信息 -->
    <div class="userinfo">
      <!-- 用户头像部分 -->
      <div @click="readuserinfo" class="userhead">
        <img :src="userinfo.photo" alt />
        <span>{{userinfo.name}}</span>
      </div>
      <!-- 用户关注/动态/粉丝 -->
      <div class="userdata">
        <!-- 动态 -->
        <div>
          <div>{{userinfo.art_count}}</div>
          <div>动态</div>
        </div>
        <!-- 关注 -->
        <div>
          <div>{{userinfo.follow_count}}</div>
          <div>关注</div>
        </div>
        <!-- 粉丝 -->
        <div>
          <div>{{userinfo.fans_count}}</div>
          <div>粉丝</div>
        </div>
      </div>
      <!-- 今日阅读 -->
      <div class="todayread">
        今日阅读
        <div>0分钟</div>
      </div>
    </div>
    <!-- 用户 收藏/历史/作品 -->
    <van-grid :column-num="3" :icon-size="30" :border="false">
      <van-grid-item icon="star-o" text="收藏" />
      <van-grid-item class="history" icon="clock-o" text="历史" />
      <van-grid-item icon="records" text="作品" />
    </van-grid>
    <!-- 消息通知.用户反馈,小智同学 -->
    <van-cell-group>
      <van-cell size="large" title="消息通知" is-link />
      <van-cell size="large" title="用户反馈" is-link />
      <van-cell size="large" @click="gozhi()" title="小智同学" is-link />
    </van-cell-group>
  </div>
</template>

<script>
import { localSet } from '../../utils/mylocal'
import { apiGetuserinfo } from '../../api/user'
export default {
  data () {
    return {
      userinfo: ''
    }
  },
  async mounted () {
    var res = await apiGetuserinfo()
    console.log(res)
    this.userinfo = res.data.data
  },
  methods: {
    // 跳转至小智聊天页面
    gozhi () {
      // 将用户的头像传到local中
      localSet('userimage', this.userinfo.photo)
      // 跳转至小智聊天页面
      this.$router.push('/xiaozhi')
    },
    // 跳转至个人详情页面
    readuserinfo () {
      this.$router.push('/personalinfo')
    }
  }
}
</script>

<style lang='less'>
.mypage {
  background-color: #f5f7f9;
  height: 100%;
  .userinfo {
    box-sizing: border-box;
    padding: 40px 50px 0 50px;
    background-color: #3e9df8;
    height: 200px;
    position: relative;
    .userhead {
      display: flex;
      font-size: 18px;
      color: #fff;
      img {
        width: 70px;
        height: 70px;
        border-radius: 50%;
      }
      span {
        margin-left: 20px;
      }
    }
    .userdata {
      margin-top: 20px;
      display: flex;
      justify-content: space-between;
      div {
        color: #fff;
        font-size: 16px;
        text-align: center;
      }
    }
    .todayread {
      text-align: center;
      position: absolute;
      top: 50%;
      transform: translateY(-90%);
      background-color: #2b6ead;
      right: 0;
      padding: 5px 10px;
      font-size: 14px;
      color: #fff;
      border-radius: 30px 0 0 30px;
    }
  }
  .van-grid {
    // padding: 10px;
    height: 110px;
    margin-bottom: 20px;
    // .history {
    //   .van-grid-item__content.van-grid-item__content--center {
    //     border-left: 1px solid #000;
    //     border-right: 1px solid #000;
    //   }
    // }
  }
  i.van-icon.van-icon-star-o.van-grid-item__icon {
    color: red;
  }
  i.van-icon.van-icon-clock-o.van-grid-item__icon {
    color: orange;
  }
  i.van-icon.van-icon-records.van-grid-item__icon {
    color: #6a93ff;
  }
}
</style>
