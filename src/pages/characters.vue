<!--角色页面-->
<script lang="ts" setup>import { ref } from 'vue'
// TODO: 从 i18n 获取
const characters = ref(['白石 罗塞塔', '渡边 柚', '林 雨幕', '克里斯蒂娜 琼斯', '安娜 伊凡诺娃', '东山 抚子', '般若', '德川璃璃子'])
const currentShow = ref(0)
</script>
<template>
  <div class="route-page">
    <!-- 角色选择器 -->
    <div class="selector">
      <div
        class="selector-item"
        :class="currentShow === index - 1 ? 'selector-item-active' : ''"
        v-for="index in characters.length"
        :key="index - 1"
        @click="currentShow = index - 1"
      >
        <div class="selector-item-icon clickble" />
        <div class="selector-item-title clickble">
          {{ characters[index - 1] }}
        </div>
      </div>
    </div>
    <!-- 角色介绍 -->
    <div class="info">
      <div class="info-title">
        {{ characters[currentShow] }}
      </div>
      <div class="info-title-en">
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
      <div class="info-divider" />
      <div class="info-desc">
        她是巨型企业白石集团董事长的女儿，出于保护人身安全的目的，她的父母为她创造了一个假名[九条泷川]，并让她在福京市理工大学学习，就读理论物理专业。
        然而，纵使白石的物质生活极度优越，可她却总是被父母的意志所支配，就连学习的专业与未来的工作都在计划板上被写的清清楚楚。
        她并不愿意屈服于眼前这已经被安排好的日复一日的生活。她一直以来都有一个梦想，那便是用自己的力量，帮助其他人，为这座快要烂掉的城市做出一份贡献。

        一直以来，她都在寻找这样一个契机。
      </div>
    </div>
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
</style>
