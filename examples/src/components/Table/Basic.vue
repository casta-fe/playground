<template>
    <BasicTable
      title="基础示例"
      titleHelpMessage="温馨提醒"
      :columns="columns"
      :dataSource="data"
      :canResize="canResize"
      :loading="loading"
      :striped="striped"
      :bordered="border"
      showTableSetting
      :pagination="pagination"
      @columns-change="handleColumnChange"
    >
      <template #toolbar>
        <Button type="primary" @click="toggleCanResize">
          {{ !canResize ? "自适应高度" : "取消自适应" }}
        </Button>
        <Button type="primary" @click="toggleBorder">
          {{ !border ? "显示边框" : "隐藏边框" }}
        </Button>
        <Button type="primary" @click="toggleLoading"> 开启loading </Button>
        <Button type="primary" @click="toggleStriped">
          {{ !striped ? "显示斑马纹" : "隐藏斑马纹" }}
        </Button>
      </template>
    </BasicTable>
</template>
<script lang="ts">
  import { defineComponent, ref } from "vue";
  import { getBasicColumns, getBasicData } from "./tableData";
  import { BasicTable, ColumnChangeParam } from "@casta-fe-playground/components/Table";
  import {Button} from "@casta-fe-playground/components/Button"

  export default defineComponent({
    components: { BasicTable, Button },
    setup() {
      const canResize = ref(false);
      const loading = ref(false);
      const striped = ref(true);
      const border = ref(true);
      const pagination = ref<any>(false);
      function toggleCanResize() {
        canResize.value = !canResize.value;
      }
      function toggleStriped() {
        striped.value = !striped.value;
      }
      function toggleLoading() {
        loading.value = true;
        setTimeout(() => {
          loading.value = false;
          pagination.value = { pageSize: 20 };
        }, 3000);
      }
      function toggleBorder() {
        border.value = !border.value;
      }

      function handleColumnChange(data: ColumnChangeParam[]) {
        console.log("ColumnChanged", data);
      }

      return {
        columns: getBasicColumns(),
        data: getBasicData(),
        canResize,
        loading,
        striped,
        border,
        toggleStriped,
        toggleCanResize,
        toggleLoading,
        toggleBorder,
        pagination,
        handleColumnChange
      };
    }
  });
</script>
