<!--NFT 页面-->
<script lang="ts" setup>
import { computed, CSSProperties, reactive, ref } from 'vue'
import { usePagination } from '../utils'
import { gsap } from 'gsap'
import modelViewer from '../components/ModelViewer/index.vue'
import { useElementBounding } from '@vueuse/core'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'
import { useStore } from '../store'
import type { NFTItem } from '../components/ResourceLoader/Resources'
// pinia 状态管理
const store = useStore()
// TODO: 到时候从服务器上拿数据吧
const itemsList = ref<NFTItem[]>([
  {
    name: '九霄金币',
    nameEn: 'need text',
    description: 'NFT 文案，NFT 文案，NFT 文案，NFT 文案，NFT 文案，NFT 文案，NFT 文案，NFT 文案，NFT 文案，NFT 文案',
    descriptionEn: 'NFT Description, NFT Description, NFT Description, NFT Description',
    reserved: false,
    model: (store.getRes('kusyouCoin', 'NFT').value as GLTF).scene,
    customData: {
      childName: 'YX_Gold',
      roughness: 0.2,
      metalness: 1.0
    }
  },
  {
    name: '九霄银币',
    nameEn: 'need text',
    description: 'NFT 文案，NFT 文案，NFT 文案，NFT 文案，NFT 文案，NFT 文案，NFT 文案，NFT 文案，NFT 文案，NFT 文案',
    descriptionEn: 'NFT Description, NFT Description, NFT Description, NFT Description',
    reserved: true,
    model: (store.getRes('littlestTokyo', 'NFT').value as GLTF).scene,
    customData: {

    }
  }
])
// 当前正在显示的 NFT
const { currentIndex, prevOrNext } = usePagination(itemsList)
// 动画偏移量
const translateX = reactive({
  info: 100,
  reserveBtn: 100
})
// 动画时长
const durations = reactive({
  info: 250,
  reserveBtn: 250
})
// 动画延迟
const delay = reactive({
  info: 0,
  reserveBtn: 250
})
// NFT 信息动画参数
const infoAnimationArgs = reactive({
  translateX: 0,
  opacity: 1
})
const infoAnimationStyle = computed<CSSProperties>(() => ({
  transform: `translateX(${infoAnimationArgs.translateX}px)`,
  opacity: infoAnimationArgs.opacity
}))
// 预约按钮动画参数
const reserveBtnAnimationArgs = reactive({
  translateX: 0,
  opacity: 1
})
const reserveBtnAnimationStyle = computed<CSSProperties>(() => ({
  transform: `translateX(${reserveBtnAnimationArgs.translateX}px)`,
  opacity: reserveBtnAnimationArgs.opacity
}))
// 模型查看器实例
const modelViewerEl = ref<InstanceType<typeof modelViewer> | null>(null)
// 上一页或下一页
const prevOrNextLocal = (next?: boolean, index?: number) => {
  if (typeof next === 'undefined') {
    if (typeof index === 'undefined') {
      throw new Error('切换组件：没有传入任何参数')
    } else {
      doAnimation(true, index, false)
    }
  } else {
    if (typeof index !== 'undefined') {
      console.warn('已经传入了要进行的动作：' + next + '，再传入要跳转的索引是无效的')
    } else {
      doAnimation(next, -1, false)
    }
  }
}
// 动画定时
let reserveBtnAnimationTimeout = -1
// 动画函数
const doAnimation = (next: boolean, newIndex: number, enter: boolean) => {
  // 停止正在进行的动画
  gsap.killTweensOf(infoAnimationArgs)
  // 取消动画定时
  window.clearTimeout(reserveBtnAnimationTimeout)
  // 开始新的动画
  gsap.fromTo(infoAnimationArgs, {
    translateX: next ? (enter ? -translateX.info : 0) : (enter ? translateX.info : 0),
    opacity: enter ? 0 : 1
  }, {
    translateX: next ? (enter ? 0 : translateX.info) : (enter ? 0 : -translateX.info),
    opacity: enter ? 1 : 0,
    duration: durations.info / 1000
  })
  reserveBtnAnimationTimeout = window.setTimeout(() => {
    gsap.fromTo(reserveBtnAnimationArgs, {
      translateX: next ? (enter ? -translateX.reserveBtn : 0) : (enter ? translateX.reserveBtn : 0),
      opacity: enter ? 0 : 1
    }, {
      translateX: next ? (enter ? 0 : translateX.reserveBtn) : (enter ? 0 : -translateX.reserveBtn),
      opacity: enter ? 1 : 0,
      duration: durations.reserveBtn / 1000,
      onComplete: () => {
        if (enter) return
        // 正式修改正显示的 NFT 索引
        if (newIndex !== -1) {
          currentIndex.value = newIndex
        } else {
          prevOrNext(next)
        }
        modelViewerEl.value?.prevOrNextModel(next, itemsList.value[currentIndex.value].model, itemsList.value[currentIndex.value].customData)
        doAnimation(next, -1, true)
      }
    })
  }, delay.reserveBtn)
}
// 模型容器元素
const modelContainerEl = ref<HTMLDivElement | null>(null)
// 模型容器元素的位置高宽信息
const modelContainerElBounding = reactive(useElementBounding(modelContainerEl))
</script>
<template>
  <div class="route-page">
    <!-- 模型查看器 -->
    <model-viewer
      :width="modelContainerElBounding.width"
      :height="modelContainerElBounding.height"
      :top="modelContainerElBounding.top"
      :left="modelContainerElBounding.left"
      :env="store.getRes('coinEnviroment', 'NFT').value"
      ref="modelViewerEl"
    />
    <div class="info">
      <!-- NFT 名字 -->
      <div
        class="info-title"
        :style="infoAnimationStyle"
      >
        {{ itemsList[currentIndex].name }}
      </div>
      <!-- 当切换至英文时，隐藏，但是占空间 -->
      <div
        class="info-title-en"
        :style="infoAnimationStyle"
      >
        {{ itemsList[currentIndex].nameEn.toUpperCase() }}
      </div>
      <div
        class="info-divider"
        :style="infoAnimationStyle"
      />
      <!-- NFT 描述 -->
      <div
        class="info-desc"
        :style="infoAnimationStyle"
      >
        {{ itemsList[currentIndex].description }}
      </div>
      <!-- 预约按钮 TODO: 从 i18n 获取文案 -->
      <div
        class="info-reserve-btn-text"
        :style="reserveBtnAnimationStyle"
      >
        {{ itemsList[currentIndex].reserved ? '已预约' : '立即预约' }}
      </div>
      <div
        class="info-reserve-btn"
        :style="reserveBtnAnimationStyle"
      >
        <div class="info-reserve-btn-inner clickble" />
      </div>
    </div>
    <div class="matrix matrix-left-bottom" />
    <div class="matrix matrix-behind-models" />
    <!-- 模型展示区域 -->
    <div class="models">
      <div class="models-main">
        <div
          class="models-prev-btn prev-btn clickble"
          @click="prevOrNextLocal(false)"
        />
        <div
          class="models-main-container"
          ref="modelContainerEl"
        >
          <div class="models-rotating-border" />
        </div>
        <div
          class="models-next-btn next-btn clickble"
          @click="prevOrNextLocal(true)"
        />
      </div>
      <!-- 当前模型 -->
      <div class="models-indicator">
        <div
          class="models-indicator-item clickble"
          v-for="index in itemsList.length"
          :key="itemsList[index - 1].name"
          :class="currentIndex === (index - 1) ? 'models-indicator-item-active' : ''"
          @click="prevOrNextLocal(undefined, index - 1)"
        />
      </div>
    </div>
  </div>
