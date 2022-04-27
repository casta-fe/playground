<script  lang="ts">
import { defineComponent, reactive } from 'vue';
// import HelloWorld from './components/HelloWorld.vue';
export default defineComponent({
  name:"App",
  setup(){
    const inputNumberRangeState=reactive({
      value:[]
    })
    return {
      inputNumberRangeState
    }
  }
})
</script>

<template>
  <!-- <img alt="Vue logo" src="./assets/logo.png" /> -->
  <!-- <HelloWorld msg="Hello Vue 3 + TypeScript + Vite" /> -->
  <TgIcon color="red" :size="30" class="tg-icon-dropbox">Icon Test</TgIcon>
  <br />
  <InputNumberRange :value="inputNumberRangeState.value"></InputNumberRange>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
