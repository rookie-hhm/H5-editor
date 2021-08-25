import { v4 as uuidv4 } from 'uuid'
import { Module } from 'vuex'
import { GlobalProps } from '../types'
import { find, cloneDeep, findIndex, debounce } from 'lodash-es'
import { ComponentType2Name } from '@/types/componentProps'
import { message } from 'ant-design-vue'
import { ComponentPropsType } from '@/types/componentPropsType'
import store from '../index'
const debounceKeys = ['textContent']
type Direction = 'up' | 'down' | 'left' | 'right'
export interface ComponentProps { // 所有的组件数据
  id: string
  name: string
  elem?: null | HTMLElement
  layerName?: string
  isLocked?: boolean
  isHidden?: boolean
  type: string // 组件类型
  props: { [key: string]: any }
}

export interface ReferenceLineProps {
  rowLine: number[] // 横轴
  colLine: number[] // 纵轴
}
export interface SelectedProps {
  id: string,
  elem: null | HTMLElement
}
export interface UpdateProps {
  id: string
  // key: keyof ComponentPropsType | Array<keyof ComponentPropsType> | any
  key: string | string[]
  value: any | any[]
  isPropKey?: boolean
  isDebounce?: boolean
}

// history
export type HistoryType = 'add' | 'update' | 'delete'
export interface HistoryRecord {
  id: string
  componentId: string
  type: HistoryType
  newVal?: any
  index?: number
  // key?: ComponentPropsType | ComponentPropsType[]
  key?: string | string[]
  oldValue?: any
}
export interface History {
  historyList: HistoryRecord[] // 历史记录
  historyIndex: number // 撤回重做的游标
  maxNumber: number // 最大的历史记录数量
  oldValue: any // 更新钱的旧的值
}
export interface EditorProps {
  selectedElem: HTMLElement | null// 当前选中元素
  selectedId: string // 当前选中的ID
  components: ComponentProps[]
  referenceLine: ReferenceLineProps // 辅助线
  copyComponentData?: ComponentProps | null // 当前复制的图层
  history: History
}
type HistoryAction = 'redo' | 'undo'
const historyMethods = {
  // 对于添加类型的历史记录
  addHistoryRecord (state: EditorProps, historyRecord: HistoryRecord, type: HistoryAction) {
  const { index, newVal } = historyRecord
    if (type === 'undo') { // 撤回 删除
      state.components.splice(index as number, 1)
    } else {
      // 重做 恢复
      state.components.push(newVal)
    }
  },
  // 对于删除类型的历史记录
  deleteHistoryRecord (state: EditorProps, historyRecord: HistoryRecord, type: HistoryAction) {
    const { index, newVal } = historyRecord
    if (type === 'undo') {
      state.components.push(newVal)
    } else {
      state.components.splice(index as number, 1, newVal)
    }
  },
  // 对于修改属性的类型记录
  updateHistoryRecord (state: EditorProps, historyRecord: HistoryRecord, type: HistoryAction) {
    const { componentId, newVal, oldValue, key: keys } = historyRecord
    const component = find(state.components, item => item.id === componentId)
    const values = type === 'undo' ? oldValue : newVal
    if (component) {
      if (Array.isArray(keys)) {
        keys.forEach((key, index) => {
          component.props[key] = values[index]
        })
      }
    }
  },
  // 防抖处理
  updateHistoryRecordDebounce (state: EditorProps, historyRecord: HistoryRecord, type: HistoryAction) {
    console.log()
  }
}

