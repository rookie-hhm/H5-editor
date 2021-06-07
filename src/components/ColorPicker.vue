<template>
  <div class="color-picker-wrapper">
    <div class="color-selector">
      <input type="color" :value="value" @input="onInput">
    </div>
    <ul class="color-list" v-if="isShowColorList && colorList.length">
      <li class="color-item" v-for="color in colorList" :key="color" @click.prevent="onChange(color)">
        <div class="color-bg" :style="{ backgroundColor: color }"></div>
      </li>
    </ul>
  </div>
</template>

<script lang='ts'>
import { defineComponent, PropType } from 'vue'
const defaulList = ['#fff', '#ed6051', '#e8a862', '#f7ca4f', '#5fcba3', '#75c6f4', '#5b90ec', '#6f75e7', '#505973', '#000000']
export default defineComponent({
  props: {
    value: {
      type: String,
      required: true
    },
    colorList: {
      type: Array as PropType<string[]>,
      default: defaulList
    },
    isShowColorList: {
      type: Boolean,
      default: true
    }
  },
  setup (props, { emit }) {
    const onChange = (color: string) => emit('change', color)
    const onInput = (e: any) => onChange(e.target.value)
    return {
      onInput,
      onChange
    }
  }
})
</script>

<style lang='scss' scoped>
.color-picker-wrapper {
  @include left;
  .color-selector {
    input[type="color"] {
      width: 70px;
      height: 36px;
    }
  }
  .color-list {
    width: 140px;
    @include left;
    flex-wrap: wrap;
    .color-item {
      margin: 5px;
      cursor: pointer;
      .color-bg {
        width: 14px;
        height: 14px;
        border-radius: 3px;
        border: 1px solid #ccd5db;
      }
    }
  }
}
</style>
