<template>
  <a-layout class="container">
    <al-layout-header class="header-wrapper">
      <layout-header></layout-header>
    </al-layout-header>
    <a-layout class="content-wrapper">
      <a-layout-content>
      <router-view></router-view>
    </a-layout-content>
    <a-layout-footer>
      <layout-footer></layout-footer>
    </a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<script lang='ts'>
import { defineComponent } from 'vue'
import LayoutHeader from './components/Header.vue'
import LayoutFooter from './components/Footer.vue'
export default defineComponent({
  components: {
    LayoutHeader,
    LayoutFooter
  },
  setup () {
    return {

    }
  }
})
</script>

<style lang='scss' scoped>
.container {
  min-width: 1200px;
  height: 100%;
  padding-top: 44px;
  .header-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 44px;
    border-bottom: 1px solid #e6ebed;
    background-color: #fff;
    z-index: 10;
  }
  .content-wrapper {
    min-height: calc(100% - 44px);
  }
}
</style>
