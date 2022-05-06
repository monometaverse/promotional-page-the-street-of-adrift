<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

// 路由
const route = useRoute()

// 定义要传入的参数
const props = defineProps<{
  animationFrom: boolean,
  animationActive: boolean,
  routes: { name: string, to: string }[]
}>()
// i18n
const { t } = useI18n()
// 定义会触发的事件
const emits = defineEmits<{
  (e: 'itemSelected', to: string): void
}>()
</script>
<template>
  <div
    class="navigation"
    :class="{
      'opacity-0': animationFrom && animationActive,
      'duration-500 delay-0': animationActive
    }"
  >
    <div class="navigation-content">
      <span
        v-for="theRoute of routes"
        class="navigation-item clickble flex justify-end"
        :key="theRoute.name"
        :class="{
          'router-link-active': route.path === theRoute.to
        }"
        @click="emits('itemSelected', theRoute.to)"
      >
        <div class="navigation-item-text clickble">
          {{ t(theRoute.name) }}
        </div>
        <div class="navigation-item-icon cover-no-repeat-center clickble" />
      </span>
    </div>
    <div class="navigation-line" />
  </div>
</template>
<style lang="less" scoped>
// 导航
.navigation {
  z-index: 20;
  @line-height: 800px;

  position: absolute;
  display: flex;
  align-items: center;
  top: calc(50% - @line-height / 2);
  right: 4rem;
  // 导航中的左侧部分
  &-content {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    height: 500px;
    margin-right: 24px;
  }
  // 导航中的每一项
  &-item {
    padding: 10px;
    display: flex;
    transition: opacity 250ms ease-out;
    font-family: 'Noto Sans SC', sans-serif;
    font-size: 16px;
    color: white;
    opacity: 0.5;
    text-decoration: none;
    align-items: center;
    column-gap: 16px;

    &:hover {
      opacity: 1;
    }

    &-text {
      transition: transform 250ms ease-out;
      transform: translateX(34px);
    }

    &-icon {
      transition: opacity 250ms ease-out;
      opacity: 0;
      width: 12px;
      height: 18px;
      background-image: url('../assets/static-framework/navigation-item-active.png');
      background-size: contain;
    }
  }

  // 导航右侧的线
  &-line {
    height: @line-height;
    width: 1px;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.5) 25.52%, rgba(255, 255, 255, 0.5) 49.63%, rgba(255, 255, 255, 0.5) 75.52%, rgba(255, 255, 255, 0) 100%);
  }
  // 正在显示的导航页面
  .router-link-active {
    opacity: 1;

    .navigation-item-text {
      transform: none;
      pointer-events: fill;
    }

    .navigation-item-icon {
      opacity: 1;
    }
  }
}

@media screen and (max-width: 1689px) {
  .navigation {
    right: 2rem;
  }
}

@media screen and (max-width: 1079px) {
  .navigation {
    right: 24px;
    top: 72px;

    &-line {
      height: 500px;
    }

    &-content {
      height: 350px;
    }
  }
}
</style>
