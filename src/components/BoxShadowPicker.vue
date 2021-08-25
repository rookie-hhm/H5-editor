<template>
  <div class="box-shadow-wrapper">
    <div class="item">
      <span>左偏移</span>
      {{ parseInt(values[0] )}}
      <a-input-number :value="parseInt(values[0])" @change="value => updateValue(value, 0)"></a-input-number>
    </div>
    <!-- <div class="item">
      <span>上偏移</span>
      <a-input :value="parseInt(values[1])" @change="e => updateValue(e.target.value, 1)"></a-input>
    </div> -->
    <div class="item">
      <span>模糊半径</span>
      <a-slider :value="parseInt(values[2])" :step="1" :min="0" :max="100" @change="value => updateValue(value, 2)"></a-slider>
    </div>
    <div class="item">
      <span>扩展半径</span>
      <a-slider :value="parseInt(values[3])" :step="1" :min="0" :max="100" @change="value => updateValue(value, 3)"></a-slider>
    </div>
    <div class="item">
      <span>阴影颜色</span>
      <color-picker :value="values[4]" @change="value => updateValue(value, 4)"></color-picker>
    </div>
  </div>
</template>

<script lang='ts'>
import { computed, defineComponent, watch } from 'vue'
import ColorPicker from './ColorPicker.vue'
export default defineComponent({
  name: 'BoxShadowPicker',
  components: {
    ColorPicker
  },
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  setup (props, { emit }) {
    watch(props, (newVal) => {
      console.log(newVal, 'newVal')
    }, { deep: true })
    const values = computed(() => {
      return props.value.split(' ')
    })
    const updateValue = (value: string, index: number) => {
      console.log(value, index, 'box-shadow')
      const result = computed(() => {
        return values.value.map((item, i) => {
          if (i === index) {
            return index !== 4 ? value + 'px' : value
          } else {
            return item
          }
        })
      })
      console.log(result, result.value.join(' '), 'box-shadow change')
      const lastReuslt = result.value.join(' ')
      emit('change', lastReuslt)
    }
    return {
      updateValue,
      values
    }
  }
})
</script>

<style lang='scss' scoped>
.box-shadow-wrapper {
  .item {
    @include left;
    width: 100%;
    & > span {
      width: 70px;
    }
    span + div {
      flex: 1 0 0;
    }
  }
}
</style>
