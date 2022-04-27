/*
 * @Author: huyb
 * @Descripttion: Think & Action
 * @Date: 2021-11-05 11:01:49
 */

export interface ButtonItem {
  value: string | number;
  label: string;
  url?: string;
  number?: number | null | undefined;
  disabled?: boolean;
  permission?: string;
  loading?: boolean;
}
