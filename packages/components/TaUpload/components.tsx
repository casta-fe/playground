import { Button } from "@casta-fe-playground/components/Button";
import { FileView } from "@casta-fe-playground/components/FileViews";
import { BasicForm, useForm } from "@casta-fe-playground/components/Form";
import { BasicTable, TableAction, useTable } from "@casta-fe-playground/components/Table";
import download from "@casta-fe-playground/utils/src/file/TaDownload";
import { Select as TaSelect } from "ant-design-vue";
import { computed, defineComponent, inject, Ref, ref, toRefs, unref, watch } from "vue";
import { columns } from "./config";
import { useFileTypeCode } from "./hooks";
import { PreviewTablePropType, TypeSelectPropType } from "./types";

export const PreviewTable = defineComponent({
  props: {
    dataSource: {
      type: Array as PropType<FileItemType[]>,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      required: true
    },
    showTableAction: {
      type: Object as PropType<PreviewTablePropType["showTableAction"]>,
      required: true
    },
    onClickName: Function,
    canResize: {
      type: Boolean,
      required: true
    },
    tableActionPermission: {
      type: Object as PropType<PreviewTablePropType["tableActionPermission"]>,
      required: true
    },
    customOptions: Array as PropType<PreviewTablePropType["customOptions"]>
  },
  emits: ["delete"],
  setup(props, { emit }) {
    // init begin
    const { getOptionsByTypeCodes } = useFileTypeCode(
      unref(inject("typeCodeRecord") as Recordable)
    );
    // init end

    const dataSource = computed(() => props.dataSource);
    const typeCodeArray = computed(() => dataSource.value.map((el) => el.typeCode));
    const typeCodeOptions = computed(
      () => props.customOptions ?? unref(getOptionsByTypeCodes(typeCodeArray.value))
    );
    const showActionColumn = computed(() => {
      if (
        props.showTableAction.preview === false &&
        props.showTableAction.download === false &&
        props.showTableAction.delete === false
      )
        return undefined;
      return {
        width: 140,
        title: "操作",
        dataIndex: "action",
        slots: { customRender: "action" }
      };
    });

    const { loading, readonly } = toRefs(props);
    const [tableRegister, { setTableData }] = useTable({
      columns,
      dataSource: dataSource.value,
      pagination: false,
      rowKey: "id",
      actionColumn: showActionColumn,
      useAdd: {
        ifShow: false
      },
      useDelete: {
        ifShow: false
      },
      useExport: {
        ifShow: false
      },
      useRefresh: {
        ifShow: false
      },
      scroll: {
        y: 250
      }
    });
    watch(
      () => dataSource.value,
      (val) => {
        setTableData<FileItemType>(val);
      },
      {
        deep: true
      }
    );
    const showPreview = ref(false);
    const previewRecord = ref<FileItemType[]>([]);

    return () => (
      <div class="ta-upload-preview-table">
        <BasicTable onRegister={tableRegister} loading={loading.value} canResize={props.canResize}>
          {{
            name: ({ text, record }) => (
              <>
                {props.onClickName ? (
                  <a
                    onClick={() => {
                      props.onClickName?.(record);
                    }}
                  >
                    {text || record.name}
                  </a>
                ) : (
                  <span>{text || record.name}</span>
                )}
                {record.hyperlink == 1 ? (
                  <>
                    <br />
                    <a
                      onClick={() => {
                        window
                          .open(
                            record.address.includes("//") ? record.address : "//" + record.address
                          )
                          ?.focus();
                      }}
                    >
                      {record.address}
                    </a>
                  </>
                ) : null}
              </>
            ),
            typeCode: ({ text }) =>
              typeCodeOptions.value.find((el) => el.value === text)?.label || text,
            action: ({ record }) => (
              <TableAction
                actions={[
                  {
                    label: "查看",
                    permission: props.tableActionPermission.preview,
                    ifShow: record.hyperlink === 1 ? false : props.showTableAction.preview ?? true,
                    onClick() {
                      if (record.hyperlink === 1) {
                        window.open(record.address)?.focus();
                        return;
                      }
                      previewRecord.value = [record];
                      showPreview.value = true;
                    }
                  },
                  {
                    label: "下载",
                    permission: props.tableActionPermission.download,
                    ifShow: record.hyperlink === 1 ? false : props.showTableAction.download ?? true,
                    onClick() {
                      previewRecord.value = record;
                      download(record);
                    }
                  },
                  {
                    label: "删除",
                    permission: props.tableActionPermission.delete,
                    ifShow: props.showTableAction.delete ?? !readonly.value,
                    popConfirm: {
                      title: "是否确认删除?",
                      confirm: () => {
                        emit("delete", record);
                      }
                    }
                  }
                ]}
              />
            )
          }}
        </BasicTable>
        <FileView vModel={[showPreview.value, "show"]} list={previewRecord.value} />
      </div>
    );
  }
});

