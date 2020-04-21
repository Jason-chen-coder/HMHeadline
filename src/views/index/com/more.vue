<template>
  <div>
    <van-popup round v-model="show" class="more">
      <van-cell-group v-if="!isResport">
        <van-cell @click="uninterest()">
          <van-icon class="moreicon" name="failure" />不感兴趣
        </van-cell>
        <van-cell @click="isResport=!isResport">
          <van-icon class="moreicon" name="info-o" />反馈垃圾内容
          <template #right-icon>
            <van-icon name="arrow" />
          </template>
        </van-cell>
        <van-cell @click="blockauthor()">
          <van-icon class="moreicon" name="delete" />拉黑作者
        </van-cell>
      </van-cell-group>
      <van-cell-group v-if="isResport">
        <van-cell @click="isResport=false" icon="arrow-left" title="返回" />
        <van-cell @click="resport(item.id)" v-for="(item, index) in reportdata" :key="index">
          <!-- 举报类型： 0-其他问题，1-标题夸张，2-低俗色情，3-错别字多，4-旧闻重复，5-广告软文，6-内容不实，7-涉嫌违法犯罪，8-侵权' -->
          {{item.type}}
        </van-cell>
      </van-cell-group>
    </van-popup>
  </div>
</template>

<script>
import { apiUninterest, apiResportArticle } from '../../../api/article'
import { apiBlockauthor } from '../../../api/user'
export default {
  props: ['articleid', 'authorid'],
  data () {
    return {
      show: false,
      isResport: false,
      reportdata: [
        {
          type: '其他问题',
          id: 0
        },
        {
          type: '标题夸张',
          id: 1
        },
        {
          type: '低俗色情',
          id: 2
        },
        {
          type: '错别字多',
          id: 3
        },
        {
          type: '旧闻重复',
          id: 4
        },
        {
          type: '广告软文',
          id: 5
        },
        {
          type: '内容不实',
          id: 6
        },
        {
          type: '涉嫌违法犯罪',
          id: 7
        },
        {
          type: '侵权',
          id: 8
        }
      ]
    }
  },
  methods: {
    async blockauthor () {
      try {
        var res = await apiBlockauthor(this.authorid)
        console.log(res)
        this.$toast.success('拉黑成功')
        // 让更过页面消失
        this.show = false
      } catch (error) {
        this.$toast.fail('拉黑失败')
      }
    },
    async resport (typeid) {
      // 发起举报申请
      try {
        var res = await apiResportArticle({ target: this.articleid, type: typeid })
        console.log(res)
        this.$toast.success('举报成功')
        // 举报成功后将更多页面恢复,并消失
        this.isResport = false
        this.show = false
      } catch (error) {
        this.$toast.fail('举报失败')
      }
    },
    async uninterest () {
      // 点击了不感兴趣
      // 将该文章的id传递会给父组件,让父组件去移出该文章
      this.$emit('uninterest', this.articleid)
      // 发起申请,对该文章不喜欢
      try {
        var res = await apiUninterest(this.articleid)
        console.log(res, '11111')
        this.show = false
        this.$toast.success('将减少推荐类似内容')
      } catch (error) {
        this.$toast.fail('设置不感兴趣失败')
      }
    }
  }
}
</script>

<style lang='less'>
.more {
  width: 80%;
  // height: 18%;
  padding: 15px;
  .moreicon {
    margin-right: 10px;
  }
}
</style>
