<script lang="ts" setup>
import { LoadedResources, LoadingResources, Resources, resources } from './Resources'
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
import draco0Decoder from '../../assets/draco/draco_decoder.js?url'
import draco0Encoder from '../../assets/draco/draco_encoder.js?url'
import draco1Decoder from '../../assets/draco/gltf/draco_decoder.js?url'
import draco1Encoder from '../../assets/draco/gltf/draco_encoder.js?url'
import { computed, onMounted, ref } from 'vue'
import { DataTexture } from 'three'
// 手动保持引用
[draco0Decoder, draco0Encoder, draco1Decoder, draco1Encoder]
// 控制图片的最大高度或宽度
const picSize = ref(400)
// 定义父组件需要监听的事件
const emits = defineEmits<{
  (events: 'loadComplete', loaded: LoadedResources): void
}>()
// 加载进度
const progress = ref(0)
const progressBar = computed(() => { // 进度条
  let text = 'I'
  for (let i = 0; i <= progress.value / 10; i++) {
    text += ' I'
  }
  return text
})

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
    if (nowProgress === all) {
      // 加载完成
      emits('loadComplete', loadingResources as LoadedResources)
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
  <div class="res-loader-layer">
    {{ progressBar }} {{ progress }} {{ progressBar }}
  </div>
</template>
<style lang="less" scoped>
.res-loader-layer {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
