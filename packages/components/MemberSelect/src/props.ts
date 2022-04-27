/*
 * @Author: huyb
 * @Descripttion: Think & Action
 * @Date: 2021-11-09 14:48:22
 */
import type { PropType } from "vue";
// import { API__SYSTEM_USER_LIST_ALL } from "/@/api/system/user";

type TypeItems = "user" | "org";
export default {
  // 选中的值
  value: {
    type: [String, Number, Array],
    default: null
  },
  options: {
    type: Array as PropType<LabelValueOptions>
  },
  autofocus: {
    type: Boolean,
    default: false
  },
  defaultOpen: {
    type: Boolean,
    default: false
  },
  // 弹窗标题
  title: {
    type: String,
    default: "成员选择"
  },
  // 类型，可用选项 user, org
  type: {
    type: String as PropType<TypeItems>,
    default: "user"
  },
  // 是否多选
  multiple: {
    type: Boolean,
    default: false
  },
  ignoreUser: {
    type: Array,
    default: []
  },
  // api: {
  //   type: Function as PropType<(...arg: any[]) => Promise<any>>,
  //   default: null
  // },

  // 请求用户列表的api，某些情况下不是使用所有用户,暂时不用
  userListApi: {
    type: Function as PropType<(...arg: any[]) => Promise<any>>,
    // default: API__SYSTEM_USER_LIST_ALL
    default: () => {}
  },
  userListParams: {
    type: Object
  },

  // 不显示组织
  noOrg: {
    type: Boolean,
    default: false
  },
  // 不显示下拉
  noSelect: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  placeholder: {
    type: String,
    default: "请选择"
  },
  // 下拉框最大tag树
  maxTagCount: {
    type: Number,
    default: 3
  },
  // 下拉框tag的placeholder
  maxTagPlaceholder: {
    type: String
  },
  allowClear: {
    type: Boolean,
    default: false
  },
  getPopupContainer: {
    type: Function as PropType<(...args: any[]) => any>,
    default: () => document.body
  },
  size: {
    type: String
  },
  codeField: {
    type: String
  },
  formValues: {
    type: Object
  },
  change: {
    type: Function
  }
};

// import type { ButtonProps } from "ant-design-vue/es/button/buttonTypes";
// import type { RowProps } from "ant-design-vue/lib/grid/Row";
// import type { CSSProperties, PropType } from "vue";
// import type { ColEx } from "./types";
// import type { FieldMapToTime, FormSchema } from "./types/form";
// import type { TableActionType } from "/@/components/Table";
// import { propTypes } from "/@/utils/propTypes";

// export const basicProps = {
//   model: {
//     type: Object as PropType<Recordable>,
//     default: {}
//   },
//   // 标签宽度  固定宽度
//   labelWidth: {
//     type: [Number, String] as PropType<number | string>,
//     default: 0
//   },
//   fieldMapToTime: {
//     type: Array as PropType<FieldMapToTime>,
//     default: () => []
//   },
//   compact: propTypes.bool,
//   // 表单配置规则
//   schemas: {
//     type: [Array] as PropType<FormSchema[]>,
//     default: () => []
//   },
//   mergeDynamicData: {
//     type: Object as PropType<Recordable>,
//     default: null
//   },
//   baseRowStyle: {
//     type: Object as PropType<CSSProperties>
//   },
//   baseColProps: {
//     type: Object as PropType<Partial<ColEx>>
//   },
//   autoSetPlaceHolder: propTypes.bool.def(true),
//   // 在INPUT组件上单击回车时，是否自动提交
//   autoSubmitOnEnter: propTypes.bool.def(false),
//   submitOnReset: propTypes.bool,
//   size: propTypes.oneOf(["default", "small", "large"]).def("default"),
//   // 禁用表单
//   disabled: propTypes.bool,
//   emptySpan: {
//     type: [Number, Object] as PropType<number>,
//     default: 0
//   },
//   // 是否显示收起展开按钮
//   showAdvancedButton: propTypes.bool,
//   // 转化时间
//   transformDateFunc: {
//     type: Function as PropType<Fn>,
//     default: (date: any) => {
//       return date._isAMomentObject ? date?.format("YYYY-MM-DD HH:mm:ss") : date;
//     }
//   },
//   rulesMessageJoinLabel: propTypes.bool.def(true),
//   // 超过3行自动折叠
//   autoAdvancedLine: propTypes.number.def(3),
//   // 不受折叠影响的行数
//   alwaysShowLines: propTypes.number.def(1),

//   // 是否显示操作按钮
//   showActionButtonGroup: propTypes.bool.def(true),
//   // 操作列Col配置
//   actionColOptions: Object as PropType<Partial<ColEx>>,
//   // 显示重置按钮
//   showResetButton: propTypes.bool.def(true),
//   // 是否聚焦第一个输入框，只在第一个表单项为input的时候作用
//   autoFocusFirstItem: propTypes.bool,
//   // 重置按钮配置
//   resetButtonOptions: Object as PropType<Partial<ButtonProps>>,

//   // 显示确认按钮
//   showSubmitButton: propTypes.bool.def(true),
//   // 确认按钮配置
//   submitButtonOptions: Object as PropType<Partial<ButtonProps>>,

//   // 自定义重置函数
//   resetFunc: Function as PropType<() => Promise<void>>,
//   submitFunc: Function as PropType<() => Promise<void>>,

//   // 以下为默认props
//   hideRequiredMark: propTypes.bool,

//   labelCol: Object as PropType<Partial<ColEx>>,

//   layout: propTypes.oneOf(["horizontal", "vertical", "inline"]).def("horizontal"),
//   tableAction: {
//     type: Object as PropType<TableActionType>
//   },

//   wrapperCol: Object as PropType<Partial<ColEx>>,

//   colon: propTypes.bool,

//   labelAlign: propTypes.string,

//   rowProps: Object as PropType<RowProps>
// };
