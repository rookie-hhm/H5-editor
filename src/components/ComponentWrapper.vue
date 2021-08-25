<template>
  <!-- 控制元素的css属性，譬如定位信息、过渡信息等 -->
  <div
    class="edit-component-wrapper"
    :data-component-id="id"
    ref="elem"
    @click.stop="setSelected"
    :class="{ active: active && !isLocked, 'is-locked': isLocked }"
    @mousedown.stop="onMouseDown"
    :style="styles"
  >
    <slot></slot>
    <div class="dragger-wrapper" v-show="active && !isLocked" ref="draggerWrapper">
      <!-- 从左上角顺时针编写 八个方向 -->
      <div
        @mousedown.stop="onResizeDown"
        class="dragger-item"
        :class="direction"
        :data-direction="direction"
        v-for="direction in directionList"
        :key="direction">
      </div>
      <!-- <div class="dragger-item top-left" data-direction="top-left"></div>
      <div class="dragger-item top-center" data-direction="top-center"></div>
      <div class="dragger-item left-center" data-direction="left-center"></div>
      <div class="dragger-item top-right" data-direction="top-right"></div>
      <div class="dragger-item right-center" data-direction="right-center"></div>
      <div class="dragger-item bottom-center" data-direction="bottom-center"></div>
      <div class="dragger-item bottom-left" data-direction="bottom-left"></div>
      <div class="dragger-item bottom-right" data-direction="bottom-right"></div> -->
    </div>
  </div>
</template>

