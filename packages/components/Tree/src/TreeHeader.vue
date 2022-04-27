<template>
  <div class="flex px-2 py-1.5 items-center basic-tree-header">
    <slot name="headerTitle" v-if="$slots.headerTitle"></slot>
    <BasicTitle :helpMessage="helpMessage" v-if="!$slots.headerTitle && title">
      {{ title }}
    </BasicTitle>
    <div
      class="flex flex-1 justify-self-stretch items-center cursor-pointer"
      v-if="search || toolbar"
    >
      <div :class="getInputSearchCls" v-if="search">
        <InputSearch
          placeholder="搜索"
          size="small"
          allowClear
          v-model:value="searchValue"
        />
      </div>
      <Dropdown @click.prevent v-if="toolbar">
        <Icon icon="ion:ellipsis-vertical" />
        <template #overlay>
          <Menu @click="handleMenuClick">
            <template v-for="item in toolbarList" :key="item.value">
              <MenuItem v-bind="{ key: item.value }">
                {{ item.label }}
              </MenuItem>
              <MenuDivider v-if="item.divider" />
            </template>
          </Menu>
        </template>
      </Dropdown>
    </div>
  </div>
</template>
<script lang="ts">
  import { PropType } from "vue";
  import { defineComponent, computed, ref, watch } from "vue";

  import { Dropdown, Menu, Input } from "ant-design-vue";
  import { Icon } from "@casta-fe-playground/components";
  import { BasicTitle } from "@casta-fe-playground/components/Basic";

  import { propTypes } from "@casta-fe-playground/utils";

  import { useDebounceFn } from "@vueuse/core";

  enum ToolbarEnum {
    SELECT_ALL,
    UN_SELECT_ALL,
    EXPAND_ALL,
    UN_EXPAND_ALL,
    CHECK_STRICTLY,
    CHECK_UN_STRICTLY
  }

  interface MenuInfo {
    key: ToolbarEnum;
  }
  export default defineComponent({
    name: "BasicTreeHeader",
    components: {
      BasicTitle,
      Icon,
      Dropdown,
      Menu,
      MenuItem: Menu.Item,
      MenuDivider: Menu.Divider,
      InputSearch: Input.Search
    },
    props: {
      helpMessage: {
        type: [String, Array] as PropType<string | string[]>,
        default: ""
      },
      title: propTypes.string,
      toolbar: propTypes.bool,
      checkable: propTypes.bool,
      search: propTypes.bool,
      checkAll: propTypes.func,
      expandAll: propTypes.func,
      searchText: propTypes.string
    },
    emits: ["strictly-change", "search"],
    setup(props, { emit, slots }) {
      const searchValue = ref("");

      const getInputSearchCls = computed(() => {
        const titleExists = slots.headerTitle || props.title;
        return [
          "mr-1",
          "w-full",
          // titleExists ? 'w-2/3' : 'w-full',
          {
            ["ml-5"]: titleExists
          }
        ];
      });

      const toolbarList = computed(() => {
        const { checkable } = props;
        const defaultToolbarList = [
          { label: "展开全部", value: ToolbarEnum.EXPAND_ALL },
          {
            label: "折叠全部",
            value: ToolbarEnum.UN_EXPAND_ALL,
            divider: checkable
          }
        ];

        return checkable
          ? [
              { label: "选择全部", value: ToolbarEnum.SELECT_ALL },
              {
                label: "取消选择",
                value: ToolbarEnum.UN_SELECT_ALL,
                divider: checkable
              },
              ...defaultToolbarList,
              { label: "层级关联", value: ToolbarEnum.CHECK_STRICTLY },
              { label: "层级独立", value: ToolbarEnum.CHECK_UN_STRICTLY }
            ]
          : defaultToolbarList;
      });

      function handleMenuClick(e: MenuInfo) {
        const { key } = e;
        switch (key) {
          case ToolbarEnum.SELECT_ALL:
            props.checkAll?.(true);
            break;
          case ToolbarEnum.UN_SELECT_ALL:
            props.checkAll?.(false);
            break;
          case ToolbarEnum.EXPAND_ALL:
            props.expandAll?.(true);
            break;
          case ToolbarEnum.UN_EXPAND_ALL:
            props.expandAll?.(false);
            break;
          case ToolbarEnum.CHECK_STRICTLY:
            emit("strictly-change", false);
            break;
          case ToolbarEnum.CHECK_UN_STRICTLY:
            emit("strictly-change", true);
            break;
        }
      }

      function emitChange(value?: string): void {
        emit("search", value);
      }
      const debounceEmitChange = useDebounceFn(emitChange, 200);

      watch(
        () => searchValue.value,
        (v) => {
          debounceEmitChange(v);
        }
      );
      watch(
        () => props.searchText,
        (v) => {
          if (v !== searchValue.value) {
            searchValue.value = v;
          }
        }
      );
      // function handleSearch(e: ChangeEvent): void {
      //   debounceEmitChange(e.target.value);
      // }

      return { toolbarList, handleMenuClick, searchValue, getInputSearchCls };
    }
  });
</script>
<style lang="less" scoped>
  @import "../../../theme-chalk/src/var";
  .basic-tree-header {
    border-bottom: 1px solid @border-color-base;
  }
</style>
