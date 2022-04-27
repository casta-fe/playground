<template>
<section class="test">
  <h2>InputNumberRange test</h2>
  <div class="components">
    <InputNumberRange :value="state.value" />
  </div>
</section>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue"
import InputNumberRange from "@casta-fe-playground/components/InputNumberRange"
export default defineComponent({
  name: "InputNumberRangeTest",
  components: {
    InputNumberRange
  },
  setup() {
    const state = reactive({
      value:[]
    })
    return {
      state
    }
  }
})
</script>

<style lang="less">
  @import "./test.less";
</style>