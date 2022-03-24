<script setup lang="ts">
import WebGLBackground from './components/WebGLBackground/index.vue'
import ResourceLoader from './components/ResourceLoader/index.vue'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { LoadedResources } from './components/ResourceLoader/Resources'
import { useRoute, useRouter } from 'vue-router'
// 资源引用
const loadedRes = ref<LoadedResources | null>(null)
// 当资源加载完成时
const onResourceLoadComplete = (res: LoadedResources) => {
  loadedRes.value = res
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
// 当前路由
const currentRoute = useRoute()
const router = useRouter()
const prevRoute = ref('')
// 在每次路由切换后，记录当前路由的路径
router.beforeEach(() => {
  prevRoute.value = currentRoute.path
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
// 返回传入的路由是否在当前路由上方
const isBefore = (to: string, from: string): boolean => {
  return indexOfRoute(to) < indexOfRoute(from)
}
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
        <div class="navigation">
          <div class="navigation-content">
            <!--TODO：替换成 i18n 文案-->
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
        <transition :name="isBefore(prevRoute, route.path) ? 'translate-up-page' : 'translate-down-page'">
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
  .translate-up-page-enter-to, .translate-up-page-leave-from {
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
  .translate-down-page-enter-to, .translate-down-page-leave-from {
    transform: translateY(0);
  }
  .translate-down-page-leave-to {
    transform: translateY(100%);
  }
  @static-z-index: 1000;
  html, body, #app {
    margin: 0;
    height: 100%;
  }
  .cover-no-repeat-center {
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
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
</style>
