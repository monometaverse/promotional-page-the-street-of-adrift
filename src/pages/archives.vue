<!--档案页面-->
<script lang="ts" setup>
import { computed, ref } from 'vue'
import beauties from '../assets/archive-page/beauties.jpg'
import haven from '../assets/archive-page/heaven.jpg'
import anna from '../assets/archive-page/anna.jpg'
import planning from '../assets/archive-page/planning-board.jpg'

// TODO: 切换动画方案，遍历图片列表，生成被 transition 组件包裹的图片
const picAndNameList = ref([
  { name: '花魁们', pic: beauties },
  { name: '九霄', pic: haven },
  { name: '安娜', pic: anna },
  { name: '计划板', pic: planning },
])
// 当前正在显示的图片索引
const currentIndex = ref(0)
// 当前正在显示的图片
const currentPicAndName = computed(() => {
  return picAndNameList.value[currentIndex.value]
})
// 当前正在进行上一张还是下一张
const isNext = ref(false)
// 当前使用的动画类名
const picAnimationName = computed(() => {
  return isNext.value ? 'pic-next' : 'pic-prev'
})
const titleAnimationName = computed(() => {
  return isNext.value ? 'title-next' : 'title-prev'
})
// 上一张或下一张
const switchPic = (next: boolean) => {
  isNext.value = next
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
}
</script>
<template>
  <div class="route-page">
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
    <!-- 图片右侧矩阵 -->
    <div class="matrix left-[calc(437px+50vw-960px)] bottom-[calc(358px+50vh-540px)] !opacity-100" />
    <!-- 图片左侧矩阵 -->
    <div class="matrix right-[calc(422px+50vw-960px)] top-[calc(233px+50vh-540px)] !opacity-100 z-999" />
    <!-- 标题 -->
    <div class="title">
      <div class="title-name">
        {{ currentPicAndName.name }}
      </div>
      <div class="title-number">
        0{{ currentIndex + 1 }}
      </div>
    </div>
    <!-- 主要内容 -->
    <div class="archives">
      <!-- 向左切换 -->
      <div
        class="archives-prev clickble"
        @click="switchPic(false)"
      />
      <div class="archives-center">
        <!-- 图片 -->
        <transition
          :name="picAnimationName"
          v-for="index in picAndNameList.length"
          :key="index"
        >
          <a
            :href="picAndNameList[index - 1].pic"
            target="_blank"
            class="archives-pic cover-no-repeat-center block clickble"
            v-show="currentIndex === index - 1"
            :style="{
              'background-image': `url(${picAndNameList[index - 1].pic})`
            }"
          />
        </transition>
        <!-- 当前图片位置指示器 -->
        <div class="archives-indicators">
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
