<template>
    <!-- v-show="IfShow(permission)" -->
  <Button
    v-bind="getBindValue"
    :class="getButtonClass"
    @click="onClick"
    class="ta-basic-button"
  >
    <template #default="data">
      <Icon :icon="preIcon" v-if="!loading && preIcon" :size="iconSize" :color="preIconColor" />
      <template v-if="!loading">
        <slot v-bind="data || {}"></slot>
      </template>
      <Icon :icon="postIcon" v-if="!loading && postIcon" :size="iconSize" :color="postIconColor" />
    </template>
  </Button>
</template>

<script lang="ts">
// @ts-nocheck
import { defineComponent } from "vue";
export default defineComponent({
  name: "BasicButton",
  inheritAttrs: false
});
</script>
<script lang="ts" setup>
  import { Button } from "ant-design-vue";
  import { computed, unref } from "vue";
  import { buttonProps } from "./props";
  import { Icon } from "@casta-fe-playground/components/Icon";
  import { useAttrs } from "@casta-fe-playground/hooks";
  // import { usePermission } from "/@/hooks/web/usePermission";
  /* eslint-disable-next-line */
  const props = defineProps(buttonProps);
  // get component class
  const attrs = useAttrs({ excludeDefaultKeys: false });
  const getButtonClass = computed(() => {
    const { color, disabled } = props;
    return [
      {
        [`ant-btn-${color}`]: !!color,
        [`is-disabled`]: disabled
      }
    ];
  });

  // get inherit binding value
  const getBindValue = computed(() => ({ ...unref(attrs), ...props }));

  // const { getPermissions } = usePermission();
  // const Permissions = getPermissions();
  // const IfShow = computed(() => (code) => {
  //   return code ? unref(Permissions)[code]?.ifShow && props.ifShow : props.ifShow;
  // });
</script>
