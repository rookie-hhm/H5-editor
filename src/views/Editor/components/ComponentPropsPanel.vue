<template>
  <div class="props-panel-wrapper">
    <div class="form-props-item" :class="{ 'inline': isInlineProps(item.propKey) }" v-for="(item, index) in newPropsList" :key="index">
      <span class="description" v-if="item.description">{{ item.description }}</span>
      {{ selectedProps }}
      <div class="component-wrapper">
        <component
          :is="item.component"
          :[item.propName]="item.value"
          v-bind="item.attrs"
          v-on="item.events"
        >
        </component>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { computed, defineComponent, PropType, watch } from 'vue'
import { ComponentPropsType } from '@/types/componentPropsType'
import { reduce } from 'lodash-es'
import { propsMap } from '@/types/propsMap'
import ColorPicker from '@/components/ColorPicker.vue'
import ImageProcesser from '@/components/ImageProcesser.vue'
import FontIcon from '@/components/FontIcon.vue'
import BoxShadowPicker from '@/components/BoxShadowPicker.vue'
interface NewPropsForm {
  component: string // 组件件
  description?: string // 提示语
  value: string
  propKey: string
  attrs?: { [key: string]: any } // 组件属性
  propName: string // 绑定组件的value的属性值
  eventName: string // 更改组件时向外发送的事件名字
  events: { [eventName: string]: (e: any) => void }
}
const INLINE_KEYS = ['fontWeight', 'fontStyle', 'textDecoration']
export default defineComponent({
  name: 'ComponentPropsPanel',
  components: {
    ColorPicker,
    ImageProcesser,
    FontIcon,
    BoxShadowPicker
  },
  props: {
    selectedProps: { // 选中组件的属性值
      type: Object as PropType<ComponentPropsType>,
      required: true
    }
  },
  emits: ['change'],
  setup (props, { emit }) {
    const isInlineProps = (key: string) => {
      return INLINE_KEYS.includes(key)
    }
    const newPropsList = computed(() => {
     return reduce(props.selectedProps, (result, value, key) => {
        const newKey = key as keyof ComponentPropsType
        const item = propsMap[newKey]
        if (item) {
          const { propName = 'value', eventName = 'change', beforeTransform, afterTransform } = item
          const newItem: NewPropsForm = {
            ...item,
            propKey: newKey,
            value: beforeTransform ? beforeTransform(value) : value,
            propName,
            eventName,
            events: {
              [eventName]: (e: any) => {
                console.log(e, 'after')
                emit('change', { key, value: afterTransform ? afterTransform(e) : e })
               }
            }
          }
          if (newKey === 'src') { // 图片的特殊逻辑
            if (!newItem.attrs) {
              newItem.attrs = {}
            }
            (newItem.attrs).originSrc = newItem.value
            console.log(newItem.attrs, 'src')
          }
          result.push(newItem)
        }
        return result
      }, [] as NewPropsForm[])
    })
    console.log(newPropsList, 'newPropsList')
    watch(newPropsList, (newVal) => {
      console.log(newVal, 'watch newPropsList')
    })
    return {
      newPropsList,
      isInlineProps
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
    &.inline {
      display: inline-block;
      margin: 0 10px;
    }
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
