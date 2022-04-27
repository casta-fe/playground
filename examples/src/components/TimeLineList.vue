<template>
  <section class="test">
    <h2>TimeLineList默认使用</h2>
    <div class="components">
      <TimeLineList :list="state.list" :useLoadingMore="true" @loadingMore="loadingMore"> </TimeLineList>
    </div>
    <h2>TimeLineList 自定义渲染内容使用</h2>
    <div class="components">
      <TimeLineList :list="state.list" :useLoadingMore="false" :renderListItem="renderListItem"> </TimeLineList>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, h, reactive } from "vue";
import { Button } from "ant-design-vue";
import TimeLineList, { TimeLineListPropsType } from "@casta-fe-playground/components/TimeLineList";

export default defineComponent({
  name: "TimeLineListTest",
  components: {
    TimeLineList,
    Button
  },
  setup() {
    const state = reactive<TimeLineListPropsType>({
      list: [
        {
          times: ["1111", "22222"],
          status: "success",
          title: "测试一下啦",
          tags: [
            {
              label: "tag1",
              color: "#999999"
            }
          ],
          description: ["dkdkdkd", "sdkdkdiddi"]
        },
         {
          times: ["1111", "22222"],
          status: "success",
          title: "测试一下啦",
          tags: [
            {
              label: "tag1",
              color: "#999999"
            },
            {
              label: "tag1",
              color: "#999999"
            }
          ],
          description: ["dkdkdkd", "sdkdkdiddi"]
        }
      ]
    });
    const renderListItem=({item,index})=>{
        console.log(item,index)
        return h(Button, {}, 'sksksk')
    }
    const loadingMore=()=>{
        console.log('loadingMoreloadingMore')
    }
    return {
      state,
      renderListItem,
      loadingMore
    };
  }
});
</script>

<style lang="less">
@import "./test.less";
</style>