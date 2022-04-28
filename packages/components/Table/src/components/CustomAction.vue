<template>
  <div class="ta-basic-table-custom-action">
    <Button
      v-if="props.visible?.isAddVisible"
      class="mr-4"
      type="primary"
      preIcon="ant-design:plus-circle-outlined"
      @click="addOpenModal"
    >
      新增
    </Button>
    <Button
      v-if="props.visible?.isDeleteVisible"
      class="mr-4"
      type="primary"
      preIcon="ant-design:delete-outlined"
      @click="delOpenModal"
    >
      删除
    </Button>
    <slot></slot>
    <!-- <Button v-if="props.visible?.isImportVisible" class="mr-4" type="primary" preIcon="ant-design:import-outlined">导入</Button> -->
    <Button
      v-if="props.visible?.isExportVisible"
      class="mr-4"
      type="primary"
      preIcon="ant-design:export-outlined"
      @click="exportOpenModal"
    >
      导出
    </Button>
    <!-- <ExpExcelModal @register="expModalRegister" @success="exportHandler" /> -->
    <Button
      v-if="props.visible?.isRefreshVisible"
      class="mr-4 refresh-btn"
      preIcon="ant-design:redo-outlined"
      @click="refreshHandler"
    />
  </div>
</template>

<script lang="ts" setup>
  import { computed, inject, PropType, reactive } from "vue";
  import type { TableActionType } from "../types/table";
  import { Button } from "@casta-fe-playground/components/Button";
  // import { ExpExcelModal, ExportModalResult, jsonToSheetXlsx } from "@casta-fe-playground/components/Excel";
  // import { useModal } from "@casta-fe-playground/components/Modal";
  import { useMessage } from "@casta-fe-playground/hooks";
  import { componentSetting } from "@casta-fe-playground/settings";
  import { Emitter } from "@casta-fe-playground/utils";

  const tableEmitter = inject("tableEmitter") as Emitter;

  const {
    table: {
      fetchSetting: { listField }
    }
  } = componentSetting;

  const { createConfirm } = useMessage();

  const props = defineProps({
    visible: {
      type: Object as PropType<Recordable>
    },
    handlers: {
      type: Object as PropType<Recordable>
    },
    tableAction: {
      type: Object as PropType<TableActionType>
    }
  });

  const state = reactive({
    filter: {}
  });

  tableEmitter.on("table:filter-submit", ({ filter = {} }) => {
    state.filter = filter;
  });

  const addOpenModal = () => {
    props.handlers?.addHandle();
  };

  const delOpenModal = () => {
    props.handlers?.deleteHandle();
    // createConfirm({
    //   iconType: "warning",
    //   title: "确定删除吗？",
    //   content: "数据删除后不可恢复 🙅‍♂️",
    //   onOk() {
    //     console.log("delete");
    //   }
    // });
  };

  const exportOpenModal = () => {
    props.handlers?.exportHandle();
  };

  // const tableData = computed(() => {
  //   return props.tableAction?.getRawDataSource
  //     ? props.tableAction?.getRawDataSource()[listField]
  //     : [];
  // });
  // const exportHandler = ({ filename, bookType }: ExportModalResult) => {
  //   // 默认Object.keys(data[0])作为header
  //   jsonToSheetXlsx({
  //     data: tableData.value,
  //     filename,
  //     write2excelOpts: {
  //       bookType
  //     }
  //   });
  // };
  // const [expModalRegister, { openModal: expOpenModal }] = useModal();

  const refreshHandler = () => {
    props.tableAction?.reload({
      searchInfo: {
        filter: state.filter
      }
    });
  };
</script>

<style lang="less" scoped>
  @import "../../index.less";
  @prefix-cls: ~"@{namespace}-basic-table-custom-action";

  .@{prefix-cls} {
    .refresh-btn {
      min-width: auto !important;
      color: @primary-color;
      border-color: @primary-color;
    }
  }
</style>
