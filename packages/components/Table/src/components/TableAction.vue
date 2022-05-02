<template>
  <div :class="[prefixCls, getAlign]" @click="onCellClick">
    <template v-for="(action, index) in getActions" :key="`${index}-${action.label}`">
      <Tooltip v-if="action.tooltip" v-bind="getTooltip(action.tooltip)">
        <ModalButton v-bind="action">
          <Icon :icon="action.icon" :class="{ 'mr-1': !!action.label }" v-if="action.icon" />
          <template v-if="action.label">{{ action.label }}</template>
        </ModalButton>
        <!-- <PopConfirmButton v-bind="action">
          <Icon :icon="action.icon" :class="{ 'mr-1': !!action.label }" v-if="action.icon" />
          <template v-if="action.label">{{ action.label }}</template>
        </PopConfirmButton> -->
      </Tooltip>
      <!-- <PopConfirmButton v-else v-bind="action">
        <Icon :icon="action.icon" :class="{ 'mr-1': !!action.label }" v-if="action.icon" />
        <template v-if="action.label">{{ action.label }}</template>
      </PopConfirmButton> -->
      <ModalButton v-else v-bind="action">
        <Icon :icon="action.icon" :class="{ 'mr-1': !!action.label }" v-if="action.icon" />
        <template v-if="action.label">{{ action.label }}</template>
      </ModalButton>
      <Divider
        type="vertical"
        class="action-divider"
        v-if="divider && index < getActions.length - 1"
      />
    </template>
    <Dropdown
      :trigger="['hover']"
      :dropMenuList="getDropdownList"
      placement="bottomCenter"
      popconfirm
      v-if="DropdownActions.length || (dropDownActions && getDropdownList.length > 0)"
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
  import { Divider, Tooltip, TooltipProps, Button } from "ant-design-vue";
  import { computed, defineComponent, PropType, toRaw, unref } from "vue";
  import { ACTION_COLUMN_FLAG, MAX_ACTION_NUMBER } from "../const";
  import { useTableContext } from "../hooks/useTableContext";
  import { ModalButton, PopConfirmButton } from "@casta-fe-playground/components/Button";
  import { Dropdown } from "@casta-fe-playground/components/Dropdown";
  import Icon from "@casta-fe-playground/components/Icon";
  import { ActionItem, TableActionType } from "@casta-fe-playground/components/Table";
  // import { usePermission } from "@casta-fe-playground/hooks/web/usePermission";
  import { isBoolean, isFunction, propTypes, isString } from "@casta-fe-playground/utils";

  export default defineComponent({
    name: "TableAction",
    components: { Icon, PopConfirmButton, Divider, Dropdown, MoreOutlined, Tooltip, ModalButton, AButton: Button },
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

      let restActions: ActionItem[] = [];
      const Actions = computed(() => {
        let actions = toRaw(props.actions) || [];
        actions = actions.filter((action) => isIfShow(action));
        if (actions.length <= MAX_ACTION_NUMBER) {
          return actions;
        } else {
          const _actions = actions.slice(0, MAX_ACTION_NUMBER - 1);
          restActions = actions.slice(MAX_ACTION_NUMBER - 1);
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
              // return isNullOrUnDef(action.permission)
              //   ? isIfShow(action)
              //   : unref(Permissions)[action.permission]?.ifShow && isIfShow(action);
              return isIfShow(action)
            })
            .map((action) => {
              return {
                type: "link",
                size: "small",
                ...action
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
              return action.permission
                ? unref(Permissions)[action.permission]?.ifShow ?? isIfShow(action)
                : isIfShow(action);
            })
            .map((action, index, list) => {
              const { label, popConfirm } = action;
              return {
                type: "link",
                size: "small",
                ...action,
                // onConfirm: popConfirm?.confirm,
                // onCancel: popConfirm?.cancel,
                text: label,
                divider: index < list.length - 1 ? props.divider : false
              };
            })
        );
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
  @import "../../../../theme-chalk/src/var";
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

    button {
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
