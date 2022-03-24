<script lang="ts" setup>
import { LoadedResources, LoadingResources, Resources, resources } from './Resources'
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
import draco0Decoder from '../../assets/draco/draco_decoder.js?url'
import draco0Encoder from '../../assets/draco/draco_encoder.js?url'
import draco1Decoder from '../../assets/draco/gltf/draco_decoder.js?url'
import draco1Encoder from '../../assets/draco/gltf/draco_encoder.js?url'
import { computed, CSSProperties, onMounted, ref, watch } from 'vue'
import { DataTexture } from 'three'
import { gsap } from 'gsap'
// 手动保持引用
[draco0Decoder, draco0Encoder, draco1Decoder, draco1Encoder]
// 控制图片的最大高度或宽度
const picSize = ref(400)
// 定义父组件需要监听的事件
const emits = defineEmits<{
  (events: 'loadComplete', loaded: LoadedResources): void
}>()
// 加载过程中已经加载好的资源暂存
const loadingResources: LoadingResources = []
// 加载进度
const progress = ref(0)
// 进度条数量
const progressCount = 20
// 将显示在界面上的进度，由于 GSAP 只能操作对象，使用了一个对象把数值包裹了起来
const showProgress = ref({ p: 0 })
// 当进度变化时，使用 GSAP 对要显示的进度进行缓动
watch(progress, (newVal) => {
  // 取消上一个缓动效果
  gsap.killTweensOf(showProgress)
  // 进行新的缓动
  gsap.fromTo(showProgress.value, { p: showProgress.value.p }, { p: newVal, duration: 1, onComplete: () => {
    // 当缓动结束，且新的值为 100 时，触发资源加载结束事件
    if (newVal === 100) {
      emits('loadComplete', loadingResources)
    }
  } })
})
// 每个进度条的透明度
const opacityForProgressItem = (index: number): CSSProperties => {
  return {
    opacity: showProgress.value.p / 100 * progressCount - index,
    transition: 'opacity 250ms'
  }
}

onMounted(() => {
  let loaded = 0
  const all = resources.length
  // 实例化 three 提供的 gltf 加载器
  const gltfLoader = (() => {
    const loader = new GLTFLoader()
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderConfig({ type: 'js' })
    dracoLoader.setDecoderPath(draco0Decoder.substring(0, draco0Decoder.lastIndexOf('/') + 1))
    dracoLoader.preload()
    loader.setDRACOLoader(dracoLoader)
    return loader
  })()
  // 实例化 three 提供的 hdr 环境贴图加载器
  const rgbeLoader = new RGBELoader()
  // 每一项加载结束时的回调
  const onResItemLoadEnd = (nowProgress: number, all: number, name: Resources[number]['name'], target: HTMLImageElement | GLTF | DataTexture, for0: Resources[number]['for']) => {
    loadingResources.push({ name, value: target, for:  for0})
    progress.value = Math.floor(nowProgress / all * 100)
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
  <div class="res-loader-layer">
    <div class="loading-block">
      <div class="game-logo cover-no-repeat-center" />
      <!--加载条-->
      <div class="progress-bar cover-no-repeat-center">
        <div class="progress-bar-inner cover-no-repeat-center">
          <!--左侧斜杠-->
          <div class="progress-bar-left">
            <div
              class="progress-item"
              v-for="v in progressCount"
              :key="v"
              :style="opacityForProgressItem(progressCount - v)"
            />
          </div>
          <!--进度数字-->
          <div class="progress-bar-center">
            {{ showProgress.p.toFixed() }}%
          </div>
          <!--右侧斜杠-->
          <div class="progress-bar-right">
            <div
              class="progress-item"
              v-for="v in progressCount"
              :key="v"
              :style="opacityForProgressItem(v - 1)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="less" scoped>
// 游戏 logo，需要特意向右边偏移一段距离
.game-logo {
  @width: 480px;
  @height: calc(@width / 480 * 112);
  width: @width;
  height: @height;
  margin-left: 20px;
  background-image: url('../../assets/home-page/tsoa-logo.svg');
}
// 加载层
.res-loader-layer {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
// 加载条
.progress-bar {
  @width: 405px;
  @height: 32px;
  width: @width;
  height: @height;
  margin-top: 24px;
  transform: skewX(-30deg);
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-sizing: border-box;
  // 内部背景
  &-inner {
    margin: 0 auto;
    width: 100%;
    height: 100%;
    background-image: url('../../assets/loading-page/progress-background-inner.png');
    display: flex;
    align-items: center;
    justify-content: center;
  }
  // 加载数字
  &-center {
    text-align: center;
    font-family: 'Montserrat', sans-serif;
    font-size: 20px;
    font-weight: 500;
    text-shadow: 0px 0px 24px #FFFFFF;
    height: 100%;
    width: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  &-left, &-right {
    display: flex;
    column-gap: 6px;
    align-items: center;
  }
}
.progress-item {
  height: 16px;
  width: 2px;
  background: white;
  box-shadow: 0px 0px 24px #FFFFFF;
}
</style>
