<template>
  <div class="groups-props-wrapper">
    <a-collapse v-model:activeKey="activeKey">
    <a-collapse-panel v-for="group in newGroupProps" :key="group.text" :header="group.text">
      <component-props-panel :selectedProps="group.props" @change="onChange"></component-props-panel>
    </a-collapse-panel>
  </a-collapse>
  </div>
</template>

<script lang='ts'>
import { computed, defineComponent, PropType } from 'vue'
import { ComponentPropsType } from '@/types/componentPropsType'
import { difference } from 'lodash-es'
import ComponentPropsPanel from './ComponentPropsPanel.vue'
interface Rule {
  text: string
  keys: string[]
  props?: { [key: string]: any }
}
const defaultGroupsRule = [
  {
    text: '尺寸',
    keys: ['width', 'height', 'paddingLeft', 'paddingRight', 'paddingTop', 'paddingBottom']
  },
  {
    text: '位置',
    keys: ['left', 'top']
  },
  {
    text: '阴影透明度',
    keys: ['boxShadow', 'opacity']
  },
  {
    text: '边框',
    keys: ['borderStyle', 'borderWidth', 'borderRadius', 'borderColor']
  }
]
export default defineComponent({
  components: {
    ComponentPropsPanel
  },
  props: {
    props: {
      type: Object as PropType<ComponentPropsType>,
      required: true
    },
    groupsRule: {
      type: Array as PropType<Rule[]>,
      default: defaultGroupsRule
    }
  },
  setup (props, { emit }) {
    // 将基本属性往前插入
    const newGroupsRule = computed<Rule[]>(() => {
      // 除去groupsRule里包含的key值，剩下的就是基本属性
      const normalKeys = props.groupsRule.reduce((prev, next) => {
        return [...prev, ...next.keys]
      }, [] as string[])
      const basicKeys = difference(Object.keys(props.props), normalKeys)
      return [
        {
          text: '基本属性',
          keys: basicKeys
        },
        ...props.groupsRule
      ]
    })
    const newGroupProps = computed<Rule[]>(() => {
      return newGroupsRule.value.map(item => {
        const newProps = {} as ComponentPropsType
        item.keys.forEach(key => {
          const newKey = key as keyof ComponentPropsType
          newProps[newKey] = props.props[newKey]
        })
        return {
          ...item,
          props: newProps
        }
      })
    })
    const onChange = (e: any) => {
      emit('change', e)
    }
    console.log(newGroupProps, 'newGroupProps')
    return {
      newGroupProps,
      onChange
    }
  }
})
</script>

<style lang='scss' scoped>
.group-props-wrapper {

}
</style>
