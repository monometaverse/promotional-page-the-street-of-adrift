<!--主页-->
<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { CSSProperties, onMounted, ref } from 'vue'
import { useStore } from '../store'
import { useWindowSize } from '@vueuse/core'
import { gsap } from 'gsap'

// states
const store = useStore()
const { firstEnter } = storeToRefs(store)

// logo 图标的引用
const logoRef = ref<HTMLDivElement | null>(null)
// logo 图标复制体的样式
const logoCopyStyle = ref<CSSProperties>({})
// 使用并监听屏幕宽度变化
const { width: windowWidth } = useWindowSize()
// 定义挂载的时候执行的操作
onMounted(() => {
  if (firstEnter.value) {
    // 第一次进入首页，展示动画
    setTimeout(() => {
      gsap.fromTo('.logo-copy.cover-no-repeat-center', { left: windowWidth.value / 2 - logoRef.value!.clientWidth / 2 + 20 + 'px' },  { left: '64px', duration: 0.75, ease: 'power4', onComplete: () => {
        // 更改值，表示已经不是第一次进入首页了
        firstEnter.value = false
      }})
    }, 500)
  }
})
</script>
<template>
  <div class="route-page">
    <div
      class="logo-copy cover-no-repeat-center"
      :style="logoCopyStyle"
      v-if="firstEnter"
    />
    <div class="community-btns">
      <div class="community-btn community-btn-discord" />
      <div class="community-btn community-btn-twitter" />
    </div>
    <div class="logo-and-play">
      <div
        class="logo cover-no-repeat-center"
        :class="firstEnter ? 'opacity-0' : ''"
        ref="logoRef"
      />
      <div class="play-btn cover-no-repeat-center" />
    </div>
    <div class="description">
      彷徨之街本名艾德里夫特街（Street of
      Adrift），它并非街道而是商业大楼。其负责人曾读过不少福京市官方语言的文学作品，于是把它意译为“彷徨之街”。
    </div>
    <div class="scroll-hint">
      <div class="scroll-hint-text">
        SCROLL
      </div>
      <div class="scroll-hint-icon cover-no-repeat-center" />
      <div class="scroll-hint-indicator cover-no-repeat-center" />
      <div class="scroll-hint-indicator delay-0_25s cover-no-repeat-center" />
    </div>
  </div>
</template>
<style lang="less" scoped>
@logo-width: 480px;
@logo-height: calc(@logo-width / 480 * 112);
@logo-and-play-top: calc(50% - calc(@logo-height + 64px) / 2);
@logo-margin-right: 16px;
@play-btn-size: 90px;
// 滑动提示
@keyframes for-scroll {
  0% {
    opacity: 0.5;
  }
  10% {
    opacity: 1;
  }
  20% {
    opacity: 0.5;
  }
}
// logo 的复制体
.logo-copy {
  width: @logo-width;
  height: @logo-height;
  position: absolute;
  top: calc(50% - @logo-height / 2);
  left: calc(50% - @logo-width / 2 + 20px);
  background-image: url("../assets/home-page/tsoa-logo.svg");
}
.scroll-hint {
  position: absolute;
  bottom: 24px;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  flex-direction: column;
  &-text {
    font-family: "Poppins", sans-serif;
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 8px;
  }
  &-icon {
    width: 25px;
    height: 37px;
    background-image: url("../assets/home-page/mouse-icon.svg");
    margin-bottom: 8px;
  }
  &-indicator {
    opacity: 0.5;
    width: 18px;
    height: 7px;
    background-image: url("../assets/home-page/scroll-indicator.svg");
    animation: 5s for-scroll infinite;
    &:first-child {
      margin-bottom: 8px;
    }
  }
}
// 文字介绍
.description {
  font-family: "Noto Sans SC", sans-serif;
  font-size: 16px;
  position: absolute;
  left: 64px;
  top: calc(50% + @logo-height / 2 + 64px);
  width: calc(@logo-width + @logo-margin-right + @play-btn-size);
  line-height: 32px;
}
// 社交页面按钮部分
.community-btns {
  display: flex;
  column-gap: 24px;
  position: absolute;
  left: 64px;
  top: calc(@logo-and-play-top - 32px - 24px);
}
// 社交页面按钮
.community-btn {
  cursor: pointer;
  transition: opacity 250ms ease;
  height: 32px;
  width: 80px;
  background-position: center;
  background-repeat: no-repeat;
  box-sizing: border-box;
  background-color: rgba(255, 255, 255, 0.2);
  border: 1px solid white;
  opacity: 0.5;
  &:hover {
    opacity: 1;
  }
  &-discord {
    background-image: url("../assets/home-page/discord-icon.svg");
  }
  &-twitter {
    background-image: url("../assets/home-page/twitter-icon.svg");
  }
}
// logo 和播放按钮
.logo-and-play {
  display: flex;
  position: absolute;
  top: @logo-and-play-top;
  left: 64px;
  padding: 32px 0;
  align-items: center;
  background-image: url("../assets/static-framework/page-title-dot.png"),
    url("../assets/static-framework/page-title-dot.png"),
    url("../assets/static-framework/page-title-dot.png"),
    url("../assets/static-framework/page-title-dot.png");
  background-repeat: no-repeat;
  background-position: top left, top right, bottom left, bottom right;
  .logo {
    width: @logo-width;
    height: @logo-height;
    background-image: url("../assets/home-page/tsoa-logo.svg");
    margin-right: @logo-margin-right;
  }
  .play-btn {
    transition: opacity 250ms ease;
    cursor: pointer;
    width: @play-btn-size;
    height: @play-btn-size;
    background-image: url("../assets/home-page/play-btn.svg");
    opacity: 0.5;
    &:hover {
      opacity: 1;
    }
  }
}
</style>
