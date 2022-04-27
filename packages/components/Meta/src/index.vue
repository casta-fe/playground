<template>
  <section class="ta-meta">
    <div class="ta-meta__content-wrapper">
      <!-- <Image
        :src="info.img || '/@/assets/images/company.png'"
        fallback="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBhcmlhLWhpZGRlbj0idHJ1ZSIgcm9sZT0iaW1nIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJ4TWlkWU1pZCBtZWV0IiB2aWV3Qm94PSIwIDAgNTAgNTAiID48cGF0aCBkPSJNMzkgMzhIMTFjLTEuNyAwLTMtMS4zLTMtM1YxNWMwLTEuNyAxLjMtMyAzLTNoMjhjMS43IDAgMyAxLjMgMyAzdjIwYzAgMS43LTEuMyAzLTMgM3pNMTEgMTRjLS42IDAtMSAuNC0xIDF2MjBjMCAuNi40IDEgMSAxaDI4Yy42IDAgMS0uNCAxLTFWMTVjMC0uNi0uNC0xLTEtMUgxMXoiIGZpbGw9InJnYmEoMCwwLDAsLjA4KSI+PC9wYXRoPjxwYXRoIGQ9Ik0zMCAyNGMtMi4yIDAtNC0xLjgtNC00czEuOC00IDQtNHM0IDEuOCA0IDRzLTEuOCA0LTQgNHptMC02Yy0xLjEgMC0yIC45LTIgMnMuOSAyIDIgMnMyLS45IDItMnMtLjktMi0yLTJ6IiBmaWxsPSJyZ2JhKDAsMCwwLC4wNikiPjwvcGF0aD48cGF0aCBkPSJNMzUuMyAzNy43TDE5IDIyLjRMOS43IDMxbC0xLjQtMS40bDEwLjctMTBsMTcuNyAxNi43eiIgZmlsbD0icmdiYSgwLDAsMCwuMDYpIj48L3BhdGg+PHBhdGggZD0iTTQwLjQgMzIuN0wzNSAyOC4zTDMwLjUgMzJsLTEuMy0xLjZsNS44LTQuN2w2LjYgNS40eiIgZmlsbD0icmdiYSgwLDAsMCwuMDYpIj48L3BhdGg+PC9zdmc+"
      /> -->
      <i class="icon-company"></i>
      <div class="ta-meta__content">
        <div class="ta-meta__content-title">
          <span v-show="info.name" class="name">{{ info.name }}</span>
          <div v-show="info?.tags?.length" class="ta-meta__tags">
            <template v-for="tag in info.tags" :key="`ta-meta__tags-${tag.label}`">
              <!-- <template v-if="tag.label ? tag.label.length > 20 : tag.tooltip"> -->
              <template v-if="tag.tooltip ? true : tag.label ? tag.label.length > 20 : false">
                <Tooltip :title="tag.tooltip || tag.label">
                  <Tag :color="tag.color">
                    {{ `${tag.label?.slice(0, 20)}...` }}
                  </Tag>
                </Tooltip>
              </template>
              <template v-else>
                <Tag :color="tag.color">
                  {{ tag.label }}
                </Tag>
              </template>
            </template>
          </div>
        </div>
        <div class="ta-meta__content-desc">
          <span v-show="info.describe" class="describe">{{ info.describe }}</span>
          <!-- <p v-show="info.filters">{{ info.filters }}</p> -->
          <slot name="actions"></slot>
        </div>
      </div>
    </div>
    <div v-show="follow && follow.visible" class="ta-meta__follow">
      <Button
        type="link"
        :loading="follow.loading"
        :preIcon="state.follow.options[follow.active ? 1 : 0].icon"
        @click="handleFollowClick"
      >
        {{ state.follow.options[follow.active ? 1 : 0].label }}
      </Button>
    </div>
    <div v-show="jumper && jumper.visible" class="ta-meta__jumper">
      <Tooltip placement="top">
        <template #title>
          <span>上一条数据</span>
        </template>
        <Button type="text" preIcon="ant-design:left-outlined" @click="handlePrevClick" />
      </Tooltip>
      <Tooltip placement="top">
        <template #title>
          <span>下一条数据</span>
        </template>
        <Button type="text" preIcon="ant-design:right-outlined" @click="handleNextClick" />
      </Tooltip>
    </div>
  </section>
</template>

<script lang="ts">
  import { Image, Tag, Tooltip } from "ant-design-vue";
  import type { PropType } from "vue";
  import { defineComponent, reactive, unref } from "vue";
  import { Follow, Info, Jumper } from "./types";
  import { Button } from "@casta-fe-playground/components/Button";

  const props = {
    info: {
      type: Object as PropType<Info>,
      default() {
        return {
          name: "Casstar",
          tags: []
        };
      }
    },
    follow: {
      type: Object as PropType<Partial<Follow>>,
      default() {
        return {
          visible: true
        };
      }
    },
    jumper: {
      type: Object as PropType<Partial<Jumper>>,
      default() {
        return {
          visible: true
        };
      }
    }
  };

  export default defineComponent({
    name: "Meta",
    components: { Button, Image, Tooltip, Tag },
    inheritAttrs: false,
    props,
    emits: ["follow-change"],
    setup(props, { emit }) {
      const state = reactive({
        follow: {
          options: [
            {
              label: "关注",
              icon: "ant-design:star-outlined"
            },
            {
              label: "已关注",
              icon: "ant-design:star-filled"
            }
          ]
        }
      });

      const { info } = unref(props);

      const handleFollowClick = () => {
        // state.follow.active = state.follow.active === 0 ? 1 : 0;
        emit("follow-change", { active: !props.follow.active });
      };

      const handlePrevClick = () => {
        console.log("prev");
      };

      const handleNextClick = () => {
        console.log("next");
      };

      return {
        state,
        handleFollowClick,
        handlePrevClick,
        handleNextClick
      };
    }
  });
</script>

<style lang="less">
  .ta-meta {
    position: relative;

    &__content {
      padding: 16px;
      flex: 1;

      &-wrapper {
        display: flex;
        width: 90%;
      }

      &-title {
        display: flex;
        // align-items: center;
        flex-wrap: wrap;

        .name {
          font-size: 18px;
          line-height: 24px;
          font-weight: bold;
          margin-right: 10px;
        }
      }

      &-desc {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        margin-top: 8px;

        .describe {
          font-size: 14px;
          line-height: 18px;
          font-weight: bold;
          margin-right: 16px;
        }
      }
    }

    &__tags {
      .ant-tag {
        border-radius: 20px 20px 20px 0px;
        margin-bottom: 8px;
      }
    }

    .ant-image img,
    .icon-company {
      max-height: 140px;
      // background: rgba(0, 0, 0, 0.03);
    }

    &__follow,
    &__jumper {
      button {
        padding: 0 !important;
        min-width: auto;
      }
    }

    &__follow {
      position: absolute;
      top: 16px;
      right: 16px;
      max-width: 70px;
    }

    &__jumper {
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: absolute;
      width: 50px;
      bottom: 0;
      right: 16px;
    }
  }
</style>
