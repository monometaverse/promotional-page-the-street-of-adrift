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
  </div>
</template>
<style lang="less" scoped>
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
</style>
