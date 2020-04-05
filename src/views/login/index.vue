<template>
  <div>
    <!-- <van-nav-bar class="loginbar" title="登录" /> -->
    <div class="loginimg">
      <img src="../../assets/login.png" alt />
    </div>
    <van-cell-group>
      <van-field :error-message="msg.phone" v-model="obj.phone" placeholder="请输入手机号">
        <template #left-icon>
          <i class="iconfont icon-iPhone"></i>
        </template>
      </van-field>
      <van-field
        left-icon="music-o"
        :error-message="msg.code"
        v-model="obj.code"
        placeholder="请输入验证码"
      >
        <template #left-icon>
          <i class="iconfont icon-lock"></i>
        </template>
        <template #button>
          <van-button class="codebtn" round type="default" color="#ededed" size="small">发送验证码</van-button>
        </template>
      </van-field>
      <van-button @click="login()" class="loginbtn" :loading="isloading" type="info" size="large">登录</van-button>
    </van-cell-group>
  </div>
</template>

<script>
import { Apilogin } from '../../api/user'
export default {
  data () {
    return {
      // 管理用户信息
      obj: {
        // 手机号
        phone: '18611111111',
        // 验证码
        code: '246810'
      },
      msg: {
        phone: '',
        code: ''
      },
      isloading: false
    }
  },
  methods: {
    async login () {
      // 将按钮设置为加载状态
      this.isloading = true
      if (this.checkData()) {
        // try{}catch{} try里面写运行的代码,如果try中的代码出错了就会执行catch里面的代码然后继续执行后面的代码,如果没出错就直接执行后面的代码
        try {
          console.log('开始发送登录的申请')
          // 使用async修饰包括axios的函数 ， 用await修饰axios请求函数 ；修饰效果为axios请求函数将会变成同步请求，执行完axios请求函数后才会继续往下执行
          const res = await Apilogin(this.obj)
          // window.console.log(res.data.data)
          // 将得到的结果返回给vuex;执行store的setuserinfo方法后会直接将传过去的res.data.data保存到userinfo中同时也保存至localstorage中
          this.$store.commit('setuserinfo', res.data.data)
          // 提示登陆成功
          this.$toast.success('登录成功')
          // 将按钮状态设置正常
          this.isloading = false
          // 进行页面跳转,跳转至首页
          this.$router.push('/index')
          console.log('保存至store中的值为', this.$store.state.userinfo)
        } catch {
          // 登陆失败
          this.$toast.fail('登录失败')
          this.isloading = false
        }
      } else {
        console.log('登录验证失败')
      }
    },
    checkData () {
      // 设置一个查验数组,用来保存手机号和验证码是否通过验证
      var checkarr = []
      if (this.obj.phone.length !== 11) {
        this.msg.phone = '手机号码长度不合法'
        checkarr.push(false)
      } else {
        this.msg.phone = ''
        checkarr.push(true)
      }
      if (this.obj.code.length !== 6) {
        this.msg.code = '验证码长度不合法'
        checkarr.push(false)
      } else {
        this.msg.code = ''
        checkarr.push(true)
      }
      // 如果checkarr数组中包含了false就说明表单检验不成功
      if (checkarr.includes(false)) {
        console.log('表单验证失败')
        return false
      } else {
        console.log('表单验证成功')
        return true
      }
    }
  }
}
</script>

<style lang="less">
// .loginbar.van-nav-bar {
//   background-color: #3296fa;
//   .van-hairline--bottom::after {
//     border-bottom-width: 0;
//   }
//   .van-nav-bar__title {
//     color: white;
//   }
// }

div.loginimg {
  background-color: #3296fa;
  height: 150px;
  margin-bottom: 100px;
  text-align: center;
  img {
    width: 100%;
    // height: 150px;
    margin-top: 60px;
  }
}
.codebtn span.van-button__text {
  color: #999;
}
.loginbtn.van-button--large {
  width: 80%;
  margin: 30px 35px;
}
</style>
