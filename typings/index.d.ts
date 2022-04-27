declare interface Fn<T = any, R = T> {
  (...arg: T[]): R;
}

declare interface PromiseFn<T = any, R = T> {
  (...arg: T[]): Promise<R>;
}

declare type RefType<T> = T | null;

declare type EmitType = (event: string, ...args: any[]) => void;

declare type TargetContext = "_self" | "_blank";

declare interface ComponentElRef<T extends HTMLElement = HTMLDivElement> {
  $el: T;
}

declare type ComponentRef<T extends HTMLElement = HTMLDivElement> = ComponentElRef<T> | null;

declare type ElRef<T extends HTMLElement = HTMLDivElement> = Nullable<T>;

// 底下重新定义了，注释掉
// declare type LabelValueOptions = {
//   label: string;
//   value: any;
//   [key: string]: string | number | boolean;
// }[];

// ==================== 投管开发的组件需要的类型 ==================== //
declare type LabelValueOption<V = any, K = string | number | boolean> = {
  label: string;
  value: V;
  disabled?: boolean;
  [key: string]: K;
};

declare type LabelValueOptions<V = any, K = string | number | boolean> = LabelValueOption<V, K>[];

declare type FileItemType = {
  actualId: string; // 文件真实id
  address: string;
  appId: number;
  businessId: null;
  businessKey: null;
  createTime: string;
  createBy: string | number;
  createByName: string;
  deleted: number;
  fullName: string;
  hyperlink: number;
  id: number;
  moduleId: number;
  name: string;
  runtime: null;
  size: number;
  suffix: string;
  type: number;
  version: number;
  moduleCode: ModuleCodeType;
  typeCode: string;
};

declare interface Result<T = any> {
  code: number | string;
  type?: "success" | "error" | "warning";
  message?: string;
  result?: T;

  data: T;
  msg: string;
  success: boolean;
}

declare type ListPagerRequestType<T = {}> = {
  filter: { searchValue?: string } & T;
  model: {
    dir?: string;
    limit: number;
    page: number;
    sort?: string;
  };
};

declare type ListPagerResponseDataType<T = any> = {
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  isFirstPage: boolean;
  isLastPage: boolean;
  navigatePageNumbers: number[];
  navigatePages: number;
  pageCount: number;
  pageSize: number;
  total: number;
  result: T[];
};

declare type ListPagerResponseType<T = any> = Result<ListPagerResponseDataType<T>>;
// ==================== 投管开发的组件需要的类型 ==================== //
