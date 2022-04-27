<template>
  <div class="ta-fixed-menu">
    <Menu
      mode="inline"
      :inline-collapsed="collapsed"
      v-model:selectedKeys="selectedKeys"
      @click="handleFixedMenuClick"
    >
      <MenuItem v-for="option in options" :key="option.key">
        <template #icon>
          <Icon :icon="option.icon" :color="option.iconColor" />
        </template>
        <span>{{ option.text }}</span>
      </MenuItem>
    </Menu>
  </div>
</template>

<script lang="ts">
  import { Menu, MenuItem } from "ant-design-vue";
  import type { PropType } from "vue";
  import { defineComponent, reactive, toRefs, watch, unref } from "vue";
  import { Icon } from "@casta-fe-playground/components/Icon";

  const props = {
    active: {
      type: String,
      default: ""
    },
    options: {
      type: Object as PropType<
        {
          key: string;
          icon: string;
          iconColor: string;
          text: string;
        }[]
      >
    }
  };

  export default defineComponent({
    name: "FixedMenu",
    components: {
      Menu,
      MenuItem,
      Icon
    },
    inheritAttrs: false,
    props,
    emits: ["select"],
    setup(props, { emit }) {
      const state = reactive({
        collapsed: true,
        selectedKeys: [] as string[]
      });

      const init = () => {
        const { active } = unref(props);
        state.selectedKeys = [...state.selectedKeys, active];
      };

      const deselect = () => {
        state.selectedKeys = [];
      };

      const handleFixedMenuClick = ({ key }) => {
        const isExist = state.selectedKeys.find((k) => key === k);
        if (isExist) {
          state.selectedKeys = state.selectedKeys.filter((k) => key !== k);
        } else {
          state.selectedKeys = [...state.selectedKeys, key];
          emit("select", key);
        }
      };

      watch(
        () => props.options,
        () => {
          init();
        },
        { immediate: true }
      );

      return {
        ...toRefs(state),
        handleFixedMenuClick,
        deselect
      };
    }
  });
</script>

<style lang="less">
  .ta-fixed-menu {
    position: fixed;
    right: 20px;
    bottom: 120px;
    border-radius: 10px;
    background-color: #fff;
    box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.1);
    z-index: 11;

    .ant-menu {
      width: 50px !important;
      border-radius: 10px;
    }
  }
</style>
