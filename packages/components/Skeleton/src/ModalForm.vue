<script lang="tsx">
  import { defineComponent } from "vue";
  import { Skeleton } from "ant-design-vue";
  import { Loading } from "@casta-fe-playground/components/Loading";

  export default defineComponent({
    setup() {
      return () => (
        <div class="ta-skeleton-modal-form" style={{ padding: "16px 30px" }}>
          <Loading loading={true} absolute={true} tip={"正在加载数据 😉"} />
          <Skeleton paragraph={{ rows: 4 }} />
          <Skeleton paragraph={{ rows: 4 }} />
        </div>
      );
    }
  });
</script>
