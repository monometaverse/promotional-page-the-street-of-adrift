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
  <div class="h-[100%] w-[100%] z-999 absolute overflow-hidden pointer-events-none">
    <!-- 菜单主体 -->
    <div
      class="bg-[rgba(0,0,0,0.9)] h-[100vh] transform top-0 left-0 w-[100vw] duration-250 absolute pointer-events-auto"
      :class="{
        '-translate-y-[100%]': !modelValue
      }"
      @transitionend="onMenuTransitionEnd"
    >
      <!-- 游戏 logo -->
      <div class="bg-cover bg-center bg-no-repeat h-2rem mt-72px ml-20px game-logo" />
      <!-- 复用桌面端的导航 -->
      <nav-on-desktop
        :animation-active="animationActive"
        :animation-from="animationFrom"
        :routes="routes"
        @item-selected="onItemSelected"
      />
      <!-- 社交网络图标 -->
      <div class="top-524px right-3rem z-50 absolute">
        <div class="font-monsterrat font-12px font-700 text-right opacity-50 text-15px">
          SHARE
        </div>
        <div class="flex mt-24px gap-x-24px">
          <a
            href="https://twitter.com/adriftstreet"
            target="_blank"
            class="block"
          >
            <div class="icon icon-twitter" />
          </a>
          <a
            href="https://discord.gg/TUkQzXVDUV"
            target="_blank"
            class="block"
          >
            <div class="icon icon-discord" />
          </a>
        </div>
      </div>
      <!-- 左上角跳转按钮 -->
      <div class="flex top-4.5rem right-3rem absolute">
        <a
          class="mr-2.25rem clickble"
          href=""
          target="_blank"
        >
          <img
            src="../assets/home-page/mono.svg"
            class="object-center object-contain h-2rem w-2rem clickble"
          >
        </a>
        <img
          src="../assets/home-page/caramel-mocha.svg"
          class="object-center object-contain h-2rem w-2rem"
        >
      </div>
      <!-- 背景格子 -->
      <div class="bg-left bg-no-repeat bg-contain h-313px bottom-24px w-453px background absolute" />
    </div>
    <!-- 左上角菜单图标 -->
    <div
      class="top-24px left-24px absolute pointer-events-auto"
      @click="emits('update:modelValue', !modelValue)"
    >
      <div
        class="bg-white h-3px mb-5px origin-top-left transition-transform w-24px duration-250"
        :class="{
          'transform rotate-z-45': modelValue
        }"
      />
      <div
        class="bg-white h-3px mb-5px origin-left transition-transform w-24px duration-250"
        :class="{
          'transform scale-x-0': modelValue
        }"
      />
      <div
        class="bg-white h-3px origin-bottom-left transition-transform w-24px duration-250"
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
