<template>
  <div class="props-panel-wrapper">
    <div class="form-props-item" v-for="(item, index) in newPropsList" :key="index">
      <span class="description">{{ item.description }}</span>
      <div class="component-wrapper">
        <component
          :is="item.component"
          :value="item.value"
          v-bind="item.attrs"
          v-on="item.events"
        >
        </component>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { computed, defineComponent, PropType } from 'vue'
import { ComponentPropsType } from '@/types/componentPropsType'
import { reduce } from 'lodash-es'
import { propsMap } from '@/types/propsMap'
import ColorPicker from '@/components/ColorPicker.vue'
interface NewPropsForm {
  component: string // 组件件
  description?: string // 提示语
  value: string
  attrs?: { [key: string]: any } // 组件属性
  propName: string // 绑定组件的value的属性值
  eventName: string // 更改组件时向外发送的事件名字
  events: { [eventName: string]: (e: any) => void }
}
export default defineComponent({
  name: 'ComponentPropsPanel',
  components: {
    ColorPicker
  },
  props: {
    selectedProps: { // 选中组件的属性值
      type: Object as PropType<ComponentPropsType>,
      required: true
    }
  },
  emits: ['change'],
  setup (props, { emit }) {
    console.log(props.selectedProps)
    const newPropsList = computed(() => {
     return reduce(props.selectedProps, (result, value, key) => {
        const newKey = key as keyof ComponentPropsType
        const item = propsMap[newKey]
        if (item) {
          const { propName = 'value', eventName = 'change', beforeTransform, afterTransform } = item
          const newItem: NewPropsForm = {
            ...item,
            value: beforeTransform ? beforeTransform(value) : value,
            propName,
            eventName,
            events: {
              [eventName]: (e: any) => { emit('change', { key, value: afterTransform ? afterTransform(e) : e }) }
            }
          }
          result.push(newItem)
        }
        return result
      }, [] as NewPropsForm[])
    })
    return {
      newPropsList
    }
  }
})
</script>

<style lang='scss' scoped>
.props-panel-wrapper {
  min-width: 250px;
  .form-props-item {
    @include left;
    margin-bottom: 10px;
    .description {
      min-width: 50px;
      text-align: center;
    }
    .component-wrapper {
      flex: 1;
    }
  }
}
</style>
