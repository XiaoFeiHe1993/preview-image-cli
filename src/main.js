import { createApp } from 'vue'
import './style.css'
import 'viewerjs/dist/viewer.css'
import 'video.js/dist/video-js.css'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'vue-waterfall-plugin-next/style.css'

const app = createApp(App)
app.use(ElementPlus)
app.mount('#app')
