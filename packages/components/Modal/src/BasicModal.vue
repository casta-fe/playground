<template>
  <Modal v-bind="getBindValue" @cancel="handleCancel">
    <template #closeIcon v-if="!$slots.closeIcon">
      <ModalClose
        :canFullscreen="getProps.canFullscreen"
        :fullScreen="fullScreenRef"
        @cancel="handleCancel"
        @fullscreen="handleFullScreen"
      />
    </template>

    <template #title v-if="!$slots.title">
      <ModalHeader
        :helpMessage="getProps.helpMessage"
        :title="getMergeProps.title"
        @dblclick="handleTitleDbClick"
      />
    </template>

    <template #footer v-if="!$slots.footer">
      <ModalFooter v-bind="getBindValue" @ok="handleOk" @cancel="handleCancel">
        <template #[item]="data" v-for="item in Object.keys($slots)">
          <slot :name="item" v-bind="data || {}"></slot>
        </template>
      </ModalFooter>
    </template>

    <ModalWrapper
      :useWrapper="getProps.useWrapper"
      :footerOffset="wrapperFooterOffset"
      :fullScreen="fullScreenRef"
      ref="modalWrapperRef"
      :loading="getProps.loading"
      :loading-tip="getProps.loadingTip"
      :minHeight="getProps.minHeight"
      :height="getWrapperHeight"
      :visible="visibleRef"
      :modalFooterHeight="footer !== undefined && !footer ? 0 : undefined"
      v-bind="omit(getProps.wrapperProps, 'visible', 'height', 'modalFooterHeight')"
      @ext-height="handleExtHeight"
      @height-change="handleHeightChange"
    >
      <slot></slot>
    </ModalWrapper>

    <template #[item]="data" v-for="item in Object.keys(omit($slots, 'default'))">
      <slot :name="item" v-bind="data || {}"></slot>
    </template>
  </Modal>
</template>
<script lang="ts">
  import type { ModalProps, ModalMethods } from "./typing";

  import {
    defineComponent,
    computed,
    ref,
    watch,
    unref,
    watchEffect,
    toRef,
    getCurrentInstance,
    nextTick
  } from "vue";
  import Modal from "./components/Modal";
  import ModalWrapper from "./components/ModalWrapper.vue";
  import ModalClose from "./components/ModalClose.vue";
  import ModalFooter from "./components/ModalFooter.vue";
  import ModalHeader from "./components/ModalHeader.vue";
  import { isFunction } from "@casta-fe-playground/utils";
  import { deepMerge } from "@casta-fe-playground/utils";
  import { basicProps } from "./props";
  import { useFullScreen } from "./hooks/useModalFullScreen";
  import { omit } from "lodash-es";

  export default defineComponent({
    name: "BasicModal",
    components: { Modal, ModalWrapper, ModalClose, ModalFooter, ModalHeader },
    inheritAttrs: false,
    props: basicProps,
    emits: ["visible-change", "height-change", "cancel", "ok", "register", "update:visible"],
    setup(props, { emit, attrs }) {
      const visibleRef = ref(false);
      const propsRef = ref<Partial<ModalProps> | null>(null);
      const modalWrapperRef = ref<any>(null);
      const prefixCls = "ta-basic-modal";

      // modal   Bottom and top height
      const extHeightRef = ref(0);
      const modalMethods: ModalMethods = {
        setModalProps,
        emitVisible: undefined,
        redoModalHeight: () => {
          nextTick(() => {
            if (unref(modalWrapperRef)) {
              (unref(modalWrapperRef) as any).setModalHeight();
            }
          });
        }
      };

      const instance = getCurrentInstance();
      if (instance) {
        emit("register", modalMethods, instance.uid);
      }

      // Custom title component: get title
      const getMergeProps = computed((): Recordable => {
        return {
          ...props,
          ...(unref(propsRef) as any)
        };
      });

      const { handleFullScreen, getWrapClassName, fullScreenRef } = useFullScreen({
        modalWrapperRef,
        extHeightRef,
        // wrapClassName: toRef(getMergeProps.value, "wrapClassName")
        wrapClassName: toRef(props, "wrapClassName")
      });

      // modal component does not need title and origin buttons
      const getProps = computed((): Recordable => {
        const opt = {
          ...unref(getMergeProps),
          visible: unref(visibleRef),
          okButtonProps: undefined,
          cancelButtonProps: undefined,
          title: undefined
        };
        return {
          ...opt,
          wrapClassName: unref(getWrapClassName)
        };
      });

      const getBindValue = computed((): Recordable => {
        const attr = {
          ...attrs,
          ...unref(getMergeProps),
          visible: unref(visibleRef),
          wrapClassName: `${unref(getWrapClassName)} ta-basic-modal i7eo`
        };
        if (unref(fullScreenRef)) {
          return omit(attr, ["height", "title"]);
        }
        return omit(attr, "title");
      });

      const getWrapperHeight = computed(() => {
        if (unref(fullScreenRef)) return undefined;
        return unref(getProps).height;
      });

      watchEffect(() => {
        visibleRef.value = !!props.visible;
        fullScreenRef.value = !!props.defaultFullscreen;
      });

      watch(
        () => unref(visibleRef),
        (v) => {
          emit("visible-change", v);
          emit("update:visible", v);
          instance && modalMethods.emitVisible?.(v, instance.uid);
          nextTick(() => {
            if (props.scrollTop && v && unref(modalWrapperRef)) {
              (unref(modalWrapperRef) as any).scrollTop();
            }
          });
        },
        {
          immediate: false
        }
      );

      // 取消事件
      async function handleCancel(e: Event) {
        e?.stopPropagation();
        // 过滤自定义关闭按钮的空白区域
        if ((e.target as HTMLElement)?.classList?.contains(prefixCls + "-close--custom")) return;
        if (props.closeFunc && isFunction(props.closeFunc)) {
          const isClose: boolean = await props.closeFunc();
          visibleRef.value = !isClose;
          return;
        }

        visibleRef.value = false;
        emit("cancel", e);
      }

      /**
       * @description: 设置modal参数
       */
      function setModalProps(props: Partial<ModalProps>): void {
        // Keep the last setModalProps
        propsRef.value = deepMerge(unref(propsRef) || ({} as any), props);
        if (Reflect.has(props, "visible")) {
          visibleRef.value = !!props.visible;
        }
        if (Reflect.has(props, "defaultFullscreen")) {
          fullScreenRef.value = !!props.defaultFullscreen;
        }
      }

      function handleOk(e: Event) {
        emit("ok", e);
      }

      function handleHeightChange(height: string) {
        emit("height-change", height);
      }

      function handleExtHeight(height: number) {
        extHeightRef.value = height;
      }

      function handleTitleDbClick(e) {
        if (!props.canFullscreen) return;
        e.stopPropagation();
        handleFullScreen(e);
      }

      return {
        handleCancel,
        getBindValue,
        getProps,
        handleFullScreen,
        fullScreenRef,
        getMergeProps,
        handleOk,
        visibleRef,
        omit,
        modalWrapperRef,
        handleExtHeight,
        handleHeightChange,
        handleTitleDbClick,
        getWrapperHeight
      };
    }
  });
