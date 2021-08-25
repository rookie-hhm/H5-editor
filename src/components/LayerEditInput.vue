<template>
  <div class="edit-input-wrapper" @dblclick.stop="handleDbClick" ref="editWrapper">
    <input
      ref="inputRef"
      class="edit-input"
      v-if="isEditing"
      v-model="textValue"
      :placeholder="placeholder"/>
    <slot v-else :text="textValue">{{ textValue }}</slot>
  </div>
</template>

<script lang='ts'>
import { computed, defineComponent, nextTick, ref, watch } from 'vue'
import useClickOutside from '@/hooks/useClickOutside'
import useKeyBorad from '@/hooks/useKeyBorad'
export default defineComponent({
  props: {
    value: {
      type: String,
      required: true
    },
    placeholder: {
      type: String,
      default: '文本不能为空'
    }
  },
  emits: ['change'],
  setup (props, { emit }) {
    const textValue = ref(props.value)
    const isEditing = ref(false)
    const illegal = computed(() => {
      return !textValue.value.trim()
    })
    const editWrapper = ref<null | HTMLElement>(null)
    const inputRef = ref<null | HTMLInputElement>(null)
    watch(() => props.value, () => {
      textValue.value = props.value
    })
    const onChange = (value: string) => {
      emit('change', value)
    }
    const handleDbClick = () => {
      isEditing.value = true
    }
    watch(isEditing, async (newVale) => {
      if (newVale) {
        await nextTick()
        if (inputRef.value) {
          inputRef.value.focus()
        }
      }
    })
    const isClickOutside = useClickOutside(editWrapper)
    // 监听是否点击到元素外面
    watch(isClickOutside, (newValue) => {
      console.log()
      if (illegal.value) {
        return
      }
      // 如果有新的值并且处于编辑状态中
      if (newValue && isEditing.value) {
        isEditing.value = false
        emit('change', textValue.value)
      }
    })
    useKeyBorad('Enter', () => {
      if (illegal.value) return
      if (isEditing.value) {
        isEditing.value = false
        emit('change', textValue.value)
      }
    })
    useKeyBorad('Escape', () => {
      if (illegal.value) return
      if (isEditing.value) {
        isEditing.value = false
        textValue.value = props.value
      }
    })
    return {
      inputRef,
      editWrapper,
      isEditing,
      textValue,
      illegal,
      onChange,
      handleDbClick
    }
  }
})
</script>

<style lang='scss' scoped>
.edit-input-wrapper {
  .edit-input {
    width: 130px;
    outline: none;
    text-align: center;
    line-height: 24px;
    border-radius: 20px;
    border: 1px solid #d9d9d9;
    &:focus {
      border-color: #71afd3;
    }
  }
}
</style>
