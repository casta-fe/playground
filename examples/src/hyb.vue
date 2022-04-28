<!--
 * @Author: huyb
 * @Descripttion: Think & Action
 * @Date: 2022-04-28 11:07:04
-->
<template>
  <div>
    <TaFileView :list="fileView.list" v-model:show="fileView.show" />
    <Button @click="fileView.show = true">显示</Button>
    <TaFollow :params="{ id: 222, type: 3 }"></TaFollow>
  </div>
</template>

<script lang="ts">
  import { defineComponent, reactive, toRefs } from "vue";
  import TaFileView from "@casta-fe-playground/components/FileViews";
  import { Button } from "@casta-fe-playground/components/Button";
  import { TaFollow } from "@casta-fe-playground/components/Follow";
  export default defineComponent({
    components: { TaFileView, Button, TaFollow },
    setup() {
      const state = reactive({
        fileView: {
          list: [],
          show: false
        }
      });
      return {
        ...toRefs(state)
      };
    }
  });
</script>

<style scoped></style>
