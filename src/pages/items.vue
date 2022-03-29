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
      <div class="info-reserve-btn clickble">
        {{ itemsList[currentIndex].reserved ? '已预约' : '立即预约' }}
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

.info {
  position: absolute;
  top: calc(50% - calc(@title-line-height + @title-en-line-height + @divider-margin-top + @desc-margin-top + @divider-height + @divider-height + @desc-line-height * 2 + @reserve-btn-height + @reserve-btn-margin-top) / 2);
  left: 64px;

  &-title {
    font-size: 64px;
    font-family: 'Noto Serif SC', sans-serif;
    font-weight: 900;
    line-height: @title-line-height;
  }

  &-title-en {
    font-size: 24px;
    font-weight: 600;
    line-height: @title-en-line-height;
    font-family: 'Montserrat', sans-serif;
    opacity: 0.5;
  }

  &-divider {
    height: @divider-height;
    margin-top: @divider-margin-top;
    width: 16px;
    background-color: white;
  }

  &-desc {
    margin-top: @desc-margin-top;
    line-height: @desc-line-height;
    font-size: 16px;
    font-family: 'Noto Sans SC', sans-serif;
    font-weight: 400;
    width: 480px;
  }

  &-reserve-btn {
    transition: opacity 250ms ease;
    margin-top: @reserve-btn-margin-top;
    height: 64px;
    font-family: 'Noto Serif SC', sans-serif;
    font-weight: 900;
    width: 192px;
    font-size: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-image: url('../assets/nft-page/button-subscribe.svg');
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
    opacity: 0.5;

    &:hover {
      opacity: 1;
    }
  }
}
</style>
