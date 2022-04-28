<template>
  <section class="test">
    <h2>Time组件测试</h2>
    <Time :value="state.value"></Time>
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
        value: "1994//04/27"
      });
      return {
        state
      };
    }
  });
</script>

<style lang="less">
  @import "../test.less";
</style>
