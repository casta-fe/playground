<template>
  <Button v-bind="$attrs" :disabled="isStart" @click="handleStart" :loading="loading">
    {{ getButtonText }}
  </Button>
</template>
<script lang="ts">
  import { Button } from "ant-design-vue";
  import { computed, defineComponent, ref, unref, watchEffect } from "vue";
  import { useCountdown } from "./useCountdown";
  import { isFunction } from "@casta-fe-playground/utils";

  const props = {
    value: { type: [Object, Number, String, Array] },
    count: { type: Number, default: 60 },
    beforeStartFunc: {
      type: Function as PropType<() => Promise<boolean>>,
      default: null
    }
  };

  export default defineComponent({
    name: "CountButton",
    components: { Button },
    props,
    setup(props) {
      const loading = ref(false);

      const { currentCount, isStart, start, reset } = useCountdown(props.count);

      const getButtonText = computed(() => {
        return !unref(isStart)
          ? "获取验证码"
          : "{0}秒后重新获取".replace("{0}", `${unref(currentCount)}`);
      });

      watchEffect(() => {
        props.value === undefined && reset();
      });

      /**
       * @description: Judge whether there is an external function before execution, and decide whether to start after execution
       */
      async function handleStart() {
        const { beforeStartFunc } = props;
        if (beforeStartFunc && isFunction(beforeStartFunc)) {
          loading.value = true;
          try {
            const canStart = await beforeStartFunc();
            canStart && start();
          } finally {
            loading.value = false;
          }
        } else {
          start();
        }
      }
      return { handleStart, currentCount, loading, getButtonText, isStart };
    }
  });
</script>
