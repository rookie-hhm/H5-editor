import { mapValues } from 'lodash-es'
import { ComponentType } from '@/types/componentPropsType'
export const mergeStyleProps = <T extends ComponentType>(props: T) => {
  return mapValues(props, (item) => {
    return {
      type: (item as any).constructor as StringConstructor,
      default: item
    }
  })
}

interface ImageSize {
  width: number
  height: number
}
export const getImageSize = (url: string | File) => {
  return new Promise<ImageSize>((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => {
      const { naturalWidth, naturalHeight } = image
      resolve({ width: naturalWidth, height: naturalHeight })
    })
    image.addEventListener('error', () => {
      reject(new Error('something is wrong!!'))
    })
    image.src = (typeof url === 'string' ? url : URL.createObjectURL(url))
  })
}
