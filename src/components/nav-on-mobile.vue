<script lang="ts" setup>
import { ref, toRaw, unref } from 'vue'
import navOnDesktop from './nav-on-desktop.vue'

// 定义要传入的参数
const props = defineProps<{
  animationFrom: boolean,
  animationActive: boolean,
  routes: { name: string, to: string }[],
  modelValue: boolean
}>()
// 定义会触发的事件
const emits = defineEmits<{
  (e: 'itemSelected', to: string): void,
  (e: 'update:modelValue', newVal: boolean): void
}>()

const { onItemSelected, onMenuTransitionEnd } = (() => {
  const willGoTo = ref('')
  // 接收桌面端导航事件
  const onItemSelected0 = (to: string) => {
    emits('update:modelValue', false)
    willGoTo.value = to
  }
  // 接收菜单动画结束事件
  const onMenuTransitionEnd0 = () => {
    if (!props.modelValue) emits('itemSelected', willGoTo.value)
    willGoTo.value = ''
  }
  return {
    onItemSelected: onItemSelected0,
    onMenuTransitionEnd: onMenuTransitionEnd0
  }
})()
</script>
<template>
  <div class="absolute w-[100%] h-[100%] z-999 overflow-hidden pointer-events-none">
    <!-- 菜单主体 -->
    <div
      class="absolute w-[100vw] h-[100vh] transform bg-[rgba(0,0,0,0.9)] duration-250 top-0 left-0 pointer-events-auto"
      :class="{
        '-translate-y-[100%]': !modelValue
      }"
      @transitionend="onMenuTransitionEnd"
    >
      <!-- 游戏 logo -->
      <div class="game-logo mt-72px ml-20px h-2rem bg-cover bg-center bg-no-repeat" />
      <!-- 复用桌面端的导航 -->
      <nav-on-desktop
        :animation-active="animationActive"
        :animation-from="animationFrom"
        :routes="routes"
        @item-selected="onItemSelected"
      />
      <!-- 社交网络图标 -->
      <div class="absolute top-524px right-3rem z-50">
        <div class="font-monsterrat text-15px opacity-50 font-12px font-700 text-right">
          SHARE
        </div>
        <div class="flex gap-x-24px mt-24px">
          <a
            href="https://twitter.com/adriftstreet"
            target="_blank"
            class="block"
          >
            <div class="icon icon-twitter" />
          </a>
          <a
            href="https://discord.gg/monoverse"
            target="_blank"
            class="block"
          >
            <div class="icon icon-discord" />
          </a>
        </div>
      </div>
      <!-- 左上角跳转按钮 -->
      <div class="absolute top-4.5rem right-3rem flex">
        <a
          class="mr-2.25rem clickble"
          href="https://mono.fun"
          target="_blank"
        >
          <img
            src="../assets/home-page/mono.svg"
            class="w-2rem h-2rem object-center object-contain clickble"
          >
        </a>
        <img
          src="../assets/home-page/caramel-mocha.svg"
          class="w-2rem h-2rem object-center object-contain"
        >
      </div>
      <!-- 背景格子 -->
      <div class="background w-453px h-313px bg-left bg-no-repeat bg-contain bottom-24px absolute" />
    </div>
    <!-- 左上角菜单图标 -->
    <div
      class="absolute top-24px left-24px pointer-events-auto"
      @click="emits('update:modelValue', !modelValue)"
    >
      <div
        class="mb-5px h-3px w-24px bg-white transition-transform duration-250 origin-top-left"
        :class="{
          'transform rotate-z-45': modelValue
        }"
      />
      <div
        class="mb-5px h-3px w-24px bg-white transition-transform duration-250 origin-left"
        :class="{
          'transform scale-x-0': modelValue
        }"
      />
      <div
        class="h-3px w-24px bg-white transition-transform duration-250 origin-bottom-left"
        :class="{
          'transform -rotate-z-45': modelValue
        }"
      />
    </div>
  </div>
</template>
<style lang="less" scoped>
.game-logo {
  background-image: url('../assets/home-page/tsoa-logo.svg');
  width: calc(2rem / 149 * 640);
}

.icon {
  width: 28px;
  height: 28px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
}

.icon-twitter {
  background-image: url('../assets/home-page/twitter-icon.svg');
}

.icon-discord {
  background-image: url('../assets/home-page/discord-icon.svg');
}

.background {
  background-image: url('../assets/static-framework/background-mobile-nav.svg');
}
</style>
