import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import { useMouse, useWindowSize } from '@vueuse/core'

export const useStore = defineStore('main', () => {
  // 是否是刷新后首次进入首页
  const firstEnter = ref(true)
  // 是否应该开始静态框架的动画
  const staticFrameworkAnimationStart = ref(false)
  // 是否应该开始滚动提示的动画
  const scrollHintAnimationStart = ref(false)
  // 是否已经可以滚动以切换页面了
  const allowScroll = ref(false)
  // 鼠标的位置
  const mousePos = reactive(useMouse())
  // 屏幕大小
  const { width: windowWidth, height: windowHeight } = useWindowSize()
  return {
    firstEnter,
    staticFrameworkAnimationStart,
    scrollHintAnimationStart,
    allowScroll,
    mousePos,
    windowWidth,
    windowHeight
  }
})
