import { CommonComponentProps, TextProps, ImageProps } from './componentPropsType'

export const commonDefaultProps: CommonComponentProps = {
  position: 'relative',
  left: '0',
  top: '50%',
  right: '0',
  // size
  width: '375px',
  height: '',
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
  boxShadow: '0 0 0 #000000',
  opacity: '1',
  // actions
  actionType: '',
  url: ''
}

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

export const ImageDefaultProps: ImageProps = {
  src: '',
  ...commonDefaultProps
}
export type ComponentProps = TextProps & ImageProps
