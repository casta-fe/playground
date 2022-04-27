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
  import { Button } from "ant-design-vue";
  import { computed, defineComponent, unref } from "vue";
  import { buttonProps } from "./props";
  import Icon from "/@/components/Icon/src/Icon.vue";
  import { useAttrs } from "/@/hooks/core/useAttrs";
  // import { usePermission } from "/@/hooks/web/usePermission";
  export default defineComponent({
    name: "AButton",
    inheritAttrs: false
  });
</script>
<script lang="ts" setup>
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
