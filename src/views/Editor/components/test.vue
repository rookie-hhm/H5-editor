<template>
  <div></div>
</template>

<script lang='ts'>
import { defineComponent } from 'vue'
export default defineComponent({
  props: {
    list: {
      type: Array,
      default () {
        return []
      }
    }
  },
  setup (props) {
    return {

    }
  }
})
</script>

<style lang='scss' scoped>

</style>
