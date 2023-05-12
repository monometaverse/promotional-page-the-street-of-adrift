<script setup lang="ts">
import particlesForCharacter from './components/particles-for-characters.vue'
import ResourceLoader from './components/ResourceLoader/index.vue'
import { computed, CSSProperties, onMounted, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { LoadedResources } from './components/ResourceLoader/Resources'
import { useRoute, useRouter } from 'vue-router'
import { gsap } from 'gsap'
import { useMessage, useStore } from './store'
import { storeToRefs } from 'pinia'
import { useElementSize, useEventListener, useTitle } from '@vueuse/core'
import { useSwipe } from '@vueuse/core'
import { useStyleTag } from '@vueuse/core'
import { MenuItem } from '@headlessui/vue'
import DropdownMenu from './components/dropdown-menu.vue'
import navOnMobile from './components/nav-on-mobile.vue'
import navOnDesktop from './components/nav-on-desktop.vue'
import sharePic from './assets/static-framework/share-pic.webp'
import defaultProfileAvatar from './assets/static-framework/default_profile.png'
import api, { isSuccess } from './api'
import { ossPath, useLoginAndMessage, useItemsPageButtonSize } from './utils'
import TextButton from './components/text-button.vue'
import LoginDialog from './components/login-dialog.vue'
import MessageBar from './components/message-bar.vue'
import Orders from './components/Orders/orders.vue'

// pinia
const store = useStore()
const { firstEnter, staticFrameworkAnimationStart, scrollHintAnimationStart , allowScroll, windowWidth, windowHeight, res: loadedRes, isOnMobile, isOnMobileByUserAgent, userInfo } = storeToRefs(store)
// 当资源加载完成时
const onResourceLoadComplete = (res: LoadedResources) => {
  loadedRes.value = res
  router.push('/')
}
// i18n 切换语言
const i18n = useI18n()
const title = useTitle()
const setLocale = (locale: string) => {
  i18n.locale.value = locale
  localStorage.setItem('locale', locale)
  title.value = i18n.locale.value === 'zh' ? '彷徨之街' : 'The Street of Adrift'
}
// 路由，等英文文案准备好之后改用 i18n
const routes = ref([
  { to: '/', name: 'static.home' },
  { to: '/items', name: 'static.item' },
  { to: '/characters', name: 'static.character' },
  { to: '/settings', name: 'static.settings' },
  { to: '/archives', name: 'static.archives' },
])
// 获取路由名称
const getRouteName = (path: string): string => {
  for (let r of routes.value) {
    if (r.to === path) {
      return r.name
    }
  }
  return ''
}
// 正在显示的页面名称
const pageName = ref('static.home')
// 当前路由
const currentRoute = useRoute()
const router = useRouter()
// 当前显示的路由路径
const currentRoutePath = ref('')
// 上一个路由路径
const prevRoutePath = ref('')
// 在每次路由切换之前进行操作
router.beforeEach((to, from, next) => {
  // 资源尚未加载完成，不进入页面
  if (!loadedRes.value) {
    next(false)
    return
  }
  // 获取要前往的路由的背景
  let routeName = ''
  if (to.path === '/') {
    routeName = 'static.home'
  } else {
    routeName = getRouteName(to.path)
  }
  const backgroundFound = loadedRes.value.find((it) => it.name === routeName + 'Background')
  if (!backgroundFound) {
    throw new Error('未找到需要的背景图片，这种情况不应该出现，需要找的是: ' + routeName + 'Background')
  }
  // 设置目前的路由和上一个路由
  prevRoutePath.value = currentRoutePath.value
  currentRoutePath.value = currentRoute.path
  // 取消正在进行的动画
  gsap.killTweensOf(backgroundCss.value)
  if (backgroundCss.value['background-image']) {
    // 如果已经设置背景，把背景渐隐
    gsap.to(backgroundCss.value, { opacity: 0, duration: 0.25, onComplete: () => {
      // 在渐隐完成之后设置新的背景，并渐显
      backgroundCss.value['background-image'] = `url('${(backgroundFound.value as HTMLImageElement).src}')`
      gsap.to(backgroundCss.value, { opacity: 1, duration: 0.25 })
    }})
  } else {
    // 没有设置背景，设置背景，并渐显
    backgroundCss.value['background-image'] = `url('${(backgroundFound.value as HTMLImageElement).src}')`
    gsap.to(backgroundCss.value, { opacity: 1, duration: 0.25 })
  }
  // 取消页码正在进行的动画
  gsap.killTweensOf(pageNumberAnimateObj.value)
  // 获取页码当前应该向上还是向下移动
  const pageNumberActualDistance = getTranslateDistance(to.path, from.path)
  // 使页码消失
  gsap.to(pageNumberAnimateObj.value, { opacity: 0, transform: -pageNumberActualDistance, duration: 0.25, onComplete: () => {
    // 更新页码数字
    pageNumber.value = indexOfRoute(currentRoute.path) + 1
    // 消失之后重新显示
    gsap.fromTo(pageNumberAnimateObj.value, { opacity: 0, transform: pageNumberActualDistance }, { opacity: 1, transform: 0, duration: 0.25 })
  }})
  // 取消左上角标题正在进行的动画
  gsap.killTweensOf('.page-title')
  if (to.path === '/') {
    // 隐藏标题
    gsap.to('.page-title', { opacity: 0, duration: 0.5 })
  } else if (from.path === '/') {
    // 显示标题
    pageName.value = getRouteName(to.path)
    gsap.to('.page-title', { opacity: 1, duration: 0.5 })
  } else {
    // 隐藏标题
    gsap.to('.page-title', { opacity: 0, duration: 0.25, onComplete: () => {
      // 显示标题
      pageName.value = getRouteName(to.path)
      gsap.to('.page-title', { opacity: 1, duration: 0.25 })
    }})
  }
  next()
})
// 当导航中的某一项被点击
const onNavItemSelected = (to: string) => {
  router.push(to)
}
// 获取路由的索引
const indexOfRoute = (to: string): number => {
  for (let index in routes.value) {
    if (routes.value[index].to === to) {
      return parseInt(index)
    }
  }
  return -1
}
// 页面元素上的动画样式，可以被 GSAP 操作
const pageNumberAnimateObj = ref({
  opacity: 1,
  transform: 0
})
// 页码元素上的动画样式
const pageNumberAnimateStyle = computed<CSSProperties>(() => {
  return {
    opacity: pageNumberAnimateObj.value.opacity,
    transform: `translateY(${pageNumberAnimateObj.value.transform}%)`
  }
})
// 页码数字
const pageNumber = ref(0)
/**
 * 是否正在前往下一个页面
 * 0 没有上一个页面，无法判断
 * 1 否
 * 2 是
 */
const isToNext = (to: string, from: string): 0 | 1 | 2 => {
  // 没有上一个路由，不需要动画
  if (!prevRoutePath.value) return 0
  return indexOfRoute(to) < indexOfRoute(from) ? 1 : 2
}
/**
 * 获取当前页码应该被平移的距离 %
 * 返回正数，页面切换，页码消失时向上移动
 * 返回负数，页面切换，页码消失时向下移动
 */
const getTranslateDistance = (to: string, from: string): number => {
  // 平移距离 %
  const distance = 50
  switch(isToNext(to, from)) {
    case 0: return 0
    case 1: return -distance
    case 2: return distance
  }
}
/**
 * 获取路由切换时使用的动画名称
 * 当前往下一个页面时显示向上的动画
 * 当前往上一个页面时显示向下的动画
 */
const getTransitionName = (to: string, from: string): 'translate-down-page' | 'translate-up-page' | '' => {
  switch(isToNext(to, from)) {
    case 0: return ''
    case 1: return 'translate-down-page'
    case 2: return 'translate-up-page'
  }
}
// 背景图片块的 CSS 样式
const backgroundCss = ref<CSSProperties>({
  opacity: 0
})
// 是否将元素转移到动画开始的状态
const animationFrom = computed(() => {
  if (!firstEnter.value) {
    return false
  }
  return !staticFrameworkAnimationStart.value
})
// 等待动画结束，告诉滚动提示部分显示动画
watch(animationFrom, (newVal) => {
  if (!newVal) {
    setTimeout(() => {
      animationActive.value = false
      scrollHintAnimationStart.value = true
    }, animationDurationAll.value)
  }
})
// 是否激活动画
const animationActive = ref(false)
// 各个元素的动画延迟
// 修改以调整各个元素动画开始的时间和顺序
const animationDelay = ref({
  nav: 0, // 导航
  actions: 500, // 右上角操作部分
  pageNumber: 1000, // 页码
})
// 各个元素动画的时长
const animationDuration = ref<typeof animationDelay.value>({
  nav: 500, // 导航
  actions: 500, // 右上角操作部分
  pageNumber: 500, // 页码
})
// 所有元素完成动画所需的时间
// 所有元素的动画时间总时长 - 所有元素的动画延迟总和
const animationDurationAll = computed(() => {
  let durationAndDelay: number[] = []
  Object.keys(animationDuration.value).forEach(it => durationAndDelay.push((animationDuration.value as any)[it] + (animationDelay.value as any)[it]))
  return Math.max(...durationAndDelay)
})
// 鼠标跟随圈的样式
const mouseOuterStyle = ref<CSSProperties>({
  left: `${innerWidth / 2 - 18}px`,
  top: `${innerHeight / 2 - 18}px`
})
// 鼠标跟随十字的样式
const mouseInnerStyle = ref<CSSProperties>({
  left: `${innerWidth / 2}px`,
  top: `${innerHeight / 2}px`
})
// 鼠标扩散圈的样式
const mouseClickStyleArgs = reactive({
  left: 0,
  top: 0,
  opacity: 0,
  scale: 0
})
const mouseClickStyle = computed<CSSProperties>(() => ({
  top: mouseClickStyleArgs.top + 'px',
  left: mouseClickStyleArgs.left + 'px',
  opacity: mouseClickStyleArgs.opacity + '',
  transform: `scale(${mouseClickStyleArgs.scale})`
}))
// 鼠标是否在可点击的物体上
const isMouseOverClickable = ref(false)
// 鼠标是否在可滚动的元素上
const isMouseOverScrollble = ref(false)
// 是否在可滚动或可拖动物体上触摸
const isTouchOverScrollbleOrDragble = ref(false)
// 监听屏幕内部鼠标移动事件
watch(store.mousePos, (val) => {
  // 取消正在进行的动画
  gsap.killTweensOf(mouseOuterStyle.value)
  // 把鼠标跟随圈移动到鼠标所在位置
  gsap.fromTo(mouseOuterStyle.value, {
    left: mouseOuterStyle.value.left,
    top: mouseOuterStyle.value.top
  }, {
    left: val.x + 'px',
    top: val.y + 'px',
    duration: 0.25,
    ease: 'power4'
  })
  // 移动鼠标十字
  mouseInnerStyle.value.left = val.x + 'px'
  mouseInnerStyle.value.top = val.y + 'px'
})
// 监听鼠标点击事件
useEventListener(window, 'click', (event) => {
  mouseClickStyleArgs.left = event.x - 24
  mouseClickStyleArgs.top = event.y - 24
  gsap.killTweensOf(mouseClickStyleArgs)
  gsap.fromTo(mouseClickStyleArgs, {
    opacity: 1,
    scale: 0
  }, {
    opacity: 0,
    scale: 2,
    duration: 0.5
  })
})
// 监听鼠标移入事件
useEventListener(window, 'mouseover', (event) => {
  const target = event.target as HTMLElement
  isMouseOverClickable.value = target.classList.contains('clickble')
  isMouseOverScrollble.value = window.getComputedStyle(target).overflowY === 'scroll'
})
// 监听触摸移动事件
useEventListener(window, 'touchmove', (event) => {
  const target = event.target as HTMLElement
  isTouchOverScrollbleOrDragble.value = window.getComputedStyle(target).overflowY === 'scroll' || target.classList.contains('dragble')
})

// 是否显示订单框
const showOrder = ref(false)
// 是否锁定鼠标滚动
const scrollLock = computed(() => showLogin.value || showOrder.value)
// 监听鼠标滚动事件以切换页面
useEventListener(document, 'wheel', (() => {
  let canScroll = true
  return (event: WheelEvent) => {
    // 如果允许切换，继续切换步骤
    if (canScroll && allowScroll.value && !isShareDialogShow.value && !isMouseOverScrollble.value && !scrollLock.value) {
      const currentRouteIndex = indexOfRoute(currentRoute.path)
      // 避免获取到的上一页或下一页的索引超出边界
      const prevIndex = currentRouteIndex - 1 >= 0 ? currentRouteIndex - 1 : 0
      const nextIndex = currentRouteIndex + 1 <= routes.value.length - 1 ? currentRouteIndex + 1 : routes.value.length - 1
      // 如果向下滚动，就切换到下一个页面，否则切换到上一个页面
      if (event.deltaY < 0) {
        router.push(routes.value[prevIndex].to)
      } else {
        router.push(routes.value[nextIndex].to)
      }
      // 禁止切换
      canScroll = false
      // 500 毫秒后再允许切换，防止切换过于频繁
      setTimeout(() => canScroll = true, 500)
    }
  }
})())
// 语言菜单按钮的引用
const langMenuBtnEl = ref<HTMLButtonElement | null>(null)
// 分享框
const isShareDialogShow = ref(false)
// API 基础路径
const apiBase = import.meta.env.VITE_APP_API_URL_BASE
// MonoFun 前端基础路径
const monoFeBase = import.meta.env.VITE_APP_MONO_FE
// 当挂载时
onMounted(async () => {
  animationActive.value = true
  // 尝试获取已保存的语言
  const locale = localStorage.getItem('locale')
  if (locale) {
    i18n.locale.value = locale
  } else {
    // 没有保存的语言，获取浏览器语言
    const browserLocale = navigator.language
    if (browserLocale === 'zh-CN') {
      setLocale('zh')
    } else {
      setLocale('en')
    }
  }
  // 尝试获取用户账户信息
  const res = await api.user.getLoginInfo()
  if (isSuccess(res)) {
    userInfo.value = res.data
  }
})
// 消息组件
const message = useMessage()
// 前往登录页，并等待登录消息
const goLoginPageAndWaitForMessage = useLoginAndMessage()
// 登出
const logout = async () => {
  const res = await api.user.logout()
  if (isSuccess(res)) {
    userInfo.value = null
    message.show(i18n.t('static.logoutSuccess'))
  } else {
    message.show(res.message)
  }
}
// 静态框架的引用
const staticFramworkEl = ref<HTMLDivElement | null>(null)
// 检测是否在静态框架上滑动
useSwipe(staticFramworkEl, { onSwipeEnd: (() => {
  let canScroll = true
  return (e, direction) => {
    // 如果允许切换，继续切换步骤
    if (canScroll && allowScroll.value && !isTouchOverScrollbleOrDragble.value && !isShareDialogShow.value && !mobileNavOpen.value) {
      const currentRouteIndex = indexOfRoute(currentRoute.path)
      // 避免获取到的上一页或下一页的索引超出边界
      const prevIndex = currentRouteIndex - 1 >= 0 ? currentRouteIndex - 1 : 0
      const nextIndex = currentRouteIndex + 1 <= routes.value.length - 1 ? currentRouteIndex + 1 : routes.value.length - 1
      // 如果向下滑动，就切换到上一个页面，否则切换到下一个页面
      if (direction === 'DOWN') {
        router.push(routes.value[prevIndex].to)
      } else if (direction === 'UP') {
        router.push(routes.value[nextIndex].to)
      }
      // 禁止切换
      canScroll = false
      // 500 毫秒后再允许切换，防止切换过于频繁
      setTimeout(() => canScroll = true, 500)
    }
  }
})() })
// 如果开发者工具打开了，就显示鼠标
const staticFramwork = useElementSize(staticFramworkEl)
const hideCursorStyle = computed(() => {
  // 如果静态框架的宽度小于窗口宽度，表示可能是开发者工具打开了
  return window.outerWidth > staticFramwork.width.value ? '' : '* { cursor: none!important; }'
})
// 移动端导航是否已打开
const mobileNavOpen = ref(false)
// 移动端导航开关事件
const onMobileNavChange = (newVal: boolean) => mobileNavOpen.value = newVal
useStyleTag(hideCursorStyle)
// 下载图片
const downloadPic = () => {
  const a = document.createElement('a')
  a.href = sharePic
  a.download = 'share-pic.png'
  a.click()
}
const buttonSize = useItemsPageButtonSize()
const showLogin = ref(false)
</script>
<template>
  <transition name="fade">
    <ResourceLoader
      @load-complete="onResourceLoadComplete"
      v-if="!loadedRes"
    />
  </transition>
  <router-view v-slot="{ Component, route }">
    <transition name="fade">
      <div
        class="static-framework"
        v-if="loadedRes"
        ref="staticFramworkEl"
      >
        <!-- 背景 -->
        <div
          class="background cover-no-repeat-center"
          :style="backgroundCss"
        />
        <div
          class="background-top-mask"
          v-if="!mobileNavOpen && isOnMobile"
        />
        <!-- 粒子效果 -->
        <particles-for-character />
        <div
          class="mouse-container"
          v-if="!isOnMobileByUserAgent"
        >
          <div
            class="mouse-outer"
            :class="isMouseOverClickable ? 'mouse-outer-hovered' : ''"
            :style="mouseOuterStyle"
          />
          <div
            class="mouse-click mouse-outer"
            :style="mouseClickStyle"
          />
          <div
            class="mouse-inner"
          >
            <div
              class="mouse-inner-line mouse-inner-line-1"
              :class="isMouseOverClickable ? 'mouse-inner-line-hovered-1' : ''"
              :style="mouseInnerStyle"
            />
            <div
              class="mouse-inner-line mouse-inner-line-2"
              :class="isMouseOverClickable ? 'mouse-inner-line-hovered-2' : ''"
              :style="mouseInnerStyle"
            />
            <div
              class="mouse-inner-line mouse-inner-line-3"
              :class="isMouseOverClickable ? 'mouse-inner-line-hovered-3' : ''"
              :style="mouseInnerStyle"
            />
            <div
              class="mouse-inner-line mouse-inner-line-4"
              :class="isMouseOverClickable ? 'mouse-inner-line-hovered-4' : ''"
              :style="mouseInnerStyle"
            />
          </div>
        </div>
        <!-- 手机端导航 -->
        <nav-on-mobile
          v-if="isOnMobile"
          :routes="routes"
          :animation-active="animationActive"
          :animation-from="animationFrom"
          @item-selected="onNavItemSelected"
          v-model="mobileNavOpen"
          @update:model-value="onMobileNavChange"
        />
        <!-- 桌面和平板端导航 -->
        <nav-on-desktop
          :routes="routes"
          :animation-active="animationActive"
          :animation-from="animationFrom"
          @item-selected="onNavItemSelected"
          v-else
        />
        <!-- 页码 -->
        <div
          class="page-number"
          :class="{
            'opacity-0': animationFrom && animationActive,
            'duration-500 delay-1000': animationActive
          }"
        >
          <div
            class="page-number-current"
            :style="pageNumberAnimateStyle"
          >
            0{{ pageNumber }}
          </div>
          <div class="page-number-divider" />
          <div class="page-number-all">
            05
          </div>
        </div>
        <!-- 左上角页面标题，在首页时不显示 -->
        <div
          class="page-title"
        >
          <div class="page-title-main">
            {{ i18n.t(pageName).toUpperCase() }}
          </div>
          <div
            class="page-title-small"
            v-if="i18n.locale.value !== 'en'"
          >
            {{ i18n.t(pageName, 1, { locale: 'en' }).toUpperCase() }}
          </div>
        </div>
        <!-- 右上角操作部分 -->
        <div
          class="actions"
          :class="{
            'opacity-0': animationFrom && animationActive,
            'duration-500 delay-500': animationActive
          }"
        >
          <!-- 登录和登录后的用户头像 -->
          <div
            v-if="!userInfo"
            class="flex items-center justify-center"
          >
            <div
              class="actions-text clickble"
              @click="showLogin = true"
            >
              {{ i18n.t('static.login') }}
            </div>
            <div class="actions-divider" />
            <a
              class="actions-text clickble"
              :href="`${monoFeBase}/login`"
              target="blank"
            >
              {{ i18n.t('static.register') }}
            </a>
          </div>
          <div
            v-else
            class="mr-3rem"
          >
            <dropdown-menu>
              <template #trigger>
                <div
                  class="rounded-full w-2rem h-2rem bg-cover bg-center bg-no-repeat clickble"
                  :style="{
                    backgroundImage: `url(${userInfo.avatar ? ossPath(userInfo.avatar) : defaultProfileAvatar})`,
                    backgroundColor: 'rgba(255,255,255,0.5)'
                  }"
                />
              </template>
              <template #menuItems>
                <div>
                  <menu-item>
                    <button
                      class="text-1rem leading-1.5rem font-sans text-left clickble"
                      @click="showOrder = true"
                    >
                      {{ i18n.t('static.orders') }}
                    </button>
                  </menu-item>
                  <div class="w-106px h-1px mt-12px mb-12px bg-[#c4c4c4] opacity-50" />
                  <menu-item>
                    <button
                      class="text-1rem leading-1.5rem font-sans text-left clickble"
                      @click="logout"
                    >
                      {{ i18n.t('static.logout') }}
                    </button>
                  </menu-item>
                </div>
              </template>
            </dropdown-menu>
          </div>
          <!-- 语言切换菜单 -->
          <div>
            <dropdown-menu>
              <template #trigger="{ open }">
                <div
                  class="actions-text actions-dropdown clickble flex items-center"
                  ref="langMenuBtnEl"
                >
                  <span class="clickble block">{{ i18n.locale.value.toUpperCase() }}</span>
                  <img
                    src="./assets/static-framework/dropdown.svg"
                    class="actions-dropdown-icon transition transform transition-transform duration-250 clickble block"
                    :class="{
                      'rotate-z-180': open
                    }"
                  >
                </div>
              </template>
              <template #menuItems>
                <div>
                  <menu-item>
                    <button
                      class="text-1rem leading-1.5rem font-sans text-left clickble"
                      @click="setLocale('en')"
                    >
                      English
                    </button>
                  </menu-item>
                  <div class="w-106px h-1px mt-12px mb-12px bg-[#c4c4c4] opacity-50" />
                  <menu-item>
                    <button
                      class="text-1rem leading-1rem font-sans text-left clickble"
                      @click="setLocale('zh')"
                    >
                      中文
                    </button>
                  </menu-item>
                </div>
              </template>
            </dropdown-menu>
          </div>
          <!-- 返回项目详情页 -->
          <a
            class="ml-3rem <xl:ml-2rem"
            href="https://mono.fun/project/03f3e7eb-fa25-485d-b224-b81105feca19"
            target="_blank"
          >
            <img
              src="./assets/static-framework/back-to-details.svg"
              class="clickble object-center object-contain w-1rem h-1rem"
            >
          </a>
          <img
            src="./assets/static-framework/share.svg"
            class="actions-share clickble"
            width="16"
            height="16"
            @click="isShareDialogShow = true"
          >
        </div>
        <transition
          :name="getTransitionName(route.path, currentRoutePath)"
        >
          <keep-alive>
            <component :is="Component" />
          </keep-alive>
        </transition>
        <!-- 分享框 -->
        <div
          class="w-[100vw] h-[100vh] flex justify-center items-center absolute transition-colors duration-250 z-998"
          :class="{
            'bg-[rgba(0,0,0,0.5)]': isShareDialogShow,
            'pointer-events-none': !isShareDialogShow
          }"
        >
          <transition
            leave-active-class="transition duration-250"
            enter-active-class="transition duration-250"
            leave-to-class="transform -translate-y-1.5rem opacity-0"
            enter-from-class="transform -translate-y-1.5rem opacity-0"
          >
            <div
              class="w-36rem h-40.5rem bg-[#0f0f0f] flex flex-col justify-between items-center <sm:(w-20rem h-34.25rem)"
              v-if="isShareDialogShow"
            >
              <div class="pt-1.5rem pr-1.5rem w-[100%]">
                <div
                  class="close-btn float-right clickble"
                  @click="isShareDialogShow = false"
                />
              </div>
              <span class="leading-2.875rem text-2rem font-serif <sm:(leading-2.125rem text-1.5rem)">
                {{ i18n.t('static.shareTheGame') }}
              </span>
              <!-- 分享图片预览 -->
              <div class="w-17rem h-23.125rem overflow-y-scroll custom-scrollbar">
                <img
                  class="w-[100%]"
                  :src="sharePic"
                >
              </div>
              <!-- 保存按钮 -->
              <TextButton
                class="mb-4rem"
                @click="downloadPic"
                type="secondary"
                :width="buttonSize.width"
                :height="buttonSize.height"
                :is-en="i18n.locale.value === 'en'"
              >
                {{ i18n.t('static.saveSahrePic') }}
              </TextButton>
            </div>
          </transition>
        </div>
        <div
          class="absolute top-0 left-0 transition-colors duration-250 w-[100vw] h-[100vh] flex justify-center items-center"
          :class="[showLogin || showOrder ? 'bg-black/50' : 'pointer-events-none']"
        >
          <LoginDialog
            :show="showLogin"
            @close="showLogin = false"
          />
          <Orders
            :show="showOrder"
            @close="showOrder = false"
          />
        </div>
        <!-- <div
          class="absolute top-0 left-0 transition-colors duration-250 w-[100vw] h-[100vh] flex justify-center items-center"
          :class="[showOrder ? 'bg-black/50' : '!pointer-events-none']"
        >
        </div> -->
      </div>
    </transition>
    <div class="absolute top-0 left-0 w-[100vw] h-[100vh] pointer-events-none z-1000">
      <TransitionGroup
        leave-to-class="transform -translate-y-20px opacity-0"
        enter-from-class="transform -translate-y-20px opacity-0"
        leave-active-class="absolute transition-all"
        enter-active-class="absolute transition-all"
        move-class="transition-all"
        :appear="true"
      >
        <MessageBar
          v-for="(item) in message.messages"
          :key="item.id"
          :info="item"
          @close="message.remove(item.id)"
        />
      </TransitionGroup>
    </div>
  </router-view>
