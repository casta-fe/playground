import { createApp } from 'vue';
import TgIcon from '@casta-fe-playground/components/icon';
import App from './App.vue';
import '@casta-fe-playground/theme-chalk/src/index.scss';

const app = createApp(App);
app.use(TgIcon);
app.mount('#app');
