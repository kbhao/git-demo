import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/css/global.css'
import '../static/download/iconfont.css'
import axios from 'axios'
axios.defaults.baseURL = 'https://api.naccl.top/vue/shop/api/private/v1/'
Vue.prototype.$http = axios


Vue.config.productionTip = false
Vue.use(ElementUI);
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
