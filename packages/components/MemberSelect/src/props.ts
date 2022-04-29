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

  orgApi: {
    type: Function as PropType<(...arg: any[]) => Promise<any>>,
    // default: API__SYSTEM_USER_LIST_ALL
    default: () => {}
  },
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
  // 下拉框最大tag数量
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
