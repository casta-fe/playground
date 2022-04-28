<template>
  <div ref="wrapRef" :class="getWrapperClass">
    <BasicForm
      submitOnReset
      v-bind="getFormProps"
      v-if="getBindValues.useSearchForm"
      :tableAction="tableAction"
      @register="registerForm"
      @submit="handleSearchInfoChange"
      @advanced-change="redoHeight"
    >
      <template #[replaceFormSlotKey(item)]="data" v-for="item in getFormSlotKeys">
        <slot :name="item" v-bind="data || {}"></slot>
      </template>
    </BasicForm>

    <!-- ::==================== i7eo：添加 ///// start ///// ====================:: -->
    <div class="ta-basic-table-operations flex flex-wrap align-center justify-between">
      <template v-if="useFilter.isVisible">
        <Filter ref="filterElRef" :forms="getFilterProps" :tableAction="tableAction" />
      </template>
      <template v-else>
        <div class="ta-basic-table-custom-title">
          <slot name="customTitle" v-bind="$slots['customTitle'] || {}"></slot>
        </div>
      </template>
      <CustomAction
        v-if="useInnerCustomAction.isVisible"
        :visible="useInnerCustomAction"
        :handlers="useInnerCustomAction"
        :tableAction="tableAction"
      >
        <slot name="customAction" v-bind="$slots['customAction'] || {}"></slot>
      </CustomAction>
      <!-- <div v-if="!tableData.length" class="ta-basic-table-operations-mask"></div> -->
    </div>
    <!-- ::==================== i7eo：添加 ///// end  ///// ====================:: -->

    <Table
      ref="tableElRef"
      v-bind="getBindValues"
      :rowClassName="getRowClassName"
      v-show="getEmptyDataIsShowTable"
      @change="handleTableChange"
    >
      <template #[item]="data" v-for="item in Object.keys($slots)" :key="item">
        <slot :name="item" v-bind="data || {}"></slot>
      </template>

      <template #[`header-${column.dataIndex}`] v-for="column in columns" :key="column.dataIndex">
        <HeaderCell :column="column" />
      </template>
    </Table>

    <!-- <div v-show="getBindValues.masking" class="ta-basic-table-mask"></div> -->
  </div>
