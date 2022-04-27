import { Modal } from "ant-design-vue";
import { defineComponent, toRefs, unref } from "vue";
import { useModalDragMove } from "../hooks/useModalDrag";
import { basicProps } from "../props";
import { useAttrs } from "@casta-fe-playground/hooks";
import { extendSlots } from "@casta-fe-playground/utils";

export default defineComponent({
  /* eslint-disable-next-line */
  name: "Modal",
  inheritAttrs: false,
  props: basicProps,
  emits: ["cancel"],
  setup(props, { slots, emit }) {
    const { visible, draggable, destroyOnClose } = toRefs(props);
    const attrs = useAttrs();
    useModalDragMove({
      visible,
      destroyOnClose,
      draggable
    });

    const handleCancel = (e: Event) => {
      emit("cancel", e);
    };

    return () => {
      const propsData = { ...unref(attrs), ...props } as Recordable;
      return (
        <Modal {...propsData} onCancel={handleCancel}>
          {extendSlots(slots)}
        </Modal>
      );
    };
  }
});
