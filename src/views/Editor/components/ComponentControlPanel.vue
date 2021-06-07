<template>
  <div class="control-panel-wrapper">
    <ul class="panel-list">
      <li class="panel-item" v-for="item in panelList" :key="item.name" @click="addComponent(item)">
        <svg-icon :iconClass="item.iconClass"></svg-icon>
        <span>{{ item.name }}</span>
      </li>
    </ul>
  </div>
</template>

<script lang='ts'>
import { defineComponent, reactive } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { templateList } from '@/template/h5'
export default defineComponent({
  name: 'ComponentControlPanel',
  setup (props, { emit }) {
    const panelList = reactive(templateList)
    const addComponent = (item: any) => {
      console.log(item, 'item')
      const { iconClass } = item
      let data = {}
      if (iconClass === 'text') {
        data = {
          id: uuidv4(),
          name: 'r-text',
          props: {
            textContent: '123123213',
            fontSize: '14px',
            lineHeight: '1.2',
            color: 'blue'
          }
        }
      }
      emit('addComponent', data)
    }
    return {
      panelList,
      addComponent
    }
  }
})
</script>

<style lang='scss' scoped>
.control-panel-wrapper {
  @include center;
  height: 100%;
  .panel-list {
    @include center;
    padding: 0 20px;
    font-size: 24px;
    .panel-item {
      @include column-center;
      padding: 0 10px;
      cursor: pointer;
      span {
        height: 24px;
        margin-top: 5px;
        font-size: 12px;
        line-height: 24px;
      }
    }
  }
}
</style>
