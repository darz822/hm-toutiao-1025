import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
//
import router from '@/router'

import axios from '@/api'
// import MyBread from '@/components/my-bread'
// Vue.component('my-bread', MyBread)
import plugin from '@/components'
Vue.use(plugin)
Vue.prototype.$http = axios

Vue.use(ElementUI)

Vue.config.productionTip = false

// 根实例
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

// main.js的作用是入口文件
// 职责1：创建一个根实例
// 职责2：负责全局范围的依赖导入
