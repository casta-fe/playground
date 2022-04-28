<!--
 * @Author: huyb
 * @Descripttion: 关注组件
 * @Date: 2021-12-09 14:13:36
-->
<template>
  <Button
    class="ta-basic-follow"
    :class="{ 'ta-basic-follow-active': isFollow }"
    type="link"
    @click="changFollwStatus"
    :loading="loading"
  >
    <span class="iconify" data-icon="bxs:star"></span>
    <span v-if="isFollow" class="active"> 已关注 </span>
    <span v-else>关注</span>
  </Button>
</template>

<script lang="ts">
  import { defineComponent, reactive, toRefs, watch } from "vue";
  import { Button } from "@casta-fe-playground/components/Button";
  import { useMessage } from "@casta-fe-playground/hooks/index";
  //  1 企业 2投资项目 3退出项目 4基金 5 投资人
  interface FollowType {
    id: number | string;
    type: number;
  }
  const followApi: any = {};
  export default defineComponent({
    components: {
      Button
    },
    props: {
      params: {
        type: Object as PropType<FollowType>,
        required: true
      }
    },
    emits: ["update:show"],
    setup(props) {
      const { createMessage } = useMessage();
      const state = reactive({
        loading: false,
        isFollow: false
      });
      const getFollwStatus = () => {
        // followApi.getFollwStatus(props.id).then((res) => {
        //   state.isFollow = res.data ? !!res.data.status : false;
        // });
      };
      const changFollwStatus = () => {
        state.loading = true;
        followApi
          .updateFollowStatus({ followId: props.params.id, type: props.params.type })
          .then(() => {
            let msg = state.isFollow ? "取消成功" : "关注成功";
            state.loading = false;
            state.isFollow = !state.isFollow;
            createMessage.success(msg);
          })
          .catch(() => {
            state.loading = false;
          });
      };
      getFollwStatus();
      watch(
        () => props.params.id,
        (newData) => {
          if (newData) {
            getFollwStatus();
          }
        }
      );
      return {
        ...toRefs(state),
        getFollwStatus,
        changFollwStatus
      };
    }
  });
</script>

<style lang="less" scoped>
  .ta-basic-follow {
    padding: 0 !important;
    min-width: 0;
    color: #999;
    .iconify {
      margin: 0 5px;
      vertical-align: -2px;
    }
    &-active {
      color: #f00;
      // color: @primaryColor;
    }
  }
</style>
