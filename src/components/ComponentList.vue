<template>
  <div class="component-list-wrapper">
    <a-tabs v-model:activeKey="activeKey" :tab-position="tabPosition">
      <a-tab-pane key="1" tab="Tab 1">Content of Tab 1</a-tab-pane>
      <a-tab-pane key="2" tab="Tab 2">Content of Tab 2</a-tab-pane>
      <a-tab-pane key="3" tab="Tab 3">Content of Tab 3</a-tab-pane>
    </a-tabs>
  </div>
</template>

<script lang='ts'>
import { defineComponent } from 'vue'
export default defineComponent({
  setup () {
    return {

    }
  }
})
</script>

<style lang='scss' scoped>

</style>
