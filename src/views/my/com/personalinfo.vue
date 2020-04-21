<template>
  <div class="userinfo">
    <!-- 标题 -->
    <van-nav-bar title="个人信息" right-text="保存" left-arrow @click-left="back" @click-right="save" />
    <!-- 头像/昵称/介绍 -->
    <van-cell-group class="tabgroup1">
      <van-cell @click="showuserimage=true" title="头像" is-link>
        <template #default>
          <img class="userimage" :src="userprofileinfo.photo" alt />
        </template>
      </van-cell>
      <van-cell title="昵称" @click="showname=true" is-link :value="userprofileinfo.name" />
      <!-- 修改昵称页面 -->
      <van-popup v-model="showname" position="bottom" :style="{ height: '6%' }">
        <van-field v-model="userprofileinfo.name" required label="昵称" />
      </van-popup>
      <van-cell title="介绍" @click="showintro=true" is-link :value="userprofileinfo.intro" />
      <!-- 修改介绍页面 -->
      <van-popup v-model="showintro" position="bottom" :style="{ height: '23%' }">
        <van-field
          v-model="userprofileinfo.intro"
          rows="2"
          autosize
          label="留言"
          type="textarea"
          maxlength="100"
          placeholder="请输入留言"
          show-word-limit
        />
      </van-popup>
    </van-cell-group>
    <!-- 性别/生日 -->
    <van-cell-group class="tabgroup2">
      <van-cell
        @click="showgender=true"
        title="性别"
        is-link
        :value="userprofileinfo.gender? '女':'男'"
      />
      <!-- 性别选择框 -->
      <van-popup v-model="showgender" position="bottom" :style="{ height: '30%' }">
        <van-picker
          show-toolbar
          title="选择性别"
          :columns="columns"
          @cancel="showgender = false"
          @confirm="onConfirm"
        />
      </van-popup>
      <van-cell title="生日" @click="showbirday = true" is-link :value="userprofileinfo.birday" />
      <!-- 生日选择框 -->
      <van-popup v-model="showbirday" position="bottom" :style="{ height: '30%' }">
        <van-datetime-picker
          v-model="selectbirday"
          type="date"
          @confirm="confirmdate"
          @cancel="showbirday=false"
          :min-date="minDate"
          :max-date="maxDate"
        />
      </van-popup>
    </van-cell-group>
    <imagepop @newuserimage="newuserimage" :show="showuserimage" @changeshow="v=>{showuserimage=v}"></imagepop>
  </div>
</template>

<script>
import { apiGetuserprofileinfo, apiGetuserinfo, apiSetUserinfo } from '../../../api/user'
import imagepop from './imagepop'
export default {
  data () {
    return {
      userprofileinfo: {
        photo: '',
        name: '',
        intro: '',
        gender: null,
        birday: ''
      },
      columns: ['男', '女'],
      intro: '',
      showname: false,
      showintro: false,
      showgender: false,
      showbirday: false,
      minDate: new Date(1900, 1, 1),
      maxDate: new Date(),
      selectbirday: '',
      showuserimage: false
    }
  },
  async mounted () {
    var res = await apiGetuserprofileinfo()
    // console.log('res1', res)
    this.userprofileinfo.photo = res.data.data.photo
    this.userprofileinfo.name = res.data.data.name
    this.userprofileinfo.gender = res.data.data.gender
    this.userprofileinfo.birday = res.data.data.birthday
    var res2 = await apiGetuserinfo()
    // this.intro = res2.data.data.intro
    this.userprofileinfo.intro = res2.data.data.intro
    // console.log('res2', res2)
    // 将生日日期转换成date格式
    this.selectbirday = new Date(this.userprofileinfo.birday)
  },
  components: {
    imagepop
  },
  methods: {
    // 最新的用户头像
    newuserimage (value) {
      this.userprofileinfo.photo = value
    },
    // 确认日期
    confirmdate () {
      // 选择好日期后,先将日期转换成/格式
      this.userprofileinfo.birday = this.selectbirday.toLocaleDateString().replace(/\//g, '-')
      // console.log('现在的生日日期为', this.userprofileinfo.birday)
      this.showbirday = false
    },
    // 确认性别
    onConfirm (value, index) {
      this.userprofileinfo.gender = parseInt(index)
      // console.log(`当前值：${value}, 当前索引：${index}`, typeof (this.userprofileinfo.gender))
      this.showgender = false
    },
    // 返回上一页
    back () {
      this.$router.back()
    },
    // 保存修改的信息
    async save () {
      console.log('保存修改的所有信息', this.userprofileinfo)
      // 提交修改的个人信息
      try {
        var res = await apiSetUserinfo({ username: this.userprofileinfo.name, usergender: this.userprofileinfo.gender, userbirthday: this.userprofileinfo.birday, userintro: this.userprofileinfo.intro })
        console.log(res)
        this.$toast.success('保存成功')
      } catch (error) {
        console.dir(error)
        // 昵称的长度不能超过7个字符
        this.$toast.fail('昵称的长度不能超过7个字符')
      }
    }
  }
}
</script>

<style lang='less'>
.userinfo {
  .van-nav-bar.van-hairline--bottom {
    background-color: #3e9df8;
    .van-nav-bar__title.van-ellipsis {
      color: #fff;
    }
    .van-nav-bar__right .van-nav-bar__text {
      color: #fff;
    }
    .van-icon.van-icon-arrow-left.van-nav-bar__arrow {
      color: #fff;
    }
  }
  .userimage {
    width: 30px;
    height: 30px;
    border-radius: 50%;
  }
  .tabgroup2 {
    margin-top: 20px;
  }
}
</style>
