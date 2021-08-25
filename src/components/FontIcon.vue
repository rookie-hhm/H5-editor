<template>
  <div class="font-icon-wrapper">
    <a-tooltip placement="top" :title="tooltip">
      <!-- <template v-slot:title>
        <span>{{ tooltip }} </span>
      </template> -->
      {{ checked }}
      <a-button :type="checked ? 'primary' : 'dashed'" shape="circle" @click="toggleChange">
        <svg-icon :iconClass="iconName" class="icon"></svg-icon>
      </a-button>
    </a-tooltip>
  </div>
</template>

<script lang='ts'>
import { defineComponent, watch } from 'vue'
export default defineComponent({
  name: 'FontIcon',
  props: {
    iconName: {
      type: String
    },
    tooltip: {
      type: String
    },
    checked: {
      type: Boolean,
      default: false
    } // 是否选中
  },
  emits: ['change'],
  setup (props, { emit }) {
    const toggleChange = () => {
      emit('change', !props.checked)
    }
    return {
      toggleChange
    }
  }
})
</script>

<style lang='scss' scoped>
.font-icon-wrapper {
}
</style>
