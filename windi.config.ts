import { defineConfig } from 'windicss/helpers'

export default defineConfig({
  content: [
    './src/**/*.vue'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Noto Sans SC', 'sans-serif'],
        serif: ['Noto Serif SC', 'sans-serif'],
        monsterrat: ['Montserrat', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif']
      },
    },
    screens: {
      sm: '1080px', // <md
      xl: '1680px' // <xl
    }
  }
})
