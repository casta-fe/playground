<script  lang="ts">
import { defineComponent, reactive } from 'vue';
// import HelloWorld from './components/HelloWorld.vue';
export default defineComponent({
  name:"App",
  setup(){
    const inputNumberRangeState=reactive({
      value:[]
    })
    const changeInputNumber=(data)=>{
      inputNumberRangeState.value=data
    }
    return {
      inputNumberRangeState,
      changeInputNumber
    }
  }
})
</script>

<template>
  <!-- <img alt="Vue logo" src="./assets/logo.png" /> -->
  <!-- <HelloWorld msg="Hello Vue 3 + TypeScript + Vite" /> -->
  <TgIcon color="red" :size="30" class="tg-icon-dropbox">Icon Test</TgIcon>
  <br />
  <div class="colorTheme">测试主题变量颜色功能</div>
  <br />
  <InputNumberRange :value="inputNumberRangeState.value" @change="changeInputNumber"></InputNumberRange>
</template>

<style lang="less">
.colorTheme{
  color:@primary-color;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
