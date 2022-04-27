export const dictStatusList = [
  { label: "请选择", value: "" },
  { label: "停用", value: 0 },
  { label: "启用", value: 1 },
  { label: "删除", value: 2 }
];
// 获取状态文本
export const getDictStatus = (data): string => {
  const item = dictStatusList.find((v) => v.value === data.status);
  return item ? item.label : "";
};
