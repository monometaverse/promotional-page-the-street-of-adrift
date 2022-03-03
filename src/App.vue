<script setup lang="ts">
import WebGLBackground from './components/WebGLBackground/index.vue'
import { computed, onMounted, ref } from 'vue'
import { LoadedResources, LoadingResources, Resources, resources } from './Resources'
import { useI18n } from 'vue-i18n'

// 已经加载好的资源
const loadedRes = ref<LoadedResources>([])
// 背景 canvas
const webGlBackground = ref<InstanceType<typeof WebGLBackground> | null>(null)
// 控制图片的最大高度或宽度
const picSize = ref(400)
const showHelper = ref(false)
const i18n = useI18n()
// 切换语言
const switchLang = () => {
  i18n.locale.value = i18n.locale.value === 'zh' ? 'en' : 'zh'
}
// 显示或隐藏辅助 canvas
const toggleHelper = () => {
  if (!webGlBackground.value) {
    return
  }
  showHelper.value = !showHelper.value
  webGlBackground.value.showOrHidePic(showHelper.value)
}

onMounted(() => {
  let loaded = 0
  const all = resources.length
  // 加载过程中已经加载好的资源暂存
  const loadingResources: LoadingResources = []
  // 每一项加载结束时的回调
  const onResLoadng = (nowProgress: number, all: number, name: Resources[number]['name'], target: HTMLImageElement) => {
    loadingResources.push({ name, value: target })
    console.log('资源加载进度: ' + (nowProgress / all * 100).toFixed(0))
    if (nowProgress === all) {
      // 加载完成
      loadedRes.value = loadingResources as LoadedResources
    }
  }
  // 加载资源
  const loadResources = (images: Resources) => {
    for (let res of resources) {
      if (res.type === 'image') {
        // 加载图片资源
        const img = new Image()
        img.src = res.value
        img.onload = () => {
          // 处理图片大小
          const width = Number(img.width)
          img.width = picSize.value
          img.height = img.height * picSize.value / width
          if (img.height > 400) {
            const height = Number(img.height)
            img.height = picSize.value
            img.width = img.width * picSize.value / height
          }
          img.style.background = 'black'
          loaded++
          onResLoadng(loaded, all, res.name, img)
        }
      }
    }
  }
  loadResources(resources)
})

</script>
<template>
  <div class="static-framework">
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
    :res="loadedRes"
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
