export type TimeLinePropsType = {
  list?: ListItemDefaultDataType[];
  useLoadingMore?: Boolean;
};

// export interface ListData=Array<ListItemDefaultDataType>

export type ListItemDefaultDataType = {
  times?: string[];
  status?: "success" | "fail" | "continue";
  title?: string;
  tags?: TagPropsType[];
  description?: string[];
};

export type TagPropsType = {
  color?: string;
  label?: string;
  tooltip?: string;
  [key: string]: any;
};
