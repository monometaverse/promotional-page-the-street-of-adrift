<!--角色页面-->
<script lang="ts" setup>
import { computed, CSSProperties, onActivated, onDeactivated, ref, watchEffect } from 'vue'
import { gsap } from 'gsap'

import { useStore } from '../store'
import { storeToRefs } from 'pinia'
import { useElementBounding } from '@vueuse/core'
import ScrollHint from '../components/scroll-hint.vue'
import { usePagination } from '../utils'
// pinia 状态管理
const store = useStore()
const { res, showingCharacter, allImagesForParticles, infoElPos } = storeToRefs(store)
// TODO: 从 i18n 获取
const characters = ref(['shiraishi', 'watanabe', 'lin', 'christina', 'anna', 'higashiyama', 'hannya', 'tokugawa'])
const characterPaintings = ref([
  store.getRes('shiraishiPaint', 'characterPaint').value as HTMLImageElement,
  store.getRes('watanabePaint', 'characterPaint').value as HTMLImageElement,
  store.getRes('linPaint', 'characterPaint').value as HTMLImageElement,
  store.getRes('christinaPaint', 'characterPaint').value as HTMLImageElement,
  store.getRes('annaPaint', 'characterPaint').value as HTMLImageElement,
  store.getRes('higashiyamaPaint', 'characterPaint').value as HTMLImageElement,
  store.getRes('hannyaPaint', 'characterPaint').value as HTMLImageElement,
  store.getRes('tokugawaPaint', 'characterPaint').value as HTMLImageElement,
])
const currentShow = ref(0)
const currentShowForNav = ref(0)
// 页面切换器，仅在手机端使用
const { prev, next } = usePagination(characters, undefined, (next: boolean, nextIndex: number) => {
  swtichTo(nextIndex)
})
// 动画长度
const durations = {
  characterPainting: 500,
  name: 250,
  infoItem: 250,
  infoDesc: 250
}
// 动画延迟
const delay = {
  characterPainting: 0,
  name: 125,
  infoItem: 250,
  infoDesc: 375
}
// 离开动画结束时、进入动画开始时偏移距离 px
const translateX = {
  characterPainting: 200,
  name: 100,
  infoItem: 100,
  infoDesc: 100
}
// 立绘动画参数
const paintingArgs = ref({
  translateX: 0,
  opacity: 1,
  rotateY: 0
})
// 响应式立绘行内样式
const paintingStyle = computed<CSSProperties>(() => ({
  filter: `brightness(${(100 - Math.abs(paintingArgs.value.translateX))}%)`,
  transform: `perspective(1000px) translateX(${paintingArgs.value.translateX}px) rotateY(${paintingArgs.value.rotateY}deg)`,
  opacity: paintingArgs.value.opacity,
  transformStyle: 'preserve-3d'
}))
// 立绘切换动画
const doPaintingAnimation = (enter: boolean) => {
  gsap.fromTo(paintingArgs.value, {
    translateX: enter ? translateX.characterPainting : 0,
    opacity: enter ? 0 : 1,
    rotateY: enter ? 10 : 0
  }, {
    translateX: enter ? 0 : -translateX.characterPainting,
    opacity: enter ? 1 : 0,
    rotateY: enter ? 0 : -10,
    duration: durations.characterPainting / 1000
  })
}
// 角色名称和英文名称动画参数
const nameArgs = ref({ translateX: 0, opacity: 1 })
const nameStyle = computed<CSSProperties>(() => ({
  transform: `translateX(${nameArgs.value.translateX}px)`,
  opacity: nameArgs.value.opacity
}))
const nameEnStyle = computed<CSSProperties>(() => ({
  transform: `translateX(${nameArgs.value.translateX}px)`,
  opacity: nameArgs.value.opacity - 0.5
}))
// 角色名称切换动画
const doNameAnimation = (enter: boolean) => {
  gsap.fromTo(nameArgs.value, {
    translateX: enter ? translateX.name : 0,
    opacity: enter ? 0 : 1
  }, {
    translateX: enter ? 0 : -translateX.name,
    opacity: enter ? 1 : 0,
    duration: durations.name / 1000
  })
}
// CV 和画师信息切换动画
const doInfoItemAnimation = (enter: boolean) => {
  gsap.fromTo('.info-more', {
    translateX: `${enter ? translateX.infoItem : 0}px`,
    opacity: enter ? '0' : '1'
  }, {
    translateX: `${enter ? 0 : -translateX.infoItem}px`,
    opacity: enter ? '1' : '0',
    duration: durations.infoItem / 1000
  })
  // 离开动画进行时隐藏分割条，进入动画进行时显示分割条
  isDividerHide.value = !enter
}
// 分割条是否隐藏
const isDividerHide = ref(false)
// 动画定时
let nameLeaveTimeout = -1
let infoItemLeaveTimeout = -1
let infoDescLeaveTimeout = -1
// 详细介绍切换动画
const doInfoDescAnimation = (enter: boolean, index: number) => {
  gsap.fromTo('.info-desc', {
    translateX: `${enter ? translateX.infoDesc : 0}px`,
    opacity: enter ? '0' : '1'
  }, {
    translateX: `${enter ? 0 : -translateX.infoDesc}px`,
    duration: durations.infoDesc / 1000,
    opacity: enter ? '1' : '0',
    onComplete: () => {
      if (enter) return
      // 真正修改目前正在显示的索引
      currentShow.value = index
      // 开始进入动画
      doPaintingAnimation(true)
      setTimeout(doNameAnimation, delay.name, true)
      setTimeout(doInfoItemAnimation, delay.infoItem, true)
      setTimeout(doInfoDescAnimation, delay.infoDesc, true)
    }
  })
}
// 切换函数
const swtichTo = (index: number) => {
  currentShowForNav.value = index
  // 切换粒子图片
  if (allImagesForParticles.value) {
    const randomPicIndex = Math.floor(Math.random() * allImagesForParticles.value.length)
    showingCharacter.value = allImagesForParticles.value[randomPicIndex].value as HTMLImageElement
  }
  // 取消所有正在进行的动画和动画定时
  gsap.killTweensOf(paintingArgs.value)
  clearTimeout(nameLeaveTimeout)
  clearTimeout(infoItemLeaveTimeout)
  clearTimeout(infoDescLeaveTimeout)
  // 开始退出动画
  doPaintingAnimation(false)
  nameLeaveTimeout = window.setTimeout(doNameAnimation, delay.name, false)
  infoItemLeaveTimeout = window.setTimeout(doInfoItemAnimation, delay.infoItem, false)
  infoDescLeaveTimeout =  window.setTimeout(doInfoDescAnimation, delay.infoDesc, false, index)
}
// 当页面激活时，随机设置一个粒子图片，TODO: 等数据填充好之后，使用第一个
onActivated(() => {
  // 切换粒子图片
  if (allImagesForParticles.value) {
    const randomPicIndex = Math.floor(Math.random() * allImagesForParticles.value.length)
    showingCharacter.value = allImagesForParticles.value[randomPicIndex].value as HTMLImageElement
  }
  window.dispatchEvent(new Event('resize'))
})
// 当页面休眠时，移除正在显示的粒子图片
onDeactivated(() => {
  showingCharacter.value = new Image()
})
// 角色信息块引用
const infoEl = ref<HTMLDivElement>()
// 角色信息块位置
const infoElBounding = useElementBounding(infoEl)
// 监听角色信息块的位置，发送给 pinia
watchEffect(() => {
  infoElPos.value = {
    x: infoElBounding.x.value,
    y: infoElBounding.y.value
  }
})
</script>
<template>
  <div class="route-page">
    <div class="element-x" />
    <div class="matrix matrix-left-bottom" />
    <div class="matrix matrix-behind-pic <sm:hidden" />
    <!-- 角色选择器 -->
    <div class="selector">
      <div
        class="selector-item"
        :class="currentShowForNav === index - 1 ? 'selector-item-active' : ''"
        v-for="index in characters.length"
        :key="index - 1"
        @click="swtichTo(index - 1)"
      >
        <div class="selector-item-icon clickble" />
        <div class="selector-item-title clickble">
          {{ characters[index - 1] }}
        </div>
      </div>
    </div>
    <!-- 角色立绘 -->
    <div
      class="character-painting"
      :style="{
        backgroundImage: `url('${characterPaintings[currentShow].src}')`,
        ...paintingStyle
      }"
    />
    <!-- 角色介绍 -->
    <div
      class="info"
      ref="infoEl"
    >
      <div
        class="info-title"
        :style="nameStyle"
      >
        {{ characters[currentShow] }}
      </div>
      <div
        class="info-title-en"
        :style="nameEnStyle"
      >
        SHIRAISHI ROSETTA
      </div>
      <div class="info-more">
        <div class="info-more-item">
          <div class="info-more-item-title">
            ILLUSTRATOR
          </div>
          <div class="info-more-item-content">
            yannn
          </div>
        </div>
        <div class="info-more-item">
          <div class="info-more-item-title">
            CV
          </div>
          <div class="info-more-item-content">
            范馨源
          </div>
        </div>
      </div>
      <!-- 分割线 -->
      <div
        class="info-divider"
        :class="{
          'info-divider-hide': isDividerHide
        }"
      />
      <div class="info-desc">
        她是巨型企业白石集团董事长的女儿，出于保护人身安全的目的，她的父母为她创造了一个假名[九条泷川]，并让她在福京市理工大学学习，就读理论物理专业。
        然而，纵使白石的物质生活极度优越，可她却总是被父母的意志所支配，就连学习的专业与未来的工作都在计划板上被写的清清楚楚。
        她并不愿意屈服于眼前这已经被安排好的日复一日的生活。她一直以来都有一个梦想，那便是用自己的力量，帮助其他人，为这座快要烂掉的城市做出一份贡献。

        一直以来，她都在寻找这样一个契机。
      </div>
    </div>
    <scroll-hint class="!sm:hidden" />
    <!-- 页面切换器，仅在手机端显示 -->
    <div
      class="prev-btn sm:hidden absolute left-20px top-[calc(50vh+296px-406px)]"
      @click="prev"
    />
    <div
      class="next-btn sm:hidden absolute right-20px top-[calc(50vh+296px-406px)]"
      @click="next"
    />
  </div>