</script>
<style lang="less">
  @import "../../../theme-chalk/src/var";
.fullscreen-modal {
  overflow: hidden;

  .ant-modal {
    top: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    left: 0 !important;
    width: 100% !important;
    height: 100%;

    &-content {
      height: 100%;
    }
  }
}

.ant-modal {
  width: 650px;
  padding-bottom: 0;

  .ant-modal-body > .scrollbar {
    // padding: 14px;
    padding: 16px 24px;
  }

  &-title {
    font-size: 16px;
    font-weight: bold;
    line-height: 16px;

    .ta-basic-title {
      // cursor: move !important;
      padding-left: 0 !important;
    }
  }

  .ant-modal-body {
    padding: 0;

    > .scrollbar > .scrollbar__bar.is-horizontal {
      display: none;
    }
  }

  &-large {
    top: 60px;

    &--mini {
      top: 16px;
    }
  }

  &-header {
    padding: 16px;
  }

  &-content {
    box-shadow: 0 4px 8px 0 rgb(0 0 0 / 20%), 0 6px 20px 0 rgb(0 0 0 / 19%);
  }

  &-footer {
    button + button {
      margin-left: 10px;
    }
  }

  &-close {
    font-weight: normal;
    outline: none;
  }

  &-close-x {
    display: inline-block;
    width: 96px;
    height: 56px;
    line-height: 56px;
  }

  &-confirm-body {
    .ant-modal-confirm-content {
      // color: #fff;

      > * {
        color: @text-color-help-dark;
      }
    }
  }

  &-confirm-confirm.error .ant-modal-confirm-body > .anticon {
    color: @error-color;
  }

  &-confirm-btns {
    .ant-btn:last-child {
      margin-right: 0;
    }
  }

  &-confirm-info {
    .ant-modal-confirm-body > .anticon {
      color: @warning-color;
    }
  }

  &-confirm-confirm.success {
    .ant-modal-confirm-body > .anticon {
      color: @success-color;
    }
  }
}

.ant-modal-confirm .ant-modal-body {
  padding: 24px !important;
}
@media screen and (max-height: 600px) {
  .ant-modal {
    top: 60px;
  }
}
@media screen and (max-height: 540px) {
  .ant-modal {
    top: 30px;
  }
}
@media screen and (max-height: 480px) {
  .ant-modal {
    top: 10px;
  }
}

</style>