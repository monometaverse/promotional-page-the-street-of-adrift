<!--档案页面-->
<script lang="ts" setup>
import { computed, CSSProperties, ref, watch } from 'vue'
import beauties from '../assets/archive-page/beauties.jpg'
import haven from '../assets/archive-page/heaven.jpg'
import anna from '../assets/archive-page/anna.jpg'
import planning from '../assets/archive-page/planning-board.jpg'
import { gsap } from 'gsap'
import { useStore } from '../store'
import { storeToRefs } from 'pinia'

// 状态
const store = useStore()
const { windowWidth, windowHeight, pageChanging } = storeToRefs(store)
// TODO: 切换动画方案，遍历图片列表，生成被 transition 组件包裹的图片
const picAndNameList = ref([
  { name: '花魁们', pic: beauties },
  { name: '九霄', pic: haven },
  { name: '安娜', pic: anna },
  { name: '计划板', pic: planning },
])
// 当前正在显示的图片索引
const currentIndex = ref(0)
// 用来显示的名字索引
const showCurrentNameIndex = ref(0)
// 用来显示的图片名称
const showCurrentName = computed(() => {
  return picAndNameList.value[showCurrentNameIndex.value].name
})
// 标题动画定时
let animationTimeout = -1
const translateDistance = 100
// 图片动画用的参数
const picAnimationArgs = ref({
  origin: '',
  scale: 1
})
// 图片动画时使用的样式
const picAnimationStyle = computed<CSSProperties>(() => ({
  transform: `scale(${picAnimationArgs.value.scale}, ${picAnimationArgs.value.scale})`,
  transformOrigin: picAnimationArgs.value.origin
}))
// 下一张图片动画用的参数
const picAnimationArgsNext = ref({
  origin: '',
  scale: 1
})
// 下一张图片动画时使用的样式
const picAnimationStyleNext = computed<CSSProperties>(() => ({
  transform: `scale(${picAnimationArgsNext.value.scale}, ${picAnimationArgsNext.value.scale})`,
  transformOrigin: picAnimationArgsNext.value.origin
}))
// 是否正在进行下一张图片
const isNextPic = ref(false)
// 上一张图片
const prevPic = ref(0)
// 图片动画
const doPicAniamtion = (next: boolean) => {
  isNextPic.value = next
  // 终止图片的动画
  gsap.killTweensOf(picAnimationArgs.value)
  gsap.killTweensOf(picAnimationArgsNext.value)
  gsap.fromTo(picAnimationArgs.value,{
    scale: 1
  }, {
    scale: 0,
    origin: next ? 'top left' : 'bottom right',
    duration: 0.75,
  })
  gsap.fromTo(picAnimationArgsNext.value,{
    scale: 0
  }, {
    scale: 1,
    origin: next ? 'bottom right' : 'top left',
    duration: 0.75
  })
}
// 进行标题动画
const doTitleAnimation = (next: boolean) => {
  // 终止标题动画
  window.clearTimeout(animationTimeout)
  gsap.killTweensOf('.title-name')
  gsap.killTweensOf('.title-number')
  // 开始标题退出动画
  gsap.to('.title-name', {
    translateX: `${next ? -translateDistance : translateDistance}px`,
    opacity: '0',
    duration: 0.25
  })
  // 开始图片退出动画
  animationTimeout = window.setTimeout(() => {
    gsap.to('.title-number', {
      translateX: `${next ? -translateDistance : translateDistance}px`,
      opacity: '0',
      duration: 0.25,
      onComplete: () => {
        // 开始标题进入动画
        showCurrentNameIndex.value = currentIndex.value
        gsap.fromTo('.title-name', {
          translateX: `${next ? translateDistance : -translateDistance}px`,
        }, {
          translateX: '0',
          opacity: '1',
          duration: 0.25
        })
        setTimeout(() => {
          gsap.fromTo('.title-number', {
            translateX: `${next ? translateDistance : -translateDistance}px`,
          }, {
            translateX: '0',
            opacity: '0.5',
            duration: 0.25
          })
        }, 125)
      }
    })
  }, 125)
}
// 上一张或下一张
const switchPic = (next: boolean) => {
  prevPic.value = currentIndex.value
  if (next) {
    // 下一张，如果是最后一张就跳到第一张
    if (currentIndex.value < picAndNameList.value.length - 1) {
      currentIndex.value += 1
    } else {
      currentIndex.value = 0
    }
  } else {
    // 上一张，如果是第一张就跳到最后一张
    if (currentIndex.value === 0) {
      currentIndex.value = picAndNameList.value.length - 1
    } else {
      currentIndex.value -= 1
    }
  }
  doTitleAnimation(next)
  doPicAniamtion(next)
}
// 最大倾斜角度
const maxDeg = 5
// 整个页面的倾斜样式，纯数字
const pageStyleNums = ref({
  x: 0,
  y: 0
})
// 监听鼠标位置的变化
watch(store.mousePos, (val) => {
  if (pageChanging.value) return
  // 停止动画
  gsap.killTweensOf(pageStyleNums.value)
  // 开始新的动画
  gsap.to(pageStyleNums.value, {
    duration: 1,
    x: (val.x - windowWidth.value / 2) / windowWidth.value * 2 * maxDeg,
    y: -(val.y - windowHeight.value / 2) / windowHeight.value * 2 * maxDeg,
    ease: 'power4'
  })
})
// 整个页面的倾斜样式
const pageStyle = computed<CSSProperties>(() => {
  if (pageChanging.value) return {}
  return {
    willChange: 'transform',
    transform: `perspective(1000px) translate3d(${pageStyleNums.value.x}px, ${-pageStyleNums.value.y}px, 50px) rotateY(${pageStyleNums.value.x}deg) rotateX(${pageStyleNums.value.y}deg)`
  }
})
const layer1Style = computed<CSSProperties>(() => {
  if (pageChanging.value) return {}
  return {
    willChange: 'transform',
    transform: `perspective(1000px) translate3d(${pageStyleNums.value.x * 5}px, ${-pageStyleNums.value.y * 5}px, 50px)`
  }
})
const layer2Style = computed<CSSProperties>(() => {
  if (pageChanging.value) return {}
  return {
    willChange: 'transform',
    transform: `perspective(1000px) translate3d(${pageStyleNums.value.x * 10}px, ${-pageStyleNums.value.y * 10}px, 50px)`
  }
})
const layer3Style = computed<CSSProperties>(() => {
  if (pageChanging.value) return {}
  return {
    willChange: 'transform',
    transform: `perspective(1000px) translate3d(${pageStyleNums.value.x * 15}px, ${-pageStyleNums.value.y * 15}px, 50px)`
  }
})
</script>
<template>
  <div
    class="route-page"
    :style="pageStyle"
  >
    <div class="matrix matrix-left-bottom" />
    <!-- 背景 -->
    <div class="background">
      <div class="flex flex-col">
        <div class="background-line ml-178px">
          <div class="background-item " />
          <div class="background-item" />
          <div class="background-item" />
        </div>
        <div class="background-line">
          <div class="background-item" />
          <div class="background-item" />
          <div class="background-item" />
        </div>
        <div class="background-line ml-350px">
          <div class="background-item" />
          <div class="background-item background-item-empty" />
          <div class="background-item background-item-empty" />
        </div>
      </div>
    </div>
    <!-- 图片左侧矩阵 -->
    <div
      class="matrix left-[calc(437px+50vw-960px)] bottom-[calc(358px+50vh-540px)] !opacity-100"
      :style="layer1Style"
    />
    <!-- 图片右侧矩阵 -->
    <div
      class="matrix right-[calc(422px+50vw-960px)] top-[calc(233px+50vh-540px)] !opacity-100 z-999"
      :style="layer3Style"
    />
    <!-- 标题 -->
    <div
      class="title"
      :style="layer1Style"
    >
      <div class="title-name">
        {{ showCurrentName }}
      </div>
      <div class="title-number">
        0{{ showCurrentNameIndex + 1 }}
      </div>
    </div>
    <!-- 主要内容 -->
    <div class="archives">
      <!-- 向左切换 -->
      <div
        class="archives-prev clickble"
        @click="switchPic(false)"
        :style="layer1Style"
      />
      <div class="archives-center">
        <!-- 图片 -->
        <a
          :href="picAndNameList[showCurrentNameIndex].pic"
          target="_blank"
          class="archives-pic cover-no-repeat-center block clickble"
          :style="{
            'background-image': `url(${picAndNameList[currentIndex].pic})`,
            transform: layer2Style.transform + ' ' + picAnimationStyleNext.transform,
            willChange: layer2Style.willChange,
            transformOrigin: picAnimationStyleNext.transformOrigin
          }"
        />
        <a
          :href="picAndNameList[showCurrentNameIndex].pic"
          target="_blank"
          class="archives-pic cover-no-repeat-center block clickble"
          :style="{
            'background-image': `url(${picAndNameList[prevPic].pic})`,
            transform: layer2Style.transform + ' ' + picAnimationStyle.transform,
            willChange: layer2Style.willChange,
            transformOrigin: picAnimationStyle.transformOrigin
          }"
        />
        <!-- 当前图片位置指示器 -->
        <div
          class="archives-indicators"
          :style="layer3Style"
        >
          <div
            class="archives-indicator clickble"
            v-for="index in picAndNameList.length"
            :key="index"
            :class="index - 1 === currentIndex ? 'archives-indicator-active' : ''"
          />
        </div>
      </div>
      <!-- 向右切换 -->
      <div
        class="archives-next clickble"
        @click="switchPic(true)"
        :style="layer1Style"
      />
    </div>
    <!-- 页面四角的短横线 -->
    <div class="short-line short-line-top short-line-left" />
    <div class="short-line short-line-top short-line-right" />
    <div class="short-line short-line-bottom short-line-left" />
    <div class="short-line short-line-bottom short-line-right" />
  </div>
