<template>
  <div class="text-wrapper">
    <component :is="tag" :style="style">
      {{ textContent }}
    </component>
  </div>
</template>

<script lang='ts'>
import { defineComponent } from 'vue'
import { mergeStyleProps } from '@/utils/utils'
import { textDefaultProps } from '@/types/componentProps'
import { getStyleProps } from '@/hooks/common'
const defaultProps = mergeStyleProps(textDefaultProps) // 解析props的定义

export default defineComponent({
  name: 'RText',
  props: {
    tag: {
      type: String,
      default: 'p'
    },
    ...defaultProps
  },
  setup (props) {
    const style = getStyleProps(props, ['actionType', 'url', 'textContent'])
    console.log(style, 'style')
    return {
      style
    }
  }
})
</script>

<style lang='scss' scoped>

</style>
