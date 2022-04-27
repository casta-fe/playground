import basicTable from "./src/BasicTable.vue";
import editTableHeaderIcon from "./src/components/EditTableHeaderIcon.vue";
import tableAction from "./src/components/TableAction.vue";
import tableImg from "./src/components/TableImg.vue";
import { ROW_KEY } from "./src/const";
import { withInstall } from "@casta-fe-playground/utils";

export const DEFAULT_ROW_KEY = ROW_KEY;
export type { EditRecordRow } from "./src/components/editable";
export { useTable } from "./src/hooks/useTable";
export * from "./src/types/pagination";
export * from "./src/types/table";
export * from "./src/types/tableAction";
// export type { FormProps, FormSchema } from "/@/components/Form/src/types/form";

export const BasicTable = withInstall(basicTable);
export const EditTableHeaderIcon = withInstall(editTableHeaderIcon);
export const TableAction = withInstall(tableAction);
export const TableImg = withInstall(tableImg);
