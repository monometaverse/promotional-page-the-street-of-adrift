<script setup lang="ts">
import WebGLBackground from './components/WebGLBackground/index.vue'
import ResourceLoader from './components/ResourceLoader/index.vue'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { LoadedResources } from './components/ResourceLoader/Resources'
// 资源引用
const loadedRes = ref<LoadedResources | null>(null)
// 当资源加载完成时
const onResourceLoadComplete = (res: LoadedResources) => {
  loadedRes.value = res
}
// i18n 切换语言
const i18n = useI18n()
const switchLang = () => {
  i18n.locale.value = i18n.locale.value === 'zh' ? 'en' : 'zh'
}
// 背景 canvas
const webGlBackground = ref<InstanceType<typeof WebGLBackground> | null>(null)
// 显示或隐藏辅助 canvas
const toggleHelper = () => {
  if (!webGlBackground.value) {
    return
  }
  showHelper.value = !showHelper.value
  webGlBackground.value.showOrHidePic(showHelper.value)
}
const showHelper = ref(false)

</script>
<template>
  <ResourceLoader
    @load-complete="onResourceLoadComplete"
    v-if="!loadedRes"
  />
  <div
    class="static-framework"
    v-if="loadedRes"
  >
    <h1 class="title">
      {{ i18n.t('underDevelopment') }}
    </h1>
    <h2 class="title">
      Vue3+TypeScript+vue-i18n+Three.js
    </h2>
    <div class="particles-control-btns">
      <button
        class="btn"
        @click="webGlBackground?.nextPic"
      >
        {{ i18n.t('nextPic') }}
      </button>
      <button
        class="btn"
        @click="webGlBackground?.prevPic"
      >
        {{ i18n.t('prevPic') }}
      </button>
      <button
        class="btn"
        @click="toggleHelper"
      >
        {{ showHelper? i18n.t('hide') : i18n.t('show') }}{{ i18n.t('helperCanvas') }}
      </button>
      <button
        class="btn"
        @click="switchLang"
      >
        {{ i18n.t('switchLang') }}
      </button>
      <button
        v-if="!webGlBackground?.isFirstView"
        class="btn"
        @click="webGlBackground?.prevView"
      >
        {{ i18n.t('prevView') }}
      </button>
      <button
        v-if="!webGlBackground?.isLastView"
        class="btn"
        @click="webGlBackground?.nextView"
      >
        {{ i18n.t('nextView') }}
      </button>
    </div>
  </div>
  <WebGLBackground
    :res="loadedRes!"
    ref="webGlBackground"
  />
</template>

<style lang="less">
  @static-z-index: 1000;
  html, body, #app {
    margin: 0;
    height: 100%;
  }
  #app {
    background: black;
    color: white;
    .static-framework {
      pointer-events: none;
      width: 100%;
      height: 100%;
      position: absolute;
      z-index: @static-z-index;
      .title {
        width: 100%;
        text-align: center;
        top: 20px;
      }
      .particles-control-btns {
        display: flex;
        justify-content: center;
      }
      .btn {
        pointer-events: auto;
        transition: all 250ms ease-out;
        border: 2px white solid;
        color: white;
        background: black;
        font-size: 16px;
        font-weight: 600;
        padding: 8px 15px;
        margin: 5px;
        &:hover {
          color: black;
          background: white;
        }
      }
    }
  }
</style>
