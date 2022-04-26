<script lang="ts" setup>
import { gsap } from 'gsap'
import { useI18n } from 'vue-i18n'
import scrollHint from './scroll-hint.vue'

// i18n
const { t, locale } = useI18n()
// 需要父组件传入的部分
const props = defineProps<{
  items: { name: string, smallPic: HTMLImageElement | null, bigPic: HTMLImageElement | null }[],
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
    <!-- 图片上方矩阵 -->
    <div class="matrix top-[calc(261px+50vh-540px)] right-[calc(515px+50vw-960px)] z-999 <xl:(top-[calc(210px+50vh-417px)] right-[calc(352px+50vw-597px)]) <sm:hidden" />
    <!-- 图片下方矩阵 -->
    <div class="matrix bottom-[calc(250px+50vh-540px)] right-[calc(378px+50vw-960px)] z-999 <xl:(bottom-[calc(225px+50vh-417px)] right-[calc(243px+50vw-597px)]) <sm:hidden" />
    <!-- 图片 -->
    <div
      class="details-pic cover-no-repeat-center"
      :style="{
        'background-image': items[modelValue].bigPic ? `url(${items[modelValue].bigPic.src})` : 'none'
      }"
    />
    <!-- 详情 -->
    <div class="details-desc">
      <div class="details-desc-title">
        {{ t(`settings.${items[modelValue].name}.name`) }}
      </div>
      <div class="details-desc-divider" />
      <div class="details-desc-text max-w-40rem max-h-30rem overflow-y-scroll <xl:(max-w-30rem max-h-20rem)">
        {{ t(`settings.${items[modelValue].name}.info`) }}
      </div>
    </div>
    <!-- 关闭按钮 -->
    <div
      class="close-btn close-btn-local clickble <sm:hidden"
      @click="emits('close')"
    />
    <!-- 切换按钮 -->
    <div
      class="details-prev-btn prev-btn clickble"
      @click="prevOrNext(false)"
    />
    <div
      class="details-next-btn next-btn clickble"
      @click="prevOrNext(true)"
    />
    <!-- 只在手机端出现的滑动提示 -->
    <scroll-hint class="!sm:hidden" />
  </div>
</template>
<style lang="less" scoped>
.close-btn-local {
  position: absolute;
  top: calc(253px + 50vh - 540px);
  right: calc(403px + 50vw - 960px);
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
      scrollbar-color: rgba(255, 255, 255, 0.5) transparent;

      &::-webkit-scrollbar-thumb {
        background-color: rgba(255, 255, 255, 0.5);
      }

      &::-webkit-scrollbar {
        width: 5px;
        background-color: transparent;
      }
    }
  }
}

@media screen and (max-width: 1679px) {
  .close-btn-local {
    position: absolute;
    top: calc(183px + 50vh - 407px);
    right: calc(267px + 50vw - 597px);
  }

  .details {
    &-prev-btn { left: calc(32px + 50vw - 597px); }
    &-next-btn { right: calc(153px + 50vw - 597px); }

    &-prev-btn,
    &-next-btn {
      top: calc(393px + 50vh - 407px);
      position: absolute;
    }

    &-pic {
      @height: 320px;
      @width: calc(@height / 9 * 16);

      height: @height;
      width: @width;
      top: calc(50vh - calc(@height / 2));
      right: calc(263px + 50vw - 597px);
    }

    &-desc {
      top: calc(211px + 50vh - 407px);
      left: calc(121px + 50vw - 597px);

      &-title {
        font-size: 48px;
        line-height: 69px;
      }

      &-divider {
        margin-top: 16px;
      }

      &-text {
        margin-top: 16px;
        font-size: 12px;
        line-height: 28px;
      }
    }
  }
}

@media screen and (max-width: 1079px) {
  .details {
    @pic-top: calc(221px + 50vh - 406px);
    @pic-height: calc(calc(100vw - 48px) / 16 * 9);

    &-desc {
      padding: 24px 8px 0 24px;
      width: 100%;
      top: unset;
      left: unset;
      bottom: 64px;

      &-title {
        font-size: 32px;
        line-height: 49px;
      }

      &-divider {
        margin-top: 8px;
      }

      &-text {
        margin-top: 8px;
        font-size: 12px;
        line-height: 20px;
        max-height: 16.25em;
        overflow-y: scroll;
      }
    }

    &-pic {
      width: calc(100vw - 48px);
      margin: 0 24px;
      left: 0;
      top: @pic-top;
      height: calc(calc(100vw - 48px) / 16 * 9);
    }

    &-prev-btn { left: 20px; }
    &-next-btn { right: 20px; }

    &-prev-btn,
    &-next-btn {
      top: calc(@pic-top + @pic-height / 2 - 17px);
      position: absolute;
    }
  }
}
</style>
