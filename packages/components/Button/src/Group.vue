<template>
  <div class="ta-button-group" @click.stop>
    <div class="ta-button-group-inner" ref="scrollRef">
      <Button
        v-for="(item, index) in buttons"
        :key="item.value"
        :type="active == item.value ? 'primary' : 'default'"
        @click="clickHandle(item, index, $event)"
        :disabled="item.disabled"
        :permission="item.permission"
      >
        {{ item.label }}
        <span v-if="item.number != null">（{{ item.number }}）</span>
      </Button>
    </div>
    <slot></slot>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref } from "vue";
  // import { onBeforeRouteUpdate, useRouter } from "vue-router";
  import Button from "./BasicButton.vue";

  interface ButtonItem {
    value: string | number;
    label: string;
    url?: string;
    number?: number | null | undefined;
    disabled?: boolean;
    permission?: string;
  }

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
      const clickHandle = (data: ButtonItem, index: number, event) => {
        if (data.value == props.active) return;
        if (props.islink) {
          // router.push({ path: data.value as string });
        }
        emit("update:active", data.value);
        emit("btnClick", data);
      };
      // onBeforeRouteUpdate((data) => {
      //   getButtonValue(data);
      // });
      const pageInit = () => {
        // getButtonValue(router.currentRoute.value);
      };
      pageInit();

      return {
        scrollRef,
        clickHandle
      };
    }
  });
</script>

<style lang="less">
  @import "../index.less";
  .ta-button-group {
    margin-bottom: @gap16;

    &-inner {
      white-space: nowrap;
      max-width: 100%;
      overflow-y: hidden;
      overflow-x: auto;
    }

    .ant-btn {
      border-radius: 32px !important;
    }

    .ant-btn + .ant-btn {
      margin-left: 16px;
    }

    .ant-btn-default {
      background: #eeedf2;
      border-color: #eeedf2;
      color: #999;
    }
  }
</style>
