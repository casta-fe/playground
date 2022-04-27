/*
 * @Author: huyb
 * @Descripttion: Think & Action
 * @Date: 2021-12-09 14:13:07
 */
export default {
  show: {
    type: Boolean,
    default: false
  },
  index: {
    type: Number,
    default: 0
  },
  list: {
    type: Array as PropType<FileItemType[]>,
    required: true,
    default: []
  },
  fileApi:{
    type:Function,
    default:null
  }
};
export type FileItemType = {
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

type ModuleCodeType = String;

