import { Ref } from "vue";
import { Handler } from "./main";
type RequestFilterType = Recordable;

/**
 * 组件内默认预览表格的props
 * @author mxs
 * @createDate ...
 * @updateDate 2022/01/24
 */
type PreviewTablePropType = {
  dataSource: FileItemType[];
  showTableAction: BasicPropsType["showTableAction"];
  tableActionPermission: BasicPropsType["tableActionPermission"];
  loading?: boolean;
  readonly: boolean;
  showUploadBtn: boolean;
  customOptions: BasicPropsType["customOptions"];
};

type NeedHideElType = {
  hideSelect: boolean;
  hideTable: boolean;
};

type TypeSelectPropType = {
  moduleCode: string;
  selected?: string;
  typeCodeArray?: string[];
  noDefaultValue: boolean | Ref<boolean>;
  customOptions?: BasicPropsType["customOptions"];
};

interface IHandle {
  backfill(): Promise<void>;
  realUpload(): void;
  beforeUpload(file: File): void;
  throwResponse(newRecord: FileItemType[]): void;
  customRequest(): void;
  appendResultToTable(): void;
}

/**
 * @author mxs
 * @name TaUploadBasciProps
 * @createDate 2022/01/12
 * @updateDate 2022/03/09
 */
type BasicPropsType = {
  /**
   * 默认加粗样式的标题
   */
  title?: String;
  typeCodeArray?: string[];
  /**
   * 文件真实id(v-model双向绑定)
   */
  fileActualIds?: string[];
  /**
   * 请求文件列表 | 上传文件的参数
   */
  params: RequestFilterType;
  /**
   * 默认的select选择框
   */
  showSelect: boolean;
  /**
   * 上传同时添加businessId
   */
  relationBusinessId: boolean;
  /**
   * 默认的文件列表
   */
  showTable: boolean;
  /**
   * 默认的文件列表的action列
   */
  showTableAction: {
    preview?: boolean;
    download?: boolean;
    delete?: boolean;
  };
  /**
   * ".doc,.docx,.xlsx..."
   */
  accept: string;
  // /**
  //  * 单个文件的最大大小
  //  */
  // maxSize: number;
  /**
   * 文件上传成功和请求已有(之前上传的)文件列表成功时触发
   */
  onChange?: Fn<FileItemType[], void>;
  /**
   * 不显示默认文件列表的删除功能
   * @default false
   */
  readonly: boolean;
  /**
   * 默认所有文件类型
   */
  noDefaultValue: boolean;
  /**
   * 不自动回填和清空
   * ```typescript
   * import { TaUpload, useHandlerInOuter } from "/@/components/TaUpload";
   * const { register: uploadRegister, getHandler } = useHandlerInOuter();
   * ```
   */
  controlInOuter: boolean;
  /**
   * emit("register")的代码提示
   */
  onRegister?: Fn<Handler, void>;
  /**
   * 双向绑定文件真实id的代码提示
   */
  "onUpdate:fileActualIds"?: Fn<string[], void>;
  /**
   * 假删除
   * change会调用 文件真实id也会变
   * 如果不点提交,数据就不变
   * 编辑点了提交,文件真实id列表变了=>后台会执行真删除
   * @default true
   */
  useFakeDelete: boolean;
  /**
   * 回填传入列表数据就不再发起请求
   */
  uploadResponse?: FileItemType[];
  /**
   * 显示上传按钮(用于仅显示列表不上传的地方)
   * @default true
   */
  showUploadBtn: boolean;
  /**
   * 点击文件名跳转...
   * @default undefined
   */
  onClickName?: Fn<FileItemType, void>;
  /**
   * 动态构建 TypeCode Options
   * @default undefined
   */
  customOptions?: LabelValueOptions<any, any>;
  /**
   * 内部表格拓展属性
   * @default false
   */
  canResize: boolean;
  /**
   * 默认的文件列表的action列配置权限
   * @default {}
   */
  tableActionPermission: {
    preview?: string;
    download?: string;
    delete?: string;
  };
};

/**
 * 有默认值的props
 * @author mxs
 * @createDate  2022/01/22
 * @updateDate  2022/03/09
 */
type HasDefaultPropType =
  | "accept"
  // | "maxSize"
  | "readonly"
  | "readonly"
  | "canResize"
  | "showTable"
  | "showSelect"
  | "showUploadBtn"
  | "useFakeDelete"
  | "controlInOuter"
  | "noDefaultValue"
  | "showTableAction"
  | "relationBusinessId"
  | "tableActionPermission";

/**
 * 外部非必传的props
 * @author mxs
 * @createDate 2022/...
 * @updateDate 2022/01/22
 */
type OmitHasDefaultPropType<T = HasDefaultPropType> = Partial<BasicPropsType> &
  Omit<BasicPropsType, T extends string | number | symbol ? T : "">;

export {
  IHandle,
  BasicPropsType,
  NeedHideElType,
  TypeSelectPropType,
  PreviewTablePropType,
  OmitHasDefaultPropType
};
