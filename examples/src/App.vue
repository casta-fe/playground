

<template>
  <h1 style="text-align: center;">Casta-fe-playground TEST</h1>
  <div class="colorTheme">测试主题变量颜色功能</div>
  <InputNumberRange />
<<<<<<< HEAD
  <TgIcon color="red" :size="30" class="tg-icon-dropbox">Icon Test</TgIcon>
  <Button />
</template>

<script  lang="ts">
import Button from "./components/Button.vue";
import InputNumberRange from "./components/InputNumberRange.vue";
import { defineComponent } from 'vue';
export default defineComponent({
  name:"App",
  components:{
    Button,
    InputNumberRange
  },
  setup(){
    return {}
  }
})
=======
  <BasicTable/>
  <UseForm/>
</template>

<script lang="ts">
  import { defineComponent } from "vue";
  import Button from "./components/Button.vue";
  import InputNumberRange from "./components/InputNumberRange.vue";
  import BasicTable from "./components/Table/Basic.vue"
  import UseForm from "./components/Form/UseForm.vue"

  export default defineComponent({
    name: "App",
    components: { Button, InputNumberRange, BasicTable, UseForm },
    setup() {
      return {};
    }
  });
>>>>>>> 622e346 (feat(component): component)
</script>

<style lang="less">
  .colorTheme {
    color: @primary-color;
  }
</style>
