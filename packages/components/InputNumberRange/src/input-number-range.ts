import {InputNumberProps,} from 'ant-design-vue'
export type InputNumberRangeProps={
    value:Array<string|number>,
    disabled:InputNumberProps['disabled'],
    minPlaceHolder:InputNumberProps['placeholder'],
    maxPlaceHolder:InputNumberProps['placeholder'],
    size:InputNumberProps['size'],
    prefixCenter:String,
    precision:InputNumberProps['precision']
  }
export const defaultProps={
  value: {
    type: Array as PropType<InputNumberRangeProps['value']>,
    default: () => []
  },
  disabled: {
    type: Boolean as PropType<InputNumberRangeProps['disabled']>,
    default: false
  },
  minPlaceHolder: {
    type:String as PropType<InputNumberRangeProps['minPlaceHolder']>,
    default: "请输入数值"
  },
  maxPlaceHolder: {
    type:String as PropType<InputNumberRangeProps['maxPlaceHolder']>,
    default: "请输入数值"
  },
  size: {
    type: String as PropType<InputNumberRangeProps['size']>,
    default: "default"
  },
  prefixCenter: {
    type: String as PropType<InputNumberRangeProps['prefixCenter']>,
    default: "~"
  },
  precision: {
    type: Number as PropType<InputNumberRangeProps['precision']>,
    default: 4
  }
}

export const defaultEmits=["change", "blur"]