<!--设定页面-->
<script lang="ts" setup>
import { computed, ref } from 'vue'
import jiuxiao from '../assets/settings-page/jiuxiao-temp.png'

/**
 * 在 i18n 文件中的样子应该是
 * {
 *    name: string,     // 设定名称
 *    smallPic: string, // 图片名称，包含扩展名，用来显示在列表里
 *    bigPic: string,   // 图片名称，包含扩展名，用来显示在详情页里
 *    desc: string      // 详细信息
 * }[]
 */
// TODO: 改为从 i18n 文件中获取
const settings = ref([
  { name: '白石集团', smallPic: jiuxiao },
  { name: '福京市', smallPic: jiuxiao },
  { name: '九霄', smallPic: jiuxiao },
  { name: '虚爆战争', smallPic: jiuxiao },
  { name: '四大花魁', smallPic: jiuxiao },
  { name: '灰墙城', smallPic: jiuxiao },
  { name: '福京币', smallPic: jiuxiao }
])
const last = computed(() => settings.value[settings.value.length - 1])
</script>
<template>
  <div class="route-page">
    <!-- 左下角矩阵 -->
    <div class="matrix matrix-left-bottom" />
    <!-- 设定列表 -->
    <div class="settings-list">
      <div class="settings-list-left" />
      <div class="settings-list-center">
        <div class="settings-list-line settings-list-line-1">
          <div
            class="settings-item"
            v-for="setting in settings.slice(0, 3)"
            :key="setting.name"
          >
            <span class="settings-item-text">{{ setting.name }}</span>
          </div>
        </div>
        <div class="settings-list-line">
          <div
            class="settings-item"
            v-for="setting in settings.slice(3, 6)"
            :key="setting.name"
          >
            <span class="settings-item-text">{{ setting.name }}</span>
          </div>
          <div class="game-name-with-icon">
            <div class="game-name-with-icon-icon" />
            <div class="game-name-with-icon-name">
              THE STREET OF ADRIFT
            </div>
          </div>
        </div>
        <div class="settings-list-line settings-list-line-2">
          <div
            class="settings-item"
          >
            <span class="settings-item-text">{{ last.name }}</span>
          </div>
          <div class="settings-item settings-item-empty" />
          <div class="settings-item settings-item-empty" />
        </div>
      </div>
      <div class="settings-list-right" />
    </div>
    <!-- 隐藏层 -->
    <div class="settings-list settings-list-overlay">
      <div class="settings-list-left opacity-0" />
      <div class="settings-list-center">
        <div class="settings-list-line settings-list-line-1">
          <div
            v-for="setting in settings.slice(0, 3)"
            class="settings-item !border-0 clickble opacity-0 hover:opacity-100 transition-opacity duration-500"
            :style="{ 'background-image': `url(${setting.smallPic})` }"
            :key="setting.name"
          >
            <!-- 两根线装饰 -->
            <div class="rotated-lines clickble">
              <div class="rotated-line rotated-line-1 clickble" />
              <div class="rotated-line rotated-line-2 clickble" />
            </div>
            <span class="settings-item-text clickble">{{ setting.name }}</span>
            <!-- 两根线装饰 -->
            <div class="rotated-lines clickble">
              <div class="rotated-line rotated-line-2 clickble" />
              <div class="rotated-line rotated-line-1 clickble" />
            </div>
          </div>
        </div>
        <div class="settings-list-line">
          <div
            v-for="setting in settings.slice(3, 6)"
            class="settings-item !border-0 clickble opacity-0 hover:opacity-100 transition-opacity duration-500"
            :style="{ 'background-image': `url(${setting.smallPic})` }"
            :key="setting.name"
          >
            <!-- 两根线装饰 -->
            <div class="rotated-lines clickble">
              <div class="rotated-line rotated-line-1 clickble" />
              <div class="rotated-line rotated-line-2 clickble" />
            </div>
            <span class="settings-item-text clickble">{{ setting.name }}</span>
            <!-- 两根线装饰 -->
            <div class="rotated-lines clickble">
              <div class="rotated-line rotated-line-2 clickble" />
              <div class="rotated-line rotated-line-1 clickble" />
            </div>
          </div>
        </div>
        <div class="settings-list-line settings-list-line-2">
          <div
            class="settings-item !border-0 clickble opacity-0 hover:opacity-100 transition-opacity duration-500"
            :style="{ 'background-image': `url(${last.smallPic})` }"
          >
            <!-- 两根线装饰 -->
            <div class="rotated-lines clickble">
              <div class="rotated-line rotated-line-1 clickble" />
              <div class="rotated-line rotated-line-2 clickble" />
            </div>
            <span class="settings-item-text clickble">{{ last.name }}</span>
            <!-- 两根线装饰 -->
            <div class="rotated-lines clickble">
              <div class="rotated-line rotated-line-2 clickble" />
              <div class="rotated-line rotated-line-1 clickble" />
            </div>
          </div>
          <div class="settings-item settings-item-empty opacity-0" />
          <div class="settings-item settings-item-empty opacity-0" />
        </div>
      </div>
      <div class="settings-list-right opacity-0" />
    </div>
    <!-- 页面四角的短横线 -->
    <div class="short-line short-line-top short-line-left" />
    <div class="short-line short-line-top short-line-right" />
    <div class="short-line short-line-bottom short-line-left" />
    <div class="short-line short-line-bottom short-line-right" />
  </div>
