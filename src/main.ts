import Vue from 'vue'
import App from './App.vue'
import WaveUI from 'wave-ui';
import 'wave-ui/dist/wave-ui.css'

Vue.config.productionTip = false

Vue.use(WaveUI);

const waveui = new WaveUI({})

new Vue({
  waveui,
  render: h => h(App),
}).$mount('#app')
