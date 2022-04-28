<template>
  <section class="test">
    <h2>TaTableTags</h2>
    <TaTableTags :tags="state.tags" />
    <BasicTree :tree-data="state.treeData"></BasicTree>
  </section>
</template>

<script lang="ts">
  import { TaTableTags } from "@casta-fe-playground/components/TableTags";
  import { BasicTree } from "@casta-fe-playground/components/Tree";
  import { defineComponent, reactive } from "vue";

  export default defineComponent({
    name: "ButtonTest",
    components: {
      TaTableTags,
      BasicTree
    },
    setup() {
      const treeData = [
        {
          title: "parent 1",
          key: "0-0",
          children: [
            {
              title: "张晨成",
              key: "0-0-0",
              disabled: true,
              children: [
                { title: "leaf", key: "0-0-0-0", disableCheckbox: true },
                { title: "leaf", key: "0-0-0-1" }
              ]
            },
            {
              title: "parent 1-1",
              key: "0-0-1",
              children: [{ key: "0-0-1-0", title: "zcvc" }]
            }
          ]
        }
      ];
      const state = reactive({
        tags: [
          {
            text: "sksksk",
            type: "sksk"
          },
          {
            text: "sksksk",
            type: "sksk"
          },
          {
            text: "sksksk",
            type: "sksk"
          },
          {
            text: "sksksk",
            type: "sksk"
          }
        ],
        treeData
      });
      return {
        state
      };
    }
  });
</script>

<style lang="less">
  @import "../test.less";
</style>
