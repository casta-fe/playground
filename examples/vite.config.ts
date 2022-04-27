import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from "@vitejs/plugin-vue-jsx";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(),vueJsx()],
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
    preprocessorOptions: {
      less: {
        modifyVars:{
          "primary-color": "#3351c7",
        },
        javascriptEnabled: true
      }
    }
  },
});
