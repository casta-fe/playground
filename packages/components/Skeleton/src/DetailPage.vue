<script lang="tsx">
  import { defineComponent } from "vue";
  import { Skeleton, Divider } from "ant-design-vue";
  import { Loading } from "@casta-fe-playground/components/Loading";

  export default defineComponent({
    setup() {
      return () => (
        <div class="ta-skeleton-detail-page" style={{ padding: "16px 30px" }}>
          <Loading loading={true} absolute={true} tip={"正在加载数据 😉"} />
          <Skeleton avatar={{ size: 140, shape: "square" }} paragraph={{ rows: 2 }} />
          <Divider />
          <Skeleton paragraph={{ rows: 4 }} />
          <Skeleton paragraph={{ rows: 4 }} />
        </div>
      );
    }
  });
</script>
