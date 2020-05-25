import Vue from 'vue'
import App from './App.vue'
import router from './router'
import * as add from './test'
const path = require('path')

Vue.config.productionTip = false

let files = require.context('./views', false, /\.vue$/)
console.log(files.keys())
console.log(files('./About.vue').default || files('./About.vue'))
console.log(path.basename('./About.vue', '.vue'))

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')