</template>
<script lang="ts">
  import { Table } from "ant-design-vue";
  import { omit } from "lodash-es";
  import { computed, defineComponent, inject, provide, ref, toRaw, unref, watchEffect } from "vue";
  import CustomAction from "./components/CustomAction.vue";
  import expandIcon from "./components/ExpandIcon";
  import Filter from "./components/Filter.vue";
  import HeaderCell from "./components/HeaderCell.vue";
  import { useColumns } from "./hooks/useColumns";
  import { useCustomRow } from "./hooks/useCustomRow";
  import { useDataSource } from "./hooks/useDataSource";
  import { useLoading } from "./hooks/useLoading";
  import { useMasking } from "./hooks/useMasking";
  import { usePagination } from "./hooks/usePagination";
  import { useRowSelection } from "./hooks/useRowSelection";
  import { createTableContext } from "./hooks/useTableContext";
  import { useTableExpand } from "./hooks/useTableExpand";
  import { useTableFooter } from "./hooks/useTableFooter";
  import { useTableForm } from "./hooks/useTableForm";
  import { useTableHeader } from "./hooks/useTableHeader";
  import { useTableScroll } from "./hooks/useTableScroll";
  import { useTableScrollTo } from "./hooks/useTableScrollTo";
  import { useTableStyle } from "./hooks/useTableStyle";
  import { basicProps } from "./props";
  import type {
    BasicTableProps,
    ColumnChangeParam,
    SizeType,
    TableActionType
  } from "./types/table";
  import { InnerHandlers } from "./types/table";
  import { BasicForm, useForm } from "@casta-fe-playground/components/Form";
  // import emitter from "@casta-fe-playground/hooks/web/useEmiiter";
  // import { usePermission } from "@casta-fe-playground/hooks/web/usePermission";
  import { isFunction, warn, mitt } from "@casta-fe-playground/utils";

  const PageWrapperFixedHeightKey = "PageWrapperFixedHeight"

  export default defineComponent({
    components: {
      Table,
      BasicForm,
      HeaderCell,
      Filter,
      CustomAction
    },
    props: basicProps,
    emits: [
      "fetch-success",
      "fetch-error",
      "selection-change",
      "register",
      "row-click",
      "row-dbClick",
      "row-contextmenu",
      "row-mouseenter",
      "row-mouseleave",
      "edit-end",
      "edit-cancel",
      "edit-row-end",
      "edit-change",
      "expanded-rows-change",
      "change",
      "columns-change"
    ],
    setup(props, { attrs, emit, slots, expose }) {
      const tableEmitter = mitt();
      provide("tableEmitter", tableEmitter);
      const tableElRef = ref(null);
      const tableData = ref<Recordable[]>([]);

      const wrapRef = ref(null);
      const innerPropsRef = ref<Partial<BasicTableProps>>();

      const prefixCls = "ta-basic-table";
      const [registerForm, formActions] = useForm();

      const getProps = computed(() => {
        return { ...props, ...unref(innerPropsRef) } as BasicTableProps;
      });

      // ::==================== i7eo：添加 ///// start ///// ====================:: //
      const filterElRef = ref(null);
      const useFilter = computed(() => {
        const { filter } = unref(getProps);
        const result = {
          isVisible: false,
          isInputFormVisible: false,
          isPannelFormVisible: false
        };
        if (!filter) {
          result.isVisible = false;
        } else {
          const { inputForm, pannelForm } = filter;
          if (inputForm && Object.keys(inputForm).length > 0) {
            result.isInputFormVisible = true;
          } else {
            result.isInputFormVisible = false;
          }

          if (pannelForm && pannelForm.length > 0) {
            result.isPannelFormVisible = true;
          } else {
            result.isPannelFormVisible = false;
          }

          if (result.isInputFormVisible || result.isPannelFormVisible) {
            result.isVisible = true;
          } else {
            result.isVisible = false;
          }
        }
        return result;
      });

      const getFilterProps = computed(() => {
        return getProps.value.filter;
      });

      // const { getPermissions } = usePermission();
      // const Permissions = getPermissions();
      const useInnerCustomAction = computed(() => {
        // const { useAdd, useDelete, useImport, useExport, useRefresh, permission } = unref(getProps);
        // // 先判断 permission 是否有值，无值走正常的逻辑；有值判断 resourcemap中是否存在不存在走正常逻辑，存在就取值
        // const isAddVisible = isNullOrUnDef(permission?.add)
        //   ? useAdd?.ifShow
        //   : unref(Permissions)[permission!.add]?.ifShow && useAdd?.ifShow;
        // const isDeleteVisible = isNullOrUnDef(permission?.delete)
        //   ? useDelete?.ifShow
        //   : unref(Permissions)[permission!.delete]?.ifShow && useDelete?.ifShow;
        // const isImportVisible = isNullOrUnDef(permission?.import)
        //   ? useImport?.ifShow
        //   : unref(Permissions)[permission!.import]?.ifShow && useImport?.ifShow;
        // const isExportVisible = isNullOrUnDef(permission?.export)
        //   ? useExport?.ifShow
        //   : unref(Permissions)[permission!.export]?.ifShow && useExport?.ifShow;
        // const isRefreshVisible = isNullOrUnDef(permission?.refresh)
        //   ? useRefresh?.ifShow
        //   : unref(Permissions)[permission!.refresh]?.ifShow && useRefresh?.ifShow;
        // const result = {
        //   isVisible: false,
        //   isAddVisible,
        //   addHandle: useAdd?.handleAction,
        //   isDeleteVisible,
        //   deleteHandle: useDelete?.handleAction,
        //   isImportVisible,
        //   importHandle: useImport?.handleAction,
        //   isExportVisible,
        //   isRefreshVisible
        // };
        // if (
        //   isAddVisible ||
        //   isDeleteVisible ||
        //   isImportVisible ||
        //   isExportVisible ||
        //   isRefreshVisible
        // ) {
        //   result.isVisible = true;
        // }

        // return result;
        return {
          isVisible: true,
          isAddVisible: true,
          addHandle: () => {},
          isDeleteVisible: true,
          deleteHandle: () => {},
          isImportVisible: true,
          importHandle: () => {},
          isExportVisible: true,
          isRefreshVisible: true
        };
      });
      // ::==================== i7eo：添加 ///// end  ///// ====================:: //

      const isFixedHeightPage = inject(PageWrapperFixedHeightKey, false);
      watchEffect(() => {
        unref(isFixedHeightPage) &&
          props.canResize &&
          warn(
            "'canResize' of BasicTable may not work in PageWrapper with 'fixedHeight' (especially in hot updates)"
          );
      });

      const { getLoading, setLoading } = useLoading(getProps);
      const { getMasking, setMasking } = useMasking(getProps);
      const {
        getPaginationInfo,
        getPagination,
        setPagination,
        setShowPagination,
        getShowPagination
      } = usePagination(getProps);

      const {
        getRowSelection,
        getRowSelectionRef,
        getSelectRows,
        clearSelectedRowKeys,
        getSelectRowKeys,
        deleteSelectRowByKey,
        setSelectedRowKeys
      } = useRowSelection(getProps, tableData, emit);

      const {
        handleTableChange: onTableChange,
        getDataSourceRef,
        getDataSource,
        getRawDataSource,
        setTableData,
        updateTableDataRecord,
        deleteTableDataRecord,
        insertTableDataRecord,
        findTableDataRecord,
        fetch,
        getRowKey,
        reload,
        getAutoCreateKey,
        updateTableData
      } = useDataSource(
        tableElRef,
        getProps,
        {
          tableData,
          getPaginationInfo,
          setLoading,
          setPagination,
          getFieldsValue: formActions.getFieldsValue,
          clearSelectedRowKeys
        },
        emit,
        filterElRef
      );

      function handleTableChange(...args) {
        onTableChange.call(undefined, ...args);
        emit("change", ...args);
        // 解决通过useTable注册onChange时不起作用的问题
        const { onChange } = unref(getProps);
        onChange && isFunction(onChange) && onChange.call(undefined, ...args);
      }

      const {
        getViewColumns,
        getColumns,
        setCacheColumnsByField,
        setColumns,
        getColumnsRef,
        getCacheColumns
      } = useColumns(getProps, getPaginationInfo);

      const { getScrollRef, redoHeight } = useTableScroll(
        getProps,
        tableElRef,
        getColumnsRef,
        getRowSelectionRef,
        getDataSourceRef,
        slots
      );

      const { scrollTo } = useTableScrollTo(tableElRef, getDataSourceRef);

      const { customRow } = useCustomRow(getProps, {
        setSelectedRowKeys,
        getSelectRowKeys,
        clearSelectedRowKeys,
        getAutoCreateKey,
        emit
      });

      const { getRowClassName } = useTableStyle(getProps, prefixCls);

      const { getExpandOption, expandAll, expandRows, collapseAll } = useTableExpand(
        getProps,
        tableData,
        emit
      );

      const handlers: InnerHandlers = {
        onColumnsChange: (data: ColumnChangeParam[]) => {
          emit("columns-change", data);
          // support useTable
          unref(getProps).onColumnsChange?.(data);
        }
      };

      const { getHeaderProps } = useTableHeader(getProps, slots, handlers);

      const { getFooterProps } = useTableFooter(
        getProps,
        getScrollRef,
        tableElRef,
        getDataSourceRef
      );

      const { getFormProps, replaceFormSlotKey, getFormSlotKeys, handleSearchInfoChange } =
        useTableForm(getProps, slots, fetch, getLoading);

      const getBindValues = computed(() => {
        const dataSource = unref(getDataSourceRef);
        let propsData: Recordable = {
          // ...(dataSource.length === 0 ? { getPopupContainer: () => document.body } : {}),
          ...attrs,
          customRow,
          expandIcon: slots.expandIcon ? null : expandIcon(),
          ...unref(getProps),
          ...unref(getHeaderProps),
          scroll: unref(getScrollRef),
          loading: unref(getLoading),
          masking: unref(getMasking),
          tableLayout: "fixed",
          rowSelection: unref(getRowSelectionRef),
          rowKey: unref(getRowKey),
          columns: toRaw(unref(getViewColumns)),
          pagination: toRaw(unref(getPaginationInfo)),
          dataSource,
          footer: unref(getFooterProps),
          ...unref(getExpandOption)
        };
        if (slots.expandedRowRender) {
          propsData = omit(propsData, "scroll");
        }

        propsData = omit(propsData, ["class", "onChange"]);
        return propsData;
      });

      const getWrapperClass = computed(() => {
        const values = unref(getBindValues);
        return [
          prefixCls,
          attrs.class,
          {
            [`${prefixCls}-form-container`]: values.useSearchForm,
            [`${prefixCls}--inset`]: values.inset,
            [`${prefixCls}--full-height`]: values.fullHeight
          }
        ];
      });

      const getEmptyDataIsShowTable = computed(() => {
        const { emptyDataIsShowTable, useSearchForm } = unref(getProps);
        if (emptyDataIsShowTable || !useSearchForm) {
          return true;
        }
        return !!unref(getDataSourceRef).length;
      });

      function setProps(props: Partial<BasicTableProps>) {
        innerPropsRef.value = { ...unref(innerPropsRef), ...props };
      }

      const tableAction: TableActionType = {
        reload,
        getSelectRows,
        clearSelectedRowKeys,
        getSelectRowKeys,
        deleteSelectRowByKey,
        setPagination,
        setTableData,
        updateTableDataRecord,
        deleteTableDataRecord,
        insertTableDataRecord,
        findTableDataRecord,
        redoHeight,
        setSelectedRowKeys,
        setColumns,
        setLoading,
        setMasking,
        getDataSource,
        getRawDataSource,
        setProps,
        getRowSelection,
        getPaginationRef: getPagination,
        getColumns,
        getCacheColumns,
        emit,
        updateTableData,
        setShowPagination,
        getShowPagination,
        setCacheColumnsByField,
        expandAll,
        expandRows,
        scrollTo,
        collapseAll,
        getSize: () => {
          return unref(getBindValues).size as SizeType;
        }
      };
      createTableContext({ ...tableAction, wrapRef, getBindValues });

      // ::==================== i7eo：添加 ///// start ///// ====================:: //
      watchEffect(() => {
        // 数据渲染完毕后发送 dom，此时布局已经确定
        // if (tableElRef.value && tableData.value.length) {
        if (tableElRef.value) {
          tableEmitter.emit("table:fetch-refs", {
            table: (tableElRef.value as any).$el
          });
        }
      });
      // ::==================== i7eo：添加 ///// end  ///// ====================:: //

      expose(tableAction);

      emit("register", tableAction, formActions);

      return {
        tableData,
        filterElRef,
        useFilter,
        getFilterProps,
        useInnerCustomAction,
        tableElRef,
        getBindValues,
        getLoading,
        registerForm,
        handleSearchInfoChange,
        getEmptyDataIsShowTable,
        handleTableChange,
        getRowClassName,
        wrapRef,
        tableAction,
        redoHeight,
        getFormProps: getFormProps as any,
        replaceFormSlotKey,
        getFormSlotKeys,
        getWrapperClass,
        columns: getViewColumns
      };
    }
  });
