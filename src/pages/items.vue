<!--NFT 页面-->
<script lang="ts" setup>import { ref } from 'vue'
// TODO: 到时候从服务器上拿数据吧
const itemsList = ref<{
  name: string,
  nameEn: string,
  description: string,
  descriptionEn: string,
  reserved: boolean
}[]>([
  {
    name: '九霄金币',
    nameEn: 'need text',
    description: 'NFT 文案，NFT 文案，NFT 文案，NFT 文案，NFT 文案，NFT 文案，NFT 文案，NFT 文案，NFT 文案，NFT 文案',
    descriptionEn: 'NFT Description, NFT Description, NFT Description, NFT Description',
    reserved: false
  },
  {
    name: '九霄银币',
    nameEn: 'need text',
    description: 'NFT 文案，NFT 文案，NFT 文案，NFT 文案，NFT 文案，NFT 文案，NFT 文案，NFT 文案，NFT 文案，NFT 文案',
    descriptionEn: 'NFT Description, NFT Description, NFT Description, NFT Description',
    reserved: true
  }
])
// 当前正在显示的 NFT
const currentIndex = ref(0)
</script>
<template>
  <div class="route-page">
    <div class="info">
      <!-- NFT 名字 -->
      <div class="info-title">
        {{ itemsList[currentIndex].name }}
      </div>
      <!-- 当切换至英文时，隐藏，但是占空间 -->
      <div class="info-title-en">
        {{ itemsList[currentIndex].nameEn.toUpperCase() }}
      </div>
      <div class="info-divider" />
      <!-- NFT 描述 -->
      <div class="info-desc">
        {{ itemsList[currentIndex].description }}
      </div>
      <!-- 预约按钮 TODO: 从 i18n 获取文案 -->
      <div class="info-reserve-btn">
        <div class="info-reserve-btn-inner clickble" />
      </div>
      <div class="info-reserve-btn-text">
        {{ itemsList[currentIndex].reserved ? '已预约' : '立即预约' }}
      </div>
    </div>
    <div class="matrix matrix-left-bottom" />
    <div class="matrix matrix-behind-models" />
    <!-- 模型展示区域 -->
    <div class="models">
      <div class="models-main">
        <div class="models-prev-btn prev-btn clickble" />
        <div class="models-main-container">
          <div class="models-rotating-border" />
        </div>
        <div class="models-next-btn next-btn clickble" />
      </div>
      <!-- 当前模型 -->
      <div class="models-indicator">
        <div
          class="models-indicator-item"
          v-for="index in itemsList.length"
          :key="itemsList[index - 1].name"
          :class="currentIndex === (index - 1) ? 'models-indicator-item-active' : ''"
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
    opacity: 0.5;
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
    transition: all 250ms ease;
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
