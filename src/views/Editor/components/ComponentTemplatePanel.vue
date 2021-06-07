<template>
  <div class="component-template-wrapper">
    <a-tabs v-model:activeKey="activeKey" tab-position="left">
      <a-tab-pane key="upload" tab="上传">
        <template #tab>
          <span>
            <UploadOutlined />/>
            上传
          </span>
        </template>
        <Uploader @success="onImageUpload"></Uploader>
      </a-tab-pane>
      <a-tab-pane key="shape" tab="形状">Content of Tab 2</a-tab-pane>
    </a-tabs>
  </div>
</template>

<script lang='ts'>
import Uploader from '@/components/Uploader.vue'
import { UploadOutlined } from '@ant-design/icons-vue'
import { defineComponent, ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { getImageSize } from '@/utils/helper'
import { message } from 'ant-design-vue'
interface ImageData {
  url: string,
  file: File
}
export default defineComponent({
  name: 'ComponentTemplatePanel',
  components: {
    UploadOutlined,
    Uploader
  },
  emits: ['addComponent'],
  setup (props, { emit }) {
    const activeKey = ref('upload')
    const onImageUpload = async (data: ImageData) => {
      console.log(data.url, data.file)
      try {
        const { width, height } = await getImageSize(data.url || data.file)
        const componentData = {
          id: uuidv4(),
          name: 'r-image',
          props: {
            originSrc: data.url,
            src: data.url,
            width,
            height,
            preview: false
          }
        }
        emit('addComponent', componentData)
      } catch (err) {
        message.error(err.message)
      }
    }
    return {
      activeKey,
      onImageUpload
    }
  }
})
</script>

<style lang='scss' scoped>

</style>
