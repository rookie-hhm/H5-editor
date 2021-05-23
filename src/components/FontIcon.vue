<template>
  <div class="icon-list">
    <div class="icon-item" v-for="item in icons" :key="item.icon" @click="toggleChange(item)">
      <svg-icon :iconClass="item.icon" class="icon"></svg-icon>
    </div>
  </div>
</template>

<script lang='ts'>
import { defineComponent, reactive } from 'vue'
const iconList = [
  { key: 'fontWeigh', icon: 'bold', isActive: false },
  { key: 'fontStyle', icon: 'italic', isActive: false },
  { key: 'textDecoration', icon: 'underline', isActive: false },
  { key: 'textDecoration', icon: 'line-through', isActive: false }
]
export default defineComponent({
  setup (props, { emit }) {
    const icons = reactive(iconList)
    const toggleChange = (item: any) => {
      console.log({ key: item.key, value: item.isActive ? item.icon : '' })
      emit('change', { key: item.key, value: item.isActive ? item.icon : '' })
      item.isActive = !item.isActive
    }
    return {
      toggleChange,
      icons
    }
  }
})
</script>

<style lang='scss' scoped>
.icon-list {
  @include center;
  .icon-item {
    margin: 0 3px;
    .icon {
      width: 22px;
      height: 26px;
      line-height: 26px;
    }
  }
}
</style>
