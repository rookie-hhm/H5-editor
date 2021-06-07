// 组件的属性对应的 --> 各种组件
import { ComponentPropsType } from './componentPropsType'

export interface PropsMap {
  component: string // 组件件
  description?: string // 提示语
  attrs?: { [key: string]: any } // 组件属性
  propName?: string // 绑定组件的value的属性值
  eventName?: string // 更改组件时向外发送的事件名字
  beforeTransform?: (e: any) => any // 预处理函数
  afterTransform?: (e: any) => any // 返回处理函数
}

export type PropsForm = {
  [key in keyof ComponentPropsType]?: PropsMap
}
const pxToNumberHandler: PropsMap = {
  component: 'a-input-number',
  beforeTransform: (v: string) => parseInt(v),
  afterTransform: (e: number) => e ? `${e}px` : ''
}

export const propsMap: PropsForm = {
  textContent: {
    description: '文本',
    component: 'a-textarea',
    attrs: { rows: 3 },
    afterTransform: (e: any) => e.target.value
  },
  fontSize: {
    description: '字号',
    ...pxToNumberHandler
  },
  lineHeight: {
    description: '行高',
    component: 'a-slider',
    attrs: { min: 0, max: 100, step: 0.1 },
    beforeTransform: (v: string) => parseFloat(v),
    afterTransform: (e: number) => e.toString()
  },
  // fontFamily: {
  //   component: 'a-select',
  //   subComponent: 'a-select-option',
  //   text: '字体',
  //   options: [
  //     { value: '', text: '无' },
  //     ...fontFamilyOptions
  //   ]
  // },
  width: {
    description: '宽度',
    ...pxToNumberHandler
  },
  color: {
    component: 'color-picker',
    description: '颜色'
  },
  src: {
    component: 'image-processer',
    propName: 'src'
  }
}
