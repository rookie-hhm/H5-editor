<template>
  <div class="uploader-wrapper">
    <div class="upload-btn">
      <Upload
        action="http://localhost:3000/upload"
        @success="onSuccess"
        @error="onError"
      ></Upload>
    </div>
    <a-divider></a-divider>
    <div class="upload-list-wrapper"></div>
  </div>
</template>

<script lang='ts'>
import { defineComponent } from 'vue'
import Upload, { FileInfo } from './Upload.vue'
interface ResponseData {
  response?: any
  error?: any
  file: File,
  fileList: FileInfo[]
}
export default defineComponent({
  components: {
    Upload
  },
  emits: ['success'],
  setup (props, { emit }) {
    const onSuccess = (data: ResponseData) => {
      console.log(data, 'success')
      const { response, file } = data
      emit('success', { url: response.url, file })
    }
    const onError = (data: ResponseData) => {
      console.log(data, 'error')
    }
    return {
      onSuccess,
      onError
    }
  }
})
</script>

<style lang='scss' scoped>
.uploader-wrapper {
  margin-top: 10px;
  padding: 0 16px;
}
</style>
