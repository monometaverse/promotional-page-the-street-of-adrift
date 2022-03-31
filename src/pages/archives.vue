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
</script>
<template>
  <div class="route-page">
    <div class="matrix matrix-left-bottom" />
    <!-- 背景 -->
    <div class="background">
      <div class="background-line">
        <div class="background-item ml-178px" />
        <div class="background-item" />
        <div class="background-item" />
      </div>
      <div class="background-line">
        <div class="background-item" />
        <div class="background-item" />
        <div class="background-item" />
      </div>
      <div class="background-line">
        <div class="background-item ml-350px" />
        <div class="background-item background-item-empty" />
        <div class="background-item background-item-empty" />
      </div>
    </div>
    <!-- 图片右侧矩阵 -->
    <div class="matrix" />
    <!-- 图片左侧矩阵 -->
    <div class="matrix" />
    <!-- 标题 -->
    <div class="title">
      <div class="title-name">
        {{ currentPicAndName.name }}
      </div>
      <div class="title-number">
        0{{ currentIndex }}
      </div>
    </div>
    <!-- 主要内容 -->
    <div class="archives">
      <!-- 向左切换 -->
      <div class="archives-prev" />
      <div class="archives-center">
        <!-- 图片 -->
        <transition
          name="fade"
          v-for="index in picAndNameList.length"
          :key="index"
        >
          <div
            class="archives-pic"
            v-show="currentIndex === index - 1"
            :style="{
              'background-image': `url(${picAndNameList[index - 1].pic})`
            }"
          />
        </transition>
        <!-- 当前图片位置指示器 -->
        <div class="archives-indicators">
          <div
            class="archives-indicator"
            v-for="index in picAndNameList.length"
            :key="index"
            :class="index - 1 === currentIndex ? 'archives-indicator-active' : ''"
          />
        </div>
      </div>
      <!-- 向右切换 -->
      <div class="archives-next" />
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
  position: absolute;
  display: flex;
  // TODO: 把上一个下一个按钮抽离成组件
  &-prev {
    background-image: url('../assets/nft-page/models-prev.svg');
    margin-right: 255px;
  }

  &-next {
    background-image: url('../assets/nft-page/models-next.svg');
    margin-left: 204px;
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
