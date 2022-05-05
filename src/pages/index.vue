<!--主页-->
<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { computed, CSSProperties, onMounted, ref } from 'vue'
import { useStore } from '../store'
import scrollHint from '../components/scroll-hint.vue'
import { useI18n } from 'vue-i18n'
import { useElementBounding, useMediaControls } from '@vueuse/core'

// states
const store = useStore()
const { firstEnter, staticFrameworkAnimationStart, scrollHintAnimationStart, allowScroll, mousePos, windowHeight, windowWidth } = storeToRefs(store)

// i18n
const { t, locale } = useI18n()
// logo 图标的引用
const logoRef = ref<HTMLDivElement | null>(null)
// logo 图标复制体的样式
const logoCopyStyle = ref<CSSProperties>({})
// 标题下方描述文字是否显示
const showDescriptionText = ref(false)
// 是否将元素转移到动画开始的状态
const animationFrom = ref(false)
// 神秘文字
const secretMsg = ref<HTMLDivElement>()
const secretMsgBounding = useElementBounding(secretMsg)
const secretMsgLightBounding = computed(() => {
  let top = secretMsgBounding.y.value
  if (top < 0) {
    top += windowHeight.value
  } else if (top > windowHeight.value) {
    top -= windowHeight.value
  }
  return {
    top,
    left: secretMsgBounding.x.value
  }
})
// 是否激活动画
const animationActive = ref(false)
// 各个元素的动画延迟
// 修改以调整各个元素动画开始的时间和顺序
const animationDelay = ref({
  logo: 0,
  playBtn: 500, // 播放按钮和旁边的 4 个点
  socialBtns: 1000, // discord 和 Twitter 按钮
  descTextLine1: 1500, // 描述文字第一行
  descTextLine2: 1750 // 描述文字第二行
})
// 各个元素动画的时长
const animationDuration = ref<typeof animationDelay.value>({
  logo: 500,
  playBtn: 500, // 播放按钮和旁边的 4 个点
  socialBtns: 500, // discord 和 Twitter 按钮
  descTextLine1: 500, // 描述文字第一行
  descTextLine2: 500 // 描述文字第二行
})
// 所有元素完成动画所需的时间
// 每个元素的动画时长 + 延迟 的最大值
const animationDurationAll = computed(() => {
  let durationAndDelay: number[] = []
  Object.keys(animationDuration.value).forEach(it => durationAndDelay.push((animationDuration.value as any)[it] + (animationDelay.value as any)[it]))
  return Math.max(...durationAndDelay)
})
// 滚动提示的 css 类
const scrollHintAnimationClass = computed<string>(() => {
  if (!firstEnter.value) {
    return ''
  }
  return scrollHintAnimationStart.value ? 'duration-500' : 'opacity-0'
})
// 当滚动提示的动画结束，把刷新后首次进入的旗标置为 false
const onScrollHintTransitionEnd = () => {
  firstEnter.value = false
  allowScroll.value = true
}
// 视频播放相关
const isVideoShow = ref(false)
const videoEl = ref<HTMLMediaElement>()
const { playing: isVideoPlaying } = useMediaControls(videoEl)
const showVideo = () => {
  isVideoShow.value = true
  isVideoPlaying.value = true
}
const hideVideo = () => {
  isVideoShow.value = false
  isVideoPlaying.value = false
}
// 定义挂载的时候执行的操作
onMounted(() => {
  if (firstEnter.value) {
    // 重载后第一次进入首页，展示动画
    animationFrom.value = true
    animationActive.value = true
    setTimeout(() => {
      animationFrom.value = false
      setTimeout(() => {
        animationActive.value = false
        staticFrameworkAnimationStart.value = true
      }, animationDurationAll.value)
    }, 250)
  } else {
    showDescriptionText.value = true
  }
})
// 监听目前最后一个结束的动画，的动画结束事件
</script>
<template>
  <div class="route-page">
    <div
      class="logo-copy cover-no-repeat-center"
      :style="logoCopyStyle"
      :class="{
        'logo-copy-center': animationFrom && animationActive,
        'duration-500 delay-0 transition-all': animationActive
      }"
      :lang="locale"
    />
    <!-- 左上角跳转按钮 -->
    <div class="absolute top-4rem left-4rem <sm:hidden flex">
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
    <!-- 社交媒体按钮 -->
    <div
      class="community-btns"
    >
      <a
        class="community-btn community-btn-discord clickble"
        :class="{
          'social-btns-hide': animationFrom && animationActive,
          '!duration-500 !delay-1000 !transition-all': animationActive
        }"
        href="https://discord.gg/monoverse"
        target="_blank"
      />
      <a
        class="community-btn community-btn-twitter clickble"
        :class="{
          'social-btns-hide': animationFrom && animationActive,
          '!duration-500 !delay-1000 !transition-all': animationActive
        }"
        href="https://twitter.com/adriftstreet"
        target="_blank"
      />
    </div>
    <div
      class="logo-and-play"
      :class="{
        'opacity-0': animationFrom && animationActive,
        'duration-500 delay-500 transition-all': animationActive
      }"
    >
      <div
        class="logo cover-no-repeat-center"
        ref="logoRef"
      />
      <div
        class="play-btn cover-no-repeat-center clickble"
        @click="showVideo"
      />
    </div>
    <div
      class="description"
      :class="{
        '!<sm:bottom-80px': locale === 'en'
      }"
    >
      <span
        class="text"
        :class="{
          'text-hide': animationFrom && animationActive,
          'duration-500 delay-1500 transition-all': animationActive,
          '!inline': locale === 'en'
        }"
      >{{ t('home.gameInfo1') }}</span>
      <span
        class="text"
        :class="{
          'text-hide': animationFrom && animationActive,
          'duration-500 delay-1750 transition-all': animationActive,
          '!inline': locale === 'en'
        }"
      >{{ t('home.gameInfo2') }}</span>
    </div>
    <!-- 神秘文字 -->
    <div
      class="absolute bottom-4rem left-4rem <sm:hidden <xl:(bottom-2rem left-2rem) overflow-hidden"
      ref="secretMsg"
    >
      <div
        class="absolute w-4rem h-4rem transform -translate-x-2rem -translate-y-2rem flex justify-center items-center rounded-full pointer-events-none"
        :style="{
          background: 'rgba(255, 255, 255, 0.5)',
          filter: 'blur(8px)',
          top: mousePos.y - secretMsgLightBounding.top + 'px', // 解决绝对定位的偏移问题
          left: mousePos.x - secretMsgLightBounding.left + 'px',
          'mix-blend-mode': 'screen',
        }"
      >
        <div
          class="w-2rem h-2rem filter-[blur(6px)] bg-[rgba(255, 255, 255, 1)] rounded-full pointer-events-none"
        />
      </div>
      <span
        class="font-inter font-400 text-0.75rem leading-1rem secret-msg"
        :style="{'mix-blend-mode': 'screen'}"
      >▽▲▽▽▽▽▲▽▽▽▲▽▲▲▲▲▽▲▽▲▽▲▲▲▽▽▲▽▽▽▽▽▽▽▲▲▽▽▽▲▽▽▲▲▽▽▲▽</span>
    </div>
    <scroll-hint
      :class="scrollHintAnimationClass"
      @transitionend="onScrollHintTransitionEnd"
    />
    <!-- 视频容器 -->
    <div
      class="position absolute w-[100vw] h-[100vh] flex justify-center items-center duration-250 transition-colors"
      :class="{
        'pointer-events-none': !isVideoShow,
        'bg-[rgba(0,0,0,0.5)]': isVideoShow
      }"
    >
      <div
        class="transition duration-250 flex flex-col"
        :class="{
          'opacity-0 transform -translate-y-1.5rem': !isVideoShow,
        }"
      >
        <div class="pb-1.5rem w-[100%]">
          <div
            class="close-btn float-right clickble"
            @click="hideVideo"
          />
        </div>
        <div
          class="video-container"
        >
          <video
            ref="videoEl"
            src="../assets/home-page/game-video.mp4"
            class="w-[100%]"
            type="video/mp4"
            preload="metadata"
            controls
          />
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="less" scoped>
@logo-width: 480px;
@logo-height: calc(@logo-width / 480 * 112);
@logo-and-play-top: calc(50% - calc(@logo-height + 64px) / 2);
@logo-margin-right: 16px;
@play-btn-size: 90px;
// 视频容器
.video-container {
  width: 50vw;
  height: calc(50vw / 16 * 9);
}

