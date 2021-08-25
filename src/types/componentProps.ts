import { CommonComponentProps, TextProps, ImageProps } from './componentPropsType'

// 通用组件属性
export const commonDefaultProps: CommonComponentProps = {
  position: 'absolute',
  left: '0',
  top: '50%',
  // size
  width: '375px',
  height: '20px',
  paddingLeft: '0px',
  paddingRight: '0px',
  paddingTop: '0px',
  paddingBottom: '0px',
  // border type
  borderStyle: 'none',
  borderColor: '#000',
  borderWidth: '0',
  borderRadius: '0',
  // shadow and opacity
  boxShadow: '0 0 0 0 #000',
  opacity: '1',
  // actions
  actionType: '',
  url: ''
}

// 文本特有属性
export const textDefaultProps: TextProps = {
  textContent: '请输入文本信息',
  fontSize: '12px',
  fontFamily: '',
  fontWeight: 'normal',
  fontStyle: 'normal',
  textDecoration: 'none',
  lineHeight: '1',
  textAlign: 'center',
  color: '#000000',
  backgroundColor: '',
  ...commonDefaultProps
}

// 图片特有属性
export const ImageDefaultProps: ImageProps = {
  src: '', // 图片地址
  originSrc: '', // 图片源地址
  ...commonDefaultProps
}

export const ComponentType2Name: { [key: string]: any } = {
  text: '文字',
  image: '图片',
  video: '音频',
  audio: '视频'
}

export type ComponentProps = TextProps & ImageProps
