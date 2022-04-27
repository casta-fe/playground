<template>
  <Input v-model:value="value" placeholder="Basic usage" />
</template>
<script lang="ts">
  import { defineComponent, ref } from "vue";
  import { Input } from "ant-design-vue";
  import Icon from "../../icon";

  export default defineComponent({
    name: "TaInput",
    components: { Input, Icon },
    inheritAttrs: false,
    setup() {
      const value = ref<string>("");
      return {
        value
      };
    }
  });
</script>
