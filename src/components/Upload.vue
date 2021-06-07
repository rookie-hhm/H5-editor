<template>
  <div class="upload-wrapper">
    <div v-on="events">
      <slot name="loading" v-if="isUploading">
        <a-button type="primary" disabled>正在上传</a-button>
      </slot>
      <slot name="loaded" v-else-if="fileList.length && isUploaded">
        <a-button type="primary">点击上传</a-button>
      </slot>
      <slot name="default" v-else>
        <a-button type="primary">点击上传</a-button>
      </slot>
    </div>
    <!-- 点击上传 -->
    <input ref="inputRef" type="file" name="file" :style="{ display: 'none' }" @change="onFileChange">
  </div>
</template>

<script lang='ts'>
import { message } from 'ant-design-vue'
import { computed, defineComponent, PropType, reactive, ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import axios from 'axios'
// import { findIndex } from 'lodash-es'
type UplodStatus = 'ready' | 'loading' | 'success' | 'error'
type checkUpload = (file: File) => boolean | Promise<File>
export interface FileInfo {
  uid: string
  size: number
  fileName: string
  status: UplodStatus
  raw: File,
  response?: any
  url?: string
}
export interface ResponseData {
  response?: any
  error?: any
  file: File,
  fileList: FileInfo[]
}
export default defineComponent({
  props: {
    action: {
      type: String,
      default: 'http://localhost:3000/upload'
    },
    drag: Boolean,
    beforeUpload: {
      type: Function as PropType<checkUpload>
    },
    autoUpload: {
      type: Boolean,
      default: true
    }
  },
  emits: ['success', 'error'],
  setup (props, { emit }) {
    const inputRef = ref<HTMLInputElement | null>(null)
    const fileStatus = ref<UplodStatus>('ready')
    const fileList = ref<FileInfo[]>([])
    const isDragOver = ref<boolean>(false)
    const onClick = () => {
      if (inputRef.value) {
        inputRef.value.value = ''
        inputRef.value.click()
      }
    }
    const postFile = (file: FileInfo) => {
      if (file) {
        const formData = new FormData()
        formData.append('file', file.raw)
        file.status = 'loading'
        axios.post(props.action, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then(res => {
          file.status = 'success'
          console.log('res', res)
          emit('success', { response: res.data, file: file.raw, fileList: fileList.value })
        }).catch(error => {
          file.status = 'error'
          // const deleteIndex = findIndex(fileList.value, fileInfo => fileInfo.uid === file.uid)
          // if (deleteIndex > -1) {
          //   fileList.value.splice(deleteIndex, 1)
          // }
          emit('error', { error, file: file.raw, fileList: fileList.value })
        })
      }
    }
    const onFileChange = (e: Event) => {
      const target = e.target as HTMLInputElement
      const files = target.files as FileList
      beforeUploadFile(files)
    }
    const addToFileList = (file: File) => {
      const fileInfo: FileInfo = reactive({
        uid: uuidv4(),
        size: file.size,
        fileName: file.name,
        raw: file,
        status: 'ready'
      })
      fileList.value.push(fileInfo)
      props.autoUpload && postFile(fileInfo)
    }
    const beforeUploadFile = (files: FileList | null) => {
      if (files) {
        const file = files[0] as File
        if (props.beforeUpload) {
          const result = props.beforeUpload(file)
          if (result && result instanceof Promise) {
            result.then(processedFile => {
              if (processedFile instanceof File) {
                addToFileList(processedFile)
              } else {
                message.error('promise表达式返回值必须为File对象')
              }
            })
          } else if (result) {
            addToFileList(file)
          }
        } else {
          addToFileList(file)
        }
      }
    }
    const isUploading = computed(() => fileList.value.some(file => file.status === 'loading'))
    const isUploaded = computed(() => fileList.value.every(file => ['success', 'error'].includes(file.status)))
    let events: { [key: string]: any } = {
      click: onClick
    }
    const handleDragOver = (e: DragEvent, isOver: boolean) => {
      e.preventDefault()
      isDragOver.value = isOver
    }
    const handleDrop = (e: DragEvent) => {
      e.preventDefault()
      if (e.dataTransfer) {
        beforeUploadFile(e.dataTransfer.files)
      }
    }
    if (props.drag) {
      events = {
        ...events,
        dragover: (e: DragEvent) => handleDragOver(e, true),
        dragleave: (e: DragEvent) => handleDragOver(e, false),
        drop: handleDrop
      }
    }
    const submit = () => {
      if (inputRef.value && inputRef.value.value) {
        // postFile(inputRef.value.)
      }
    }
    return {
      inputRef,
      onClick,
      onFileChange,
      fileStatus,
      fileList,
      isUploading,
      events,
      isUploaded,
      submit
    }
  }
})
</script>

<style lang='scss' scoped>

</style>
