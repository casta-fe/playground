<template>
  <div class="p-2">
    <div class="p-4 mb-2 bg-white">
      <BasicForm @register="registerForm" />
    </div>
    {{ sliderProp.width }}
    <div class="p-2 bg-white">
      <List
        :grid="{ gutter: 5, xs: 1, sm: 2, md: 4, lg: 4, xl: 6, xxl: cardListGrid }"
        :data-source="data"
        :pagination="paginationProp"
      >
        <template #header>
          <div class="flex justify-end space-x-2">
            <slot name="header"></slot>
            <Tooltip>
              <template #title>
                <div class="w-50">每行显示数量</div>
                <Slider id="slider" v-bind="sliderProp" v-model:value="cardListGrid" @change="sliderChange"
              /></template>
              <Button><TableOutlined /></Button>
            </Tooltip>
            <Tooltip @click="fetch">
              <template #title>刷新</template>
              <Button><RedoOutlined /></Button>
            </Tooltip>
          </div>
        </template>
        <template #renderItem="{ item }">
          <ListItem>
            <Card>
              <template #title></template>
              <template #cover>
                <div :class="height">
                  <Image :src="item.imgs[0]" />
                </div>
              </template>
              <!-- <template class="ant-card-actions" #actions> -->
              <template #actions>
                <!--              <SettingOutlined key="setting" />-->
                <EditOutlined key="edit" />
                <Dropdown
                  :trigger="['hover']"
                  :dropMenuList="[
                    {
                      text: '删除',
                      event: '1',
                      popConfirm: {
                        title: '是否确认删除',
                        confirm: handleDelete.bind(null, item.id)
                      }
                    }
                  ]"
                  popconfirm
                >
                  <EllipsisOutlined key="ellipsis" />
                </Dropdown>
              </template>

              <CardMeta>
                <template #title>
                  <TypographyText :content="item.name" :ellipsis="{ tooltip: item.address }" />
                </template>
                <template #avatar>
                  <Avatar :src="item.avatar" />
                </template>
                <template #description>{{ item.time }}</template>
              </CardMeta>
            </Card>
          </ListItem>
        </template>
      </List>
    </div>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, onMounted, ref } from "vue";
import { EditOutlined, EllipsisOutlined, RedoOutlined, TableOutlined } from "@ant-design/icons-vue";
import { List, Card, Image, Typography, Tooltip, Slider, Avatar } from "ant-design-vue";
import { Dropdown } from "@casta-fe-playground/components/Dropdown";
import { BasicForm, useForm } from "@casta-fe-playground/components/Form";
import { propTypes } from "@casta-fe-playground/utils";
import { Button } from "@casta-fe-playground/components/Button";
import { isFunction } from "@casta-fe-playground/utils";
import { useCardListSlider, cardListGrid } from "./data";
const TypographyText = Typography.Text;

const ListItem = List.Item;
const CardMeta = Card.Meta;
export default defineComponent({
  name: "CardList",
  emits: ["getMethod", "delete"],
  components: {
    TypographyText,
    ListItem,
    CardMeta,
    Button,
    BasicForm,
    Dropdown,
    Image,
    Tooltip,
    Slider,
    Avatar,
    EditOutlined,
    EllipsisOutlined,
    RedoOutlined,
    TableOutlined
  },
  props: {
    // 请求API的参数
    /* eslint-disable-next-line */
    params: propTypes.object.def({}),
    //api
    /* eslint-disable-next-line */
    api: propTypes.func
  },
  setup(props,{emit}) {
    // 获取slider属性
    const sliderProp = computed(() => useCardListSlider(4));
    //数据
    const data = ref([]);
    // 切换每行个数
    // cover图片自适应高度
    //修改pageSize并重新请求数据

    const height = computed(() => {
      return `h-${120 - cardListGrid.value * 6}`;
    });

     //表单提交
    const  handleSubmit=async ()=> {
      const data = await validate();
      await fetch(data);
    }
    //表单
    const [registerForm, { validate }] = useForm({
      schemas: [{ field: "type", component: "Input", label: "类型" }],
      labelWidth: 80,
      baseColProps: { span: 6 },
      actionColOptions: { span: 24 },
      autoSubmitOnEnter: true,
      submitFunc: handleSubmit
    });
   
    const sliderChange=(n)=> {
      pageSize.value = n * 4;
      fetch();
    }

    // 自动请求并暴露内部方法
    onMounted(() => {
      fetch();
      emit("getMethod", fetch);
    });

    async function fetch(p = {}) {
      const { api, params } = props;
      if (api && isFunction(api)) {
        const res = await api({ ...params, page: page.value, pageSize: pageSize.value, ...p });
        data.value = res.items;
        total.value = res.total;
      }
    }
    //分页相关
    const page = ref(1);
    const pageSize = ref(36);
    const total = ref(0);
    const pageSizeChange=(_current, size)=> {
      pageSize.value = size;
      fetch();
    }
   

    const pageChange=(p, pz)=> {
      page.value = p;
      pageSize.value = pz;
      fetch();
    }
   

    const handleDelete=(id)=> {
      emit("delete", id);
    }

    const paginationProp = ref({
      showSizeChanger: false,
      showQuickJumper: true,
      pageSize,
      current: page,
      total,
      showTotal: (total) => `总 ${total} 条`,
      onChange: pageChange,
      onShowSizeChange: pageSizeChange
    });
    return {
      registerForm,
      handleDelete,
      pageSizeChange,
      paginationProp,
      pageChange,
      sliderProp,
      height,
      fetch,
      sliderChange,
      grid
    }
  }
});
</script>
