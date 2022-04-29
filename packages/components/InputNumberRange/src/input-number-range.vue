<template>
  <div class="ta-input-number-range">
    <InputNumber
      :placeholder="minPlaceHolder"
      :value="min"
      :min="0"
      :size="size"
      :precision="precision"
      @blur="blurValueMin"
    />
    <Input
      style="width: 30px; border: none; pointer-events: none; background-color: #fff"
      :placeholder="prefixCenter"
      disabled
      size="small"
    />
    <InputNumber
      :min="0"
      :placeholder="maxPlaceHolder"
      :value="max"
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
  import { inputNumberRangeProps,inputNumberRangeEmits } from "./input-number-range";
  import { useMessage } from "@casta-fe-playground/components/useMessage";
  const { createMessage } = useMessage();
  export type InputNumberRangeState={
    min:number|string,
    max:number|string
  }
  export default defineComponent({
    name: "InputNumberRange",
    components: {
      Input,
      InputNumber
    },
    props:inputNumberRangeProps,
    emits: inputNumberRangeEmits,
    setup(props, { emit }) {
      const initPropsValue= props.value?props.value.slice(0):[]
    
      const state = reactive<InputNumberRangeState>({
        min: initPropsValue[0],
        max: initPropsValue[1]
      });
    
      const blurValueMin = (e) => {
        const value=e.target.value
        if (value && state.max && value > state.max) {
          createMessage.warning("最小范围不得大于最大范围");
          emit("change", [null, state.max]);
        }else{
          emit("change", [value, state.max]);
        }
      };
     
      const blurValueMax = (e) => {
        const value=e.target.value
        if (state.min && value && state.min > value) {
          createMessage.warning("最大范围不得小于最小范围");
          emit("change", [state.min, null]);
        }else{
          emit("change", [state.min, value]);
        }
      };
      watch(
        () => props.value,
        (newValue) => {
          const nextValue= newValue?newValue.slice(0):[]
          state.min = nextValue[0];
          state.max = nextValue[1];
        },
        {
          deep: true
        }
      );

      return {
        blurValueMax,
        blurValueMin,
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
