// import { v4 as uuidv4 } from 'uuid'
import { Module } from 'vuex'
import { GlobalProps } from '../types'
import { find } from 'lodash-es'
export interface ComponentProps { // 所有的组件数据
  id: string
  name: string
  props: { [key: string]: any }
}

export interface EditorProps {
  selectedElem: HTMLElement | null// 当前选中元素
  selectedId: string // 当前选中的ID
  components: ComponentProps[]
}

export interface selectedComponent {
  id: string,
  elem: HTMLElement
}
// const textData = [
//   { id: uuidv4(), name: 'div', attrs: { fontSize: '12px' } },
//   { id: uuidv4(), name: 'div', attrs: {} },
//   { id: uuidv4(), name: 'div', attrs: {} },
//   { id: uuidv4(), name: 'div', attrs: {} }
// ]

const editor: Module<EditorProps, GlobalProps> = {
  namespaced: true,
  state: {
    selectedElem: null,
    selectedId: '',
    components: []
  },
  getters: {
    selectedComponent: (state) => find(state.components, item => item.id === state.selectedId) // 当前选中的组件
  },
  mutations: {
    addComponent (state: EditorProps, data: ComponentProps) { // 添加组件
      console.log('addComponent')
      state.components.push(data)
    },
    setSelectedComponent (state, selectedComponent: selectedComponent) { // 设置当前选中的元素
      const { id, elem } = selectedComponent
      console.log(id, elem)
      state.selectedId = id
      state.selectedElem = elem
      console.log(find(state.components, item => item.id === state.selectedId), 'selected')
    },
    updateComponent (state, data) {
      const selectedComponent = find(state.components, item => item.id === state.selectedId)
      const { key, value } = data
      if (selectedComponent) {
        if (key === 'font') {
          const{ key, value: fontValue } = value
          selectedComponent.props[key] = fontValue
        } else {
          selectedComponent.props[key] = value
        }
      }
      console.log(key, value, 'changed')
    },
    deleteComponent (state: EditorProps, id: string) { // 删除组件
      const index = state.components.findIndex(item => item.id === id)
      if (index > -1) {
        state.components.splice(index, 1)
      }
    }
  }
}

export default editor
