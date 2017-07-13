import Vue from 'vue'
import VueRouter from 'vue-router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import '../theme/index.css'
import 'font-awesome/css/font-awesome.min.css'
import './assets/css/custom.css'
import './assets/css/base.css'
import 'babel-polyfill'

import store from './store'

Vue.use(VueRouter)
Vue.use(ElementUI)

import router from './routes'

const App = { template: '<router-view></router-view>' }

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
