// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)

Vue.config.productionTip = false

// 设置基础URL
axios.defaults.baseURL = '/api'
// 设置请求超时时间 3s
axios.defaults.timeout = 3000
// 设置axios请求头
axios.defaults.headers.common['Content-Type'] = 'application/json;charset=UTF-8'
//axios默认不发送cookie,每次请求都是新的会话
axios.defaults.withCredentials=true

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  render: h => h(App)
})
