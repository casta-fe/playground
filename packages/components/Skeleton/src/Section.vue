<script lang="tsx">
  import { Skeleton } from "ant-design-vue";
  import { defineComponent } from "vue";
  import { Loading } from "@casta-fe-playground/components/Loading";

  export default defineComponent({
    name: "SkeletonSection",
    props: {
      useLoading: {
        type: Boolean,
        default: true
      },
      useSkeleton: {
        type: Boolean,
        default: true
      }
    },
    setup(props) {
      const InnerLoading = () =>
        props.useLoading ? (
          <Loading loading={true} absolute={true} tip={"正在加载数据 😉"} />
        ) : null;

      const InnerSkeleton = () =>
        props.useSkeleton ? (
          <>
            <Skeleton paragraph={{ rows: 2 }} />
            <Skeleton paragraph={{ rows: 4 }} />
          </>
        ) : null;
      return () => (
        <div class="ta-skeleton-section" style={{ padding: "16px" }}>
          {InnerLoading()}
          {InnerSkeleton()}
        </div>
      );
    }
  });
</script>

<style lang="less">
  .ta-skeleton-section {
    position: relative;

    .full-loading {
      &.absolute {
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 1;
      }
    }
  }
</style>
