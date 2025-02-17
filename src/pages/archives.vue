<!--档案页面-->
<script lang="ts" setup>
import { computed, CSSProperties, reactive, ref, watch } from 'vue'
import { gsap } from 'gsap'
import { useStore } from '../store'
import { storeToRefs } from 'pinia'
import { usePagination } from '../utils'
import { useI18n } from 'vue-i18n'
import { useElementBounding } from '@vueuse/core'

// i18n
const { t, locale } = useI18n()
// 状态
const store = useStore()
const { windowWidth, windowHeight, isOnMobile } = storeToRefs(store)
// TODO: 使用 i18n 替代文案
const picAndNameList = ref([
  { name: 'theHeadMistresses', pic: store.getRes('beauties', 'archive').value as HTMLImageElement },
  { name: 'refrigerator2044', pic: store.getRes('refrigerator2044', 'archive').value as HTMLImageElement },
  { name: 'refrigerator2045', pic: store.getRes('refrigerator2045', 'archive').value as HTMLImageElement },
  { name: 'tokugawa', pic: store.getRes('tokugawaInArchive', 'archive').value as HTMLImageElement },
  { name: 'planningBoard', pic: store.getRes('planningBoard', 'archive').value as HTMLImageElement },
  { name: 'lin', pic: store.getRes('linInArchive', 'archive').value as HTMLImageElement },
  { name: 'conceptDesign', pic: store.getRes('conceptDesign', 'archive').value as HTMLImageElement },
  { name: 'noTitle', pic: store.getRes('noTitle', 'archive').value as HTMLImageElement },
  { name: 'alcoholAbuse', pic: store.getRes('alcoholAbuse', 'archive').value as HTMLImageElement },
  { name: 'anna', pic: store.getRes('annaInArchive', 'archive').value as HTMLImageElement }
])
// 获取原图链接
const getOriginPicLink = (src: string): string => {
  const srcLarge = src.substring(0, src.lastIndexOf('.')) + '.jpg'
  return srcLarge
}
// 用来显示的名字索引
const showCurrentNameIndex = ref(0)
// 用来显示的图片名称
const showCurrentName = computed(() => {
  return picAndNameList.value[showCurrentNameIndex.value].name
})
// 标题元素
const titleNameEl = ref<HTMLDivElement>()
const titleNameBounding = useElementBounding(titleNameEl)
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
  gsap.fromTo(picAnimationArgs.value, {
    scale: 1
  }, {
    scale: 0,
    origin: next ? 'top left' : 'bottom right',
    duration: 0.75,
  })
  gsap.fromTo(picAnimationArgsNext.value, {
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
  // 开始标题数字退出动画
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
// 移动端缩略图当前正在显示的图片集
const currentShowForSmallPic = ref(0)
const currentSetForSmallPic = computed(() => {
  const indexes: number[] = []
  // 上一张图片索引
  let prev = currentShowForSmallPic.value - 1
  if (currentShowForSmallPic.value === 0) {
    prev = picAndNameList.value.length - 1
  }
  let prevPrev = prev - 1
  if (prev === 0) {
    prevPrev = picAndNameList.value.length - 1
  }
  indexes.push(prevPrev, prev, currentShowForSmallPic.value)
  // 下一张图片索引
  let next = currentShowForSmallPic.value + 1
  if (currentShowForSmallPic.value === picAndNameList.value.length - 1) {
    next = 0
  }
  let nextNext = next + 1
  if (next === picAndNameList.value.length - 1) {
    nextNext = 0
  }
  indexes.push(next, nextNext)
  return indexes
})
// 小图片动画
const { smallPicInnerStyle, doSmallPicAnimation } = (() => {
  // 小图片样式参数
  const args = reactive({
    x: -(windowWidth.value - 48) / 3
  })
  // 小图片样式
  const style = computed<CSSProperties>(() => ({
    transform: `translateX(${args.x}px)`
  }))
  // 动画开始函数
  const animation = (next: boolean) => {
    gsap.fromTo(args, {
      x: -(windowWidth.value - 48) / 3 - 4
    }, {
      x: next ? (-(windowWidth.value - 48) / 3) * 2 - 8 : 0,
      duration: 0.75,
      onComplete: () => {
        currentShowForSmallPic.value = currentIndex.value,
        args.x = -(windowWidth.value - 48) / 3 - 4
      }
    })
  }
  return {
    smallPicInnerStyle: style,
    doSmallPicAnimation: animation
  }
})()
// 使用分页组件
const { currentIndex, prevOrNext: switchPic } = usePagination(picAndNameList, (next, prevIndex) => {
  prevPic.value = prevIndex
}, (next) => {
  doTitleAnimation(next)
  doPicAniamtion(next)
  doSmallPicAnimation(next)
})
const switchPicForMobile = (index: number) => {
  if (index === currentIndex.value) return
  switchPic(index < currentIndex.value ? false : true)
}
// 切换至某张图片，在手机端时，只有手机端的组件可以触发
const switchTo = (index: number) => {
  if (isOnMobile.value) return
  // 如果当前照片索引与要切换到的索引相同，就不继续了
  if (currentIndex.value === index) return
  prevPic.value = currentIndex.value
  currentIndex.value = index
  doTitleAnimation(true)
  doPicAniamtion(true)
  doSmallPicAnimation(true)
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
  // 如果在移动端，就停止响应
  if (isOnMobile.value) {
    // 停止动画
    gsap.killTweensOf(pageStyleNums.value)
    // 开始新的动画
    gsap.to(pageStyleNums.value, {
      duration: 1.5,
      // 计算出倾斜角度
      x: 0,
      y: 0,
      ease: 'power4'
    })
    return
  }
  // 停止动画
  gsap.killTweensOf(pageStyleNums.value)
  // 开始新的动画
  gsap.to(pageStyleNums.value, {
    duration: 1.5,
    // 计算出倾斜角度
    x: (val.x - windowWidth.value / 2) / windowWidth.value * 2 * maxDeg,
    y: -(val.y - windowHeight.value / 2) / windowHeight.value * 2 * maxDeg,
    ease: 'power4'
  })
})
// 透视效果偏移倍数
const times = computed(() => isOnMobile.value ? 5 : 10)
// 整个页面的倾斜样式
const pageStyle = computed<CSSProperties>(() => {
  return {
    willChange: 'transform',
    transform: `perspective(1000px) translate3d(${pageStyleNums.value.x}px, ${-pageStyleNums.value.y}px, 0) rotateY(${pageStyleNums.value.x}deg) rotateX(${pageStyleNums.value.y}deg)`
  }
})
const layer1Style = computed<CSSProperties>(() => {
  return {
    willChange: 'transform',
    transform: `perspective(1000px) translate3d(${pageStyleNums.value.x * times.value}px, ${-pageStyleNums.value.y * times.value}px, 0)`
  }
})
const layer2Style = computed<CSSProperties>(() => {
  return {
    willChange: 'transform',
    transform: `perspective(1000px) translate3d(${pageStyleNums.value.x * times.value * 2}px, ${-pageStyleNums.value.y * times.value * 2}px, 0)`
  }
})
const layer3Style = computed<CSSProperties>(() => {
  return {
    willChange: 'transform',
    transform: `perspective(1000px) translate3d(${pageStyleNums.value.x * times.value * 3}px, ${-pageStyleNums.value.y * times.value * 3}px, 0)`
  }
})
</script>
<template>
  <div
    class="route-page"
  >
    <div class="matrix matrix-left-bottom" />
    <!-- 会被 3D 效果影响的区域 -->
    <div
      class="effect"
      :style="pageStyle"
    >
      <div class="bg-center bg-contain bg-no-repeat h-24px opacity-50 top-[calc(614px+50vh-540px)] right-[calc(454px+50vw-960px)] w-24px element-block absolute <sm:hidden <xl:(top-[calc(478px+50vh-407px)] right-[calc(254px+50vw-597px)]) " />
      <!-- 背景 -->
      <div class="background">
        <div class="flex flex-col gap-8px">
          <div class="ml-178px background-line <xl:ml-139px">
            <div class="background-item " />
            <div class="background-item" />
            <div class="background-item" />
          </div>
          <div class="background-line">
            <div class="background-item" />
            <div class="background-item" />
            <div class="background-item" />
          </div>
          <div class="ml-350px background-line <xl:ml-267px">
            <div class="background-item" />
            <div class="background-item background-item-empty" />
            <div class="background-item background-item-empty" />
          </div>
        </div>
      </div>
      <!-- 图片左侧矩阵 -->
      <div
        class="bottom-[calc(358px+50vh-540px)] left-[calc(437px+50vw-960px)] matrix <sm:hidden !opacity-100 <xl:(left-[calc(113px+50vw-597px)] bottom-[calc(266px+50vh-407px)]) "
        :style="layer1Style"
      />
      <!-- 图片右侧矩阵 -->
      <div
        class="top-[calc(233px+50vh-540px)] right-[calc(422px+50vw-960px)] z-999 matrix <sm:hidden !opacity-100 <xl:(right-[calc(256px+50vw-597px)] top-[calc(171px+50vh-407px)]) "
        :style="layer3Style"
      />
      <!-- 标题 -->
      <div
        class="title"
        :style="layer1Style"
      >
        <div
          class="title-name"
          ref="titleNameEl"
        >
          {{ t('archives.' + showCurrentName) }}
        </div>
        <div class="title-number">
          {{ showCurrentNameIndex + 1 > 9 ? '' : '0' }}{{ showCurrentNameIndex + 1 }}
        </div>
      </div>
      <!-- 主要内容 -->
      <div class="archives">
        <!-- 向左切换 -->
        <div
          class="archives-prev prev-btn clickble"
          @click="switchPic(false)"
          :style="layer1Style"
        />
        <div class="archives-center">
          <!-- 图片 -->
          <a
            :href="getOriginPicLink(picAndNameList[showCurrentNameIndex].pic.src)"
            target="_blank"
            class="bg-contain bg-center bg-no-repeat archives-pic block clickble"
            :style="{
              'background-image': `url(${picAndNameList[currentIndex].pic.src})`,
              transform: layer2Style.transform + ' ' + picAnimationStyleNext.transform,
              willChange: layer2Style.willChange,
              transformOrigin: picAnimationStyleNext.transformOrigin
            }"
          />
          <a
            :href="getOriginPicLink(picAndNameList[prevPic].pic.src)"
            target="_blank"
            class="bg-contain bg-center bg-no-repeat archives-pic block clickble"
            :style="{
              'background-image': `url(${picAndNameList[prevPic].pic.src})`,
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
              @click="switchTo(index - 1)"
            />
          </div>
        </div>
        <!-- 向右切换 -->
        <div
          class="archives-next next-btn clickble"
          @click="switchPic(true)"
          :style="layer1Style"
        />
      </div>
      <!-- 只有手机端会显示的小图 -->
      <div
        class="small-pic-container"
        :class="{
          'small-pic-container-two-line': titleNameBounding.height.value > 46
        }"
      >
        <div
          class="small-pic-inner"
          :style="smallPicInnerStyle"
        >
          <div
            class="small-pic"
            v-for="index in currentSetForSmallPic"
            :key="index + Math.random()"
            :style="{
              backgroundImage: `url(${picAndNameList[index].pic.src})`
            }"
            @click="switchPicForMobile(index)"
          />
        </div>
      </div>
      <!-- 页面四角的短横线 -->
      <div class="short-line short-line-top short-line-left <xl:hidden" />
      <div class="short-line short-line-top short-line-right <xl:hidden" />
      <div class="short-line short-line-bottom short-line-left <xl:hidden" />
      <div class="short-line short-line-bottom short-line-right <xl:hidden" />
    </div>
  </div>
