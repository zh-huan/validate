import Vue from 'vue'
import App from './App.vue'
import validate from './src/plugin'
Vue.use(validate);
new Vue({
  el: '#app',
  render: h => h(App)
})
