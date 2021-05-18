import { mapValues } from 'lodash-es'
import { TextProps } from '@/types/componentPropsType'
export const mergeStyleProps = (props: TextProps) => {
  return mapValues(props, (item) => {
    return {
      type: (item as any).constructor,
      default: item
    }
  })
}