</template>
<style lang="less" scoped>
// 主要内容
.archives {
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  // TODO: 把上一个下一个按钮抽离成组件
  &-prev {
    background-image: url('../assets/nft-page/models-prev.svg');
    position: absolute;
    left: calc(250px + 50vw - 960px);
    top: calc(50vh - 34px);
  }

  &-next {
    background-image: url('../assets/nft-page/models-next.svg');
    margin-left: 204px;
    position: absolute;
    right: calc(250px + 50vw - 960px);
    top: calc(50vh - 34px);
  }

  &-prev,
  &-next {
    width: 54px;
    height: 68px;
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
    opacity: 0.5;
    transition: opacity 250ms ease;
    pointer-events: fill;

    &:hover {
      opacity: 1;
    }
  }

  &-center {
    .archives-pic {
      transition: all;
      top: calc(279px + 50vh - 540px);
      left: calc(559px + 50vw - 960px);
      position: absolute;
      @height: 480px;
      @width: calc(@height / 9 * 16);

      height: @height;
      width: @width;
    }
  }

  &-indicators {
    position: absolute;
    bottom: calc(301px + 50vh - 540px);
    right: calc(508px + 50vw - 960px);
    display: flex;
    column-gap: 24px;
    margin-top: 16px;
    justify-content: end;
  }

  &-indicator {
    transition: opacity 250ms ease;
    width: 48px;
    height: 4px;
    opacity: 0.25;
    background-color: white;

    &:hover {
      opacity: 0.5;
    }

    &-active {
      opacity: 1;

      &:hover {
        opacity: 1;
      }
    }
  }
}
// 标题
.title {
  position: absolute;
  top: calc(128px + 50vh - 540px);
  left: calc(393px + 50vw - 960px);

  &-name {
    font-family: 'Noto Serif SC', sans-serif;
    font-weight: 900;
    font-size: 64px;
    line-height: 92px;
  }

  &-number {
    font-family: 'Poppins', sans-serif;
    font-weight: 500;
    line-height: 72px;
    font-size: 48px;
    opacity: 0.5;
  }
}
// 背景
.background {
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  row-gap: 8px;
  align-items: center;
  justify-content: center;

  &-line {
    display: flex;
    column-gap: 8px;
  }

  &-item {
    border: 2px rgba(255, 255, 255, 0.5) solid;
    width: 256px;
    height: 256px;

    &-empty {
      display: flex;
      align-items: center;
      justify-content: center;

      &::after {
        content: '';
        display: block;
        width: 256px;
        height: 2px;
        background-color: rgba(255, 255, 255, 0.5);
        transform: rotate(-45deg);
      }
    }
  }
}
</style>
