<template>
  <div
    class="scroll-hint"
  >
    <div class="scroll-hint-text">
      SCROLL
    </div>
    <div class="scroll-hint-icon cover-no-repeat-center" />
    <div class="scroll-hint-indicator cover-no-repeat-center" />
    <div class="scroll-hint-indicator !animate-delay-250 cover-no-repeat-center" />
  </div>
</template>
<style lang="less" scoped>
// 滑动提示
@keyframes for-scroll {
  0% {
    opacity: 0.5;
  }

  10% {
    opacity: 1;
  }

  20% {
    opacity: 0.5;
  }
}

.scroll-hint {
  position: absolute;
  bottom: 24px;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  flex-direction: column;

  &-text {
    font-family: "Poppins", sans-serif;
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 8px;
  }

  &-icon {
    width: 25px;
    height: 37px;
    background-image: url("../assets/home-page/mouse-icon.svg");
    margin-bottom: 8px;
  }

  &-indicator {
    opacity: 0.5;
    width: 18px;
    height: 7px;
    background-image: url("../assets/home-page/scroll-indicator.svg");
    animation: 5s for-scroll infinite;

    &:first-child {
      margin-bottom: 8px;
    }
  }
}

@media screen and (max-width: 1679px) {
  .scroll-hint {
    bottom: 32px;

    &-text,
    &-icon {
      display: none;
    }
  }
}
</style>
