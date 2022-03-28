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
// pinia
const store = useStore()
const { firstEnter, staticFrameworkAnimationStart, scrollHintAnimationStart } = storeToRefs(store)
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
// 当挂载时
onMounted(() => {
  console.log(firstEnter.value, staticFrameworkAnimationStart.value)
  animationActive.value = true
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
      >
        <div
          class="background"
          :style="backgroundCss"
        />
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
              class="navigation-item"
              :to="theRoute.to"
              :key="theRoute.name"
            >
              <div class="navigation-item-text">
                {{ theRoute.name }}
              </div>
              <div class="navigation-item-icon" />
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

<style lang="less">
// 给动画系统使用的类名，渐变
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
// 给动画系统使用的类名，向上路由
.translate-up-page-enter-active,
.translate-up-page-leave-active {
  transition: transform 0.5s ease;
}

.translate-up-page-enter-from {
  transform: translateY(100%);
}

.translate-up-page-enter-to,
.translate-up-page-leave-from {
  transform: translateY(0);
}

.translate-up-page-leave-to {
  transform: translateY(-100%);
}
// 给动画系统使用的类名，向下路由
.translate-down-page-enter-active,
.translate-down-page-leave-active {
  transition: transform 0.5s ease;
}

.translate-down-page-enter-from {
  transform: translateY(-100%);
}

.translate-down-page-enter-to,
.translate-down-page-leave-from {
  transform: translateY(0);
}

.translate-down-page-leave-to {
  transform: translateY(100%);
}
@static-z-index: 1000;

html,
body,
#app {
  margin: 0;
  height: 100%;
}

body {
  overflow: hidden;
}

.cover-no-repeat-center {
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
}

* {
  user-select: none;
}

#app {
  background: black;
  color: white;

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
// 使不透明度变为 0
.opacity-0 {
  opacity: 0;
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
    font-size: 20px;
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
      .cover-no-repeat-center();

      background-size: contain;
    }
  }

  // 导航右侧的线
  &-line {
    height: @line-height;
    width: 2px;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.5) 25.52%, rgba(255, 255, 255, 0.5) 49.63%, rgba(255, 255, 255, 0.5) 75.52%, rgba(255, 255, 255, 0) 100%);
  }
  // 正在显示的导航页面
  .router-link-active {
    opacity: 1;

    .navigation-item-text {
      transform: none;
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

.delay-0_25s {
  animation-delay: 0.25s !important;
  transition-delay: 0.25s !important;
}
// 页码
.page-number {
  color: white;
  position: absolute;
  font-family: 'Poppins', sans-serif;
  display: flex;
  column-gap: 24px;
  align-items: baseline;
  bottom: 64px;
  right: 64px;
  font-weight: 500;

  &-current {
    font-size: 32px;
  }

  &-divider {
    width: 2px;
    height: 32px;
    background-color: rgba(255, 255, 255, 0.5);
    transform: translateY(5px) rotate(45deg);
  }

  &-all {
    opacity: 0.5;
    font-size: 20px;
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
  .cover-no-repeat-center();

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
