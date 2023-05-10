import { useStore } from './../store'
import moment from "moment"
import { storeToRefs } from "pinia"
import { Object3D } from "three"
import { createApp, reactive, ref, Ref, h, App, computed } from "vue"
import { useI18n } from "vue-i18n"
import api, { isSuccess } from "../api"
import messageBar from '../components/message-bar.vue'
import { useWindowSize } from '@vueuse/core'

type DebouncedFunc<T extends (...args: any[]) => void> = (...args: Parameters<T>) => void
type DebounceFunc = <T extends (...args: any[]) => void = () => void>(func: T, time: number) => DebouncedFunc<T>

// 防抖函数
// 在固定时间内多次调用时只会执行一次
export const debounce: DebounceFunc = <T extends (...args: any[]) => any = () => void>(func: T, time: number) => {
  let timer = 0
  return (...args: Parameters<T>) => {
    if (timer) {
      // 如果计时器存在，清除计时器
      window.clearTimeout(timer)
    }
    // 设置计时器
    timer = window.setTimeout(func, time, ...args)
  }
}

/**
 * 搜索 3D 对象的子对象
 * @param root 根对象
 * @param childName 子对象的名称
 * @param deep 是否需要深度搜索，如果需要，会搜索子对象的子对象
 */
export const getChildObject = (root: Object3D[] | Object3D, childName: string, deep: boolean, first: boolean): Object3D | undefined => {
  if (Array.isArray(root)) {
    for (let obj of root) {
      const child = getChildObject(obj, childName, deep, false)
      if (child) {
        return child
      }
    }
    return undefined
  } else {
    if (root.name === childName) {
      return root
    } else if (deep || first) {
      return getChildObject(root.children, childName, deep, false)
    }
    return undefined
  }
}

/**
 * 使用分页组件
 * @param 页面数据数组
 * @param beforeSwitch 页面切换之前要做的事情
 * @param afterSwitch 当页面切换之后要做的事情
 */
export const usePagination = <T extends Ref<any[]>>(pages: T, beforeSwitch?: (next: boolean, prev: number) => void, afterSwitch?: (next: boolean, nextIndex: number) => void) => {
  // 当前页面
  const currentIndex = ref(0)
  // 下一页或上一页
  const prevOrNext = (next: boolean) => {
    // 回调
    beforeSwitch?.(next, currentIndex.value)
    if (next) {
      // 下一张，如果是最后一张就跳到第一张
      if (currentIndex.value < pages.value.length - 1) {
        currentIndex.value += 1
      } else {
        currentIndex.value = 0
      }
    } else {
      // 上一张，如果是第一张就跳到最后一张
      if (currentIndex.value === 0) {
        currentIndex.value = pages.value.length - 1
      } else {
        currentIndex.value -= 1
      }
    }
    // 回调
    afterSwitch?.(next, currentIndex.value)
  }
  // 下一页
  const next = () => prevOrNext(true)
  // 上一页
  const prev = () => prevOrNext(false)
  return {
    currentIndex,
    next,
    prev,
    prevOrNext
  }
}

export interface Message {
  show(text: string): void
}
export interface MyMessageEvent extends Event {
  text: string
}

const newShowMessageEvent = (text: string) => {
  const event = new Event('showSnackBar')
  Object.assign(event, { text })
  return event
}

// 导出使用函数
export const useMessage = (): Message => {
  return (() => {
    let app: App<Element>
    let created: boolean = false
    return {
      show: (textLocal: string) => {
        let containerEl = document.querySelector('#vuetify-snackbar-container') as HTMLDivElement
        const staticFramework = document.querySelector('.static-framework') as HTMLDivElement
        if (!containerEl) {
          // 容器元素不存在，新建一个
          containerEl = document.createElement('div')
          containerEl.id = 'vuetify-snackbar-container'
          staticFramework?.appendChild(containerEl)
        }
        // 新建一个 vue 实例
        if (!app) {
          app = createApp(messageBar)
          app.mount(containerEl)
          created = true
        }
        setTimeout(() => {
          window.dispatchEvent(newShowMessageEvent(textLocal))
          created = false
        }, created ? 50 : 0) // 添加一个延迟，避免没有动画
        // 定时关闭
        setTimeout(() => {
          window.dispatchEvent(new Event('hideSnackBar'))
        }, 5000)
      },
    }
  })()
}

// 活动开始时间
export const useActivityDate = () => {
  /**
   * 是否已经开始预约
   * @returns boolean 函数，调用之后可以获取预约是否开始
   */
  const started = () => moment('2022-06-25T11:00:00.000Z').diff(moment()) <= 0
  return {
    started
  }
}

// 拼接 OSS 路径
export const ossPath = (path: string) => {
  return `${import.meta.env.VITE_APP_OSS_URL_BASE}${path}`
}

// 前往登录页面，并等待登录页面返回消息
export const useLoginAndMessage = () => {
  let childWindow: Window | null = null
  const message = useMessage()
  const i18n = useI18n()
  const apiBase = import.meta.env.VITE_APP_MONO_FE
  const { userInfo } = storeToRefs(useStore())
  // 消息接收器
  const messageHandler = async (ev: MessageEvent) => {
    // 检查来源，避免被跨站攻击
    if (ev.origin === 'https://uat.mono.fun' || ev.origin === 'https://uat-preview.mono.fun'
      || ev.origin === 'https://mono.fun' || ev.origin === 'https://www.mono.fun' || ev.origin === apiBase) {
      if (ev.data.isLogin) {
        // 登录成功了，尝试获取一下用户信息
        const res = await api.user.getLoginInfo()
        console.log(res)
        if (isSuccess(res)) {
          userInfo.value = res.data
          childWindow?.close()
          console.log('window closed')
          // 注销消息接收器
          window.removeEventListener('message', messageHandler)
        }
      }
    }
  }
  return () => {
    // 区分环境
    childWindow = window.open(apiBase + '/login', '_blank')
    if(!childWindow) { // 如果没有获取到跳转后的窗口
      message.show(i18n.t('static.failedToOpenLoginWindow'))
      return
    }
    // 注册消息接收器
    window.addEventListener('message', messageHandler)
  }
}

export const useItemsPageButtonSize = (() => {
  const {width: windowW} = useWindowSize()
  const buttonsSize = computed(() => {
    return windowW.value > 1080 ? {
      width: '12rem',
      height: '4rem'
    } : {
      width: '6rem',
      height: '2rem'
    }
  })
  return () => buttonsSize
})()
