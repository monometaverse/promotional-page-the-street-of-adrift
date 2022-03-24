import { createApp } from 'vue'
import App from './App.vue'
import {i18n} from './locales'
import { createRouter, createWebHashHistory } from 'vue-router'
import routes from '~pages'

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

createApp(App)
  .use(i18n)
  .use(router)
  .mount('#app')
