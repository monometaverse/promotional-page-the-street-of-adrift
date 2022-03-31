<!--设定页面-->
<script lang="ts" setup>
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
          <div class="settings-item">
            <span class="settings-item-text">白石集团</span>
          </div>
          <div class="settings-item">
            <span class="settings-item-text">福京市</span>
          </div>
          <div class="settings-item">
            <span class="settings-item-text">九霄</span>
          </div>
        </div>
        <div class="settings-list-line">
          <div class="settings-item">
            <span class="settings-item-text">虚爆战争</span>
          </div>
          <div class="settings-item">
            <span class="settings-item-text">四大花魁</span>
          </div>
          <div class="settings-item">
            <span class="settings-item-text">灰墙城</span>
          </div>
          <div class="game-name-with-icon">
            <div class="game-name-with-icon-icon" />
            <div class="game-name-with-icon-name">
              THE STREET OF ADRIFT
            </div>
          </div>
        </div>
        <div class="settings-list-line settings-list-line-2">
          <div class="settings-item">
            <span class="settings-item-text">福京币</span>
          </div>
          <div class="settings-item settings-item-empty" />
          <div class="settings-item settings-item-empty" />
        </div>
      </div>
      <div class="settings-list-right" />
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
