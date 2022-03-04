<script setup lang="ts">
import WebGLBackground from './components/WebGLBackground/index.vue'
import { onMounted, ref } from 'vue'
import { LoadedResources, LoadingResources, Resources, resources } from './Resources'
import { useI18n } from 'vue-i18n'
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { RGBE, RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
import './assets/draco/draco_decoder.js'
import './assets/draco/draco_encoder.js'
import './assets/draco/gltf/draco_decoder.js'
import './assets/draco/gltf/draco_encoder.js'
import { CubeTexture, DataTexture } from 'three'

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
  // 实例化 three 提供的 gltf 加载器
  const gltfLoader = (() => {
    const loader = new GLTFLoader()
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderConfig({ type: 'js' })
    dracoLoader.setDecoderPath('/src/assets/draco/')
    dracoLoader.preload()
    loader.setDRACOLoader(dracoLoader)
    return loader
  })()
  // 实例化 three 提供的 hdr 环境贴图加载器
  const rgbeLoader = new RGBELoader()
  // 每一项加载结束时的回调
  const onResItemLoadEnd = (nowProgress: number, all: number, name: Resources[number]['name'], target: HTMLImageElement | GLTF | DataTexture, for0: Resources[number]['for']) => {
    loadingResources.push({ name, value: target, for:  for0})
    console.log(`资源加载进度:${name} ${nowProgress} / ${all}`)
    if (nowProgress === all) {
      // 加载完成
      loadedRes.value = loadingResources as LoadedResources
    }
  }
  // 加载图片资源
  const loadImageResource = (res: Resources[number]) => {
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
      onResItemLoadEnd(loaded, all, res.name, img, res.for)
    }
  }
  // 加载 GLTF 模型
  const loadGltfResource = async (res: Resources[number]) => {
    try {
      const gltf = await gltfLoader.loadAsync(res.value)
      loaded++
      onResItemLoadEnd(loaded, all, res.name, gltf, res.for)
    } catch (e) {
      const err = e as Error
      console.log(`加载出错 [name: ${res.name}, value: ${res.value}, error: ${err.name}: ${err.message}]`)
    }
  }
  // 加载 HDR 环境贴图
  const loadHdrResource = (res: Resources[number]) => {
    rgbeLoader.load(res.value, (texture) => {
      loaded++
      onResItemLoadEnd(loaded, all, res.name, texture, res.for)
    }, undefined , (err) => {
      console.log(`加载出错 [name: ${res.name}, value: ${res.value}, error: ${err.error.name}: ${err.error.message}]`)
    })
  }
  // 加载资源
  const loadResources = () => {
    for (let res of resources) {
      switch (res.type) {
        case 'image': loadImageResource(res); break
        case 'glb': loadGltfResource(res); break
        case 'hdr': loadHdrResource(res); break
      }
    }
  }
  loadResources()
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
