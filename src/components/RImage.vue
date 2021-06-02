<template>
  <a-image
    :style="styleProps"
    :src="src"
    @click.stop="handleClick"
  ></a-image>
</template>

<script lang='ts'>
import { defineComponent } from 'vue'
import { ImageDefaultProps } from '@/types/componentProps'
import { ImageProps } from '@/types/componentPropsType'
import { mergeStyleProps } from '@/utils/helper'
import useCommon from '@/hooks/useCommon'
const defaultProps = mergeStyleProps<ImageProps>(ImageDefaultProps) // 解析props的定义
export default defineComponent({
  props: {
    ...defaultProps
  },
  name: 'r-image',
  setup (props) {
    const { styleProps, handleClick } = useCommon(props, ['actionType', 'url', 'src'])
    return {
      styleProps,
      handleClick
    }
  }
})
</script>

<style lang='scss' scoped>

</style>
