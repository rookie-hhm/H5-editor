<template>
  <a-latyout class="editor-wrapper">
   <a-layout-header class="editor-header"> header </a-layout-header>
   <a-layout class="editor-content">
      <!-- 组件列表 -->
      <a-layout-sider class="panel"> componentList </a-layout-sider>
      <!-- 画布区域 -->
      <a-layout-content class="canvas-wrapper">
         画布中心区域
         <div class="canvas-area"></div>
      </a-layout-content>
      <!-- 组件属性表单 -->
      <a-layout-sider class="panel"> tableProps </a-layout-sider>
   </a-layout>
  </a-latyout>
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
.editor-wrapper {
   display: flex;
   flex-direction: column;
   height: 100%;
   .panel {
      background-color: #fff;
   }
   .editor-header {

   }
   .editor-content {
      flex: 1;
      .canvas-wrapper {
         @include center;
         .canvas-area {
            min-width: 375px;
            min-height: 20vh;
            max-height: 80vh;
            background-color: gold;
         }
      }
   }
}
</style>