</template>

<style lang="less" src="./index.less"></style>
<style lang="less" scoped>
@static-z-index: 1000;

#app {
  .static-framework {
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: @static-z-index;

    .title {
      width: 100%;
      text-align: center;
      top: 20px;
    }

    .particles-control-btns {
      display: flex;
      justify-content: center;
    }

    .btn {
      pointer-events: auto;
      transition: all 250ms ease-out;
      border: 2px white solid;
      color: white;
      background: black;
      font-size: 16px;
      font-weight: 600;
      padding: 8px 15px;
      margin: 5px;

      &:hover {
        color: black;
        background: white;
      }
    }
  }
}

// 当处于手机端、并且导航栏没有打开时，显示顶部渐变遮罩
.background-top-mask {
  background-image: linear-gradient(180deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0) 100%);
  background-position: top;
  background-size: 100% 88px;
  background-repeat: no-repeat;
  height: 88px;
  position: absolute;
  width: 100%;
}

// 页面
.route-page {
  width: 100%;
  height: 100%;
  position: absolute;
  overflow: hidden;
}
// 页码
.page-number {
  color: white;
  position: absolute;
  font-family: 'Poppins', sans-serif;
  display: flex;
  column-gap: 16px;
  align-items: baseline;
  bottom: 4rem;
  right: 4rem;
  font-weight: 400;

  &-current {
    font-size: 20px;
  }

  &-divider {
    width: 2px;
    height: 20px;
    background-color: rgba(255, 255, 255, 0.5);
    transform: translateY(5px) rotate(45deg);
  }

  &-all {
    opacity: 0.5;
    font-size: 14px;
  }
}
// 鼠标跟随层
.mouse-container {
  position: absolute;
  height: 100%;
  width: 100%;
  pointer-events: none;
  z-index: 1001;
}
// 鼠标跟随框
.mouse-outer {
  transition-property: width, height, background;
  transition-timing-function: ease;
  transition-duration: 250ms;
  pointer-events: none;
  position: absolute;
  transform: translate3d(-50%, -50%, 0);
  height: 3rem;
  width: 3rem;
  border-radius: 100%;
  border: 1px solid rgba(255, 255, 255, 0.5);

  &-hovered {
    height: 2rem;
    width: 2rem;
    background-color: rgba(255, 255, 255, 0.5);
  }
}
// 鼠标点击时的扩散圈
.mouse-click {
  opacity: 0;
  border-color: white;
}
// 鼠标跟随十字
.mouse-inner {
  .mouse-inner-line {
    position: absolute;
    pointer-events: none;
    width: 6px;
    height: 1px;
    background: white;
    transition: transform 250ms ease;

    &-2,
    &-4 {
      height: 6px;
      width: 1px;
    }

    &-1 { transform: translateX(-10px); } // 需要偏移 10 px，其中 6px 是本身的长度，4px 是本来就要偏移的长度
    &-2 { transform: translateY(-10px); }
    &-3 { transform: translateX(4px); }
    &-4 { transform: translateY(4px); }
  }

  .mouse-inner-line-hovered {
    &-1 { transform: translateX(-8px); } // 需要偏移 16 px，其中 10px 是本身的长度，6px 是本来就要偏移的长度
    &-2 { transform: translateY(-8px); }
    &-3 { transform: translateX(2px); }
    &-4 { transform: translateY(2px); }
  }
}
// 页面标题
.page-title {
  left: 4rem;
  top: 4rem;
  box-sizing: border-box;
  text-align: center;
  position: absolute;
  padding: 0 10px 10px;
  background-image:
    url('./assets/static-framework/page-title-dot.png'),
    url('./assets/static-framework/page-title-dot.png'),
    url('./assets/static-framework/page-title-dot.png'),
    url('./assets/static-framework/page-title-dot.png');
  background-repeat: no-repeat;
  background-position:
    top left,
    top right,
    bottom left,
    bottom right;

  &-main {
    font-size: 4rem;
    font-family: 'Noto Sans SC', sans-serif;
    font-weight: 700;
    text-shadow: 4px 8px 4px rgba(0, 0, 0, 0.25);
  }

  &-small {
    font-size: 12px;
    font-family: 'Montserrat', sans-serif;
    opacity: 0.5;
  }
}
// 右上角操作部分
.actions {
  position: absolute;
  right: 4rem;
  top: 4rem;
  z-index: 20;
  display: flex;
  align-items: center;

  &-text {
    color: white;
    font-family: 'Noto Sans SC', sans-serif;
    font-size: 16px;
    font-weight: bold;

    &:nth-child(3) {
      margin-right: 3rem;
    }
  }

  &-divider {
    width: 2px;
    height: 16px;
    background-color: rgba(255, 255, 255, 0.5);
    margin: 0 16px;
  }

  &-share {
    display: block;
    margin-left: 3rem;
  }

  &-dropdown {
    display: flex;
    align-items: center;
  }

  &-dropdown-icon {
    margin-left: 10px;
    object-fit: contain;
    object-position: center;
  }
}
// 背景图片块
.background {
  position: absolute;
  width: 100%;
  height: 100%;
}

