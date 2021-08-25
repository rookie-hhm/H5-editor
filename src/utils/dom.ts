export const getTargetElement = (element: HTMLElement, triggerClass: string): HTMLElement | null => {
  while (element) {
    if (element.classList && element.classList.contains(triggerClass)) {
      return element
    } else {
      element = element.parentNode as HTMLElement
    }
  }
  return null
}
