<template>
  <BasicTitle :class="prefixCls" v-if="getTitle" :helpMessage="helpMessage">
    {{ getTitle }}
  </BasicTitle>
</template>
<script lang="ts">
  import { computed, defineComponent, PropType } from "vue";
  import { BasicTitle } from "@casta-fe-playground/components/Basic";
  import { isFunction } from "@casta-fe-playground/utils";

  export default defineComponent({
    name: "BasicTableTitle",
    components: { BasicTitle },
    props: {
      title: {
        type: [Function, String] as PropType<string | ((data: Recordable) => string)>
      },
      getSelectRows: {
        type: Function as PropType<() => Recordable[]>
      },
      helpMessage: {
        type: [String, Array] as PropType<string | string[]>
      }
    },
    setup(props) {
      const prefixCls = "ta-basic-table-title";

      const getTitle = computed(() => {
        const { title, getSelectRows = () => {} } = props;
        let tit = title;

        if (isFunction(title)) {
          tit = title({
            selectRows: getSelectRows()
          });
        }
        return tit;
      });

      return { getTitle, prefixCls };
    }
  });
</script>
<style lang="less">
  @import "../../index.less";
  @prefix-cls: ~"@{namespace}-basic-table-title";

  .@{prefix-cls} {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>
