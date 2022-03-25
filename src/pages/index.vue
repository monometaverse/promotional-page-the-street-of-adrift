<!--主页-->
<script lang="ts" setup>
</script>
<template>
  <div class="route-page">
    <div class="community-btns">
      <div class="community-btn community-btn-discord" />
      <div class="community-btn community-btn-twitter" />
    </div>
    <div class="logo-and-play">
      <div class="logo cover-no-repeat-center" />
      <div class="play-btn cover-no-repeat-center" />
    </div>
  </div>
</template>
<style lang="less" scoped>
@logo-width: 480px;
@logo-height: calc(@logo-width / 480 * 112);
@logo-and-play-top: calc(50% - calc(@logo-height + 64px) / 2);
// 社交页面按钮部分
.community-btns {
  display: flex;
  column-gap: 24px;
  position: absolute;
  left: 64px;
  top: calc(@logo-and-play-top - 32px - 24px);
}
// 社交页面按钮
.community-btn {
  cursor: pointer;
  transition: opacity 250ms ease;
  height: 32px;
  width: 80px;
  background-position: center;
  background-repeat: no-repeat;
  box-sizing: border-box;
  background-color: rgba(255, 255, 255, 0.2);
  border: 1px solid white;
  opacity: 0.5;
  &:hover {
    opacity: 1;
  }
  &-discord {
    background-image: url('../assets/home-page/discord-icon.svg');
  }
  &-twitter {
    background-image: url('../assets/home-page/twitter-icon.svg');
  }
}
// logo 和播放按钮
.logo-and-play {
  display: flex;
  position: absolute;
  top: @logo-and-play-top;
  left: 64px;
  padding: 32px 0;
  align-items: center;
  background-image:
    url('../assets/static-framework/page-title-dot.png'),
    url('../assets/static-framework/page-title-dot.png'),
    url('../assets/static-framework/page-title-dot.png'),
    url('../assets/static-framework/page-title-dot.png');
  background-repeat: no-repeat;
  background-position:
    top left,
    top right,
    bottom left,
    bottom right;
  .logo {
    width: @logo-width;
    height: @logo-height;
    background-image: url('../assets/home-page/tsoa-logo.svg');
    margin-right: 16px;
  }
  .play-btn {
    transition: opacity 250ms ease;
    cursor: pointer;
    width: 90px;
    height: 90px;
    background-image: url('../assets/home-page/play-btn.svg');
    opacity: 0.5;
    &:hover {
      opacity: 1;
    }
  }
}
</style>
