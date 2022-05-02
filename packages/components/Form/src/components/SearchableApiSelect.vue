<script lang="tsx">
import { Empty, Select, Spin } from "ant-design-vue";
import {
  computed,
  createVNode,
  defineComponent,
  PropType,
  Ref,
  ref,
  toRaw,
  unref,
  watch
} from "vue";
// import request from "/@/api/tianyancha/index";
import { getPopupContainer, propTypes } from "@casta-fe-playground/utils";

export default defineComponent({
  name: "SearchableApiSelect",
  props: {
    onSelect: Function as PropType<
      (value: string, option: LabelValueOption<string, string>) => void
    >,
    onChange: Function as PropType<
      (value: string, option: LabelValueOption<string, string>) => void
    >,
    // 动态改变 是否可输入
    canInputRef: {
      type: [Object, Boolean] as PropType<boolean | Ref<boolean>>,
      default: () => false
    },
    placeholder: {
      type: String,
      default: "请输入进行匹配"
    },
    // 给setFieldsValue留的,value:[${value}, ${option}] 回填
    value: {
      type: [Object, Array, String] as PropType<[string, LabelValueOption<string, any>]>
    },
    /**
     * undefined === props.params
     * ? 用户输入直接传给 api 方法 ("用户输入") => ...
     * : 如 props.params = {type: "1"} => 设置此prop为 "name" => props.params = {type: "1", name: ${searchValue}}
     *   只需要 searchInParamsKey props.params 必须传 {} => {[searchInParamsKey]: ${searchValue}}
     *   this prop in props.params
     */
    searchInParamsKey: {
      type: String,
      default: "name"
    },
    params: {
      type: Object
    },
    api: {
      type: Function as PropType<(params: any) => Promise<Result<any>>>,
      // default: request.tianyanchaSearch
      default: () => {}
    },
    labelField: propTypes.string.def("name"),
    valueField: propTypes.string.def("id"),
    keyField: propTypes.string.def("creditCode"),
    getPopupContainer: propTypes.func,
    // codeField: String,
    onClear: Function as PropType<Fn>
  },
  emits: ["change"],
  setup(props, { emit }) {
    const options = ref<LabelValueOptions<string, any>>([]);
    const selecterdOption = ref<any>();

    watch(
      () => props.value,
      (val) => {
        if (!val) {
          selecterdOption.value = undefined;
          options.value = [];

          // 表单使用 setFieldsValue({[fieldCode]: null}) 主动清空 并触发校验
          if (null === val) {
            emit("change", undefined);
          }

          return;
        }
        const [value, option] = val;
        // 数据回填
        // options.value = canInputRef.value ? getCleanOptions(option.label) : [option];
        options.value = [option];
        selecterdOption.value = option?.value || value;
      }
    );

    const canInputRef = computed(() => unref(props.canInputRef));

    const getCleanOptions = (keyword?: string) =>
      canInputRef.value
        ? [
            {
              label: keyword ?? "请输入",
              value: keyword ?? "请输入",
              disabled: !keyword
            }
          ]
        : [];

    const clearOptions = (keyword?: string) => {
      selecterdOption.value = undefined;
      options.value = getCleanOptions(keyword);
    };

    watch(
      () => canInputRef.value,
      () => {
        clearOptions();
      },
      {
        immediate: true
      }
    );

    const newestInvesterNameKeyword = ref<string>();
    // 防抖
    const timeout = ref<number | "empty">(0);
    const resetTimeout = () => {
      if (!timeout.value) return;
      if (timeout.value !== "empty") clearTimeout(timeout.value);
      timeout.value = 0;
    };
    const refreshCandidateList = async (keyword: string): Promise<any> => {
      resetTimeout();
      newestInvesterNameKeyword.value = keyword;
      clearOptions(keyword);
      timeout.value = window.setTimeout(async () => {
        if (newestInvesterNameKeyword.value !== keyword) {
          return;
        }
        const response = await props
          .api(
            undefined === props.params
              ? newestInvesterNameKeyword.value
              : { ...props.params, [props.searchInParamsKey]: newestInvesterNameKeyword.value }
          )
          .catch(() => ({ data: [] as any[] }));
        if (response.data.length === 0) {
          timeout.value = "empty";
          return;
        }
        options.value.push(
          ...response.data.map((el) => ({
            label: el[props.labelField],
            value: el[props.valueField],
            key: el[props.keyField]
          }))
        );
      }, 666);
    };

    let composing = false;
    const onSearch = (keyword: string) => {
      if (composing) {
        resetTimeout();
        return;
      }
      keyword = keyword.trim();
      if (!keyword) {
        resetTimeout();
        return;
      }
      refreshCandidateList(keyword);
      // if (!(canInputRef.value && options.value[0])) return;
      // options.value[0].label = keyword;
      // options.value[0].value = keyword;
      // options.value[0].disabled = false;
    };

    const onSelectEnd = (value, option) => {
      resetTimeout();
      options.value.splice(
        options.value.findIndex((el) => el.value === value),
        1
      );
      let rawOption = toRaw(option);
      rawOption = { label: rawOption?.label, value: rawOption?.value, key: rawOption?.key };
      props.onSelect && props.onSelect(value, rawOption);
      emit("change", [value, rawOption]);
    };

    watch(
      () => timeout.value,
      (v, p) => console.error(p, v)
    );

    return () => (
      <Select
        vModel={[selecterdOption.value, "value"]}
        options={options.value}
        showSearch={true}
        defaultActiveFirstOption={true}
        filterOption={false}
        onCompositionstart={() => {
          composing = true;
          resetTimeout();
        }}
        onSearch={onSearch}
        onCompositionend={(e) => {
          composing = false;
          onSearch(e.target.value);
        }}
        onSelect={(value, option) => {
          onSelectEnd(value, option);
        }}
        allowClear={true}
        onClear={() => {
          clearOptions();
          props.onClear === undefined ? emit("change") : props.onClear();
        }}
        placeholder={props.placeholder}
        onBlur={() => {
          if (canInputRef.value) {
            const inputOption = options.value[0];
            if (!inputOption || inputOption.disabled) return;
            selecterdOption.value = inputOption.value;
            onSelectEnd(inputOption.value, inputOption);
          }
        }}
        notFoundContent={
          timeout.value === "empty"
            ? createVNode(Empty, { image: Empty.PRESENTED_IMAGE_SIMPLE })
            : timeout.value
            ? createVNode(Spin)
            : null
        }
        getPopupContainer={props.getPopupContainer ?? getPopupContainer}
        showArrow={false}
      />
    );
  }
});

</script>