

<template>
  <h1 style="text-align: center;">Casta-fe-playground TEST</h1>
  <div class="colorTheme">测试主题变量颜色功能</div>
  <InputNumberRange />
  <!-- <TgIcon color="red" :size="30" class="tg-icon-dropbox">Icon Test</TgIcon> -->
  <Button />
  <TimeLineListPage />
  <BasicTable />
  <UseForm />
  <TimePage />
  <InputPage />
  <TableTagsPage />
  <CardListPage />
  <FileViewPage />
  <TaUpload />
</template>

<script lang="ts">
import BasicTable from "./components/Table/Basic.vue"
import UseForm from "./components/Form/UseForm.vue"
import Button from "./components/Button.vue";
import InputNumberRange from "./components/InputNumberRange.vue";
import TimeLineListPage from './components/TimeLineList.vue'
import TimePage from './components/Time/index.vue'
import InputPage from './components/Input/index.vue'
import TableTagsPage from './components/tableTags/index.vue'
import CardListPage from './components/CardList/index.vue'
import FileViewPage from './components/fileView/index'
import TaUpload from './components/TaUpload.vue'


import { defineComponent } from 'vue';
export default defineComponent({
  name:"App",
  components:{
    InputNumberRange,
    Button,
    TimeLineListPage,
    BasicTable,
    UseForm,
    TimePage,
    InputPage,
    TableTagsPage,
    CardListPage,
    FileViewPage,
    TaUpload
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
