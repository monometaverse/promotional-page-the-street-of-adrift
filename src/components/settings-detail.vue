<script lang="ts" setup>
import { gsap } from 'gsap'
// 需要父组件传入的部分
const props = defineProps<{
  items: { name: string, smallPic: string, bigPic: string, desc: string }[],
  modelValue: number
}>()
// 定义会触发的事件
const emits = defineEmits<{
  (e: 'close'): void,
  (e: 'next'): void, // 下一张
  (e: 'prev'): void  // 上一张
}>()
// 动画从开始到结束图片和描述会移动的距离
const transitionDistance = 200
// 动画时长
const animationDuration = 0.3
// 描述动画开始定时
let descAnimationTimeout = -1
// 上一页或下一页
const prevOrNext = (next: boolean) => {
  // 取消动画
  gsap.killTweensOf('.details-pic')
  clearTimeout(descAnimationTimeout)
  // 开始新的图片退出动画
  gsap.to('.details-pic', {
    opacity: '0',
    translateX: (next ? transitionDistance : -transitionDistance) + 'px',
    duration: animationDuration,
  })
  descAnimationTimeout = window.setTimeout(() => {
    // 开始描述退出动画
    gsap.to('.details-desc', {
      translateX: (next ? transitionDistance : -transitionDistance) + 'px',
      opacity: '0',
      duration: animationDuration,
      onComplete: () => {
        // 真正调用页面切换逻辑
        next ? emits('next') : emits('prev')
        // 开始图片进入动画
        gsap.fromTo('.details-pic', {
          opacity: '0',
          translateX: (next ? -transitionDistance : transitionDistance) + 'px'
        }, {
          translateX: '0',
          opacity: '1',
          duration: animationDuration,
        })
        // 开始描述进入动画
        window.setTimeout(() => {
          gsap.fromTo('.details-desc', {
            opacity: '0',
            translateX: (next ? -transitionDistance : transitionDistance) + 'px'
          }, {
            translateX: '0',
            opacity: '1',
            duration: animationDuration,
          })
        }, animationDuration * 500)
      }
    })
  }, animationDuration * 500)
}
</script>
<template>
  <div class="details">
    <!-- 切换按钮 -->
    <div
      class="details-prev-btn prev-btn clickble"
      @click="prevOrNext(false)"
    />
    <div
      class="details-next-btn next-btn clickble"
      @click="prevOrNext(true)"
    />
    <!-- 图片上方矩阵 -->
    <div class="matrix top-[calc(261px+50vh-540px)] right-[calc(515px+50vw-960px)] z-999" />
    <!-- 图片下方矩阵 -->
    <div class="matrix bottom-[calc(250px+50vh-540px)] right-[calc(378px+50vw-960px)] z-999" />
    <!-- 图片 -->
    <div
      class="details-pic cover-no-repeat-center"
      :style="{
        'background-image': `url(${items[modelValue].bigPic})`
      }"
    />
    <!-- 详情 -->
    <div class="details-desc">
      <div class="details-desc-title">
        {{ items[modelValue].name }}
      </div>
      <div class="details-desc-divider" />
      <div class="details-desc-text">
        {{ items[modelValue].desc }}
      </div>
    </div>
    <!-- 关闭按钮 -->
    <div
      class="close-btn clickble"
      @click="emits('close')"
    />
  </div>
</template>
<style lang="less" scoped>
.close-btn {
  position: absolute;
  width: 48px;
  height: 48px;
  background-image: url('../assets/characters-page/element-x.svg');
  background-repeat: no-repeat;
  background-position: center;
  background-size: 24px 24px;
  border: rgba(255, 255, 255, 0.5) 1px solid;
  transition: all 250ms ease;
  top: calc(253px + 50vh - 540px);
  right: calc(403px + 50vw - 960px);

  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
    border-color: white;
  }
}

.details {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;

  &-prev-btn { left: calc(250px + 50vw - 960px); }
  &-next-btn { right: calc(250px + 50vw - 960px); }

  &-prev-btn,
  &-next-btn {
    top: calc(506px + 50vh - 540px);
    position: absolute;
  }

  &-pic {
    @height: 430px;
    @width: calc(@height / 9 * 16);

    position: absolute;
    top: calc(50vh - calc(@height / 2));
    right: calc(412px + 50vw - 960px);
    width: @width;
    height: @height;
  }

  &-desc {
    position: absolute;
    top: calc(333px + 50vh - 540px);
    left: calc(393px + 50vw - 960px);

    &-title {
      font-size: 64px;
      line-height: 92px;
      font-family: 'Noto Serif SC', sans-serif;
      font-weight: 900;
    }

    &-divider {
      margin-top: 24px;
      width: 16px;
      height: 2px;
      background-color: white;
    }

    &-text {
      margin-top: 24px;
      font-family: 'Noto Sans SC', sans-serif;
      font-size: 14px;
      line-height: 28px;
      white-space: pre-wrap;
    }
  }
}
</style>
