import { onUnmounted, getCurrentInstance } from "vue";
import { createContextMenu, destroyContextMenu } from "@casta-fe-playground/components/ContextMenu";
import type { ContextMenuItem } from "@casta-fe-playground/components/ContextMenu";
export type { ContextMenuItem };
export function useContextMenu(authRemove = true) {
  if (getCurrentInstance() && authRemove) {
    onUnmounted(() => {
      destroyContextMenu();
    });
  }
  return [createContextMenu, destroyContextMenu];
}
