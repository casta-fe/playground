import { TreeDataItem } from "ant-design-vue/es/tree/Tree";
//状态
export const StatusList = [
  { label: "全部", value: null },
  { label: "冻结", value: 0 },
  { label: "正常", value: 1 },
  { label: "已删除", value: 2 }
];
// 性别
export const SexList = [
  { label: "全部", value: null },
  { label: "男", value: 1 },
  { label: "女", value: 2 }
];
// 获取状态文本
export const getStatus = (data): string => {
  const item = StatusList.find((v) => v.value == data.status);
  return item ? item.label : "";
};
// 获取性别文本
export const getSex = (data): string => {
  const item = SexList.find((v) => v.value == data.sex);
  return item ? item.label : "";
};
// 递归tree符合关键字的节点
export const getParentKey = (keyword: string, list: object[], result: string[]): string[] => {
  list.forEach((item: TreeDataItem): string[] => {
    if (item.name.indexOf(keyword) > -1) {
      result.push(item.parentId);
    }
    if (item.children) {
      result: [] = [...result, getParentKey(keyword, item.children, result)];
    }
    return result;
  });

  return [...new Set(result)];
};