export const TypeSelect = defineComponent({
  props: {
    moduleCode: String as PropType<TypeSelectPropType["moduleCode"]>,
    typeCodeArray: Array as PropType<TypeSelectPropType["typeCodeArray"]>,
    selected: String as PropType<TypeSelectPropType["selected"]>,
    noDefaultValue: [Boolean, Object] as PropType<TypeSelectPropType["noDefaultValue"]>,
    customOptions: Array as PropType<TypeSelectPropType["customOptions"]>
  },
  emits: ["update:selected"],
  setup(props, { emit, slots }) {
    // init begin
    const { mergeOptions } = useFileTypeCode(unref(inject("typeCodeRecord") as Recordable));
    const queryFileType = (inject("apis") as Recordable<PromiseFn>)?.queryFileType;
    // init end
    const moduleCode = computed(() => props.moduleCode);
    const typeCodeArray = computed(() => props.typeCodeArray);

    if (!moduleCode.value) return null;

    // 此角色有的fileTypeCode
    const fetchedTypeCodeArray = ref<string[]>();

    // 从字典中取 TypeCode 选项的对应关系
    const localTypeCodeOptions = computed(() => {
      const options = props.customOptions ?? mergeOptions(moduleCode.value, typeCodeArray.value);
      /**
       * 未注入文件类型控制接口 -> 不需要控制 -> 所有文件类型
       */
      if (!queryFileType) {
        return options;
      }
      if (fetchedTypeCodeArray.value) {
        // @ts-ignore
        return options.filter((el) => fetchedTypeCodeArray.value!.includes(el.value));
      }
      return [];
    });

    /**
     * ***仅组件初始化时给予默认值***
     */
    let isInit = true;
    const defaultValue = computed(() => {
      if (unref(props.noDefaultValue) || !isInit) {
        return props.selected;
      } else {
        return props.selected &&
          localTypeCodeOptions.value.some((el) => props.selected === el.value)
          ? props.selected
          : localTypeCodeOptions.value[0]?.value;
      }
    });

    queryFileType?.([moduleCode.value])
      .then(({ data }) => {
        fetchedTypeCodeArray.value = data.map((el) => el.code!);
        if (!unref(props.noDefaultValue) && defaultValue.value !== props.selected) {
          emit("update:selected", defaultValue.value);
        }
      })
      .finally(() => (isInit = false)) ||
      (() => {
        emit("update:selected", defaultValue.value);
        isInit = false;
      })();

    return () =>
      (slots.default &&
        slots.default({
          typeCodeOptions: localTypeCodeOptions.value,
          selected: defaultValue.value
        })) || (
        <TaSelect
          value={defaultValue.value}
          style="width: 200px"
          options={localTypeCodeOptions.value}
          onSelect={(value, option) => emit("update:selected", value, option)}
          placeholder="请选择文件类型"
          allowClear={true}
          onClear={() => {
            emit("update:selected", undefined);
          }}
        />
      );
  }
});

export const HyperlinkForm = defineComponent({
  name: "HyperlinkForm",
  components: { BasicForm },
  props: {
    name: String,
    address: String,
    loading: {
      type: [Boolean, Object] as PropType<boolean | Ref<boolean>>,
      default: false
    }
  },
  emits: ["update:name", "update:address", "change", "register"],
  setup(props, { emit }) {
    // const addressPS = ["http://", ".com"];
    const [formRegister, { validate, getFieldsValue, resetFields }] = useForm({
      layout: "vertical",
      // labelWidth: 80,
      showResetButton: false,
      showSubmitButton: false,
      // showAdvancedButton: false,
      showActionButtonGroup: false,
      rowProps: { gutter: 16 },
      schemas: [
        {
          field: "name",
          label: "文件名",
          required: true,
          component: "Input",
          colProps: { span: 10 },
          componentProps: {
            maxLength: 100
          }
        },
        {
          field: "address",
          label: "链接地址",
          component: "Input",
          colProps: { span: 10 },
          rules: [
            {
              required: true
            },
            {
              pattern:
                /^((?<protocol>http|https|ftp):\/\/)?(?<hostname>[a-zA-Z0-9\u4e00-\u9fa5])+(?<dot>\.){1}(?<rootdomainPathQuery>[a-zA-Z0-9\u4e00-\u9fa5])+/,
              message: "请输入正确的链接"
            }
          ],
          componentProps: {
            maxLength: 400
          }
        },
        {
          field: "btn",
          label: "　",
          component: "Input",
          slot: "submitBtn",
          colProps: { span: 4 }
        }
      ]
    });

    emit("register", { resetFields });

    return () => (
      <BasicForm
        onRegister={formRegister}
        // style={{
        //   border: "1px solid red",
        //   display: "inline-block",
        //   width: "calc(100% - 216px)",
        //   marginLeft: "16px"
        // }}
      >
        {{
          submitBtn: () => (
            <Button
              class="ta-upload-btn-submit"
              loading={unref(props.loading)}
              onClick={() => {
                validate()
                  .then(() => {
                    const { name, address } = getFieldsValue();
                    emit("update:name", name);
                    // const tmpAddressPS = addressPS.slice();
                    // if (addressPS[0] === "自定义") {
                    //   tmpAddressPS[0] = "";
                    // }
                    // if (addressPS[1] === "自定义") {
                    //   tmpAddressPS[1] = "";
                    // }
                    emit("update:address", address);
                    emit("change", true);
                  })
                  .catch(() => {
                    emit("change", false);
                  });
              }}
            >
              {/* <UploadOutlined /> */}
              <i class="ta-upload-btn-icon" />
              上传链接
            </Button>
          )
        }}
      </BasicForm>
    );
  }
});
