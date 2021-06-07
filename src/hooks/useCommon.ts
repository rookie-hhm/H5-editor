import { computed } from 'vue'
import { omit } from 'lodash-es'
import { ComponentPropsType, ComponentType } from '@/types/componentPropsType'

const useCommon = (props: Partial<ComponentType>, omitArr: string[]) => {
  const styleProps = computed(() => (omit(props, omitArr)))
  const handleClick = () => {
    if (props.actionType === 'link' && props.url) {
      window.location.href = props.url
    }
  }
  return {
    styleProps,
    handleClick
  }
}

export default useCommon
