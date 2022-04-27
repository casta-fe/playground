<!--
 * @Author: huyb
 * @Descripttion: Think & Action
 * @Date: 2021-11-05 10:13:24
-->
<template>
  <div class="tatable-tag-list">
    <Tag class="ta-table-tag" v-for="(item, index) in baseTags" :key="index">
      {{ item.text }}
    </Tag>
    <template v-if="moreTags.length > 0">
      <Tooltip>
        <TagsOutlined />
        <template #title>
          <Tag class="ta-table-tag" v-for="(item, index) in moreTags" :key="index">
            {{ item.text }}
          </Tag>
        </template>
      </Tooltip>
    </template>
  </div>
</template>

<script lang="ts">
  import { TagsOutlined } from "@ant-design/icons-vue";
  import { Tag, Tooltip } from "ant-design-vue";
  import { defineComponent, onMounted, reactive, toRefs, watch } from "vue";
  import { Tags } from "./type";
  export default defineComponent({
    components: { Tag, Tooltip, TagsOutlined },
    props: {
      tags: {
        type: [String, Array],
        default: () => [] as Tags
      },
      maxNum: {
        type: Number,
        default: 3
      }
    },
    setup(props) {
      const state = reactive({
        tags: [] as Tags,
        baseTags: [] as Tags,
        moreTags: [] as Tags
      });
      const getAllTags = (): Tags => {
        if (!props.tags) {
          return [];
        }
        let result: Tags = [];
        if (typeof props.tags == "string") {
          let list = props.tags.split(",");
          list.forEach((v) => {
            if (v) {
              result.push({
                type: "default",
                text: v
              });
            }
          });
        } else {
          result = [...props.tags];
        }
        return result;
      };
      const pageInit = () => {
        let allTags = getAllTags();
        let maxNum = props.maxNum;
        if (allTags.length <= maxNum) {
          state.baseTags = allTags;
          state.moreTags = [];
        } else {
          state.baseTags = allTags.splice(0, maxNum - 1);
          state.moreTags = allTags;
        }
      };
      onMounted(() => {
        pageInit();
        watch(
          () => props.tags,
          (val) => val && val.length && pageInit()
        );
      });
      return { ...toRefs(state) };
    }
  });
</script>

<style lang="less">
  .tatable-tag-list {
    height: 30px;
    overflow-y: auto;

    .anticon {
      color: #3a67fc;
    }
  }

  .ta-table-tag {
    height: 20px;
    line-height: 1.5;
    color: #3a67fc;
    border-color: #3a67fc;
    background: #e6edff;
    margin: 5px;
  }
</style>
