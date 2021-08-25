<template>
  <div class="context-menu-wrapper" ref="menuWrapper">
    <ul class="context-menu-list">
      <li class="menu-item" v-for="item in menuList" :key="item.id" @click="item.action(componentId)">
        <span>{{ item.name }}</span>
      </li>
    </ul>
  </div>
</template>

<script lang='ts'>
import { defineComponent, onMounted, onUnmounted, PropType, ref } from 'vue'
import { getTargetElement } from '@/utils/dom'
interface Menu {
  name: string
  action: () => void
}
export default defineComponent({
  name: 'ContextMenu',
  props: {
    menuList: {
      type: Array as PropType<Menu[]>
    },
    triggerClass: {
      type: String,
      default: 'edit-component-wrapper'
    }
  },
  setup (props) {
    const menuWrapper = ref<null | HTMLElement>(null)
    const componentId = ref('')
    const triggerContextMenu = (e: MouseEvent) => {
      debugger
      e.preventDefault()
      // 获取到当前菜单的节点
      const menuDom = menuWrapper.value as HTMLElement
      const triggerElement = getTargetElement(e.target as HTMLElement, props.triggerClass)
      if (triggerElement) {
        menuDom.style.display = 'block'
        menuDom.style.left = e.pageX + 'px'
        menuDom.style.top = e.pageY + 'px'
        const id = triggerElement.dataset.componentId
        if (id) {
          componentId.value = id
        }
      }
    }
    const handleClick = () => {
      const menuDom = menuWrapper.value as HTMLElement
      menuDom.style.display = 'none'
    }
    onMounted(() => {
      document.addEventListener('contextmenu', triggerContextMenu)
      document.addEventListener('click', handleClick)
    })
    onUnmounted(() => {
      document.addEventListener('contextmenu', triggerContextMenu)
      document.addEventListener('click', handleClick)
    })
    return {
      menuWrapper,
      componentId
    }
  }
})
</script>

<style lang='scss' scoped>
.context-menu-wrapper {
  position: absolute;
  display: none;
  z-index: 3000;
  box-shadow: 0 0 2px rgba(0, 0, 0, .5);
  .context-menu-list {
    .menu-item {
      @include space-between;
      width: 200px;
      height: 20px;
      line-height: 20px;
      text-align: center;
      padding: 2px;
      color: #000;
      &:hover {
        background-color: rgba(61, 139, 224, 1);
      }
    }
  }
}
</style>
