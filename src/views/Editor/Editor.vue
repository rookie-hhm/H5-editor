<template>
  <a-latyout class="editor-wrapper">
   <a-layout-header class="editor-header">
      <component-control-panel @addComponent="onAddComponent"></component-control-panel>
   </a-layout-header>
   <a-layout class="editor-content">
      <!-- 组件列表 -->
      <a-layout-sider class="panel">
         模板列表
      </a-layout-sider>
      <!-- 画布区域 -->
      <a-layout-content class="canvas-wrapper">
         <div class="canvas-center">
            <component-wrapper
               v-for="component in componentList"
               :key="component.id"
               :id="component.id"
               :active="(selectedComponent && selectedComponent.id) === component.id"
               @selected="onSelected"
            >
               <component
                  :is="component.name"
                  v-bind="component.props"
               ></component>
            </component-wrapper>
         </div>
      </a-layout-content>
      <!-- 组件属性表单 -->
      <a-layout-sider class="panel">
         <component-props-panel
            v-if="selectedComponent && selectedComponent.props"
            :selectedProps="selectedComponent.props">
         </component-props-panel>
      </a-layout-sider>
   </a-layout>
  </a-latyout>
</template>

<script lang='ts'>
import { defineComponent, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { ComponentProps, selectedComponent } from '@/store/modules/editor'
import ComponentControlPanel from './components/ComponentControlPanel.vue'
import ComponentPropsPanel from './components/ComponentPropsPanel.vue'
import ComponentWrapper from '@/components/ComponentWrapper.vue'
import RText from '@/components/RText.vue'
import { GlobalProps } from '@/store/types'
export default defineComponent({
   name: 'Editor',
   components: {
      ComponentControlPanel,
      ComponentPropsPanel,
      ComponentWrapper,
      RText
   },
   setup () {
      const store = useStore<GlobalProps>()
      const componentList = computed<ComponentProps[]>(() => store.state.editor.components)
      const selectedComponent = computed<ComponentProps[]>(() => store.getters['editor/selectedComponent'])
      console.log(selectedComponent, 'selec')
      watch(selectedComponent, () => {
         console.log(selectedComponent.value, 'watch')
      })
      const onAddComponent = (data: any) => {
         console.log(data, 'data')
         store.commit('editor/addComponent', data)
         // 添加组件进去
      }
      const onSelected = (componentInfo: selectedComponent) => { // 选中组件
         console.log(componentInfo, 'id')
         store.commit('editor/setSelectedComponent', componentInfo)
      }
      return {
         componentList,
         onAddComponent,
         onSelected,
         selectedComponent
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
      background-color: #fff;
      line-height: auto;
   }
   .editor-content {
      flex: 1;
      .canvas-wrapper {
         @include center;
         .canvas-center {
            position: relative;
            min-width: 375px;
            min-height: 20vh;
            max-height: 80vh;
            background-color: gold;
         }
      }
   }
}
</style>
