<template>
  <div
    ref="tableActionElRef"
    :class="[prefixCls, getAlign]"
    @click="onCellClick"
    style="position: relative"
  >
    <template v-for="(action, index) in getActions" :key="`${index}-${action.label}`">
      <Tooltip v-if="action.tooltip" v-bind="getTooltip(action.tooltip)">
        <PopConfirmButton v-bind="action" @visibleChange="handlePopConfirmVisible">
          <Icon :icon="action.icon" :class="{ 'mr-1': !!action.label }" v-if="action.icon" />
          <template v-if="action.label">{{ action.label }}</template>
        </PopConfirmButton>
      </Tooltip>
      <PopConfirmButton v-else v-bind="action" @visibleChange="handlePopConfirmVisible">
        <Icon :icon="action.icon" :class="{ 'mr-1': !!action.label }" v-if="action.icon" />
        <template v-if="action.label">{{ action.label }}</template>
      </PopConfirmButton>
      <Divider
        type="vertical"
        class="action-divider"
        v-if="divider && index < getActions.length - 1"
      />
    </template>
    <Dropdown
      v-model:visible="dropDownVisible"
      :trigger="['hover']"
      :dropMenuList="getDropdownList"
      :getPopupContainer="() => getDropDrownPopupContainer"
      placement="bottomCenter"
      popconfirm
      v-if="DropdownActions.length || (dropDownActions && getDropdownList.length > 0)"
      @visibleChange="handlePopConfirmVisible"
      @menuItemPopConfirmVisible="handleMenuItemPopConfirmVisible"
    >
      <slot name="more"></slot>
      <a-button type="link" size="small" v-if="!$slots.more">
        <MoreOutlined class="icon-more" />
      </a-button>
    </Dropdown>
  </div>
