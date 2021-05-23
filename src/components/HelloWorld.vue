<template>
  <div>{{ message }}</div>
</template>

<script lang='ts'>
import { defineComponent } from 'vue'
export default defineComponent({
  props: {
    message: {
      type: String,
      default: '12'
    }
  },
  setup () {
    return {

    }
  }
})
</script>

<style lang='scss' scoped>

</style>
