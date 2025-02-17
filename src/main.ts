import { createApp } from 'vue'
import App from './App.vue'
import { i18n } from './locales'
import { createRouter, createWebHashHistory } from 'vue-router'
import routes from '~pages'
import { createPinia } from 'pinia'
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import { http, createConfig, WagmiPlugin } from '@wagmi/vue'
import { base, baseSepolia } from '@wagmi/vue/chains'
import 'virtual:windi.css'

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

const queryClient = new QueryClient()
const config = createConfig({
  chains: [base, baseSepolia],
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
})

createApp(App)
  .use(i18n)
  .use(router)
  .use(createPinia())
  .use(WagmiPlugin, { config })
  .use(VueQueryPlugin, { queryClient })
  .mount('#app')