</template>
<script lang="ts">
  import { MoreOutlined } from "@ant-design/icons-vue";
  import { Divider, Tooltip, TooltipProps } from "ant-design-vue";
  import { computed, defineComponent, nextTick, PropType, ref, toRaw, unref } from "vue";
  import { ACTION_COLUMN_FLAG } from "../const";
  import { useTableContext } from "../hooks/useTableContext";
  import { PopConfirmButton } from "@casta-fe-playground/components/Button";
  import { Dropdown } from "@casta-fe-playground/components/Dropdown";
  import Icon from "@casta-fe-playground/components/Icon";
  import { ActionItem, TableActionType } from "@casta-fe-playground/components/Table";
  import { MAX_ACTION_NUMBER } from "@casta-fe-playground/components/Table/src/const";
  // import { usePermission } from "@casta-fe-playground/hooks";
  import { isBoolean, isFunction, isString, propTypes } from "@casta-fe-playground/utils";

  export default defineComponent({
    name: "TableAction",
    components: { Icon, PopConfirmButton, Divider, Dropdown, MoreOutlined, Tooltip },
    props: {
      actions: {
        type: Array as PropType<ActionItem[]>,
        default: null
      },
      dropDownActions: {
        type: Array as PropType<ActionItem[]>,
        default: null
      },
      divider: propTypes.bool.def(true),
      outside: propTypes.bool,
      stopButtonPropagation: propTypes.bool.def(true)
    },
    setup(props) {
      const prefixCls = "ta-basic-table-action";
      let table: Partial<TableActionType> = {};
      if (!props.outside) {
        table = useTableContext();
      }

      const tableActionElRef = ref<HTMLElement | null>(null);
      const dropDownVisible = ref<boolean>(false);
      const isDropDownMenuItemClick = ref<boolean>(false);
      const getPopupContainer = computed(
        () => unref(tableActionElRef) ?? unref((table as any)?.wrapRef.value) ?? document.body
      );
      const getDropDrownPopupContainer = computed(
        () =>
          unref(tableActionElRef)?.querySelector(".ant-dropdown-trigger") ??
          unref((table as any)?.wrapRef.value) ??
          document.body
      );
      // hack 处理popconfirm
      async function handlePopConfirmPos(visible) {
        await nextTick();
        const target = unref(tableActionElRef)?.parentElement;
        if (target) {
          if (visible) {
            target.style.zIndex = "1030";
          } else {
            target.style.zIndex = "1";
          }
        }
      }

      async function handlePopConfirmVisible(visible) {
        if (isDropDownMenuItemClick.value) {
          dropDownVisible.value = false;
        } else {
          dropDownVisible.value = visible;
        }
        await handlePopConfirmPos(visible);
        isDropDownMenuItemClick.value = false;
      }

      async function handleMenuItemPopConfirmVisible(visible) {
        dropDownVisible.value = false;
        isDropDownMenuItemClick.value = true;
      }

      async function handleMenuEvent(e) {
        await handlePopConfirmPos(false);
      }

      function isIfShow(action: ActionItem): boolean {
        const ifShow = action.ifShow;

        let isIfShow = true;

        if (isBoolean(ifShow)) {
          isIfShow = ifShow;
        }
        if (isFunction(ifShow)) {
          isIfShow = ifShow(action);
        }
        return isIfShow;
      }

      const ActionNumber = MAX_ACTION_NUMBER;
      let restActions: ActionItem[] = [];
      const Actions = computed(() => {
        let actions = toRaw(props.actions) || [];
        actions = actions.filter((action) => isIfShow(action));
        if (actions.length <= ActionNumber) {
          return actions;
        } else {
          const _actions = actions.slice(0, ActionNumber);
          restActions = actions.slice(ActionNumber);
          return _actions;
        }
      });
      const DropdownActions = computed(() => {
        // const actions = toRaw(props.dropDownActions) || []
        const actions = [...restActions, ...(toRaw(props.dropDownActions) || [])];
        return actions;
      });

      // const { hasPermission, getPermissions } = usePermission();
      // const Permissions = getPermissions();
      const getActions = computed(() => {
        return (
          Actions.value
            // .filter((action) => {
            //   return hasPermission(action.auth) && isIfShow(action);
            // })
            .filter((action) => {
              // 先判断 permission 是否有值，无值走正常的逻辑；有值判断 resourcemap中是否存在不存在走正常逻辑，存在就取值
              // return action.permission
              //   ? unref(Permissions)[action.permission]?.ifShow ?? isIfShow(action)
              //   : isIfShow(action);
              return isIfShow(action)
            })
            .map((action) => {
              const { popConfirm } = action;
              return {
                getPopupContainer: () => getPopupContainer.value,
                type: "link",
                size: "small",
                ...action,
                ...({ ...popConfirm, placement: "bottomRight" } || {}),
                onConfirm: popConfirm?.confirm,
                onCancel: popConfirm?.cancel,
                enable: !!popConfirm
              };
            })
        );
      });

      const getDropdownList = computed(() => {
        return (
          DropdownActions.value
            // .filter(action => hasPermission(action.auth) && isIfShow(action))
            .filter((action) => {
              // 先判断 permission 是否有值，无值走正常的逻辑；有值判断 resourcemap中是否存在不存在走正常逻辑，存在就取值
              // return action.permission
              //   ? unref(Permissions)[action.permission]?.ifShow ?? isIfShow(action)
              //   : isIfShow(action);
              return isIfShow(action)
            })
            .map((action, index, list) => {
              const { label, popConfirm } = action;
              return {
                getPopupContainer: () => getDropDrownPopupContainer.value,
                ...action,
                ...({ ...popConfirm, placement: "bottomRight" } || {}),
                onConfirm: popConfirm?.confirm,
                onCancel: popConfirm?.cancel,
                text: label,
                divider: index < list.length - 1 ? props.divider : false
              };
            })
        );

        // const list = DropdownActions.value.filter((action) => {
        //   return hasPermission(action.auth) && isIfShow(action);
        // });
        // // console.log(unref(tableActionElRef));
        // return list.map((action, index) => {
        //   const { label, popConfirm } = action;
        //   return {
        //     getPopupContainer: () => getDropDrownPopupContainer.value,
        //     ...action,
        //     ...({ ...popConfirm, placement: "bottom" } || {}),
        //     onConfirm: popConfirm?.confirm,
        //     onCancel: popConfirm?.cancel,
        //     text: label,
        //     divider: index < list.length - 1 ? props.divider : false
        //   };
        // });
      });

      const getAlign = computed(() => {
        const columns = (table as TableActionType)?.getColumns?.() || [];
        const actionColumn = columns.find((item) => item.flag === ACTION_COLUMN_FLAG);
        return actionColumn?.align ?? "left";
      });

      function getTooltip(data: string | TooltipProps): TooltipProps {
        return {
          getPopupContainer: () => unref((table as any)?.wrapRef.value) ?? document.body,
          placement: "bottom",
          ...(isString(data) ? { title: data } : data)
        };
      }

      async function onCellClick(e: MouseEvent) {
        if (!props.stopButtonPropagation) return;
        const path = e.composedPath() as HTMLElement[];
        const isInButton = path.find((ele) => {
          return ele.tagName?.toUpperCase() === "BUTTON";
        });
        isInButton && e.stopPropagation();
      }

      return {
        prefixCls,
        tableActionElRef,
        dropDownVisible,
        getPopupContainer,
        getDropDrownPopupContainer,
        handlePopConfirmVisible,
        handleMenuEvent,
        handleMenuItemPopConfirmVisible,
        getActions,
        getDropdownList,
        getAlign,
        onCellClick,
        getTooltip,
        DropdownActions
      };
    }
  });
</script>
<style lang="less">
  @import "../../index.less";
  @prefix-cls: ~"@{namespace}-basic-table-action";

  .@{prefix-cls} {
    display: flex;
    align-items: center;

    .action-divider {
      display: table;
    }

    .ant-popover {
      top: 30px !important;

      .ant-popover-arrow {
        // bottom: auto !important;
        // top: 6px !important;
        display: none !important;
      }
    }

    .ant-dropdown-trigger {
      margin-left: 10px;
    }

    &.left {
      justify-content: flex-start;
    }

    &.center {
      justify-content: center;
    }

    &.right {
      justify-content: flex-end;
    }

    button:not(.ant-popover-buttons button) {
      display: flex;
      align-items: center;

      padding-left: 0 !important;
      padding-right: 0 !important;
      font-size: 12px;

      span {
        margin-left: 0 !important;
      }
    }

    button.ant-btn-circle {
      span {
        margin: auto !important;
      }
    }

    .ant-divider,
    .ant-divider-vertical {
      margin: 0 10px;
    }

    .icon-more {
      transform: rotate(90deg);

      svg {
        font-size: 1.1em;
        font-weight: 700;
      }
    }
  }
</style>
