<template>
  <InputSearch
    v-model:value="value"
    placeholder="input search text"
    size="large"
    @search="onSearch"
  >
    <template #enterButton>
      <Button>Custom</Button>
    </template>
  </InputSearch>
</template>
<script lang="ts">
  import { defineComponent, ref } from "vue";
  import { InputSearch } from "ant-design-vue";
  import {Button}  from "../../Button";
  import Icon from "../../icon";

  export default defineComponent({
    name: "TaInputSearch",
    components: { InputSearch, Button, Icon },
    inheritAttrs: false,
    emits: ["onsearch"],
    setup(props, { emit }) {
      const value = ref<string>("");

      const onSearch = (searchValue: string) => {
        console.log("use value", searchValue);
        console.log("or use this.value", value.value);
        emit("onsearch", searchValue);
      };

      return {
        value,
        onSearch
      };
    }
  });
</script>
