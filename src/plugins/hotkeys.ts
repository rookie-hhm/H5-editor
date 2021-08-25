import useHotKey from '@/hooks/useHotKeys'
import hotkeys, { HotkeysEvent } from 'hotkeys-js'
import { useStore } from 'vuex'
import { GlobalProps } from '@/store/types'
import { computed } from 'vue'
import store from '@/store/index'
type MoveAction = 'up' | 'down' | 'left' | 'right' | 'shift+up' | 'shift+down' | 'shift+left' | 'shift+right'

export default function initHotKeyPlugin (): void {
  const store = useStore<GlobalProps>()
  const selectedId = computed(() => store.state.editor.selectedId)
  useHotKey('ctrl+c, command+c', () => {
    store.commit('editor/copyComponent', selectedId.value)
  })
  useHotKey('ctrl+v, command+v', () => {
    store.commit('editor/pasteComponent')
  })
  useHotKey('backspace, delete', () => {
    console.log('deleteComponent')
    store.commit('editor/deleteComponent', selectedId.value)
  })
  useHotKey('up, down, left, right, shift+up, shift+down, shift+left, shift+right', (event: KeyboardEvent, handler: HotkeysEvent) => {
    event.preventDefault()
    switch (handler.key) {
      case 'up':
        store.commit('editor/moveComponent', { direction: 'up', diff: 1, id: selectedId.value })
        break
      case 'down':
        store.commit('editor/moveComponent', { direction: 'down', diff: 1, id: selectedId.value })
        break
      case 'left':
        store.commit('editor/moveComponent', { direction: 'left', diff: 1, id: selectedId.value })
        break
      case 'right':
        store.commit('editor/moveComponent', { direction: 'right', diff: 1, id: selectedId.value })
        break
      case 'shift+up':
        store.commit('editor/moveComponent', { direction: 'up', diff: 10, id: selectedId.value })
        break
      case 'shift+down':
        store.commit('editor/moveComponent', { direction: 'down', diff: 10, id: selectedId.value })
        break
      case 'shift+left':
        store.commit('editor/moveComponent', { direction: 'left', diff: 10, id: selectedId.value })
        break
      case 'shift+right':
        store.commit('editor/moveComponent', { direction: 'right', diff: 10, id: selectedId.value })
        break
    }
  })
  useHotKey('esc', () => {
    store.commit('editor/setSelectedComponent', { id: '', elem: '' })
  })
  useHotKey('ctrl+z, command+z', () => {
    store.commit('editor/undo')
  })
  useHotKey('ctrl+y', () => {
    store.commit('editor/redo')
  })
}
