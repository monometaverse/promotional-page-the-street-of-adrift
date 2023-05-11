import { LoginInfo } from './api/index'
import { LoadedResources } from './components/ResourceLoader/Resources'
import { defineStore } from 'pinia'
import { computed, reactive, ref } from 'vue'
import { useMediaQuery, useMouse, useWindowSize } from '@vueuse/core'
import UAParser from 'ua-parser-js'

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
  // 是否处于手机端
  const isOnMobile = useMediaQuery('(max-width: 1079px)')
  const isOnTablet = useMediaQuery('(max-width: 1679px)')
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
  // 检测是否在移动设备上，使用 user-agent 方式
  // 当宽度发生变化时再检测一次，这样 DevTools 切换视图时也能收到变化，不需要刷新页面
  const isOnMobileByUserAgent = computed(() => {
    windowWidth.value, windowHeight.value
    const device = new UAParser(navigator.userAgent).getDevice()
    return device.type === 'mobile' || device.type === 'tablet'
  })
  // 用户信息
  const userInfo = ref<LoginInfo | null>(null)
  // 在登录后立即发起预约请求的 NFT 在详情页中的索引
  const shouldReserveAfterLogin = ref(-1)
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
    infoElPos,
    isOnMobile,
    isOnTablet,
    isOnMobileByUserAgent,
    userInfo,
    shouldReserveAfterLogin
  }
})

export type MessageInfo = {
  id: number
  text: string
}

/**
 * 使用提醒消息
 */
export const useMessage = defineStore('message', () => {
  const messages = ref<MessageInfo[]>([])
  const show = (msg: string) => {
    messages.value.push({
      text: msg,
      id: window.setTimeout(() => messages.value.shift(), 5000)
    })
  }
  const remove = (id: number) => {
    clearTimeout(id)
    messages.value = messages.value.filter(it => it.id !== id)
  }

  return {
    messages,
    show,
    remove
  }
})
