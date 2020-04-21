<template>
  <div>
    <!-- 添加一个弹出层 v-model里的值是控制弹出层的显示和隐藏的,position可以设置弹出层的位置(top,bottom,left,right) -->
    <van-popup
      class="popupglass"
      v-model="show"
      position="bottom"
      custom-style="height: 90%;"
      style="height: 90%;"
      bind:close="onClose"
    >
      <!-- 我的频道 -->
      <!-- 我的频道--------------标题 -->
      <van-cell title="我的频道">
        <template #default>
          <van-button
            plain
            round
            type="info"
            size="mini"
            @click="isEdit=!isEdit"
          >{{isEdit===true? '完成':'编辑'}}</van-button>
        </template>
      </van-cell>
      <!-- 我的频道--------------列表 -->
      <van-grid class="mychannel">
        <van-grid-item
          :class="{active:index ===active}"
          v-for="(item, index) in mychannel"
          @click.stop="changechannel(index)"
          :key="index"
        >
          <template #text>
            {{item.name}}
            <van-icon v-if="isEdit" @click="deltag(index)" class="deletechannel" name="clear" />
          </template>
        </van-grid-item>
      </van-grid>
      <!-- 频道推荐 ------------标题-->
      <van-cell title="频道推荐"></van-cell>
      <!-- 频道推荐 ------------列表-->
      <van-grid class="mychannel">
        <van-grid-item
          @click="addchannel(item)"
          v-for="(item, index) in tuijianchannel"
          :key="index"
        >
          <template #text>{{item.name}}</template>
        </van-grid-item>
      </van-grid>
    </van-popup>
  </div>
</template>

<script>
import { apiGetAllChannel, apiResetChannelList } from '../../../api/channel'
import { localGet, localSet } from '../../../utils/mylocal'
export default {
  props: ['mychannel', 'active'],
  mounted () {
    this.getAllChannel()
  },
  data () {
    return {
      isEdit: false,
      show: false,
      allchannels: []
    }
  },
  computed: {
    tuijianchannel: function () {
      // computed可以访问到props的值;
      // 写在computed的原因是当computed里的依赖项改变时(我们的频道数据发生改变),会重新执行这里面的代码,从而更新推荐频道的内容
      // console.log('computed父组件传递过来的我的频道', this.mychannel)
      var allid = this.mychannel.map(item => {
        return item.id
      })
      // console.log('所有频道的id', allid)
      var filterchannels = this.allchannels.filter(item => {
        return !allid.includes(item.id)
      })
      // console.log('过滤后的频道信息', filterchannels)
      return filterchannels
    }
  },
  methods: {
    changechannel (index) {
      console.log(index)
      // this.active = index
      // this.$emit('exchangechannel', index)
      this.$emit('update:active', index)
    },
    async saveMychannel () {
      // 添加/删除完频道之后我们要判断当前是否用户已登录,如果未登录,则将最新的频道列表保存在本地,如果登陆了就提交给服务器进行保存
      var token = localGet('userinfo')
      if (!token) {
        // 如果用户没有登录,则将最新的频道列表存入local中
        console.log('用户还未登录,最新频道列表存入local')
        localSet('channellist', this.mychannel)
      } else {
        // 用户已登录,将最新的频道列表上传给服务器保存
        // 先对上传的数据进行处理
        var selectList = this.mychannel.slice(1).map((item, index) => {
          return { id: item.id, seq: index + 2 }
        })
        try {
          await apiResetChannelList(selectList)
          // console.log(res)
        } catch (error) {
          window.console.log('在线更新频道列表失败')
        }
      }
    },
    deltag (index) {
      // 点击了频道的删除按钮,就将该频道从mychannel弹出
      this.mychannel.splice(index, 1)
      // 删除完之后要 保存/更新最新频道数据
      this.saveMychannel()
    },
    addchannel (item) {
      // 当我们新增完频道列表后,调用父组件的方法,更新频道列表的默认内容
      this.$set(item, 'articleList', [])
      this.$set(item, 'finished', false)
      this.$set(item, 'loading', false)
      this.$set(item, 'isLoading', false)
      this.mychannel.push(item)
      // 新增完后 保存/更新最新频道数据
      this.saveMychannel()
    },
    async getAllChannel () {
      var res = await apiGetAllChannel()
      this.allchannels = res.data.data.channels
      // console.log('我的频道信息', this.mychannel)
    }
  }
}
</script>

<style lang='less'>
.mychannel {
  position: relative;
  font-size: 14px;
  color: '#646566';
  .deletechannel {
    position: absolute;
    right: 0;
    top: 0;
  }
  .active {
    color: red;
  }
}
</style>
