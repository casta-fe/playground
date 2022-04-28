<!--
 * @Author: huyb
 * @Descripttion: 名字第一个字，根据UI分析是 依据index来设置颜色，后面根据情况来修改
 * @Date: 2021-11-09 20:09:57
-->
<template>
  <span class="name-letter" :class="'letter-' + ((index % 4) + 1)">
    {{ letter }}
  </span>
</template>

<script lang="ts">
  import { defineComponent, onMounted, reactive, toRefs } from "vue";
  export default defineComponent({
    props: {
      value: {
        type: Object,
        required: true
      }
    },
    setup(props) {
      const state = reactive({
        letter: "",
        index: 0
      });
      const pageInit = () => {
        let { name, phone } = props.value;
        state.letter = name.substring(0, 1);
        state.index = phone.substring(10, 1);
      };
      onMounted(() => {
        pageInit();
      });
      return {
        ...toRefs(state)
      };
    }
  });
</script>

<style lang="less" scoped>
  .name-letter {
    display: inline-block;
    width: 16px;
    height: 16px;
    line-height: 16px;
    text-align: center;
    border-radius: 8px;
    color: #fff;
    font-size: 12px;
    margin-right: 8px;
  }
  @colors: #ffaaaa #83e6b8 #ffd788 #95bcff;
  @len: length(@colors);
  .Loop(@index) when (@index<=@len) {
    .letter-@{index} {
      @color: extract(@colors, @index);

      background: @color;
    }
    .Loop(@index+1);
  }
  .Loop(0);
</style>