</template>
<style lang="less" scoped>
.settings-list {
  display: flex;
  align-items: center;
  justify-content: center;
  column-gap: 8px;
  height: 100%;
  width: 100%;

  &-left,
  &-right {
    width: 256px;
    height: 2px;
    opacity: 0.5;
  }

  &-left {
    background-image: linear-gradient(90deg, transparent 0%, white 100%);
  }

  &-right {
    background-image: linear-gradient(90deg, white 0%, transparent 100%);
  }

  &-center {
    display: flex;
    row-gap: 8px;
    flex-direction: column;
  }

  &-line {
    display: flex;
    column-gap: 8px;

    &-1 {
      margin-left: 178px;
    }

    &-2 {
      margin-left: 350px;
    }
  }
}

.rotated-lines {
  display: flex;
  justify-content: space-between;
  padding: 24px 33px;
}

.rotated-line {
  width: 2px;
  height: 24px;
  background-color: rgba(255, 255, 255, 0.5);

  &-1 {
    transform: rotate(-45deg);
  }

  &-2 {
    transform: rotate(45deg);
  }
}

.settings-item {
  border: 2px solid rgba(255, 255, 255, 0.5);
  box-sizing: border-box;
  width: 256px;
  height: 256px;
  display: flex;
  justify-content: center;
  align-items: center;

  &-text {
    font-size: 40px;
    line-height: 57px;
    font-family: 'Noto Serif SC', sans-serif;
    font-weight: 900;
  }

  &-empty {
    &::after {
      content: '';
      width: 256px;
      height: 2px;
      background-color: rgba(255, 255, 255, 0.5);
      transform: rotate(-45deg);
    }
  }
}

// 叠加在上面的隐藏层
.settings-list-overlay {
  position: absolute;
  top: 0;
  left: 0;

  .settings-item {
    flex-direction: column;
    justify-content: unset;
    align-items: unset;

    &-text {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}

.game-name-with-icon {
  margin-left: 24px;
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  justify-content: end;
  align-items: flex-start;

  &-icon {
    width: 24px;
    height: 24px;
    background-image: url('../assets/characters-page/character-active.svg');
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
    opacity: 0.5;
  }

  &-name {
    margin-top: 8px;
    font-weight: 600;
    font-size: 14px;
    line-height: 17px;
    font-family: 'Montserrat', sans-serif;
    opacity: 0.5;
  }
}
</style>
