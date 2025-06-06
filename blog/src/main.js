
import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import ElementPlus from 'element-plus';
import { createPinia } from 'pinia';
import 'element-plus/dist/index.css';
import { createAuth0 } from '@auth0/auth0-vue';

const pinia = createPinia();
const app = createApp(App)
app.use(pinia);
app.use(router)
app.use(ElementPlus);


app.use(
  createAuth0({
    domain: 'dev-j8kiozma53twzodw.us.auth0.com',
    clientId: '3VZKYl4iq630d4Z2V0IAzbxNASNYs697',
    authorizationParams: {
      redirect_uri: 'https://blog-eosin-iota.vercel.app/callback',
      audience: 'https://dev-j8kiozma53twzodw.us.auth0.com/api/v2/',
      connection: 'github'
    },
  })
);

app.mount('#app' );
