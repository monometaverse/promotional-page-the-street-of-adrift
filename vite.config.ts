import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import fonts from 'vite-plugin-fonts'
import pages from 'vite-plugin-pages'
import eslint from 'vite-plugin-eslint'
import stylelint from 'vite-plugin-stylelint'
import windiCss from 'vite-plugin-windicss'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    fonts({
      google: {
        families: ['Noto Sans SC', {
          name: 'Montserrat',
          styles: 'wght@400;600'
        }, {
          name: 'Noto Serif SC',
          styles: 'wght@900'
        }, {
          name: 'Poppins',
          styles: 'wght@400;500;700'
        }]
      }
    }),
    pages(),
    eslint(),
    stylelint({
      include: 'src/**/*.vue'
    }),
    windiCss()
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
