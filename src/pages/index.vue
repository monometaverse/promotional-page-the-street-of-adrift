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
const animationStart = ref(false)
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
const showSecretMsgCoverMaxDistance = 256
// 光圈的不透明度
const msgCoverOpacity = computed(() => {
  let processedBoundingY = secretMsgBounding.y.value // 修正获取到的 y 值
  if (processedBoundingY < 0) {
    processedBoundingY += windowHeight.value
  } else if (processedBoundingY > windowHeight.value) {
    processedBoundingY -= windowHeight.value
  }
  const top = mousePos.value.y < processedBoundingY // 是否在文字上方
  const bottom = mousePos.value.y > processedBoundingY + secretMsgBounding.height.value // 是否在文字下方
  const left = mousePos.value.x < secretMsgBounding.x.value // 是否在文字左方
  const right = mousePos.value.x > secretMsgBounding.x.value + secretMsgBounding.width.value // 是否在文字右方
  let distance = 0
  if (top) {
    if (left) {
      // 在文字左上方
      distance = Math.sqrt(Math.pow(secretMsgBounding.x.value - mousePos.value.x, 2) + Math.pow(processedBoundingY - mousePos.value.y, 2))
    } else if (right) {
      // 在文字右上方
      distance = Math.sqrt(Math.pow(mousePos.value.x - secretMsgBounding.x.value - secretMsgBounding.width.value, 2) + Math.pow(processedBoundingY - mousePos.value.y, 2))
    } else {
      // 在文字正上方
      distance = processedBoundingY - mousePos.value.y
    }
  } else if (bottom) {
    if (left) {
      // 在文字左下方
      distance = Math.sqrt(Math.pow(secretMsgBounding.x.value - mousePos.value.x, 2) + Math.pow(mousePos.value.y - processedBoundingY - secretMsgBounding.height.value, 2))
    } else if (right) {
      // 在文字右下方
      distance = Math.sqrt(Math.pow(mousePos.value.x - secretMsgBounding.x.value - secretMsgBounding.width.value, 2) + Math.pow(mousePos.value.y - processedBoundingY - secretMsgBounding.height.value, 2))
    } else {
      // 在文字正下方
      distance = mousePos.value.y - processedBoundingY - secretMsgBounding.height.value
    }
  } else {
    if (left) {
      // 在文字正左方
      distance = secretMsgBounding.x.value - mousePos.value.x
    } else if (right) {
      // 在文字正右方
      distance = mousePos.value.x - secretMsgBounding.x.value - secretMsgBounding.width.value
    }
    // 在文字内部无需计算
  }
  if (distance <= showSecretMsgCoverMaxDistance) {
    return (showSecretMsgCoverMaxDistance - distance) / showSecretMsgCoverMaxDistance
  }
  return 0
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
function onSecondDescTransitionEnd() {
  staticFrameworkAnimationStart.value = true
}
// 定义挂载的时候执行的操作
onMounted(() => {
  if (firstEnter.value) {
    // 重载后第一次进入首页，展示动画
    setTimeout(() => {
      animationStart.value = true
    }, 250)
    return
  }
  showDescriptionText.value = true

})
// 监听目前最后一个结束的动画，的动画结束事件
</script>
<template>
  <div class="route-page">
    <div
      class="logo-copy logo-copy-center cover-no-repeat-center duration-500 delay-0 transition-all"
      :style="logoCopyStyle"
      :class="{
        'logo-copy-position-normal': animationStart,
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
        class="community-btn community-btn-discord clickble !duration-500 !delay-1000 !transition-all"
        :class="{
          'social-btns-hide': !animationStart,
        }"
        href="https://discord.gg/monoverse"
        target="_blank"
      />
      <a
        class="community-btn community-btn-twitter clickble !duration-500 !delay-1000 !transition-all"
        :class="{
          'social-btns-hide': !animationStart,
        }"
        href="https://twitter.com/adriftstreet"
        target="_blank"
      />
    </div>
    <div
      class="logo-and-play duration-500 delay-500 transition-all"
      :class="{
        'opacity-0': !animationStart
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
        class="text duration-500 delay-1500 transition-all"
        :class="{
          'text-hide': !animationStart,
          '!inline': locale === 'en'
        }"
      >{{ t('home.gameInfo1') }}</span>
      <span
        @transitionend="onSecondDescTransitionEnd"
        class="text duration-500 delay-1750 transition-all"
        :class="{
          'text-hide': !animationStart,
          '!inline': locale === 'en'
        }"
      >{{ t('home.gameInfo2') }}</span>
    </div>
    <!-- 神秘文字 -->
    <div
      class="absolute bottom-4rem left-4rem <sm:hidden <xl:(bottom-2rem left-2rem)"
      ref="secretMsg"
    >
      <!-- 鼠标光圈 -->
      <div
        class="absolute w-4rem h-4rem transform -translate-x-2rem -translate-y-2rem flex justify-center items-center rounded-full pointer-events-none"
        :style="{
          background: 'rgba(255, 255, 255, 0.25)',
          filter: 'blur(8px)',
          top: mousePos.y - secretMsgLightBounding.top + 'px', // 解决绝对定位的偏移问题
          left: mousePos.x - secretMsgLightBounding.left + 'px',
          opacity: msgCoverOpacity + ''
        }"
      >
        <div
          class="w-2rem h-2rem filter-[blur(6px)] bg-[rgba(255, 255, 255, 0.5)] rounded-full pointer-events-none"
        />
      </div>
      <span
        class="font-inter font-400 text-0.75rem leading-1rem secret-msg"
      >▽▲▽▽▽▽▲▽▽▽▲▽▲▲▲▲▽▲▽▲▽▲▲▲▽▽▲▽▽▽▽▽▽▽▲▲▽▽▽▲▽▽▲▲▽▽▲▽</span>
      <span
        class="font-inter font-400 text-0.75rem leading-1rem secret-msg-mask"
        :style="{
          'mask-position': `${mousePos.x - secretMsgLightBounding.left - 32}px ${mousePos.y - secretMsgLightBounding.top - 32}px`,
          '-webkit-mask-position': `${mousePos.x - secretMsgLightBounding.left - 32}px ${mousePos.y - secretMsgLightBounding.top - 32}px`
        }"
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
@logo-and-play-top: calc(50% - calc(@logo-height + 4rem) / 2);
@logo-margin-right: 16px;
@play-btn-size: 90px;
// 视频容器
.video-container {
  width: 50vw;
  height: calc(50vw / 16 * 9);
}

