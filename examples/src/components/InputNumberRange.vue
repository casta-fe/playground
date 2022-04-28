<template>
<section class="test">
  <h2>InputNumberRange使用</h2>
  <div class="components">
    <InputNumberRange :value="inputNumberRangeState.value" />
  </div>
</section>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue"
import {InputNumberRange,InputNumberRangeProps} from "@casta-fe-playground/components"
export default defineComponent({
  name: "InputNumberRangeTest",
  components: {
    InputNumberRange
  },
  setup() {
    const inputNumberRangeState=reactive<InputNumberRangeProps>({
      value:[]
    })
    const changeInputNumber=(data)=>{
      inputNumberRangeState.value=data
    }
    return {
      inputNumberRangeState,
      changeInputNumber
    }
  }
})
</script>

<style lang="less">
  @import "./test.less";
</style>