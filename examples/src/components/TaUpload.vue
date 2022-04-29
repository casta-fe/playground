<template>
  <TaUpload v-bind="taUploadProps" style="margin-bottom: 200px" />
</template>

<script lang="ts">
  import { defineComponent, provide } from "vue";
  import { TaUpload, TaUploadBasicPropsType } from "@casta-fe-playground/components";
  import { buildUUID } from "@casta-fe-playground/utils";

  export default defineComponent({
    components: { TaUpload },
    setup() {
      const uploadArr: any[] = [
        {
          id: 7116,
          appId: 10001,
          actualId: "93645034fb304ba3a5015412c1b2fc4a",
          moduleId: 25,
          businessKey: null,
          businessId: null,
          type: 104,
          deleted: 0,
          version: 1,
          name: "logo192",
          suffix: "png",
          fullName: "logo192.png",
          size: 5347,
          address: "/20220428/16511405641079317.png",
          runtime: null,
          hyperlink: 0,
          createTime: "2022-04-28 18:09:24",
          createBy: "1",
          createByName: "系统管理员",
          fileSize: "5KB",
          moduleCode: "tg_fund_manager",
          typeCode: "FUND_GLR_QTZL"
        },
        {
          fullName: "doge.png",
          fileSize: "1MB",
          createByName: "mxs",
          createTime: new Date(),
          typeCode: "FILE_TYPE_1"
        }
      ];
      provide("apis", {
        queryFile: (params: Recordable) => {
          console.error("fetch: ", params);

          return new Promise((r) =>
            setTimeout(
              r.bind(null, {
                data: {
                  result: uploadArr
                }
              }),
              900
            )
          );
        },
        uploadFile: (payload: FormData) => {
          console.error("upload: ", payload, payload.getAll("files"));
          // uploadArr.push(
          //   ...[...payload.getAll("files")].map((el) => ({
          //     fullName: el.name,
          //     typeCode: payload.get("typeCode"),
          //     moduleCode: payload.get("moduleCode")
          //   }))
          // );
          // console.error(uploadArr);

          return new Promise((r) =>
            setTimeout(
              r.bind(
                null,
                [...payload.getAll("files")].map((el) => ({
                  fullName: el.name,
                  typeCode: payload.get("typeCode"),
                  moduleCode: payload.get("moduleCode"),
                  fileSize: (el.size / 1024).toFixed(2) + "kb",
                  createByName: "mxs",
                  createTime: +new Date() + 1000 * 60 * 24 * 3
                }))
              ),
              900
            )
          );
        },
        uploadHyperlink: (payload: Recordable) => {
          console.error("upload-hyperlink: ", payload);
          return new Promise((r) =>
            setTimeout(
              r.bind(null, {
                ...payload,
                fullName: payload.name,
                fileSize: "0kb",
                createByName: "mxs-hyperlink",
                createTime: +new Date() + 1000 * 60 * 60 * 24 * 3,
                hyperlink: 1
              }),
              900
            )
          );
        }
      });

      provide("typeCodeRecord", {
        // mockModuleCode: "tg_invest"
        tg_invest: [
          {
            label: "文件类型1",
            value: "FILE_TYPE_1"
          },
          {
            label: "文件类型2",
            value: "FILE_TYPE_2"
          },
          {
            label: "基金管理人其他资料",
            value: "FUND_GLR_QTZL"
          }
        ]
      });
      return {
        taUploadProps: {
          params: {
            moduleCode: "tg_invest",
            businessId: buildUUID()
          }
        } as TaUploadBasicPropsType
      };
    }
  });
</script>
