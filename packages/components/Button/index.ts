import { withInstall } from "@casta-fe-playground/utils";
import button from "./src/BasicButton.vue";
import popConfirmButton from "./src/PopConfirmButton.vue";
import modalButton from "./src/ModalButton.vue";
import groupButton from "./src/Group.vue";
import { ButtonProps } from "./src/props";

export const Button = withInstall(button);
export const PopConfirmButton = withInstall(popConfirmButton);
export const ModalButton = withInstall(modalButton);
export const GroupButton = withInstall(groupButton);
export {
  ButtonProps
}
