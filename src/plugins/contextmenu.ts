import createContextMenu, { Menu } from '@/components/ContextMenu'
import { onMounted, onUnmounted } from 'vue'
const initContextMenu = (menuList: Menu[], triggerClass?: string | undefined) => {
  let destroyFn: any
  onMounted(() => {
    destroyFn = createContextMenu(menuList, triggerClass)
  })
  onUnmounted(() => {
    destroyFn && destroyFn()
  })
}

export default initContextMenu
