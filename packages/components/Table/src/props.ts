import type { PropType } from "vue";
import { DEFAULT_FILTER_FN, DEFAULT_SIZE, DEFAULT_SORT_FN, FETCH_SETTING } from "./const";
import type { PaginationProps } from "./types/pagination";
import type {
  BasicColumn,
  FetchSetting,
  SizeType,
  SorterResult,
  TableCustomRecord,
  TableRowSelection,
  TableSetting
} from "./types/table";
import type { FormProps } from "@casta-fe-playground/components/Form";
import { FormSchema } from "@casta-fe-playground/components/Form";
import { propTypes } from "@casta-fe-playground/utils";

export interface FilterForms {
  inputForm?: Omit<FormSchema, "label" | "component"> | FormSchema;
  pannelForm?: FormSchema[];
}

interface useAction {
  ifShow?: boolean;
  handleBeforeAction?: () => void;
  handleAction?: () => void;
  handleAfterAction?: () => void;
}

interface PermissionButton {
  add: string;
  delete: string;
  import: string;
  export: string;
  refresh: string;
}

export const basicProps = {
  clickToRowSelect: propTypes.bool.def(true),
  isTreeTable: propTypes.bool.def(false),
  tableSetting: propTypes.shape<TableSetting>({}),
  inset: propTypes.bool,
  sortFn: {
    type: Function as PropType<(sortInfo: SorterResult) => any>,
    default: DEFAULT_SORT_FN
  },
  filterFn: {
    type: Function as PropType<(data: Partial<Recordable<string[]>>) => any>,
    default: DEFAULT_FILTER_FN
  },
  showTableSetting: propTypes.bool,
  autoCreateKey: propTypes.bool.def(true),
  striped: propTypes.bool.def(false),
  showSummary: propTypes.bool,
  summaryFunc: {
    type: [Function, Array] as PropType<(...arg: any[]) => any[]>,
    default: null
  },
  summaryData: {
    type: Array as PropType<Recordable[]>,
    default: null
  },
  indentSize: propTypes.number.def(24),
  canColDrag: propTypes.bool.def(true),
  api: {
    type: Function as PropType<(...arg: any[]) => Promise<any>>,
    default: null
  },
  beforeFetch: {
    type: Function as PropType<Fn>,
    default: null
  },
  afterFetch: {
    type: Function as PropType<Fn>,
    default: null
  },
  handleSearchInfoFn: {
    type: Function as PropType<Fn>,
    default: null
  },
  fetchSetting: {
    type: Object as PropType<FetchSetting>,
    default: () => {
      return FETCH_SETTING;
    }
  },
  // ??????????????????
  immediate: propTypes.bool.def(true),
  emptyDataIsShowTable: propTypes.bool.def(true),
  // ?????????????????????
  searchInfo: {
    type: Object as PropType<Recordable>,
    default: null
  },
  // ?????????????????????
  defSort: {
    type: Object as PropType<Recordable>,
    default: null
  },
  // ??????????????????
  useSearchForm: propTypes.bool,
  // ????????????
  formConfig: {
    type: Object as PropType<Partial<FormProps>>,
    default: null
  },
  // ::==================== i7eo????????? ///// start ///// ====================:: //
  // ??????&??????????????????
  filter: {
    type: Object as PropType<FilterForms>,
    default: null
  },
  // ??????????????????????????????????????????????????????
  useAdd: {
    type: Object as PropType<useAction>,
    default() {
      return {
        ifShow: true
      };
    }
  },
  useDelete: {
    type: Object as PropType<useAction>,
    default() {
      return {
        ifShow: true
      };
    }
  },
  useImport: {
    type: Object as PropType<useAction>,
    default() {
      return {
        ifShow: true
      };
    }
  },
  useExport: {
    type: Object as PropType<useAction>,
    default() {
      return {
        ifShow: true
      };
    }
  },
  useRefresh: {
    type: Object as PropType<useAction>,
    default() {
      return {
        ifShow: true
      };
    }
  },
  // ::==================== i7eo????????? ///// end  ///// ====================:: //
  columns: {
    type: [Array] as PropType<BasicColumn[]>,
    default: () => []
  },
  showIndexColumn: propTypes.bool.def(false),
  indexColumnProps: {
    type: Object as PropType<BasicColumn>,
    default: null
  },
  actionColumn: {
    type: Object as PropType<BasicColumn>,
    default: null
  },
  ellipsis: propTypes.bool.def(true),
  canResize: propTypes.bool.def(true),
  clearSelectOnPageChange: propTypes.bool,
  resizeHeightOffset: propTypes.number.def(0),
  rowSelection: {
    type: Object as PropType<TableRowSelection | null>,
    default: null
  },
  title: {
    type: [String, Function] as PropType<string | ((data: Recordable) => string)>,
    default: null
  },
  titleHelpMessage: {
    type: [String, Array] as PropType<string | string[]>
  },
  maxHeight: propTypes.number,
  fullHeight: {
    type: Boolean,
    default: true
  },
  dataSource: {
    type: Array as PropType<Recordable[]>,
    default: null
  },
  rowKey: {
    type: [String, Function] as PropType<string | ((record: Recordable) => string)>,
    default: ""
  },
  bordered: propTypes.bool,
  pagination: {
    type: [Object, Boolean] as PropType<PaginationProps | boolean>,
    default: null
  },
  paginationControl: {
    type: String as PropType<"backend" | "frontend">,
    default: "backend"
  },
  loading: propTypes.bool,
  masking: propTypes.bool,
  rowClassName: {
    type: Function as PropType<(record: TableCustomRecord<any>, index: number) => string>
  },
  scroll: {
    type: Object as PropType<{ x: number | true; y: number }>,
    default: null
  },
  beforeEditSubmit: {
    type: Function as PropType<
      (data: {
        record: Recordable;
        index: number;
        key: string | number;
        value: any;
      }) => Promise<any>
    >
  },
  size: {
    type: String as PropType<SizeType>,
    default: DEFAULT_SIZE
  },
  // ??????code
  permission: {
    type: Object as PropType<Partial<PermissionButton>>,
    default() {
      return {
        add: undefined,
        delete: undefined,
        import: undefined,
        export: undefined,
        refresh: undefined
      };
    }
  }
};
