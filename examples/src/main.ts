import { createApp } from 'vue';
import 'ant-design-vue/dist/antd.css';
import '@casta-fe-playground/theme-chalk/src/index.less';
// import TgIcon from '@casta-fe-playground/components/icon1';
import InputNumberRange from '@casta-fe-playground/components/InputNumberRange';
import App from './App.vue';
const app = createApp(App);
// app.use(TgIcon);
app.use(InputNumberRange)
app.mount('#app');
