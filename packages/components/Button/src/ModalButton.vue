<template>
  <div v-if="isInDropDown" class="dropdown-modal-button" @click="handleButtonClick">
    <slot></slot>
  </div>
  <Button
    v-else
    :type="getBindValues.type"
    :size="getBindValues.size"
    class="modal-button"
    @click="handleButtonClick"
  >
    <slot></slot>
  </Button>
</template>

<script lang="ts">
  import { ExclamationCircleOutlined } from "@ant-design/icons-vue";
  import { Modal } from "ant-design-vue";
  import { computed, defineComponent, h, unref } from "vue";
  import Button from "./BasicButton.vue";
  import Icon from "/@/components/Icon/src/Icon.vue";
  import { useAttrs } from "/@/hooks/core/useAttrs";

  const props = {
    isInDropDown: {
      type: Boolean,
      default: false
    }
  };

  export default defineComponent({
    name: "ModalButton",
    components: { Button },
    inheritAttrs: false,
    props,
    setup(props, { slots }) {
      const attrs = useAttrs();

      // get inherit binding value
      const getBindValues: Recordable = computed(() => {
        return Object.assign(
          {
            okText: "确认",
            cancelText: "取消"
          },
          {
            ...props,
            ...unref(attrs)
          }
        );
      });

      const handleButtonClick = () => {
        const _getBindValues = unref(getBindValues);

        if (_getBindValues.onClick) {
          _getBindValues.onClick();
        } else {
          const confirmProps = {
            class: "modal-button-confirm",
            icon: h(ExclamationCircleOutlined),
            ..._getBindValues.popConfirm
          };
          if (_getBindValues.icon)
            confirmProps["icon"] = h(Icon, { icon: unref(getBindValues).icon });

          if (_getBindValues.popConfirm && _getBindValues.popConfirm.confirm)
            confirmProps["onOk"] = _getBindValues.popConfirm.confirm;

          if (_getBindValues.popConfirm && _getBindValues.popConfirm.cancel)
            confirmProps["onCancel"] = _getBindValues.popConfirm.cancel;

          Modal.confirm(confirmProps);
        }
      };

      return {
        getBindValues,
        handleButtonClick
      };
    }
  });
</script>

<style lang="less">
  .modal-button-confirm.ant-modal-confirm {
    .ant-modal-confirm-btns {
      display: flex;
      flex-direction: row-reverse;
      float: none;

      .ant-btn {
        margin-left: 8px;
      }
    }
  }

  .dropdown-modal-button {
    padding: 0 !important;
    min-width: auto !important;
  }
</style>
