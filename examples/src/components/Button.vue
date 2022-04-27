<template>
  <section class="test">
    <h2>button test</h2>
    <div class="components">
      <Button
        type="text"
        preIcon="ant-design:plus-square-filled"
        preIconColor="#276dff"
        @click="handleSection2TableFooterActionClick"
      >
        新增合同内容
      </Button>
    </div>
  </section>
</template>

<script lang="ts">
  import {
    Button,
    GroupButton,
    ModalButton,
    PopConfirmButton
  } from "@casta-fe-playground/components/Button";
  import { defineComponent } from "vue";
  export default defineComponent({
    name: "ButtonTest",
    components: {
      Button,
      GroupButton,
      ModalButton,
      PopConfirmButton
    },
    setup() {
      const handleSection2TableFooterActionClick = () => {
        alert("handleSection2TableFooterActionClick");
      };
      return {
        handleSection2TableFooterActionClick
      };
    }
  });
</script>

<style lang="less">
  @import "./test.less";
</style>
