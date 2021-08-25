import hotkeys, { KeyHandler } from 'hotkeys-js'
import { onMounted, onUnmounted } from 'vue'

const useHotKey = (key: string, handler: KeyHandler): void => {
  onMounted(() => {
    hotkeys(key, handler)
  })
  onUnmounted(() => {
    hotkeys.unbind(key, handler)
  })
}

export default useHotKey
