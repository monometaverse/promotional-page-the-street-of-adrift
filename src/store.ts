import { LoadedResources } from './components/ResourceLoader/Resources'
import { defineStore } from 'pinia'
import { computed, reactive, ref } from 'vue'
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
  // 已经加载好的资源
  const res = ref<LoadedResources | null>(null)
  // 当前正在显示的阵营图片
  const showingCharacter = ref(new Image())
  // 所有的阵营图片资源
  const allImagesForParticles = computed(() => res.value?.filter(it => it.for === 'particle'))
  // 根据名称和用途获取资源
  const getRes = (name: LoadedResources[number]['name'], forWhat: LoadedResources[number]['for']) => {
    const r = res.value?.find(it => it.name === name && it.for === forWhat)
    if (!r) throw new Error(`获取不到此资源，名称：${name}，用途：${forWhat}`)
    return r
  }
  // 角色信息块的位置
  const infoElPos = ref({ x: 0, y: 0 })
  return {
    firstEnter,
    staticFrameworkAnimationStart,
    scrollHintAnimationStart,
    allowScroll,
    mousePos,
    windowWidth,
    windowHeight,
    res,
    showingCharacter,
    allImagesForParticles,
    getRes,
    infoElPos
  }
})
