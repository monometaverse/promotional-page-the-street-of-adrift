<script lang="ts" setup>
import { computed, CSSProperties, onActivated, onDeactivated, onMounted, ref } from 'vue'
import { PerspectiveCamera, Scene, WebGLRenderer } from 'three'
import { useStore } from '../store'
import { storeToRefs } from 'pinia'
// pinia 状态管理
const store = useStore()
const { windowWidth, windowHeight } = storeToRefs(store)
// 定义父组件要传入的属性
const props = defineProps<{
  width: number,
  height: number,
  top: number,
  left: number
}>()
// 模型切换时进行的操作
// 如果是下一个，把下一个模型放到当前模型的右边，然后把当前模型和下一个模型都向左移动
// 如果是上一个，把上一个模型放到当前模型的左边，然后把当前模型和上一个模型都向右移动
// 渲染器
const renderer = new WebGLRenderer()
// 摄像机
const camera = new PerspectiveCamera()
// 主场景
const scene = new Scene()
// 当挂载时开始渲染
onMounted(() => {
  renderer.domElement = canvasEl.value!
  renderer.setPixelRatio(devicePixelRatio)
  renderer.setSize(props.width, props.height)
  scene.add(camera)
  requestAnimationFrame(render)
})
// 当激活时继续渲染
onActivated(() => {
  renderPaused.value = false
})
// 当休眠时暂停渲染
onDeactivated(() => {
  renderPaused.value = true
})
// 是否暂停渲染
const renderPaused = ref(false)
// 渲染函数
const render = () => {
  requestAnimationFrame(render)
  if (renderPaused.value) return
  renderer.render(scene, camera)
}
// canvas 要用的样式
const canvasStyle = computed<CSSProperties>(() => ({
  width: `${props.width}px`,
  height: `${props.height}px`,
  position: 'absolute',
  top: `${props.top < 0 ? props.top + windowHeight.value : props.top > windowHeight.value ? props.top - windowHeight.value : props.top}px`,
  left: `${props.left}px`,
  zIndex: 999
}))
// canvas 引用
const canvasEl = ref<HTMLCanvasElement | null>(null)
</script>
<template>
  <canvas
    :style="canvasStyle"
    ref="canvasEl"
  />
</template>