<script lang='ts'>
import { computed, defineComponent, onMounted, ref } from 'vue'
import { pick } from 'lodash-es'
import { useStore } from 'vuex'
import { ReferenceLineProps } from '@/store/modules/editor'
import { GlobalProps } from '@/store/types'
type Direction = 'top-left' | 'top-center' | 'top-right' | 'right-center' | 'bottom-right' | 'bottom-center' | 'bottom-left' | 'left-center'
const direction = ['top-left', 'top-center', 'top-right', 'right-center', 'bottom-right', 'bottom-center', 'bottom-left', 'left-center']
export default defineComponent({
  props: {
    id: {
      type: String,
      default: ''
    },
    isLocked: {
      type: Boolean,
      default: false
    },
    active: Boolean,
    props: {
      type: Object
    },
    gaps: {
      type: Number
    }
  },
  emits: ['selected', 'update-position'], // 选中事件
  setup (props, { emit }) {
    const elem = ref<HTMLElement | null>(null)
    const draggerWrapper = ref<null | HTMLElement>(null)
    const draggerList: HTMLElement[] = []
    const setItemRef = (ref: HTMLElement) => draggerList.push(ref)
    const directionList = ref(direction)
    const store = useStore<GlobalProps>()
    const styles = computed(() => pick(props.props, ['position', 'width', 'height', 'top', 'left']))
    const setSelected = () => {
      !props.isLocked && emit('selected', { id: props.id, elem: elem.value })
    }
    let isMoving = false // 设置移动的标识
    const offsetOps = { left: 0, top: 0 } // 点击时，鼠标所在元素内的偏移量
    let moveOps = { left: 0, top: 0 } // 最后移动的位置
    const isShowLine = (a: number, b: number, gaps: number) => {
      return Math.abs(a - b) <= gaps
    }
    const gaps = 1.5
    // 生成辅助线
    const generateLine = (target: HTMLElement, wrapper: HTMLElement, children: HTMLCollection) => {
      const referenceLine: ReferenceLineProps = { rowLine: [], colLine: [] }
      const { left: wrapperLeft } = wrapper.getBoundingClientRect()
      const { width, height, left, top, right, bottom } = target.getBoundingClientRect()
      Array.from(children).forEach((retItem: Element) => {
        if (retItem === target) {
          return
        }
        const { width: compareWidth, height: compareHeight, left: compareLeft, top: compareTop, right: compareRight, bottom: compareBottom } = retItem.getBoundingClientRect()
        const leftPrefix = left - compareLeft >= 0 ? 1 : -1
        // const topPrefix = top - compareTop >= 0 ? 1 : -1
        if (isShowLine(left, compareLeft, gaps) || isShowLine(left, compareRight, gaps) || isShowLine(left, (compareLeft + (compareWidth / 2)), gaps)) {
          // 左-左 左-右 左-中 边对齐
          if (referenceLine.colLine.indexOf(left) === -1) {
            referenceLine.colLine.push(left)
            target.style.left = (left - leftPrefix * gaps - wrapperLeft) + 'px'
          }
        }
        // 右-左 右-右 右-中
        if (isShowLine(right, compareLeft, gaps) || isShowLine(right, compareRight, gaps) || isShowLine(right, (compareLeft + (compareWidth / 2)), gaps)) {
          if (referenceLine.colLine.indexOf(right) === -1) {
            referenceLine.colLine.push(right)
            target.style.left = (right - leftPrefix * gaps - wrapperLeft - width) + 'px'
          }
        }
        // 上-上 上-下 上-中
        if (isShowLine(top, compareTop, gaps) || isShowLine(top, compareBottom, gaps) || isShowLine(top, (compareTop + (compareHeight / 2)), gaps)) {
          // 上-上边对齐
          if (referenceLine.rowLine.indexOf(top) === -1) {
            referenceLine.rowLine.push(top)
          }
        }
        // 下-下 下-上
        if (isShowLine(bottom, compareTop, gaps) || isShowLine(bottom, compareBottom, gaps) || isShowLine(bottom, (compareTop + (compareHeight / 2)), gaps)) {
          // 上-上边对齐
          if (referenceLine.rowLine.indexOf(bottom) === -1) {
            referenceLine.rowLine.push(bottom)
          }
        }
        // 横中-横中 横中-左 横中-右
        const middleX = (width / 2) + left
        if (isShowLine(middleX, (compareWidth / 2) + compareLeft, gaps) || isShowLine(middleX, compareLeft, gaps) || isShowLine(middleX, compareRight, gaps)) {
          if (referenceLine.colLine.indexOf(middleX) === -1) {
            referenceLine.colLine.push(middleX)
          }
        }
        // 纵中-纵中
        const middleY = (height / 2) + top
        if (isShowLine(middleY, (compareHeight / 2) + compareTop, gaps) || isShowLine(middleY, compareTop, gaps) || isShowLine(middleY, compareBottom, gaps)) {
          if (referenceLine.rowLine.indexOf(middleY) === -1) {
            referenceLine.rowLine.push(middleY)
          }
        }
      })
      store.commit('editor/setReferenceLine', referenceLine)
    }
    // 拖动元素
    const calculateMovePosition = (e: MouseEvent, container: HTMLElement, containerRect: DOMRect) => {
      const { left, top } = containerRect
      const elemLeft = e.clientX - left - offsetOps.left
      const elemTop = e.clientY - top - offsetOps.top + container.scrollTop
      return {
        left: elemLeft,
        top: elemTop
      }
    }
    const onMouseDown = (e: MouseEvent) => {
      // alert('asd')
      console.log('mousedown')
      if (elem.value && !props.isLocked) {
        const element = elem.value
          // 获取元素内部偏移量
        const { clientX, clientY } = e
        const { left, top } = element.getBoundingClientRect()
        offsetOps.left = clientX - left
        offsetOps.top = clientY - top
        // 获取移动元素的父级元素
        const container = document.querySelector('#canvas-center') as HTMLImageElement
        const children = container.children // 获取到所有的子元素
        console.log(children, 'children')
        let containerRect: DOMRect
        if (container) {
          containerRect = container.getBoundingClientRect() as DOMRect
        }
        // 拖动元素移动
        const onMouseMove = (e: MouseEvent) => {
          isMoving = true
          const position = calculateMovePosition(e, container, containerRect)
          const { left, top } = position
          element.style.left = left + 'px'
          element.style.top = top + 'px'
          moveOps = position
          // 生成辅助线
          generateLine(element, container, children)
        }
        // 松开元素
        const onMouseUp = () => {
          // udate position data
          if (isMoving) {
            console.log('MOVEopS', element, props.id)
            emit('update-position', { ...moveOps, id: props.id })
            // 清空参考线
            const referenceLine: ReferenceLineProps = { rowLine: [], colLine: [] }
            store.commit('editor/setReferenceLine', referenceLine)
          }
          // remove listeners
          isMoving = false
          document.removeEventListener('mousemove', onMouseMove)
          document.removeEventListener('mouseup', onMouseUp)
        }
        document.addEventListener('mousemove', onMouseMove)
        document.addEventListener('mouseup', onMouseUp)
      }
    }
    const calculateSizeOps = (direction: Direction, e: MouseEvent, elementRect: DOMRect, container: HTMLElement) => {
      const containerRect = container.getBoundingClientRect() as DOMRect
      const rightWidth = e.clientX - elementRect.left
      const leftWidth = elementRect.right - e.clientX
      const offsetLeft = e.clientX - containerRect.left
      const bottomHeight = e.clientY - elementRect.top
      const topHeight = elementRect.bottom - e.clientY
      const offsetTop = e.clientY - containerRect.top
      const maxTopHeight = elementRect.bottom - containerRect.top
      // const maxBottomHeight = containerRect.bottom - elementRect.top
      const maxLeftWidth = elementRect.right - containerRect.left
      // const maxRightWidth = containerRect.right - elementRect.left
      // 限制
      // const limitLeftWidth = Math.max(0, Math.min(maxLeftWidth, leftWidth))
      // const limitTopHeight = Math.max(0, Math.min(maxTopHeight, topHeight))
      // const limitBottomHeight = Math.max(0, Math.min(maxBottomHeight, bottomHeight))
      // const limitOffsetTop = Math.max(0, Math.min(maxTopHeight, offsetTop))
      // const limitOffsetLeft = Math.max(0, Math.min(maxLeftWidth, offsetLeft))
      // const limitRightWidth = Math.max(0, Math.min(maxRightWidth, rightWidth))
      switch (direction) {
        case 'top-left':
          return {
            width: leftWidth,
            height: topHeight,
            top: Math.min(offsetTop, maxTopHeight),
            left: Math.min(offsetLeft, maxLeftWidth)
          }
        case 'top-center':
          return {
            height: topHeight,
            top: Math.min(offsetTop, maxTopHeight)
          }
        case 'top-right':
          return {
            width: rightWidth,
            height: topHeight,
            top: Math.min(offsetTop, maxTopHeight)
          }
        case 'right-center':
          return {
            width: rightWidth
          }
        case 'bottom-right':
          return {
            width: rightWidth,
            height: bottomHeight
          }
        case 'bottom-center':
          return {
            height: bottomHeight
          }
        case 'bottom-left':
          return {
            width: leftWidth,
            height: bottomHeight,
            left: Math.min(offsetLeft, maxLeftWidth)
          }
        case 'left-center':
          return {
            width: leftWidth,
            left: Math.min(offsetLeft, maxLeftWidth)
          }
      }
    }
    const onResizeDown = (e: MouseEvent) => {
      if (props.isLocked) return
      const target = elem.value as HTMLElement
      const element = e.target as HTMLElement
      // 获取到当前的拖动元素的方向
      const direction = element.dataset.direction as Direction
      const container = document.querySelector('#canvas-center') as HTMLImageElement
      const targetRect = target.getBoundingClientRect() as DOMRect
      const onResizeMove = (e: MouseEvent) => {
        const sizeOps = calculateSizeOps(direction, e, targetRect, container)
        const { width, height, left, top } = sizeOps
        const style = target.style
        width && (style.width = width + 'px')
        height && (style.height = height + 'px')
        left && (style.left = left + 'px')
        top && (style.top = top + 'px')
      }
      const onResizeUp = (e: MouseEvent) => {
        const sizeOps = calculateSizeOps(direction, e, targetRect, container)
        emit('update-position', { ...sizeOps, id: props.id })
        document.removeEventListener('mousemove', onResizeMove)
        document.removeEventListener('mouseup', onResizeUp)
      }
      document.addEventListener('mousemove', onResizeMove)
      document.addEventListener('mouseup', onResizeUp)
    }
    onMounted(() => {
      console.log(elem.value, 'mounted')
    })
    return {
      setSelected,
      elem,
      draggerWrapper,
      styles,
      onMouseDown,
      onResizeDown,
      directionList
    }
  }
})
</script>

