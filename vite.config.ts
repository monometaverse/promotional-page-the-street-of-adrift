import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import fonts from 'vite-plugin-fonts'
import pages from 'vite-plugin-pages'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    fonts({
      google: {
        families: ['Noto Sans SC', 'Montserrat', 'Noto Serif SC', 'Poppins']
      }
    }),
    pages()
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
