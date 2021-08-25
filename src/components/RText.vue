<template>
  <component :is="tag" :style="styleProps" class="text">
    {{ textContent }}
  </component>
</template>

<script lang='ts'>
import { defineComponent } from 'vue'
import { mergeStyleProps } from '@/utils/helper'
import { textDefaultProps } from '@/types/componentProps'
import { TextProps } from '@/types/componentPropsType'
import useCommon from '@/hooks/useCommon'
const defaultProps = mergeStyleProps<TextProps>(textDefaultProps) // 解析props的定义

export default defineComponent({
  name: 'r-text',
  props: {
    tag: {
      type: String,
      default: 'p'
    },
    ...defaultProps
  },
  setup (props) {
    const { styleProps, handleClick } = useCommon(props, ['actionType', 'url', 'textContent'])
    console.log(styleProps, 'style')
    return {
      styleProps,
      handleClick
    }
  }
})
</script>

<style lang='scss' scoped>
.text {
  white-space: pre-wrap;
}
</style>
