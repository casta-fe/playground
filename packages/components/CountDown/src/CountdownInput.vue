<template>
  <Input v-bind="$attrs" :class="prefixCls" :size="size" :value="state">
    <template #addonAfter>
      <CountButton :size="size" :count="count" :value="state" :beforeStartFunc="sendCodeApi" />
    </template>
    <template #[item]="data" v-for="item in Object.keys($slots).filter((k) => k !== 'addonAfter')">
      <slot :name="item" v-bind="data || {}"></slot>
    </template>
  </Input>
</template>
<script lang="ts">
  import { defineComponent, PropType } from "vue";
  import {Input} from "ant-design-vue"
  import CountButton from "./CountButton.vue";
  import { useRuleFormItem } from "@casta-fe-playground/hooks";

  const props = {
    value: { type: String },
    size: { type: String, validator: (v) => ["default", "large", "small"].includes(v) },
    count: { type: Number, default: 60 },
    sendCodeApi: {
      type: Function as PropType<() => Promise<boolean>>,
      default: null
    }
  };

  export default defineComponent({
    name: "CountDownInput",
    components: { Input, CountButton },
    inheritAttrs: false,
    props,
    setup(props) {
      const prefixCls = "ta-countdown-input";
      const [state] = useRuleFormItem(props);

      return { prefixCls, state };
    }
  });
</script>
<style lang="less">
  @import "../../../theme-chalk/src/var";
  @prefix-cls: ~"@{namespace}-countdown-input";

  .@{prefix-cls} {
    .ant-input-group-addon {
      padding-right: 0;
      background-color: transparent;
      border: none;

      button {
        font-size: 14px;
      }
    }
  }
</style>
