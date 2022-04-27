import basicForm from "./src/Form.vue";
import apiSelect from "./src/components/ApiSelect.vue";
import radioButtonGroup from "./src/components/RadioButtonGroup.vue";
import apiTreeSelect from "./src/components/ApiTreeSelect.vue";
import apiRadioGroup from "./src/components/ApiRadioGroup.vue";
import apiCascader from "./src/components/ApiCascader.vue";
import { withInstall } from '@casta-fe-playground/utils'

export * from "./src/types/form";
export * from "./src/types/formItem";

export { useComponentRegister } from "./src/hooks/useComponentRegister";
export { useForm } from "./src/hooks/useForm";
export const BasicForm = withInstall(basicForm)
export const ApiSelect = withInstall(apiSelect)
export const RadioButtonGroup = withInstall(radioButtonGroup)
export const ApiTreeSelect = withInstall(apiTreeSelect)
export const ApiRadioGroup = withInstall(apiRadioGroup)
export const ApiCascader = withInstall(apiCascader)