</template>
<style lang="less" scoped>
// 角色选择器
.selector {
  @top: calc(50% - calc(32px * 8 + 24px * 7) / 2);

  position: absolute;
  left: 64px;
  top: @top;
  display: flex;
  flex-direction: column;
  row-gap: 24px;

  &-item {
    line-height: 32px;
    font-size: 24px;
    font-family: 'Noto Sans SC', sans-serif;
    display: flex;
    align-items: center;
    color: rgba(255, 255, 255, 0.5);

    &-icon {
      margin-right: 16px;
      height: 24px;
      width: 24px;
      background-image: url('../assets/characters-page/character-active.svg');
      background-position: center;
      background-repeat: no-repeat;
      background-size: contain;
      opacity: 0;
      transition: opacity 250ms ease;
    }

    &-title {
      transform: translateX(-40px);
      transition-property: transform, color;
      transition-timing-function: ease;
      transition-duration: 250ms;
    }

    &-active {
      color: white;

      .selector-item-icon {
        opacity: 1;
      }

      .selector-item-title {
        transform: none;
      }
    }

    &:hover {
      color: white;
    }
  }
}
// 角色立绘
.character-painting {
  position: absolute;
  width: 800px;
  height: calc(800px / 900 * 1500);
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  bottom: calc(-244px + 50vh - 540px);
  right: calc(850px + 50vw - 960px);
}
// 角色介绍
.info {
  position: absolute;
  right: 375px;
  bottom: calc(171px + 50vh - 540px);

  &-title {
    font-size: 64px;
    line-height: 92px;
    font-family: 'Noto Serif SC', sans-serif;
    font-weight: 900;
  }

  &-title-en {
    font-size: 24px;
    line-height: 29px;
    font-family: 'Montserrat', sans-serif;
    font-weight: 600;
    opacity: 0.5;
  }

  &-more {
    display: flex;
    margin-top: 24px;
    column-gap: 24px;

    &-item {
      &-title {
        padding-left: 8px;
        width: 128px;
        height: 24px;
        background-color: white;
        color: #818181;
        font-family: 'Noto Sans SC', sans-serif;
        font-size: 14px;
        font-weight: 700;
        display: flex;
        align-items: center;
      }

      &-content {
        line-height: 32px;
        font-size: 14px;
        font-family: 'Noto Sans SC', sans-serif;
        font-weight: 400;
      }
    }
  }

  &-divider {
    margin-top: 24px;
    height: 2px;
    width: 16px;
    background-color: white;
    transition-property: transform;
    will-change: transform;
    transition-timing-function: ease;
    transition-duration: 250ms;
    transform-origin: right;
  }

  &-divider-hide {
    transform: scale(0);
    transform-origin: left;
  }

  &-desc {
    margin-top: 24px;
    width: 480px;
    font-size: 12px;
    font-weight: 400;
    font-family: 'Noto Sans SC', sans-serif;
    line-height: 28px;
  }
}
// 角色背后的矩阵
.matrix-behind-pic {
  width: 184px;
  height: 184px;
  right: calc(984px + 50vw - 960px);
  bottom: calc(261px + 50vh - 540px);
}
// 像 x 一样的东西
.element-x {
  background-image: url('../assets/characters-page/element-x.svg');
  position: absolute;
  top: calc(180px + 50vh - 540px);
  right: calc(1432px + 50vw - 960px);
  height: 64px;
  width: 64px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
}

