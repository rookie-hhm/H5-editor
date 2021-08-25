import { createVNode, render } from 'vue'
import ContextMenu from '@/views/Editor/components/ContextMenu.vue'

export interface Menu {
  name: string,
  action: (componentId: string) => void
}
const createContextMenu = (menuList: Menu[], triggerClass = 'edit-component-wrapper') => {
  const container = document.createElement('div')
  const options = {
    menuList,
    triggerClass
  }
  console.log(options, 'options')
  // 生成vnode
  const vnode = createVNode(ContextMenu, options)
  // 根据vnode挂载到Dom上
  render(vnode, container)
  document.body.appendChild(container)
  return () => {
    render(null, container)
    document.body.removeChild(container)
  }
}

export default createContextMenu
