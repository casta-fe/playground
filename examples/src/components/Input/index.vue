<template>
  <section class="test">
    <h2>Input组件测试</h2>
    <TaInput v-model:value='state.value'/>
    <span>{{state.value}}</span>
  </section>
</template>

<script lang="ts">
  import {TaInput} from '@casta-fe-playground/components/Input'
  import { defineComponent,reactive } from "vue";
  export default defineComponent({
    name: "ButtonTest",
    components: {
      TaInput
    },
    setup() {
      const state = reactive({
        value:'ssss'
      })
      return {
        state
      };
    }
  });
</script>

<style lang="less">
  @import "../test.less";
</style>
