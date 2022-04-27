import type { VNode, FunctionalComponent } from "vue";

import { h } from "vue";
import { isString } from "@casta-fe-playground/utils";
import Icon  from "@casta-fe-playground/components/icon";

export interface ComponentProps {
  icon: VNode | string;
}

export const TreeIcon: FunctionalComponent = ({ icon }: ComponentProps) => {
  if (!icon) return null;
  if (isString(icon)) {
    return h(Icon, { icon, class: "mr-1" });
  }
  return Icon;
};
