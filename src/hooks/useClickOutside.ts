import { Ref, ref, onMounted, onUnmounted } from 'vue'

const useClickOutside = (elementRef: Ref<null | HTMLElement>) => {
  const isClickOutside = ref(false)
  const clickOutsideHandler = (e: MouseEvent) => {
    if (elementRef.value && e.target) {
      isClickOutside.value = !(elementRef.value.contains(e.target as HTMLElement))
    }
  }
  onMounted(() => document.addEventListener('click', clickOutsideHandler))
  onUnmounted(() => document.removeEventListener('click', clickOutsideHandler))
  return isClickOutside
}

export default useClickOutside