// 当宽度低于 1680px 时，进入平板模式
@media screen and (max-width: 1679px) {
  .selector {
    &-item {
      &-title {
        font-size: 20px;
        line-height: 30px;
      }
    }
  }

  .element-x {
    width: 48px;
    height: 48px;
  }

  .matrix-behind-pic {
    width: 128px;
    height: 128px;
    right: calc(608px + 50vw - 597px);
    bottom: calc(211px + 50vh - 417px);
  }

  // 角色立绘
  .character-painting {
    position: absolute;
    width: 576px;
    height: calc(576px / 900 * 1500);
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
    bottom: calc(-143px + 50vh - 417px);
    right: calc(511px + 50vw - 597px);
  }

  .info {
    right: 181px;
    bottom: calc(104px + 50vh - 417px);

    &-title {
      font-size: 48px;
      line-height: 69px;
    }

    &-title-en {
      font-size: 16px;
      line-height: 20px;
    }

    &-desc {
      width: 400px;
    }
  }
}

// 当宽度低于 1080px 时，进入手机模式
@media screen and (max-width: 1079px) {
  .selector {
    display: none;
  }
  // 角色立绘
  .character-painting {
    position: absolute;
    width: 512px;
    height: calc(512px / 900 * 1500);
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
    bottom: calc(-120px + 50vh - 406px);
    right: calc(50vw - 256px);
  }

  .info {
    right: unset;
    bottom: 64px;
    width: 100%;
    padding: 24px 24px 0 24px;

    &-title {
      font-size: 32px;
      line-height: 46px;
    }

    &-title-en {
      font-size: 16px;
      line-height: 20px;
    }

    &-more {
      margin-top: 8px;

      &-item {
        &-title {
          font-size: 12px;
          height: 18px;
          width: 86px;
          padding-left: 4px;
        }

        &-content {
          font-size: 12px;
          line-height: 18px;
        }
      }
    }

    &-divider {
      margin-top: 8px;
    }

    &-desc {
      width: 100%;
      font-size: 12px;
      line-height: 24px;
      margin-top: 8px;
    }
  }

  .element-x {
    width: 32px;
    height: 32px;
    top: calc(50vh + 153px - 406px);
    left: calc(50vw + 71px - 187.5px);
  }
}
</style>
