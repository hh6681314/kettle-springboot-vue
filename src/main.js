import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import http from './request/http';


Vue.use(Antd);
Vue.prototype.$http = http;
//request.defaults.headers.common['Authorization'] = AUTH_TOKEN;

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
