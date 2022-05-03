import { Ref } from "vue";
import { useScrollTo } from "@casta-fe-playground/hooks/src/event/useScrollTo";

export const useScrollToCenter = (
  scrollRef: Ref<ElRef | ComponentElRef>,
  opt: {
    duration?: number;
    callback?: Fn;
    direction?: "scrollTop" | "scrollLeft";
  } = {}
) => {
  let currentStopFn: Nullable<Fn>;
  const scrollToCenter = <T extends HTMLElement = HTMLButtonElement>(buttonEl: T) => {
    currentStopFn?.();
    const buttonGroupEl = ((scrollRef.value as ComponentElRef)?.$el ?? scrollRef.value) as any;

    // undefined || null
    if (undefined == buttonGroupEl) return;
    // const path = (e as unknown as { path: HTMLElement[] }).path;
    // const buttonEl =
    //   path[0].nodeName === "BUTTON"
    //     ? path[0]
    //     : path[1].nodeName === "BUTTON"
    //     ? path[1]
    //     : path.filter((el) => el.nodeName === "BUTTON")[0];

    if (undefined === buttonEl) return;
    const to = buttonEl.offsetLeft - (buttonGroupEl.clientWidth - buttonEl.offsetWidth) / 2;

    const { start, stop } = useScrollTo({
      el: buttonGroupEl,
      to,
      direction: "scrollLeft",
      duration: 300,
      ...opt
    });
    start();
    currentStopFn = stop;
  };

  return { scrollToCenter };
};
