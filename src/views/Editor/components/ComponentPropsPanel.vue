<template>
  <div class="props-panel-wrapper">
    <!-- <al-row type="flex" align="middle" v-for="item in propsComponentList">
      <span></span>
      <component></component>
    </al-row> -->
  </div>
</template>

<script lang='ts'>
import { computed, defineComponent, PropType } from 'vue'
import { ComponentPropsType } from '@/types/componentPropsType'
import { propsMap } from '@/types/propsMap'
// import { reduce } from 'lodash-es'
interface NewPropsForm {
  component: string // 组件件
  description?: string // 提示语
  value: any
  on: { [eventName: string]: any }
  attrs?: { [key: string]: any } // 组件属性
  propName: string // 绑定组件的value的属性值
  eventName: string // 更改组件时向外发送的事件名字
}
export default defineComponent({
  name: 'ComponentPropsPanel',
  props: {
    selectedProps: { // 选中组件的属性值
      type: Object as PropType<ComponentPropsType>,
      required: true
    }
  },
  setup (props, { emit }) {
    console.log(props.selectedProps)
    const finalProps = computed(() => {
      return Object.keys(props.selectedProps).reduce((result, key) => {
        const newKey = key as keyof ComponentPropsType
        const item = propsMap[newKey]
        // 如果传入的props.
        if (item) {
          const { beforeTransform, afterTransform, propName = 'value', eventName = 'change' } = item
          let value = props.selectedProps[newKey]
          value = beforeTransform ? beforeTransform(value) : value
          const newItem: NewPropsForm = {
            ...item,
            value,
            propName,
            eventName,
            on: {
              [eventName]: (e: any) => emit('change', { key, value: afterTransform ? afterTransform(e) : e })
            }
          }
          result.push(newItem)
          return result
        }
    }, [] as NewPropsForm[])
    return {
    }
  }
})
</script>

<style lang='scss' scoped>

</style>
