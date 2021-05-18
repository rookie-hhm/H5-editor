import { createApp } from 'vue'
import App from './App.vue'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import '@/style/global.scss'
import '@/icons/index'
import SvgIcon from '@/components/SvgIcon.vue'
import router from './routes/index'
import store from './store/index'
const app = createApp(App)

app.component(SvgIcon.name, SvgIcon)

app.use(Antd).use(router).use(store)
.mount('#app')
