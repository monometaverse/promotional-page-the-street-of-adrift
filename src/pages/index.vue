<!--主页-->
<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { computed, CSSProperties, onMounted, ref } from 'vue'
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
// 标题下方描述文字是否显示
const showDescriptionText = ref(false)
// 是否将元素转移到动画开始的状态
const animationFrom = ref(false)
// 是否激活动画
const animationActive = ref(false)
// 动画类
const animationClasses = computed(() => {
  return {
    // 当元素从动画开始的状态转移回原本状态时，显示动画效果
    logo: animationActive.value ? animationFrom.value ? 'logo-copy-center' : 'transition-active' : '', // 游戏 logo 的动画类
    playBtn: animationActive.value ? animationFrom.value ? 'opacity-0' : 'transition-active' : '', // 播放按钮和边框 4 个点的动画类
    descText: animationActive.value ? animationFrom.value ? 'text-hide' : 'transition-active' : '', // 标题下方描述文字的动画类
    socialBtns: animationActive.value ? animationFrom.value ? 'social-btns-hide': 'transition-active' : '' // 社交媒体按钮的动画类
  }
})
// 定义挂载的时候执行的操作
onMounted(() => {
  if (firstEnter.value) {
    // 重载后第一次进入首页，展示动画
    animationFrom.value = true
    animationActive.value = true
    setTimeout(() => {
      animationFrom.value = false
      firstEnter.value = false
    }, 500)
  } else {
    showDescriptionText.value = true
  }
})
</script>
<template>
  <div class="route-page">
    <div
      class="logo-copy cover-no-repeat-center"
      :style="logoCopyStyle"
      :class="animationClasses.logo"
    />
    <div
      class="community-btns"
    >
      <div
        class="community-btn community-btn-discord"
        :class="animationClasses.socialBtns"
      />
      <div
        class="community-btn community-btn-twitter"
        :class="animationClasses.socialBtns"
      />
    </div>
    <div
      class="logo-and-play"
      :class="animationClasses.playBtn"
    >
      <div
        class="logo cover-no-repeat-center"
        ref="logoRef"
      />
      <div class="play-btn cover-no-repeat-center" />
    </div>
    <div class="description">
      <span
        class="text"
        :class="animationClasses.descText"
      >彷徨之街本名艾德里夫特街（Street of Adrift），它并非街道而是商业大楼。</span>
      <span
        class="text delay-0_25s"
        :class="animationClasses.descText"
      >其负责人曾读过不少福京市官方语言的文学作品，于是把它意译为“彷徨之街”。</span>
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
  left: 64px;
  background-image: url("../assets/home-page/tsoa-logo.svg");
}

.logo-copy-center {
  left: calc(50% - @logo-width / 2 + 20px);
}

.transition-active {
  transition: all 250ms ease !important;
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

  .text {
    display: block;
    transition: all 500ms ease;
  }

  .text-hide {
    opacity: 0;
    transform: translateY(20px);
  }
}
// 社交页面按钮部分
.community-btns {
  display: flex;
  column-gap: 24px;
  position: absolute;
  left: 64px;
  top: calc(@logo-and-play-top - 32px - 24px);
  overflow: hidden;
}

.social-btns-hide {
  transform: translateY(40px);
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
  background-image:
    url("../assets/static-framework/page-title-dot.png"),
    url("../assets/static-framework/page-title-dot.png"),
    url("../assets/static-framework/page-title-dot.png"),
    url("../assets/static-framework/page-title-dot.png");
  background-repeat: no-repeat;
  background-position: top left, top right, bottom left, bottom right;

  .logo {
    width: @logo-width;
    height: @logo-height;
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
