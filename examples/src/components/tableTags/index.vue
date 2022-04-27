<template>
  <section class="test">
    <h2>TaTableTags</h2>
    <TaTableTags :tags='state.tags'/>
    <Tree :tree-data="state.treeData"></Tree>
  </section>
</template>

<script lang="ts">
  import TaTableTags from '@casta-fe-playground/components/TableTags'
  import Tree from '@casta-fe-playground/components/Tree'
  
  import { defineComponent,reactive } from "vue";
  export default defineComponent({
    name: "ButtonTest",
    components: {
      TaTableTags,
      Tree
    },
    setup() {
       const treeData = [
      {
        title: 'parent 1',
        key: '0-0',
        isLeaf:true,
        child: [
          {
            title: '张晨成',
            key: '0-0-0',
            disabled: true,
            isLeaf:true,
            child: [
              { title: 'leaf', key: '0-0-0-0', disableCheckbox: true },
              { title: 'leaf', key: '0-0-0-1' },
            ],
          },
          {
            title: 'parent 1-1',
            key: '0-0-1',
            child: [{ key: '0-0-1-0', title: 'zcvc' }],
          },
        ],
      },
    ];
      const state = reactive({
        tags:[{
          text:'sksksk',
          type:'sksk'
        },{
          text:'sksksk',
          type:'sksk'
        },{
          text:'sksksk',
          type:'sksk'
        },{
          text:'sksksk',
          type:'sksk'
        }],
        treeData
      })
      return {
        state
      };
    }
  });
</script>

<style lang="less">
  @import "../test.less";
</style>