</template>
<style lang="less" scoped>
@title-line-height: 92px;
@title-en-line-height: 29px;
@divider-margin-top: 24px;
@desc-margin-top: 24px;
@divider-height: 2px;
@desc-line-height: 32px;
@reserve-btn-margin-top: 64px;
@reserve-btn-height: 64px;
@all-height: calc(@title-line-height + @title-en-line-height + @divider-margin-top + @desc-margin-top + @divider-height + @divider-height + @desc-line-height * 2 + @reserve-btn-height + @reserve-btn-margin-top);

.info {
  position: absolute;
  top: calc(50% - @all-height / 2);
  left: 64px;
  // NFT 名称
  &-title {
    font-size: 64px;
    font-family: 'Noto Serif SC', sans-serif;
    font-weight: 900;
    line-height: @title-line-height;
  }
  // NFT 英文名称
  &-title-en {
    font-size: 24px;
    font-weight: 600;
    line-height: @title-en-line-height;
    font-family: 'Montserrat', sans-serif;
    color: rgba(255, 255, 255, 0.5);
  }
  // 分割线
  &-divider {
    height: @divider-height;
    margin-top: @divider-margin-top;
    width: 16px;
    background-color: white;
  }
  // NFT 文案
  &-desc {
    margin-top: @desc-margin-top;
    line-height: @desc-line-height;
    font-size: 16px;
    font-family: 'Noto Sans SC', sans-serif;
    font-weight: 400;
    width: 480px;
  }
  // 预约按钮文字
  &-reserve-btn-text {
    margin-top: @reserve-btn-margin-top;
    height: 64px;
    font-family: 'Noto Serif SC', sans-serif;
    font-weight: 900;
    width: 192px;
    font-size: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  // 预约按钮边框和背景
  &-reserve-btn {
    transition-property: background-color;
    transition-duration: 250ms;
    transition-timing-function: ease;
    position: absolute;
    top: calc(50% + @all-height / 2 - 64px);
    height: 64px;
    width: 192px;
    border: 2px solid rgba(255, 255, 255, 0.5);
    box-sizing: border-box;

    &-inner {
      transition: opacity 250ms ease;
      width: 100%;
      height: 100%;
      background-image: url('../assets/nft-page/reserve-btn-background.svg');
      background-position: center;
      background-repeat: no-repeat;
      background-size: contain;
      opacity: 0.5;
    }

    &:hover {
      background-color: rgba(255, 255, 255, 0.3);
    }

    &:hover &-inner {
      opacity: 1;
    }
  }
}

@keyframes rotating {
  0% {
    transform: rotate(0);
  }

  100% {
    transform: rotate(360deg);
  }
}

.matrix-left-bottom {
  left: 64px;
  bottom: 64px;
}

.matrix-behind-models {
  top: calc(335px + 50vh - 540px);
  right: 411px;
}

.models {
  @indicator-margin-top: 60px;
  @indicator-heigth: 4px;
  @container-width-height: 688px;

  position: absolute;
  top: calc(50% - calc(@indicator-heigth + @container-width-height + @indicator-margin-top) / 2);
  right: 300px;

  &-indicator {
    display: flex;
    justify-content: center;
    column-gap: 24px;
    margin-top: @indicator-margin-top;

    &-item {
      transition: opacity 250ms ease;
      width: 48px;
      height: @indicator-heigth;
      opacity: 0.25;
      background-color: white;

      &:hover {
        opacity: 0.5;
      }

      &-active {
        opacity: 1;
      }
    }
  }

  &-main {
    display: flex;
    align-items: center;

    &-container {
      width: @container-width-height;
      height: @container-width-height;
      background-image: url('../assets/nft-page/container-background.svg');
      background-position: center;
      background-repeat: no-repeat;
      background-size: contain;
    }
  }

  &-prev-btn {
    margin-right: 74px;
  }

  &-next-btn {
    background-image: url('../assets/nft-page/models-next.svg');
  }

  &-rotating-border {
    width: calc(100% - 10px);
    height: calc(100% - 10px);
    background-image: url('../assets/nft-page/rotating-border.svg');
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
    animation: 15s rotating linear running infinite;
    pointer-events: none;
  }
}
</style>
