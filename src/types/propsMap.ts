// 组件的属性对应的 --> 各种组件
import { ComponentPropsType } from './componentPropsType'

export interface PropsMap {
  component: string // 组件
  description?: string // 提示语
  attrs?: { [key: string]: any } // 组件属性
  propName?: string // 绑定组件的value的属性值
  eventName?: string // 更改组件时向外发送的事件名字
  beforeTransform?: (e: any) => any // 预处理函数
  afterTransform?: (e: any) => any // 返回处理函数
}

// 每一个属性对应一个组件
export type PropsForm = {
  [key in keyof ComponentPropsType]?: PropsMap
}
const pxToNumberHandler: PropsMap = {
  component: 'a-input-number',
  beforeTransform: (v: string) => parseFloat(v),
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
  fontStyle: {
    component: 'font-icon',
    propName: 'checked',
    attrs: { iconName: 'italic', tooltip: '斜体' },
    beforeTransform: (v: string) => v === 'italic',
    afterTransform: (e: boolean) => e ? 'italic' : 'normal'
  },
  fontWeight: {
    component: 'font-icon',
    propName: 'checked',
    attrs: { iconName: 'bold', tooltip: '字重' },
    beforeTransform: (v: string) => {
      console.log(v, 'fontWeight', v === 'bold')
      return v === 'bold'
    },
    afterTransform: (e: boolean) => e ? 'bold' : 'normal'
  },
  textDecoration: {
    component: 'font-icon',
    propName: 'checked',
    attrs: { iconName: 'underline', tooltip: '下换线' },
    beforeTransform: (v: string) => v === 'underline',
    afterTransform: (e: boolean) => e ? 'underline' : 'normal'
  },
  opacity: {
    component: 'a-slider',
    description: '透明度',
    attrs: { min: 0, max: 1, step: 0.1 },
    beforeTransform: (v: string) => parseFloat(v),
    afterTransform: (e: number) => e.toString()
  },
  boxShadow: {
    component: 'box-shadow-picker'
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
  top: {
    description: 'top值',
    ...pxToNumberHandler
  },
  left: {
    description: 'left值',
    ...pxToNumberHandler
  },
  width: {
    description: '宽度',
    ...pxToNumberHandler
  },
  height: {
    description: '高度',
    ...pxToNumberHandler
  },
  paddingLeft: {
    ...pxToNumberHandler,
    description: '左边距'
  },
  paddingRight: {
    ...pxToNumberHandler,
    description: '右边距'
  },
  paddingTop: {
    ...pxToNumberHandler,
    description: '上边距'
  },
  paddingBottom: {
    ...pxToNumberHandler,
    description: '下边距'
  },
  color: {
    component: 'color-picker',
    description: '颜色'
  },
  backgroundColor: {
    component: 'color-picker',
    description: '背景颜色'
  },
  src: {
    component: 'image-processer',
    propName: 'src'
  }
}
