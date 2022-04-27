/*
 * @Author: huyb
 * @Descripttion: Think & Action
 * @Date: 2021-11-08 11:22:51
 */
export interface LetterItemList {
  id: string;
  name: string;
  checked: boolean;
}
export interface letterItem {
  key: string;
  list: LetterItemList[];
}
