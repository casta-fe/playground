

<template>
  <h1 style="text-align: center;">Casta-fe-playground TEST</h1>
  <div class="colorTheme">测试主题变量颜色功能</div>
  <InputNumberRange />
  <TgIcon color="red" :size="30" class="tg-icon-dropbox">Icon Test</TgIcon>
  <Button />
  <TimeLineList></TimeLineList>
  <BasicTable/>
  <UseForm/>
  <Time></Time>
  <Input />
  <TableTags/>
  <CardList/>
</template>

<script lang="ts">
import BasicTable from "./components/Table/Basic.vue"
import UseForm from "./components/Form/UseForm.vue"
import Button from "./components/Button.vue";
import InputNumberRange from "./components/InputNumberRange.vue";
import TimeLineList from './components/TimeLineList.vue'
import Time from './components/Time/index.vue'
import Input from './components/Input/index.vue'
import TableTags from './components/tableTags/index.vue'
import CardList from './components/CardList/index.vue'

import { defineComponent } from 'vue';
export default defineComponent({
  name:"App",
  components:{
    InputNumberRange,
    Button,
    TimeLineList,
    BasicTable,
    UseForm,
    Time,
    Input,
    TableTags,
    CardList
  },
  setup(){
    return {}
  }
})
</script>

<style lang="less">
  .colorTheme {
    color: @primary-color;
  }
</style>
