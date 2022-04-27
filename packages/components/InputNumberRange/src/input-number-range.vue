<template>
  <div class="ta-input-number-range">
    <InputNumber
      :placeholder="minPlaceHolder"
      :value="min"
      :min="0"
      @change="changeValueMin"
      :size="size"
      :max="max"
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
      :min="min"
      @change="changeValueMax"
      @blur="blurValueMax"
      :size="size"
      :precision="precision"
    />
  </div>
</template>

<script lang="ts">
  import { Input, InputNumber } from "ant-design-vue";
  // import { cloneDeep } from "lodash-es";
  import { toRefs, watch } from "vue";
  import { defineComponent, reactive } from "vue-demi";
  import { defaultProps,defaultEmits } from "./input-number-range";
  import { useMessage } from "@casta-fe-playground/hooks";
  const { createMessage } = useMessage();
  
  export default defineComponent({
    name: "InputNumberRange",
    components: {
      Input,
      InputNumber
    },
    props:defaultProps,
    emits: defaultEmits,
    setup(props, { emit }) {
      const initPropsValue= props.value?props.value.slice(0):[]
      const state: any = reactive({
        min: initPropsValue[0],
        max: initPropsValue[1]
      });
      const changeValueMin = (e) => {
        console.log('kskdkd')
        state.min = e;
        state.max = state.max;
        emit("change", [e, state.max]);
      };
      const blurValueMin = () => {
        if (state.min && state.max && state.min > state.max) {
          createMessage.warning("最小范围不得大于最大范围");
          emit("change", ["", state.max]);
        }
      };
      const changeValueMax = (e) => {
        state.max = e;
        state.min = state.min;
        emit("change", [state.min, e]);
      };
      const blurValueMax = () => {
        if (state.min && state.max && state.min > state.max) {
          createMessage.warning("最大范围不得小于最小范围");
          emit("change", [state.min, ""]);
        }
      };
      watch(
        () => props.value,
        (a) => {
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
