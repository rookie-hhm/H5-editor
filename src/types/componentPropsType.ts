export interface CommonComponentProps {
  // position
  position: string
  left: string
  top: string
  right: string
  // size
  width: string
  height: string
  paddingLeft: string
  paddingRight: string
  paddingTop: string
  paddingBottom: string
  // border type
  borderStyle: string
  borderColor: string
  borderWidth: string
  borderRadius: string
  // shadow and opacity
  boxShadow: string
  opacity: string
  actionType: string
  url: string
}

export interface TextProps extends CommonComponentProps {
  textContent: string
  fontSize: string
  fontFamily: string
  fontWeight: string
  fontStyle: string
  textDecoration: string
  lineHeight: string
  textAlign: string
  color: string
  backgroundColor: string
}

export type ComponentPropsType = TextProps