<style lang='scss' scoped>
.edit-component-wrapper {
  position: relative;
  &.is-locked {
    &:hover {
      cursor: default;
      border: none;
    }
  }
  &:hover {
    cursor: pointer;
    border: 1px dotted blueviolet;
  }
  &.active {
    border: 1px solid blueviolet;
    cursor: pointer;
  }
  .dragger-wrapper {
    .dragger-item {
      position: absolute;
      z-index: 1;
      width: 8px;
      height: 8px;
      // border-radius: 50%;
      // border: 2px solid rgba(90, 194, 219, 1);
      border: 1px solid purple;
      background-color: #fff;
      &.top-left {
        top: 0;
        left: 0;
        transform: translate3d(-50%, -50%, 0);
        cursor: nwse-resize;
      }
      &.top-center {
        top: 0;
        left: 50%;
        transform: translate3d(-50%, -50%, 0);
        cursor: ns-resize;
      }
      &.top-right {
        right: 0;
        top: 0;
        cursor: nesw-resize;
        transform: translate3d(50%, -50%, 0);
      }
      &.right-center {
        right: 0;
        top: 50%;
        transform: translate3d(50%, -50%, 0);
        cursor: ew-resize;
      }
      &.bottom-right {
        right: 0;
        top: 100%;
        transform: translate3d(50%, -50%, 0);
        cursor: nwse-resize;
      }
      &.bottom-center {
        left: 50%;
        top: 100%;
        transform: translate3d(-50%, -50%, 0);
        cursor: ns-resize;
      }
      &.bottom-left {
        left: 0;
        top: 100%;
        transform: translate3d(-50%, -50%, 0);
        cursor: nesw-resize;
      }
      &.left-center {
        top: 50%;
        left: 0;
        transform: translate3d(-50%, -50%, 0);
        cursor: ew-resize;
      }
    }
  }
}
</style>
