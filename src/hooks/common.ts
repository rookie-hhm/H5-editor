import { computed } from 'vue'
import { omit } from 'lodash-es'

const getStyleProps = <T>(props: Partial<T>, omitArr: string[]) => {
  const styleProps = computed(() => (omit(props, omitArr)))
  return styleProps
}

export {
  getStyleProps
}
