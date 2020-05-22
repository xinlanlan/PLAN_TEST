import Vue from 'vue'
import App from './App.vue'

console.log(1)
console.log(2)

new Vue({
    render: h => h(App)
}).$mount('#app')