<template>
  <div class="reference-line-wrapper">
    <div class="row-reference-line" v-for="row in referenceLine.rowLine" :key="row" :style="{ top: row + 'px' }"></div>
    <div class="col-reference-line" v-for="col in referenceLine.colLine" :key="col" :style="{ left: col + 'px' }"></div>
  </div>
</template>

<script lang='ts'>
import { computed, defineComponent } from 'vue'
import { ReferenceLineProps } from '@/store/modules/editor'
import { useStore } from 'vuex'
import { GlobalProps } from '@/store/types'
export default defineComponent({
  setup () {
    const store = useStore<GlobalProps>()
    const referenceLine = computed<ReferenceLineProps>(() => store.state.editor.referenceLine)
    return {
      referenceLine
    }
  }
})
</script>

<style lang='scss' scoped>
.reference-line-wrapper {
  .row-reference-line {
    position: fixed;
    left: 0;
    right: 0;
    height: 1px;
    background-color: rgba(83, 145, 207, 1);
  }
  .col-reference-line {
    position: fixed;
    top: 0;
    bottom: 0;
    width: 1px;
    background-color: rgba(83, 145, 207, 1);
  }
}
</style>
