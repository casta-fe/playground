<template>
  <section class="test">
    <h2>TimeLineList默认使用</h2>
    <div class="components">
      <TimeLine :list="state.list" :useLoadingMore="true" @loadingMore="loadingMore"> </TimeLine>
    </div>
    <h2>TimeLineList 自定义渲染内容使用</h2>
    <div class="components">
      <TimeLine :list="state.list" :useLoadingMore="true" :renderListItem="renderListItem">
        <template #loadMore>
          <div>dkdkdkdkdkdk</div>
        </template>
      </TimeLine>
    </div>
  </section>
</template>

<script lang="ts">
  import { TimeLine, TimeLinePropsType } from "@casta-fe-playground/components/TimeLine";
  import { Button } from "ant-design-vue";
  import { defineComponent, h, reactive } from "vue";

  export default defineComponent({
    name: "TimeLineListTest",
    components: {
      TimeLine,
      Button
    },
    setup() {
      const state = reactive<TimeLinePropsType>({
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
      const renderListItem = ({ item, index }) => {
        console.log(item, index);
        return h(Button, {}, "sksksk");
      };
      const loadingMore = () => {
        console.log("loadingMoreloadingMore");
      };
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
