<script setup lang="ts">
import WebGLBackground from './components/WebGLBackground/index.vue'
import ResourceLoader from './components/ResourceLoader/index.vue'
import { computed, CSSProperties, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { LoadedResources } from './components/ResourceLoader/Resources'
import { useRoute, useRouter } from 'vue-router'
import { gsap } from 'gsap'
import { useStore } from './store'
import { storeToRefs } from 'pinia'
import { useEventListener } from '@vueuse/core'
import { useSwipe } from '@vueuse/core'
import { useWindowSize } from '@vueuse/core'
import UAParser from 'ua-parser-js'
// pinia
const store = useStore()
const { firstEnter, staticFrameworkAnimationStart, scrollHintAnimationStart , allowScroll} = storeToRefs(store)
// 资源引用
const loadedRes = ref<LoadedResources | null>(null)
// 当资源加载完成时
const onResourceLoadComplete = (res: LoadedResources) => {
  loadedRes.value = res
  router.push('/')
}
// i18n 切换语言
const i18n = useI18n()
const switchLang = () => {
  i18n.locale.value = i18n.locale.value === 'zh' ? 'en' : 'zh'
}
// 背景 canvas
const webGlBackground = ref<InstanceType<typeof WebGLBackground> | null>(null)
// 显示或隐藏辅助 canvas
const toggleHelper = () => {
  if (!webGlBackground.value) {
    return
  }
  showHelper.value = !showHelper.value
  webGlBackground.value.showOrHidePic(showHelper.value)
}
const showHelper = ref(false)
// 路由，等英文文案准备好之后改用 i18n
const routes = ref([
  { to: '/', name: '首页' },
  { to: '/items', name: '物品' },
  { to: '/characters', name: '角色' },
  { to: '/settings', name: '设定' },
  { to: '/archives', name: '档案' },
] as const)
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
const pageName = ref('')
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
    routeName = 'home'
  } else {
    routeName = to.path.substring(1)
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
const mouseClickStyle = ref<CSSProperties>({})
// 鼠标是否在可点击的物体上
const isMouseOverClickable = ref(false)
// 监听屏幕内部鼠标移动事件
useEventListener(window, 'mousemove', (event: MouseEvent) => {
  // 取消正在进行的动画
  gsap.killTweensOf(mouseOuterStyle.value)
  // 把鼠标跟随圈移动到鼠标所在位置
  gsap.fromTo(mouseOuterStyle.value, {
    left: mouseOuterStyle.value.left,
    top: mouseOuterStyle.value.top
  }, {
    left: event.x + 'px',
    top: event.y + 'px',
    duration: 0.25,
    ease: 'power4'
  })
  // 移动鼠标十字
  mouseInnerStyle.value.left = event.x + 'px'
  mouseInnerStyle.value.top = event.y + 'px'
})
// 监听鼠标点击事件
useEventListener(window, 'click', (event) => {
  mouseClickStyle.value.left = (event.x - 24) + 'px'
  mouseClickStyle.value.top = (event.y - 24) + 'px'
  gsap.killTweensOf(mouseClickStyle.value)
  gsap.fromTo(mouseClickStyle.value, {
    opacity: 1,
    transform: 'scale(0)'
  }, {
    opacity: 0,
    transform: 'scale(2)',
    duration: 0.5
  })
})
// 监听鼠标移入事件
useEventListener(window, 'mouseover', (event) => {
  isMouseOverClickable.value = (event.target as HTMLElement).classList.contains('clickble')
})
// 监听鼠标滚动事件以切换页面
useEventListener(document, 'wheel', (() => {
  let canScroll = true
  return (event: WheelEvent) => {
    // 如果允许切换，继续切换步骤
    if (canScroll && allowScroll.value) {
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
// 当挂载时
onMounted(() => {
  console.log(firstEnter.value, staticFrameworkAnimationStart.value)
  animationActive.value = true
})
// 静态框架的引用
const staticFramworkEl = ref<HTMLDivElement | null>(null)
// 检测是否在静态框架上滑动
useSwipe(staticFramworkEl, { onSwipeEnd: (() => {
  let canScroll = true
  return (e, direction) => {
    // 如果允许切换，继续切换步骤
    if (canScroll && allowScroll.value) {
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
// 获取响应式的屏幕高宽
const { width: windowWidth, height: windowHeight } = useWindowSize()
// 检测是否在移动设备上，使用 user-agent 方式
// 当宽度发生变化时再检测一次，这样 DevTools 切换视图时也能收到变化，不需要刷新页面
const isOnMobileByUserAgent = computed(() => {
  windowWidth.value, windowHeight.value
  const device = new UAParser(navigator.userAgent).getDevice()
  return device.type === 'mobile' || device.type === 'tablet'
})
</script>
<template>
  <!--TODO: 调试好之后改成 v-if="!loadedRes"-->
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
        <div
          class="background cover-no-repeat-center"
          :style="backgroundCss"
        />
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
        <div
          class="navigation"
          :class="{
            'opacity-0': animationFrom && animationActive,
            'duration-500 delay-0': animationActive
          }"
        >
          <div class="navigation-content">
            <!--TODO:替换成 i18n 文案-->
            <router-link
              v-for="theRoute of routes"
              class="navigation-item clickble"
              :to="theRoute.to"
              :key="theRoute.name"
            >
              <div class="navigation-item-text clickble">
                {{ theRoute.name }}
              </div>
              <div class="navigation-item-icon cover-no-repeat-center clickble" />
            </router-link>
          </div>
          <div class="navigation-line" />
        </div>
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
          <!-- TODO: 当 i18n 文案填充好之后，改用 i18n 文案 -->
          <div class="page-title-main">
            {{ pageName }}
          </div>
          <!-- TODO: 当 i18n 文案填充好之后，检查是否是英文状态，并决定要不要隐藏 -->
          <div class="page-title-small">
            {{ 'NEED TEXT' }}
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
          <div class="actions-text">
            登录
          </div>
          <div class="actions-divider" />
          <div class="actions-text">
            注册
          </div>
          <!-- 语言切换菜单 -->
          <el-dropdown>
            <div class="actions-text actions-dropdown">
              <span>EN</span>
              <img
                src="./assets/static-framework/dropdown.svg"
                class="actions-dropdown-icon"
              >
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>English</el-dropdown-item>
                <el-dropdown-item>中文</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <img
            src="./assets/static-framework/share.svg"
            class="actions-share"
            width="16"
            height="16"
          >
        </div>
        <transition :name="getTransitionName(route.path, currentRoutePath)">
          <component :is="Component" />
        </transition>
      </div>
    </transition>
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
// 导航
.navigation {
  z-index: 20;
  @line-height: 800px;

  position: absolute;
  display: flex;
  align-items: center;
  top: calc(50% - @line-height / 2);
  right: 64px;
  // 导航中的左侧部分
  &-content {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    height: 500px;
    margin-right: 24px;
  }
  // 导航中的每一项
  &-item {
    padding: 10px;
    display: flex;
    transition: opacity 250ms ease-out;
    font-family: 'Noto Sans SC', sans-serif;
    font-size: 16px;
    color: white;
    opacity: 0.5;
    text-decoration: none;
    align-items: center;
    column-gap: 16px;

    &:hover {
      opacity: 1;
    }

    &-text {
      transition: transform 250ms ease-out;
      transform: translateX(34px);
    }

    &-icon {
      transition: opacity 250ms ease-out;
      opacity: 0;
      width: 12px;
      height: 18px;
      background-image: url('./assets/static-framework/navigation-item-active.png');
      background-size: contain;
    }
  }

  // 导航右侧的线
  &-line {
    height: @line-height;
    width: 1px;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.5) 25.52%, rgba(255, 255, 255, 0.5) 49.63%, rgba(255, 255, 255, 0.5) 75.52%, rgba(255, 255, 255, 0) 100%);
  }
  // 正在显示的导航页面
  .router-link-active {
    opacity: 1;

    .navigation-item-text {
      transform: none;
      pointer-events: fill;
    }

    .navigation-item-icon {
      opacity: 1;
    }
  }
}
// 页面
.route-page {
  width: 100%;
  height: 100%;
  position: absolute;
}
// 页码
.page-number {
  color: white;
  position: absolute;
  font-family: 'Poppins', sans-serif;
  display: flex;
  column-gap: 16px;
  align-items: baseline;
  bottom: 64px;
  right: 64px;
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
}
// 鼠标跟随框
.mouse-outer {
  transition-property: width, height, background;
  transition-timing-function: ease;
  transition-duration: 250ms;
  pointer-events: none;
  position: absolute;
  transform: translate3d(-50%, -50%, 0);
  height: 48px;
  width: 48px;
  border-radius: 100%;
  border: 1px solid rgba(255, 255, 255, 0.5);

  &-hovered {
    height: 32px;
    width: 32px;
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
  left: 64px;
  top: 64px;
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
    font-size: 64px;
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
  right: 64px;
  top: 64px;
  z-index: 20;
  display: flex;
  align-items: center;

  &-text {
    color: white;
    font-family: 'Noto Sans SC', sans-serif;
    font-size: 16px;
    font-weight: bold;

    &:nth-child(3) {
      margin-right: 48px;
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
    margin-left: 48px;
  }

  &-dropdown {
    display: flex;
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

@media screen and (max-height: 1080px) {
  // 当屏幕高度小于 1080px 时，缩小导航大小至 700px
  .navigation-line {
    height: 700px;
  }

  .navigation {
    top: calc(50% - 350px);
  }
}
</style>
