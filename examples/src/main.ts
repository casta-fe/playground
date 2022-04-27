import { createApp } from 'vue';
import './App.less';
import TgIcon from '@casta-fe-playground/components/icon1';
import App from './App.vue';

const app = createApp(App);
app.use(TgIcon);
app.mount('#app');
