<template>
  <div class="image-cut-wrapper">
    <div class="image-preivew-bg">
      <div class="content-bg" :style="{ backgroundImage: backgroundImageUrl }"></div>
    </div>
    <div class="image-btn-wrapper">
      <div class="btn" @click="changePicture">
        <Upload action="http://localhost:3000/upload" @success="onSuccess" @error="onError">
          <svg-icon iconClass="change-picture" class="icon"></svg-icon>
          更换图片
          <template #loading>
            <svg-icon iconClass="change-picture" class="icon rotate"></svg-icon>
            更换图片
          </template>
          <template #loaded>
            <svg-icon iconClass="change-picture" class="icon"></svg-icon>
            更换图片
          </template>
        </Upload>
      </div>
      <div class="btn" @click="clipPicture">
        <svg-icon iconClass="clip"></svg-icon>
        剪裁图片
      </div>
    </div>
    <!-- 剪裁弹窗 -->
    <a-modal v-model:visible="visible" title="剪裁图片" @ok="handleOk">
      <div class="image-clip-wrapper">
        <img id="image" :src="originSrc" ref="imageRef" />
      </div>
    </a-modal>
  </div>
</template>

<script lang='ts'>
import { computed, defineComponent, nextTick, ref, watch } from 'vue'
import SvgIcon from './SvgIcon.vue'
import Cropper from 'cropperjs'
import Upload, { ResponseData } from './Upload.vue'
import { message } from 'ant-design-vue'
import axios from 'axios'
export default defineComponent({
  components: {
    SvgIcon,
    Upload
  },
  name: 'image-processer',
  props: {
    value: {
      type: String,
      default: ''
    },
    originSrc: {
      type: String,
      default: ''
    } // 原始的图片
  },
  emits: ['change'],
  setup (props, { emit }) {
    const visible = ref<boolean>(false)
    const imageRef = ref<null | HTMLImageElement>(null)
    const backgroundImageUrl = computed(() => `url(${props.originSrc || props.value})`)
    let cropperInstance: Cropper | null = null
    console.log(cropperInstance)
    const clipPicture = () => {
      visible.value = true
      console.log('clip')
    }
    watch(visible, async (newValue) => {
      if (newValue) {
        await nextTick()
        if (imageRef.value) {
          cropperInstance = new Cropper(imageRef.value, {
            crop (e) {
              console.log(e, 'e')
            }
          })
        }
      } else {
        cropperInstance && cropperInstance.destroy()
      }
    })
    const changePicture = () => {
      console.log('changePicture')
    }
    const handleOk = () => {
      if (cropperInstance) {
        cropperInstance.getCroppedCanvas().toBlob(blob => {
          const formData = new FormData()
          formData.append('file', blob as Blob)
          axios.post('http://localhost:3000/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }).then(res => {
            emit('change', res.data.url)
          }).catch(() => message.error('剪切上传图片失败'))
        })
      }
      console.log('ok')
    }
    const onSuccess = (data: ResponseData) => {
      console.log(data, 'data')
      emit('change', data.response.url)
      emit('change', data.response.url)
    }
    const onError = () => {
      message.error('更换图片失败')
    }
    return {
      backgroundImageUrl,
      clipPicture,
      changePicture,
      handleOk,
      visible,
      imageRef,
      onSuccess,
      onError
    }
  }
})
</script>

<style lang='scss' scoped>
.image-cut-wrapper {
  display: flex;
  justify-content: space-around;
  height: 80px;
  .image-preivew-bg {
    width: 112px;
    box-shadow: 1px 1px 1px 1px #222;
    // border: 1px solid #e6ebed;
    .content-bg {
      height: 100%;
      background: no-repeat center center/contain;
    }
  }
  .image-btn-wrapper {
    @include column-space-between;
    .btn {
      width: 104px;
      height: 36px;
      line-height: 36px;
      text-align: center;
      border-radius: 3px;
      color: #333;
      border: 1px solid #ccd5db;
      cursor: pointer;
      .icon {
        width: 16px;
        height: 16px;
      }
      .rotate {
        animation: loading 3s linear infinite;
      }
      &:hover {
        color: #fff;
        background-color: #1593ff;
        border-color: #1593ff;
      }
    }
  }
  @keyframes loading {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
}
</style>

<style lang="scss">
.image-clip-wrapper {
  #image {
    display: block;
    max-width: 100%;
  }
}
</style>