.secret-msg {
  transition-property: opacity;
  transition-duration: 250ms;
  transition-timing-function: ease;
  opacity: 0.1;

  &:hover {
    opacity: 0.3;
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

  &:lang(zh) {
    background-image: url("../assets/home-page/tsoa-logo.svg");
  }

  &:lang(en) {
    background-image: url("../assets/home-page/tsoa-logo-en.svg");
  }
}

.logo-copy-center {
  left: calc(50% - @logo-width / 2 + 20px);
}

.transition-active {
  transition: all 250ms ease !important;
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
// 宽度低于 1679px 时
@media screen and (max-width: 1679px) {
  @logo-width: 360px;
  @logo-height: calc(@logo-width / 640 * 149);
  @logo-and-play-top: calc(50% - calc(@logo-height + 48px) / 2);
  @logo-margin-right: 16px;
  @play-btn-size: 64px;

  .logo-and-play {
    left: 32px;
    top: @logo-and-play-top;
    padding: 24px;

    .logo {
      width: @logo-width;
      height: @logo-height;
      margin-right: @logo-margin-right;
    }

    .play-btn {
      width: @play-btn-size;
      height: @play-btn-size;
    }
  }

  .logo-copy {
    left: 32px;
    width: @logo-width;
    height: @logo-height;
    position: absolute;
    top: calc(50% - @logo-height / 2);
  }

  .logo-copy-center {
    left: calc(50% - @logo-width / 2 + 30px);
  }

  .description {
    top: calc(50% + @logo-height / 2 + 64px);
    font-size: 14px;
    left: 32px;
  }

  .community-btns {
    left: 32px;
  }
}

// 低于 1080px 切换到手机端
@media screen and (max-width: 1079px) {
  @logo-width: 240px;
  @logo-height: calc(@logo-width / 640 * 149);
  @logo-and-play-top: calc(50% - calc(@logo-height + 48px) / 2);
  @logo-margin-right: 16px;
  @play-btn-size: 64px;
  @desc-bottom: 100px;
  @desc-height: 72px;
  @desc-margin-top: 16px;

  .logo-and-play {
    top: unset;
    bottom: calc(@desc-bottom + @desc-height + @desc-margin-top);
    left: 20px;
    padding-left: 0;

    .logo {
      width: @logo-width;
      height: @logo-height;
    }
  }

  .description {
    font-size: 12px;
    top: unset;
    bottom: 100px;
    left: 20px;
    width: calc(100vw - 40px);
    line-height: 24px;

    .text {
      display: inline;
    }
  }

  .logo-copy {
    top: unset;
    left: 20px;
    width: @logo-width;
    height: @logo-height;
    bottom: calc(@desc-bottom + @desc-height + @desc-margin-top + 32px);
  }

  .logo-copy-center {
    top: unset;
    left: calc(50% - @logo-width / 2 + 20px);
    bottom: calc(50% - @logo-height / 2);
  }

  .community-btn {
    width: 60px;
    height: 24px;
    background-size: 16px 16px;
  }

  .community-btns {
    top: unset;
    bottom: calc(@desc-bottom + @desc-height + @desc-margin-top + 64px + @logo-height + 18px);
    left: 20px;
  }

  .video-container {
    width: 100vw;
    height: (100vw / 16 * 9);
  }
}
</style>
