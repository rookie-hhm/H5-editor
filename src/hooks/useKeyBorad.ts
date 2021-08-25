import { onMounted, onUnmounted } from 'vue'
type EventKey = 'Escape' | 'Enter'
const useKeyBorad = (key: EventKey, callback?: () => void) => {
  const handler = (e: KeyboardEvent) => {
    if (e.key === key) {
      callback && callback()
    }
  }
  onMounted(() => document.addEventListener('keydown', handler))
  onUnmounted(() => document.removeEventListener('keydown', handler))
}

export default useKeyBorad
