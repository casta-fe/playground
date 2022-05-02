<template>
  <div>
    <slot name="insertFooter"></slot>
    <a-button v-bind="cancelButtonProps" @click="handleCancel" v-if="showCancelBtn">
      {{ cancelText }}
    </a-button>
    <slot name="centerFooter"></slot>
    <a-button
      type="primary"
      @click="handleOk"
      :loading="confirmLoading"
      v-bind="okButtonProps"
      v-if="showOkBtn"
    >
      {{ okText }}
    </a-button>
    <slot name="appendFooter"></slot>
  </div>
</template>
<script lang="ts">
  import { defineComponent } from "vue";
  import { basicProps } from "../props";
  import {Button} from "ant-design-vue"

  export default defineComponent({
    name: "BasicModalFooter",
    props: basicProps,
    emits: ["ok", "cancel"],
    components: {AButton: Button},
    setup(_, { emit }) {
      function handleOk(e: Event) {
        emit("ok", e);
      }

      function handleCancel(e: Event) {
        emit("cancel", e);
      }

      return { handleOk, handleCancel };
    }
  });
</script>
