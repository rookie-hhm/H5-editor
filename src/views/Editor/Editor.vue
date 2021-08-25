<template>
  <a-layout class="editor-wrapper">
   <a-layout-header class="editor-header">
      <component-control-panel @addComponent="onAddComponent"></component-control-panel>
   </a-layout-header>
   <a-layout class="editor-content">
      <!-- 组件列表 -->
      <div class="template panel">
        <component-template-panel @addComponent="onAddComponent"></component-template-panel>
         <!-- <component-control-panel></component-control-panel> -->
         <!-- <FontIcon></FontIcon> -->
         <a-button @click="undo">撤销</a-button>
        <a-button @click="redo">重做</a-button>
      </div>
      <!-- 画布区域 -->
      <a-layout-content class="canvas-wrapper">
        <!-- <div style="display: flex; flex-direction: column;">
          <div  v-for="(historyItem, index) in history.historyList" :key="historyItem.id" :style="{ fontWeigh: index === history.historyIndex ? 'bold' : 'normal' }">
          <p>{{ historyItem.id }}</p>
          <p>{{ historyItem.type }}</p>
          <p>{{ history.historyIndex }}</p>
        </div>
        </div> -->
         <div id="canvas-center">
            <component-wrapper
              class="component-wrapper"
              v-for="component in componentList"
              v-show="!component.isHidden"
              :key="component.id"
              :id="component.id"
              :isLocked="component.isLocked"
              :props="component.props"
              :active="(selectedComponent && selectedComponent.id) === component.id"
              @selected="onSelected"
              @update-position="updatePosition"
            >
              <component
                :is="component.name"
                v-bind="component.props"
              ></component>
            </component-wrapper>
         </div>
      </a-layout-content>
      <!-- 组件属性表单 -->
      <div class="panel form-props">
         <a-tabs type="card" v-model:activeKey="activeKey">
            <a-tab-pane key="component" tab="组件属性">
              <component-groups
                v-if="selectedComponent && selectedComponent.props && !selectedComponent.isLocked"
                :props="selectedComponent.props"
                @change="onPropsChange"
              ></component-groups>
              <a-empty v-else-if="selectedComponent && selectedComponent.isLocked"
                image="https://gw.alipayobjects.com/mdn/miniapp_social/afts/img/A*pevERLJC9v0AAAAAAAAAAABjAQAAAQ/original"
                :image-style="{
                  height: '60px',
                }"
              >
                <template #description>
                  <span>
                    元素已被锁定，无法进行编辑
                  </span>
                </template>
              </a-empty>
            </a-tab-pane>
            <a-tab-pane key="layer" tab="图层管理">
               <layer-panel
                  v-if="selectedComponent"
                  :selectedId="selectedComponent.id"
                  :layerList="componentList"
                  @change="onPropsChange"
                  @selected="onSelected">
               </layer-panel>
            </a-tab-pane>
            <a-tab-pane key="page" tab="页面管理">页面管理</a-tab-pane>
         </a-tabs>
      </div>
      <!-- 参考线 -->
      <reference-line></reference-line>
   </a-layout>
   <!-- <context-menu :menuList="textMenu" :triggerClass="asd"></context-menu> -->
  </a-layout>
</template>

<script lang='ts'>
import { defineComponent, computed, watch, ref } from 'vue'
import { useStore } from 'vuex'
import { ComponentProps, SelectedProps, History } from '@/store/modules/editor'
import ComponentControlPanel from './components/ComponentControlPanel.vue'
import ComponentPropsPanel from './components/ComponentPropsPanel.vue'
import LayerPanel from './components/LayerPanel.vue'
import ComponentTemplatePanel from './components/ComponentTemplatePanel.vue'
// import FontIcon from '@/components/FontIcon.vue'
import ComponentWrapper from '@/components/ComponentWrapper.vue'
import ReferenceLine from './components/ReferenceLine.vue'
import Upload from '@/components/Upload.vue'
import RText from '@/components/RText.vue'
import RImage from '@/components/RImage.vue'
import ContextMenu from './components/ContextMenu.vue'
import { GlobalProps } from '@/store/types'
import initHotKeyPlugin from '@/plugins/hotkeys'
import initContextMenu from '@/plugins/contextmenu'
import { omit } from 'lodash-es'
import ComponentGroups from './components/ComponentGroups.vue'
export default defineComponent({
  name: 'Editor',
  components: {
    ComponentControlPanel,
    ComponentPropsPanel,
    ComponentTemplatePanel,
    LayerPanel,
    ReferenceLine,
    ComponentWrapper,
    RText,
    RImage,
    // FontIcon,
    Upload,
    ComponentGroups
    // ContextMenu
  },
  setup () {
    initHotKeyPlugin()
    const activeKey = ref('component')
    const store = useStore<GlobalProps>()
    const history = computed<History>(() => store.state.editor.history)
    console.log(history.value, 'das')
    initContextMenu([
      { name: '拷贝', action: (componentId) => store.commit('editor/copyComponent', componentId) },
      { name: '粘贴', action: () => store.commit('editor/pasteComponent') },
      {
        name: '删除',
        action: (componentId) => {
          console.log(componentId, 'componentid')
          store.commit('editor/deleteComponent', componentId)
        }
      },
      { name: '取消选中', action: () => { store.commit('editor/setSelectedComponent', { id: '', elem: '' }) } }
    ])
    const componentList = computed<ComponentProps[]>(() => store.state.editor.components)
    const selectedComponent = computed(() => store.getters['editor/selectedComponent'])
    console.log(selectedComponent, 'selec')
    watch(selectedComponent, () => {
        console.log(selectedComponent.value, 'watch')
    })
    const onAddComponent = (data: any) => {
        console.log(data, 'data')
        store.commit('editor/addComponent', data)
        // 添加组件进去
    }
    const onSelected = (componentInfo: SelectedProps) => { // 选中组件
        console.log('id')
        store.commit('editor/setSelectedComponent', componentInfo)
    }
    const onPropsChange = (data: any) => {
        store.commit('editor/updateComponent', { ...data, id: selectedComponent.value.id })
    }
    const updatePosition = (data: any) => {
      const { id } = data
      const payload = omit(data, ['id'])
      const keys = Object.keys(payload)
      const values = Object.values(payload).map(value => value + 'px')
      console.log(keys, values, payload, 'payload')
      store.commit('editor/updateComponent', { key: keys, value: values, id })
    }
    const undo = () => store.commit('editor/undo')
    const redo = () => store.commit('editor/redo')
    return {
        activeKey,
        componentList,
        onAddComponent,
        onSelected,
        selectedComponent,
        onPropsChange,
        updatePosition,
        history,
        undo,
        redo
    }
  }
})
</script>

<style lang='scss' scoped>
.editor-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  .panel {
    min-width: 250px !important;
    max-width: 400px !important;
    height: 100%;
    background-color: #fff;
    // &.template {
    //    box-shadow: 1px 0 5px #222;
    // }
    &.form-props {
        // padding: 0 10px;
    }
  }
  .editor-header {
    background-color: #fff;
    line-height: auto;
  }
  .editor-content {
    display: flex;
    flex-direction: row;
    flex: 1;
    .canvas-wrapper {
        @include center;
        background-color: #f0f2f5;
        #canvas-center {
          position: relative;
          min-width: 375px;
          min-height: 667px;
          max-height: 80vh;
          background-color: #fff;
          .component-wrapper > * {
            position: static !important;
            width: 100% !important;
            height: 100% !important;
          }
        }
    }
  }
}
</style>