const addHistory = (state: EditorProps, historyRecord: HistoryRecord, callback?: () => void) => {
  const history = state.history
  const { historyList, maxNumber, historyIndex } = history
  if (historyIndex !== -1) {
    historyList.splice(historyIndex)
    history.historyIndex = -1
  }
  if (historyList.length < maxNumber) {
    historyList.push(historyRecord)
  } else {
    historyList.shift()
    historyList.push(historyRecord)
  }
  callback && callback()
}
const debounceAddHistory = debounce(addHistory, 1500)
const editor: Module<EditorProps, GlobalProps> = {
  namespaced: true,
  state: {
    selectedElem: null, // 当选选中元素DOM元素
    selectedId: '', // 当前选中元素的Id
    components: [],
    referenceLine: {
      rowLine: [],
      colLine: []
    },
    copyComponentData: null,
    history: {
      historyList: [],
      historyIndex: -1,
      maxNumber: 10,
      oldValue: null
    }
  },
  getters: {
    selectedComponent: (state) => find(state.components, item => item.id === state.selectedId) // 当前选中的组件
  },
  mutations: {
    addComponent (state: EditorProps, data: ComponentProps) { // 添加组件
      const type = data.type || 'text'
      const layerName = ComponentType2Name[type] + (state.components.length + 1)
      data.layerName = layerName
      state.components.push(data)
     addHistory(state, {
       id: uuidv4(),
       componentId: data.id,
       newVal: data,
       index: state.components.length - 1,
       type: 'add'
     })
    },
    setSelectedComponent (state, selectedComponent: SelectedProps) { // 设置当前选中的元素
      const { id, elem } = selectedComponent
      console.log(id, elem, 'selectedComponent')
      state.selectedId = id
      state.selectedElem = elem
      const currentCompoent = find(state.components, item => item.id === id)
      if (currentCompoent) {
        currentCompoent.elem = elem
      }
    },
    updateComponent (state, data: UpdateProps) {
      let { key: keys, value: values, isPropKey = true, id } = data
      const component = find(state.components, item => item.id === id)
      if (!Array.isArray(keys) && !Array.isArray(values)) {
        keys = [keys]
        values = [values]
      }
      const oldValue = (keys as string[]).map(key => component?.props[key])
      !state.history.oldValue && (state.history.oldValue = oldValue)
      if (component) {
        Array.isArray(keys) && (keys).forEach((key, index) => {
          if (typeof key === 'string') {
            if (!isPropKey) {
              (component as any)[key as string] = values[index]
            }
            if (key === 'font') {
              const { key, value: fontValue } = values[index]
              component.props[key] = fontValue
            } else {
              component.props[key] = values[index]
            }
          }
        })
        const params: HistoryRecord = {
          id: uuidv4(),
          componentId: component.id,
          type: 'update',
          newVal: values,
          key: keys,
          oldValue: state.history.oldValue
        }
        // if (data.isDebounce) {
        debounceAddHistory(state, params, () => {
          // 重置旧的值
          state.history.oldValue = null
        })
        // } else {
        //   addHistory(state, params)
        // }
      }
    },
    deleteComponent (state: EditorProps, id: string) { // 删除组件
      const component = find(state.components, item => item.id === id)
      if (component) {
        const deleteIndex = findIndex(state.components, item => item.id === id)
        state.components.splice(deleteIndex, 1)
        addHistory(state, {
          id: uuidv4(),
          componentId: component.id,
          newVal: component,
          index: deleteIndex,
          type: 'delete'
        })
        message.success('删除图层删除')
      }
    },
    setReferenceLine (state: EditorProps, referenceLine: ReferenceLineProps) {
      state.referenceLine = referenceLine
    },
    copyComponent (state, id: string) {
      const component = find(state.components, item => item.id === id)
      if (component) {
        const cloneComponent = cloneDeep(component)
        cloneComponent.id = uuidv4()
        cloneComponent.layerName = component.layerName + ' 副本'
        cloneComponent.elem = null
        state.copyComponentData = cloneComponent
        message.success('复制图层成功')
      }
    },
    pasteComponent (state) {
      if (state.copyComponentData) {
        state.components.push(state.copyComponentData)
        const { id, elem } = state.copyComponentData
        store.commit('editor/setSelectedComponent', { id, elem })
        message.success('粘贴图层成功')
      }
    },
    moveComponent (state, data: { direction: Direction, diff: number, id: string }) {
      const { direction, diff, id } = data
      const component = find(state.components, item => item.id === id)
      if (component) {
        const oldLeft = parseFloat(component.props.left) || '0'
        const oldTop = parseFloat(component.props.top) || '0'
        const key = (direction === 'up' || direction === 'down') ? 'top' : 'left'
        const prefix = (direction === 'up' || direction === 'left') ? -1 : 1
        const newVal = Number(key === 'top' ? oldTop : oldLeft) + (prefix * diff)
        store.commit('editor/updateComponent', { key, value: newVal + 'px', id })
      }
    },
    redo (state) { // 重做
      const history = state.history
      const { historyIndex, historyList } = history
      if (historyIndex === -1) {
        // 未进行任何的撤回操作
        return false
      }
      const historyRecord = historyList[historyIndex]
      switch (historyRecord.type) {
        case 'add':
          historyMethods.addHistoryRecord(state, historyRecord, 'redo')
          break
        case 'delete':
          historyMethods.deleteHistoryRecord(state, historyRecord, 'redo')
          break
        case 'update':
           historyMethods.updateHistoryRecord(state, historyRecord, 'redo')
          break
        default:
          break
      }
      history.historyIndex++
    },
    undo (state) { // 撤回
      // 未进行撤回操作
      const history = state.history
      const { historyList } = history
      if (state.history.historyIndex === -1) {
        state.history.historyIndex = historyList.length - 1
      } else {
        history.historyIndex--
      }
      const historyRecord = historyList[state.history.historyIndex]
      switch (historyRecord.type) {
        case 'add':
          historyMethods.addHistoryRecord(state, historyRecord, 'undo')
          break
        case 'delete':
          historyMethods.deleteHistoryRecord(state, historyRecord, 'undo')
          break
        case 'update':
           historyMethods.updateHistoryRecord(state, historyRecord, 'undo')
          break
        default:
          break
      }
    }
  }
}

export default editor
