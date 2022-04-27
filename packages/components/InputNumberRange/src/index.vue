<template>
  <div class="ta-input-number-range">
    <InputNumber
      :placeholder="minPlaceHolder"
      :value="min"
      :min="0"
      @change="changeValueMin"
      :size="size"
      :max="9999999999"
      :precision="precision"
      @blur="blurValueMin"
    />
    <Input
      style="width: 30px; border: none; pointer-events: none; background-color: #fff"
      :placeholder="prefixCenter"
      disabled
      :size="size"
    />
    <InputNumber
      :placeholder="maxPlaceHolder"
      :value="max"
      :min="0"
      :max="9999999999"
      @change="changeValueMax"
      @blur="blurValueMax"
      :size="size"
      :precision="precision"
    />
  </div>
</template>

<script lang="ts">
  import { Input, InputNumber } from "ant-design-vue";
  import { cloneDeep } from "lodash-es";
  import { toRefs, watch } from "vue";
  import { defineComponent, reactive } from "vue-demi";
  import { useMessage } from "@casta-fe-playground/hooks/web/useMessage";
  const { createMessage } = useMessage();
  export default defineComponent({
    name: "InputNumberSelect",
    components: {
      Input,
      InputNumber
    },
    props: {
      value: {
        type: Array,
        default: () => []
      },
      disabled: {
        type: Boolean,
        default: false
      },
      minPlaceHolder: {
        type: String,
        default: "请输入数值"
      },
      maxPlaceHolder: {
        type: String,
        default: "请输入数值"
      },
      size: {
        type: String,
        default: "default"
      },
      prefixCenter: {
        type: String,
        default: "~"
      },
      precision: {
        type: Number,
        default: 4
      }
    },
    emits: ["change", "blur"],
    setup(props, { emit }) {
      const state: any = reactive({
        min: props.value && props.value[0],
        max: props.value && props.value[1]
      });
      const changeValueMin = (e) => {
        state.min = e;
        state.max = state.max;
        emit("change", [cloneDeep(e), cloneDeep(state.max)]);
      };
      const blurValueMin = () => {
        if (state.min && state.max && state.min > state.max) {
          createMessage.warning("最小范围不得大于最大范围");
          emit("change", ["", cloneDeep(state.max)]);
        }
      };
      const changeValueMax = (e) => {
        state.max = e;
        state.min = state.min;
        emit("change", [cloneDeep(state.min), cloneDeep(e)]);
      };
      const blurValueMax = () => {
        if (state.min && state.max && state.min > state.max) {
          createMessage.warning("最大范围不得小于最小范围");
          emit("change", [cloneDeep(state.min), ""]);
        }
      };
      watch(
        () => props.value,
        (a, b) => {
          state.min = a[0];
          state.max = a[1];
        },
        {
          deep: true
        }
      );

      return {
        changeValueMin,
        blurValueMax,
        blurValueMin,
        changeValueMax,
        ...toRefs(state)
      };
    }
  });
</script>

<style lang="less" scoped>
  .ta-input-number-range {
    display: inline-flex;
    border: 1px solid #eaeaea;
    width: 100%;

    :deep(.ant-input:focus) {
      box-shadow: none;
    }

    :deep(.ant-input-number) {
      width: calc(100% - 15px);
      text-align: center;
      border: none;
      box-shadow: none;

      .ant-input-number-handler-wrap {
        display: none !important;
      }

      .ant-input-number-input {
        text-align: center;
      }
    }
  }
</style>
