<template>
  <div class="layer-panel-wrapper">
    <ul class="layer-list">
      <li class="layer-item"
        v-for="item in layerList"
        :key="item.id"
        @click="selectItem(item.id, item.elem)"
        :class="{ 'actived': selectedId === item.id }"
      >
        <!-- 是否隐藏 -->
        <a-tooltip :title="item.isHidden ? '显示' : '隐藏'">
          <div class="button">
            <a-button type="primary" size="small" shape="circle" @click="onChange(item.id, 'isHidden', !item.isHidden, true)">
              <template #icon v-if="item.isHidden"><EyeOutlined /></template>
              <template #icon v-else><EyeInvisibleOutlined /></template>
            </a-button>
          </div>
        </a-tooltip>
        <a-tooltip :title="item.isLocked ? '解锁' : '锁定'">
          <!-- 是否锁定 -->
          <div class="button">
            <a-button type="primary" size="small" shape="circle" @click="onChange(item.id, 'isLocked', !item.isLocked)">
              <template #icon v-if="item.isLocked"><UnlockOutlined /> </template>
              <template #icon v-else><LockOutlined /></template>
            </a-button>
          </div>
        </a-tooltip>
        <a-tooltip title="拖动">
          <div class="button">
            <a-button type="primary" size="small" shape="circle">
              <template #icon><DragOutlined /></template>
            </a-button>
          </div>
        </a-tooltip>
        <layer-edit-input class="edit-input" :value="item.layerName" @change="(value) => onChange(item.id, 'layerName', value)"></layer-edit-input>
      </li>
    </ul>
  </div>
</template>

<script lang='ts'>
import { useStore } from 'vuex'
import { GlobalProps } from '@/store/types'
import { ComponentProps } from '@/store/modules/editor'
import { defineComponent, PropType, computed } from 'vue'
import LayerEditInput from '@/components/LayerEditInput.vue'
import { LockOutlined, UnlockOutlined, DragOutlined, EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons-vue'
export default defineComponent({
  props: {
    layerList: {
      type: Array as PropType<ComponentProps[]>
    },
    selectedId: String
  },
  components: {
    LayerEditInput,
    EyeOutlined,
    EyeInvisibleOutlined,
    DragOutlined,
    UnlockOutlined,
    LockOutlined
  },
  setup (props, { emit }) {
    const componentList = useStore<GlobalProps>()
    const onChange = (id: string, key: string, value: any) => {
      emit('change', { id, key, value, isPropKey: false })
    }
    const selectItem = (id: string, elem: HTMLLIElement) => {
      emit('selected', { id, elem })
    }
    return {
      onChange,
      selectItem
    }
  }
})
</script>

<style lang='scss' scoped>
.layer-panel-wrapper {
  .layer-list {
    .layer-item {
      @include left;
      height: 36px;
      color: #000;
      border-bottom: 1px solid #ccd5db;
      &.actived {
        border-bottom: 1px solid #1890ff;
      }
      .button {
        width: 36px;
        @include center;
      }
      .edit-input {
        margin: 0 10px;
        flex: 1
      }
    }
  }
}
</style>
