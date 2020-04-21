<template>
  <div class="changeimage">
    <van-popup round :value="show" @input="setshow">
      <van-cell value="从相册选择" @click="setphoto"></van-cell>
      <input type="file" ref="upimage" style="display:none" @change="change" />
      <van-cell value="拍照" @click="takephoto" />
      <van-cell value="取消" @click="setshow" />
    </van-popup>
    <van-dialog
      @confirm="confirmimage"
      @cancel="cancel"
      class="imgdialog"
      v-model="isshow"
      title="确认使用此图片作为头像吗?"
      show-cancel-button
    >
      <img class="newuserimg" :src="newuserimg" />
    </van-dialog>
  </div>
</template>

<script>
// import Vue from 'vue'
// import { ImagePreview } from 'vant'
// Vue.use(ImagePreview)
import { apiChangeUserimg } from '../../../api/user'
export default {
  props: ['show'],
  data () {
    return {
      isshow: false,
      newuserimg: ''
    }
  },
  methods: {
    // 本地提交照片后
    change () {
      // console.log(this.$refs.upimage.files[0])
      var file = this.$refs.upimage.files[0]
      // 创建一个 fileReader 对象
      var reader = new FileReader()
      reader.readAsDataURL(file)
      // 当图片上传成功之后
      reader.addEventListener('load', () => {
        // console.log('图片的url', reader.result)
        var imgbase = reader.result
        this.newuserimg = imgbase
        this.isshow = true
        // this.isconfirm()
        // ImagePreview({
        //   images: [imgbase],
        //   onClose () {
        //     // 关闭了预览窗口,询问是否使用此图片
        //     this.isconfirm()
        //   }
        // })
      })
    },
    // // 上传完头像之后
    // isconfirm () {
    //   this.isshow = true
    // },
    // 确认使用头像图片
    async confirmimage () {
      var imgfile = this.$refs.upimage.files[0]
      try {
        var res = await apiChangeUserimg(imgfile)
        console.log('更换用户头像结果', res)
        // 获得服务器返回的图像url
        var newimgurl = res.data.data.photo
        // 把最新的头像地址传给父组件
        this.$emit('newuserimage', newimgurl)
        this.$toast.loading({
          message: '头像上传中...',
          forbidClick: true,
          loadingType: 'spinner'
        })
        this.$toast.clear(true)
      } catch (error) {
        console.log('更换用户头像失败')
      }
      this.$toast.success('头像修改成功')
    },
    cancel () {
      this.newuserimg = ''
      this.isshow = false
    },
    // 选择照片
    setphoto () {
      this.$refs.upimage.click()
    },
    // 使用手机拍照
    takephoto () {
      this.$toast({
        message: '需调用手机相机'
      })
    },
    // 将show传递给父组件
    setshow () {
      this.$emit('changeshow', false)
    }
  }
}
</script>

<style lang='less'>
.changeimage {
  .van-popup.van-popup--center {
    width: 70%;
    .van-cell {
      .van-cell__value.van-cell__value--alone {
        text-align: center;
      }
    }
  }
  .imgdialog {
    .van-dialog__content {
      padding: 10px 20px 0 20px;
      .newuserimg {
        width: 100%;
        // height: 300px;
      }
    }
  }
}
</style>
