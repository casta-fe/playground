<template>
  <BasicModal
    v-bind="$attrs"
    title="导出数据"
    @ok="handleOk"
    @register="registerModal"
  >
    <BasicForm
      :labelWidth="100"
      :schemas="schemas"
      :showActionButtonGroup="false"
      @register="registerForm"
    />
  </BasicModal>
</template>
<script lang="ts">
  import type { ExportModalResult } from "./typing";
  import { defineComponent } from "vue";
  import { BasicModal, useModalInner } from "@casta-fe-playground/components/Modal";
  import { BasicForm, FormSchema, useForm } from "@casta-fe-playground/components/Form";

  const schemas: FormSchema[] = [
    {
      field: "filename",
      component: "Input",
      label: "文件名",
      rules: [{ required: true }]
    },
    {
      field: "bookType",
      component: "Select",
      label: "文件类型",
      defaultValue: "xlsx",
      rules: [{ required: true }],
      componentProps: {
        getPopupContainer: () => document.body,
        options: [
          {
            label: "xlsx",
            value: "xlsx",
            key: "xlsx"
          },
          {
            label: "csv",
            value: "csv",
            key: "csv"
          }
          // {
          //   label: 'html',
          //   value: 'html',
          //   key: 'html',
          // },
          // {
          //   label: 'txt',
          //   value: 'txt',
          //   key: 'txt',
          // },
        ]
      }
    }
  ];
  export default defineComponent({
    components: { BasicModal, BasicForm },
    emits: ["success", "register"],
    setup(_, { emit }) {
      const [registerForm, { validateFields }] = useForm();
      const [registerModal, { closeModal }] = useModalInner();

      async function handleOk() {
        const res = (await validateFields()) as ExportModalResult;
        const { filename, bookType } = res;
        emit("success", {
          filename: `${filename.split(".").shift()}.${bookType}`,
          bookType
        });
        closeModal();
      }

      return {
        schemas,
        handleOk,
        registerForm,
        registerModal
      };
    }
  });
</script>
