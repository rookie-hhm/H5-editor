<template>
  <div class="component-wrapper" ref="elem" @click="setSelected" :class="{ active }">
    <slot></slot>
  </div>
</template>

<script lang='ts'>
import { defineComponent, onMounted, ref } from 'vue'
export default defineComponent({
  props: {
    id: {
      type: String,
      default: ''
    },
    active: Boolean
  },
  emits: ['selected'], // 选中事件
  setup (props, { emit }) {
    const elem = ref<HTMLElement | null>(null)
    const setSelected = () => {
      emit('selected', { id: props.id, elem: elem.value })
    }
    onMounted(() => {
      console.log(elem.value, 'mounted')
    })
    return {
      setSelected,
      elem
    }
  }
})
</script>

<style lang='scss' scoped>
.component-wrapper {
  &.active {
    border: 1px dotted blueviolet;
  }
}
</style>
