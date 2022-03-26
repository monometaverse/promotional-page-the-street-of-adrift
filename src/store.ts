import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useStore = defineStore('main', () => {
  const firstEnter = ref(true)
  return {
    firstEnter
  }
})