// 当屏幕宽度小于 1680px 时，进入平板模式
@media screen and (max-width: 1679px) {
  .actions {
    right: 2rem;
    top: 2rem;
  }

  .page-number {
    right: 2rem;
    bottom: 2rem;
  }

  .page-title {
    padding-left: 24px;
    padding-right: 24px;

    &-main {
      font-size: 3rem;
    }
  }
}

// 当宽度小于 1080px 时，切换到手机版本
@media screen and (max-width: 1079px) {
  .actions-text:nth-child(3) {
    margin-right: 24px;
  }

  .actions-share {
    margin-left: 2rem;
  }

  .actions {
    top: 24px;
    right: 24px;
  }

  .page-title {
    left: 24px;
    padding-left: 12px;
    padding-right: 12px;
    top: 72px;

    &-main {
      font-size: 2rem;
    }
  }

  .page-number {
    right: 24px;
    bottom: 24px;
    z-index: 999;
  }

  .route-page {
    background-image: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.515625) 26.56%, #000 100%);
    background-size: 100% 320px;
    background-repeat: no-repeat;
    background-position: bottom;
  }
}

@media screen and (max-height: 1079px) {
  // 当屏幕高度小于 1080px 时，缩小导航大小至 700px
  .navigation-line {
    height: 700px;
  }

  .navigation {
    top: calc(50% - 350px);
  }
}
</style>
