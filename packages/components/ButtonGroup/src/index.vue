<!--
 * @Author: huyb
 * @Descripttion: Think & Action
 * @Date: 2021-11-05 10:13:24
-->
<template>
  <div class="ta-button-group" @click.stop>
    <div class="ta-button-group-inner" ref="scrollRef">
      <Button
        v-for="(item, index) in filterButton"
        :key="item.value"
        :type="active == item.value ? 'primary' : 'default'"
        @click="clickHandle(item, index, $event)"
        :disabled="item.disabled"
        :loading="item.loading"
      >
        {{ item.label }}
        <span v-if="item.number != null">（{{ item.number }}）</span>
      </Button>
    </div>
    <slot></slot>
  </div>
</template>

<script lang="ts">
  import { computed, defineComponent, ref, watch } from "vue";
  // import { onBeforeRouteUpdate, useRouter } from "vue-router";
  import { ButtonItem } from "./type";
  import { Button } from "@casta-fe-playground/components/Button";
  import { useScrollToCenter } from "@casta-fe-playground/utils";
  // import { usePermission } from "/@/hooks/web/usePermission";
  export default defineComponent({
    components: { Button },
    props: {
      active: {
        type: [Number, String],
        required: true
      },
      islink: {
        type: Boolean,
        default: false
      },
      buttons: {
        type: Array as PropType<ButtonItem[]>,
        default: () => [] as ButtonItem[]
      }
    },
    emits: ["btnClick", "update:active"],
    setup(props, { emit }) {
      let scrollRef = ref(null);
      // const router = useRouter();
      const getButtonValue = (route) => {
        // 如果是链接 那么就需要监听路由变化修改 选中的值
        if (props.islink) {
          emit("update:active", route.path);
        }
      };
      const { scrollToCenter } = useScrollToCenter(scrollRef);
      const clickHandle = (data: ButtonItem, index: number, event) => {
        if (data.value == props.active) return;
        if (props.islink) {
          // router.push({ path: data.value as string });
        }
        emit("update:active", data.value);
        emit("btnClick", data);
      };

      watch(
        () => props.active,
        (v) => {
          const buttonIndex = props.buttons.findIndex((btn) => btn.value === v);
          const buttonEl = (scrollRef.value as ElRef)?.querySelectorAll("button")[buttonIndex];
          buttonEl && scrollToCenter(buttonEl);
        },
        {
          immediate: true
        }
      );

      // onBeforeRouteUpdate((data) => {
      //   getButtonValue(data);
      // });
      const pageInit = () => {
        // getButtonValue(router.currentRoute.value);
      };
      pageInit();

      // const { getPermissions } = usePermission();
      // const permissions = getPermissions();

      const filterButton = computed(() =>
        props.buttons.filter((btn) => {
          if (!btn.permission) return true;
          // return permissions.value[btn.permission]?.ifShow;
          return true;
        })
      );

      if (props.buttons.length !== filterButton.value.length) {
        const nextBtn = filterButton.value[0];
        if (nextBtn) {
          clickHandle(nextBtn, 0, undefined);
        } else {
          emit("update:active", -1);
        }
      }

      return {
        scrollRef,
        clickHandle,
        filterButton
      };
    }
  });
</script>

<style lang="less">
  @import "../index.less";
  .ta-button-group {
    margin-bottom: @gap16;
    position: relative;

    &-inner {
      white-space: nowrap;
      max-width: 100%;
      overflow-y: hidden;
      overflow-x: auto;

      &::-webkit-scrollbar {
        display: none;
      }
    }

    .ant-btn {
      border-radius: 32px !important;
    }

    .ant-btn-default {
      background: #eeedf2;
      border-color: #eeedf2;
      color: #999;
    }
  }
</style>
