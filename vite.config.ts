import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import fonts from 'vite-plugin-fonts'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    fonts({
      google: {
        families: ['Noto Sans SC', 'Montserrat', 'Noto Serif SC']
      }
    })
  ],
  assetsInclude: [/glb/, /hdr/],
  build: {
    assetsInlineLimit: 0,
    rollupOptions: {
      output: {
        assetFileNames: `assets/[name].[ext]`
      }
    }
  }
})