.secret-msg {
  opacity: 0.05;
  display: block;
}

.secret-msg-mask {
  display: block;
  -webkit-mask-image: radial-gradient(circle at center, white 0%, transparent 80px);
  mask-image: radial-gradient(circle at center, white 0%, transparent 80px);
  mask-repeat: no-repeat;
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-size: 4rem 4rem;
  opacity: 0.5;
  mask-size: 4rem 4rem;
  transform: translateY(-100%);
}
// logo 的复制体
.logo-copy {
  position: absolute;
  width: @logo-width;
  height: @logo-height;
  top: calc(50% - @logo-height / 2);
  background-image: url("../assets/home-page/tsoa-logo.svg");

  &:lang(zh) {
    background-image: url("../assets/home-page/tsoa-logo.svg");
  }

  &:lang(en) {
    background-image: url("../assets/home-page/tsoa-logo-en.svg");
  }
}

.logo-copy-position-normal {
  left: 4rem !important;
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
  left: 4rem;
  top: calc(50% + @logo-height / 2 + 4rem);
  width: calc(@logo-width + @logo-margin-right + @play-btn-size);
  line-height: 2rem;

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
  left: 4rem;
  top: calc(@logo-and-play-top - 2rem - 24px);
  overflow: hidden;
}

.social-btns-hide {
  transform: translateY(40px);
}
// 社交页面按钮
.community-btn {
  cursor: pointer;
  transition: opacity 250ms ease;
  height: 2rem;
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
  left: 4rem;
  padding: 2rem 0;
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
  @logo-and-play-top: calc(50% - calc(@logo-height + 3rem) / 2);
  @logo-margin-right: 16px;
  @play-btn-size: 4rem;

  .logo-and-play {
    left: 2rem;
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
    width: @logo-width;
    height: @logo-height;
    position: absolute;
    top: calc(50% - @logo-height / 2);
  }

  .logo-copy-position-normal {
    left: 2rem !important;
  }

  .logo-copy-center {
    left: calc(50% - @logo-width / 2 + 30px);
  }

  .description {
    top: calc(50% + @logo-height / 2 + 4rem);
    font-size: 14px;
    left: 2rem;
  }

  .community-btns {
    left: 2rem;
  }
}

// 低于 1080px 切换到手机端
@media screen and (max-width: 1079px) {
  @logo-width: 240px;
  @logo-height: calc(@logo-width / 640 * 149);
  @logo-and-play-top: calc(50% - calc(@logo-height + 3rem) / 2);
  @logo-margin-right: 16px;
  @play-btn-size: 4rem;
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
  }

  .logo-copy-position-normal {
    left: 20px !important;
    bottom: calc(@desc-bottom + @desc-height + @desc-margin-top + 2rem) !important;
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
    bottom: calc(@desc-bottom + @desc-height + @desc-margin-top + 4rem + @logo-height + 18px);
    left: 20px;
  }

  .video-container {
    width: 100vw;
    height: (100vw / 16 * 9);
  }
}
</style>
