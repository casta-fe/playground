<template>
  <h1 style="text-align: center;">Casta-fe-playground TEST</h1>
  <div class="colorTheme">测试主题变量颜色功能</div>
  <br />
  <TgIcon color="red" :size="30" class="tg-icon-dropbox">Icon Test</TgIcon>
  <br />
  <Button />
  <InputNumberRange />
</template>

<script lang="ts">
  import { defineComponent } from "vue";
  import Button from "./components/Button.vue";
  import InputNumberRange from "./components/InputNumberRange.vue";

  export default defineComponent({
    name: "App",
    components: { Button, InputNumberRange },
    setup() {
      return {};
    }
  });
</script>

<style lang="less">
  .colorTheme {
    color: @primary-color;
  }
</style>
