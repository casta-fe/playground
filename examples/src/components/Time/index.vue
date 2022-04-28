<template>
  <section class="test">
    <h2>Time组件测试 relative</h2>
    <Time :value="state.value" mode="relative"></Time>
    <h2>Time组件测试 date</h2>
    <Time :value="state.value" mode="date"></Time>
    <h2>Time组件测试 datetime</h2>
    <Time :value="state.value" mode="datetime"></Time>
  </section>
</template>

<script lang="ts">
  import { Time } from "@casta-fe-playground/components/Time";
  import { defineComponent, reactive } from "vue";
  export default defineComponent({
    name: "ButtonTest",
    components: {
      Time
    },
    setup() {
      const state = reactive({
        value:new Date()
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