</template>
<style lang="less" scoped>
.element-block {
  background-image: url('../assets/characters-page/character-active.svg');
}

.effect {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
// 缩略图
.small-pic-container {
  display: none;
  width: calc(100vw - 3rem);
  position: absolute;
  left: 24px;
}
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

  &-prev {
    position: absolute;
    left: calc(250px + 50vw - 960px);
    top: calc(50vh - 34px);
  }

  &-next {
    margin-left: 204px;
    position: absolute;
    right: calc(250px + 50vw - 960px);
    top: calc(50vh - 34px);
  }

  &-center {
    .archives-pic {
      transition: all;
      top: calc(279px + 50vh - 540px);
      left: calc(559px + 50vw - 960px);
      position: absolute;
      background-color: black;
      @height: 480px;
      @width: calc(@height / 40 * 71);

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
    width: 3rem;
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
    font-size: 4rem;
    line-height: 92px;
  }

  &-number {
    font-family: 'Poppins', sans-serif;
    font-weight: 500;
    line-height: 72px;
    font-size: 3rem;
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

// 当宽度低于 1679px 时，进入平板模式
@media screen and (max-width: 1679px) {
  .title {
    top: calc(128px + 50vh - 417px);
    left: calc(109px + 50vw - 597px);

    &-name {
      font-size: 3rem;
      line-height: 69px;
    }

    &-number {
      font-size: 2rem;
      line-height: 3rem;
    }
  }

  .background {
    &-item {
      width: 200px;
      height: 200px;
    }
  }

  .archives {
    &-center {
      .archives-pic {
        @height: 400px;
        @width: calc(@height / 40 * 71);

        height: @height;
        width: @width;
        top: calc(208px + 50vh - 417px);
        left: calc(194px + 50vw - 597px);
      }
    }

    &-indicator {
      width: 2rem;
    }

    &-indicators {
      bottom: calc(206px + 50vh - 407px);
      right: calc(290px + 50vw - 597px);
      column-gap: 16px;
    }

    &-prev {
      top: calc(50vh - 2rem);
      left: calc(50vw + 2rem - 597px);
    }

    &-next {
      right: calc(153px + 50vw - 597px);
      top: calc(50vh - 2rem);
    }
  }
}

// 当宽度低于 1079px 时，进入手机模式
@media screen and (max-width: 1079px) {
  .background {
    display: none;
  }

  @pic-width: calc(100vw - 3rem);
  @pic-height: calc(@pic-width / 71 * 40);
  @indicators-mt: 16px;
  @title-line-height: 46px;
  @title-mt: 16px;
  @title-number-line-height: 36px;
  @small-pic-mt: 8px;
  @small-pic-width: calc(calc(100vw - 3rem - 2rem) / 3);
  @small-pic-height: calc(@small-pic-width / 71 * 40);
  @indicator-height: 2px;
  @all-height: calc(@pic-height + @indicators-mt + @title-line-height + @title-mt + @title-number-line-height + @small-pic-mt + @small-pic-height + @indicator-height);
  @all-top: calc(50vh - @all-height / 2);

  .archives {
    &-center {
      .archives-pic {
        top: @all-top;
        left: 24px;
        width: @pic-width;
        height: @pic-height;
      }
    }

    &-indicators {
      top: calc(@all-top + @pic-height);
      left: 24px;
      margin-top: @indicators-mt;
      width: @pic-width;
    }

    &-indicator {
      width: 24px;
      height: @indicator-height;
      column-gap: 8px;
    }

    &-prev,
    &-next {
      top: calc(@all-top + @pic-height / 2 - 17px);
    }

    &-prev {
      left: 20px;
      z-index: 98;
    }

    &-next {
      right: 20px;
    }
  }

  .title {
    top: calc(@all-top + @pic-height + @indicator-height + @indicators-mt + @title-mt);
    left: 24px;

    &-name {
      font-size: 2rem;
      line-height: @title-line-height;
    }

    &-number {
      font-size: 24px;
      line-height: @title-number-line-height;
    }
  }

  .small-pic-container {
    overflow: hidden;
    display: block;
    top: calc(@all-top + @pic-height + @indicator-height + @indicators-mt + @title-line-height + @title-number-line-height + @title-mt + @small-pic-mt);
  }

  .small-pic-container-two-line {
    top: calc(@all-top + @pic-height + @indicator-height + @indicators-mt + @title-line-height + @title-number-line-height + @title-mt + @small-pic-mt + 46px);
  }

  .small-pic-inner {
    width: 100%;
    display: flex;
    flex-direction: row;
    column-gap: 16px;
  }

  .small-pic {
    flex-shrink: 0;
    width: @small-pic-width;
    height: @small-pic-height;
    background-position: center;
    background-size: contain;
    background-repeat: no-repeat;
  }
}
</style>
