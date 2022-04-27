

<template>
  <h1 style="text-align: center;">Casta-fe-playground TEST</h1>
  <div class="colorTheme">测试主题变量颜色功能</div>
  <InputNumberRange />
  <TgIcon color="red" :size="30" class="tg-icon-dropbox">Icon Test</TgIcon>
  <Button />
  <TimeLineList></TimeLineList>
  <BasicTable/>
  <UseForm/>
</template>

<script  lang="ts">
import BasicTable from "./components/Table/Basic.vue"
import UseForm from "./components/Form/UseForm.vue"
import Button from "./components/Button.vue";
import InputNumberRange from "./components/InputNumberRange.vue";
import TimeLineList from './components/TimeLineList.vue'
import { defineComponent } from 'vue';
export default defineComponent({
  name:"App",
  components:{
    Button,
    InputNumberRange,
    TimeLineList,
    BasicTable,
    UseForm
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