</script>
<style lang="less">
  @import "../index.less";
  @border-color: #cecece4d;

  @prefix-cls: ~"@{namespace}-basic-table";

  [data-theme="dark"] {
    .ant-table-tbody > tr:hover.ant-table-row-selected > td,
    .ant-table-tbody > tr.ant-table-row-selected td {
      background-color: #262626;
    }
  }

  .@{prefix-cls} {
    max-width: 100%;

    .ant-popover {
      min-width: 200px;
    }

    &-row__striped {
      td {
        background-color: @app-content-background;
      }
    }

    &-form-container {
      padding: 16px;

      .ant-form {
        padding: 12px 10px 6px;
        margin-bottom: 16px;
        background-color: @component-background;
        border-radius: 2px;
      }
    }

    .ant-tag {
      margin-right: 0;
    }

    .ant-table-wrapper {
      padding: 6px;
      background-color: @component-background;
      border-radius: 2px;

      .ant-table-title {
        min-height: 40px;
        padding: 0 0 8px !important;
      }

      .ant-table.ant-table-bordered .ant-table-title {
        border: none !important;
      }

      .ant-table-hide-scrollbar::-webkit-scrollbar {
        display: none;
      }
    }

    .ant-table {
      width: 100%;
      overflow-x: hidden;

      &-title {
        display: flex;
        padding: 8px 6px;
        border-bottom: none;
        justify-content: space-between;
        align-items: center;
      }

      //.ant-table-tbody > tr.ant-table-row-selected td {
      //background-color: fade(@primary-color, 8%) !important;
      //}
    }

    .ant-pagination {
      margin: 10px 0 0;
    }

    .ant-table-footer {
      padding: 0;

      .ant-table-wrapper {
        padding: 0;
      }

      table {
        border: none !important;
      }

      .ant-table-body {
        overflow-x: hidden !important;
        //  overflow-y: scroll !important;
      }

      td {
        padding: 12px 8px;
      }
    }

    &--inset {
      .ant-table-wrapper {
        padding: 0;
      }
    }

    &-mask {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      z-index: 2;
      background-color: #f6f8ff;
      opacity: 0.5;
    }
  }
</style>
